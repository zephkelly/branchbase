import { H3Event } from 'h3'
import { ProviderData } from '~~/server/types/userProvider'

import { UnregisteredUser } from '~~/types/auth/user/session/unregistered'

import { getProviderUser, getUsersProvidersByEmail, updateProviderEmail } from '~~/server/utils/auth/database/user'

import { createUnverifiedLinkableSession } from '~~/server/utils/auth/sessions/unregistered/createUnverifiedLinkableSession'
import { createUnregisteredSession } from '~~/server/utils/auth/sessions/unregistered/createUnregisteredSession'
import { createRegisteredSession } from '~~/server/utils/auth/sessions/registered/createRegisteredSession'

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

            await createRegisteredSession(event, existingUser)
            return sendRedirect(event, '/')
        }

        // Check for existing accounts with same email
        const linkableUsersAndProviders = await getUsersProvidersByEmail(event, provider_email)

        const temporaryUser: UnregisteredUser = {
            id: null,
            username: null,
            provider,
            provider_id,
            provider_email,
            provider_verified,
            picture,
        }

        if (linkableUsersAndProviders) {
            await createUnverifiedLinkableSession(event, temporaryUser, linkableUsersAndProviders);
        }
        else {
            await createUnregisteredSession(event, temporaryUser)
        }

        return sendRedirect(event, '/register/oauth')
    }
    catch (error) {
        console.error(`Error logging in with ${provider}:`, error)
        return sendRedirect(event, '/')
    }
}