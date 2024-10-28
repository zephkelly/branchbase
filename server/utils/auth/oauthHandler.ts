import { H3Event } from 'h3'
import { Provider, SecureRegisteredUser, RegisteredUser, UnregisteredUser, LinkableData, SecureLinkableData } from '~~/types/user'
import { getProviderUser, getUserProvidersByEmail, updateProviderEmail } from '~~/server/utils/database/user'

interface ProviderData {
    provider: Provider
    provider_id: string
    provider_email: string
    provider_verified: boolean
    picture: string
}

export async function handleOAuthLogin(
    event: H3Event, 
    providerData: ProviderData
) {
    const { provider, provider_id, provider_email, provider_verified, picture } = providerData

    try {
        const existingUser: SecureRegisteredUser | null = await getProviderUser(event, provider, provider_id)

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

            return sendRedirect(event, '/')
        }

        // Check for existing accounts with same email
        const existingUserProviders = await getUserProvidersByEmail(event, provider_email)

        // Handle linkable accounts case
        if (existingUserProviders) {
            const temporaryLinkableUser: UnregisteredUser = {
                id: null,
                username: null,
                provider,
                provider_id,
                provider_email,
                picture,
            }

            const linkableData: LinkableData = {
                provider_email,
                existing_providers_number: existingUserProviders.providers.length
            }

            const secureLinkableData: SecureLinkableData = {
                linkable_providers: existingUserProviders
            }

            await setUserSession(event, {
                user: temporaryLinkableUser,
                linkable_data: linkableData,
                secure: {
                provider_email,
                provider_verified,
                linkable_data: secureLinkableData
                },
                loggedInAt: Date.now()
            }, {
                maxAge: 60 * 60 // 1 hour
            })

            return sendRedirect(event, '/register')
        }

        // Handle new user case
        const temporaryUser: UnregisteredUser = {
            id: null,
            username: null,
            provider,
            provider_id,
            provider_email,
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

        return sendRedirect(event, '/register')
    }
    catch (error) {
        console.error(`Error logging in with ${provider}:`, error)
        return sendRedirect(event, '/login')
    }
}