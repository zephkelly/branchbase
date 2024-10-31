import { H3Event } from 'h3'
import { ProviderData } from '~~/server/types/userProvider'
import { Provider, RegisteredUser, SecureRegisteredUser, UnregisteredUser, LinkableData } from '~~/types/user'

import { getEmailProviderUser } from '~~/server/utils/database/user'

interface CredentialsHandlerResponse {
    statusCode: number
    statusMessage: string
    route: string
}

export async function handleCredentialsLogin(
    event: H3Event, 
    providerData: Omit<ProviderData & { password: string }, 'provider' | 'provider_id' | 'provider_verified'>
) {
    const {
        provider_email,
        password,
        picture
    } = providerData

    try {
        const existingUser: SecureRegisteredUser | null = await getEmailProviderUser(event, Provider.Credentials, provider_email)
    
        if (existingUser) {
            const registeredUser: RegisteredUser = {
                id: existingUser.id,
                username: existingUser.username,
                provider: existingUser.provider,
                provider_id: existingUser.provider_id,
                picture: existingUser.picture
            }

            await setUserSession(event, {
                user: registeredUser,
                secure: {
                    provider_verified: existingUser.provider_verified,
                    provider_email: existingUser.provider_email,
                },
                loggedInAt: Date.now(),
            })

            console.log("returning registered user")
            return {
                statusCode: 200,
                statusMessage: 'registered',
                redirect: '/'
            }
        }

        const linkableUsersAndProviders = await getUsersProvidersByEmail(event, provider_email);

        if (linkableUsersAndProviders) {
            const temporaryLinkableUser: UnregisteredUser = {
                id: null,
                username: null,
                provider: Provider.Credentials,
                provider_id: null,
                provider_email,
                provider_verified: false,
                picture,
            }

            const linkableData: LinkableData = {
                provider_email,
                existing_users_count: linkableUsersAndProviders.length,
            }

            await setUserSession(event, {
                user: temporaryLinkableUser,
                linkableData,
                loggedInAt: Date.now(),
            })

            console.log("returning linkable user")
            return {
                statusCode: 200,
                statusMessage: 'linkable',
                redirect: '/register'
            }
        }

        const temporaryUser: UnregisteredUser = {
            id: null,
            username: null,
            provider: Provider.Credentials,
            provider_id: null,
            provider_email,
            provider_verified: false,
            picture,
        }

        await setUserSession(event, {
            user: temporaryUser,
            secure: {
                provider_email,
                provider_verified: false,
            },
            loggedInAt: Date.now(),
        }, {
            maxAge: 60 * 60 // 1 hour
        })

        console.log("returning new user")
        return {
            statusCode: 200,
            statusMessage: 'temporary',
            redirect: '/register'
        }
    }
    catch (error) {
        console.error(error)
        return {
            statusCode: 500,
            statusMessage: 'Error logging in with credentials',
            redirect: '/login'
        }
    }
}