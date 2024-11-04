import { H3Event } from 'h3'
import { ProviderData } from '~~/server/types/userProvider'

import { UnregisteredUser, UnregisteredLinkableData } from '~~/types/auth/user/session/unregistered'
import { RegisteredUser } from '~~/types/auth/user/session/registered'

import { getProviderUser, getUsersProvidersByEmail, updateProviderEmail } from '~~/server/utils/database/user'

export async function handleOAuthLogin(
    event: H3Event, 
    providerData: ProviderData
) {
    const { provider, provider_id, provider_email, provider_verified, picture } = providerData

    try {
        const existingUser = await getProviderUser(event, provider, provider_id)

        // Handle existing user
        if (existingUser) {
            if (existingUser.provider_email !== provider_email) {
                await updateProviderEmail(event, existingUser.provider, existingUser.provider_id as string, provider_email, provider_verified)
            }

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
            return sendRedirect(event, '/')
        }

        // Check for existing accounts with same email
        const linkableUsersAndProviders = await getUsersProvidersByEmail(event, provider_email)

        // Handle linkable accounts case
        if (linkableUsersAndProviders) {
            const temporaryLinkableUser: UnregisteredUser = {
                id: null,
                username: null,
                provider,
                provider_id,
                provider_email,
                provider_verified,
                picture,
            }

            const linkableData: UnregisteredLinkableData = {
                provider_email,
                existing_users_count: linkableUsersAndProviders.length,
            }
            
            await setUserSession(event, {
                user: temporaryLinkableUser,
                linkable_data: linkableData,
                secure: {
                    provider_email,
                    provider_verified,
                    linkable_users: linkableUsersAndProviders
                },
                loggedInAt: Date.now()
            }, {
                maxAge: 60 * 60 // 1 hour
            })

            console.log("returning linkable user")
            return sendRedirect(event, '/register/oauth')
        }

        // Handle new user case
        const temporaryUser: UnregisteredUser = {
            id: null,
            username: null,
            provider,
            provider_id,
            provider_email,
            provider_verified,
            picture,
        }

        await setUserSession(event, {
            user: temporaryUser,
            secure: {
                provider_email,
                provider_verified,
            },
            loggedInAt: Date.now(),
        }, {
            maxAge: 60 * 60 // 1 hour
        })

        console.log("returning temporary user")
        return sendRedirect(event, '/register/oauth')
    }
    catch (error) {
        console.error(`Error logging in with ${provider}:`, error)
        return sendRedirect(event, '/')
    }
}