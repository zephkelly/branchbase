import { H3Event } from 'h3'

import { Provider } from '~~/types/auth/user/providers'
import { UnregisteredCredUser, UnregisteredCredSession, UnregisteredCredLinkableSession } from '~~/types/auth/user/session/credentials/unregistered'
import { UnregisteredLinkableData } from '~~/types/auth/user/session/unregistered'

export async function handleRegisterCredentials(
    event: H3Event,
    body: {
        email: string,
        password: string,
        confirm_password: string
    }
) {
    try {
        const { email, password, confirm_password } = body
    
        if (!password || !confirm_password || !email) {
            return createError({
                statusCode: 400,
                statusMessage: 'Invalid or missing credentials'
            })
        }
    
        if (password !== confirm_password) {
            return createError({
                statusCode: 400,
                statusMessage: 'Passwords do not match'
            })
        }
    
    
        // Check for existing users -------------------------------------------------------
        const existingUser = await getEmailProviderUser(event, Provider.Credentials, email)
    
        if (existingUser) {
            return createError({
                statusCode: 409,
                statusMessage: 'User already exists'
            })
        }
    
    
        const password_hash = await hashPassword(password)
        const randomPicture = getRandomAvatar()
    
        const linkableUsersAndProviders = await getUsersProvidersByEmail(event, email);
    
        const temporaryUser: UnregisteredCredUser = {
            id: null,
            username: null,
            provider: Provider.Credentials,
            provider_email: email,
            provider_verified: false,
            picture: randomPicture,
        }
    
        if (linkableUsersAndProviders) {
    
            const linkableData: UnregisteredLinkableData = {
                provider_email: email,
                existing_users_count: linkableUsersAndProviders.length,
            }

            const session: UnregisteredCredLinkableSession = {
                user: temporaryUser,
                confirmed_password: true,
                linkable_data: linkableData,
                secure: {
                    provider_email: email,
                    provider_verified: false,
                    linkable_data: linkableUsersAndProviders,
                    password_hash: password_hash
                },
                logged_in_at: Date.now()
            }
    
            await setUserSession(event, {
                ...session
            }, {
                maxAge: 60 * 60 // 1 hour
            })
    
            setResponseStatus(event, 200)
            return "New linkable user"
        }

        const session: UnregisteredCredSession = {
            user: temporaryUser,
            confirmed_password: true,
            secure: {
                provider_email: email,
                provider_verified: false,
                password_hash: password_hash
            },
            logged_in_at: Date.now()
        }
    
        await setUserSession(event, {
            ...session
        }, {
            maxAge: 60 * 60 // 1 hour
        })
    
        setResponseStatus(event, 200)
        return "New user"
    }
    catch (error) {
        console.error(error)
        return {
            statusCode: 500,
            statusMessage: 'Internal server error'
        }
    }
}