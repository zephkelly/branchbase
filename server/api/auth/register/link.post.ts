import { createUserProvider } from '~~/server/utils/database/user';
import { isDatabaseError, isValidationError } from '~~/server/types/error';
import { SecureLinkableSessionDataType, UnregisteredUser, SecureUnregisteredUser, SecureSessionDataType, LinkableData, SecureLinkableData, SecureRegisteredUser, RegisteredUser } from '~~/types/user';

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)
    if (!session.user) {
        return createError({
            statusCode: 403,
            message: 'You have not initiated the linking process properly'
        })
    }

    const secureLinkableSession = session.secure as SecureLinkableSessionDataType

    if (!session.linkable_data || !secureLinkableSession || !secureLinkableSession.linkable_data) {
        return createError({
            statusCode: 403,
            message: 'No linkable account data found in session'
        })
    }

    const linkableData = session.linkable_data as LinkableData
    const secureLinkableData = secureLinkableSession.linkable_data as SecureLinkableData
    
    const userSessionData = session.user as UnregisteredUser

    if (userSessionData.id !== null) {
        return createError({
            statusCode: 403,
            message: 'You are already logged in'
        })
    }

    if (!userSessionData.provider_email) {
        return createError({
            statusCode: 403,
            message: 'No provider email found in session'
        })
    }


    if (linkableData.existing_providers_number < 1 || !secureLinkableData.linkable_providers.user_id) {
        return createError({
            statusCode: 403,
            message: 'Session indicated no accounts to link with'
        })
    }

    if (linkableData.existing_providers_number >= 2) {
        return createError({
            statusCode: 403,
            message: 'You have reached the maximum number of linked accounts'
        })
    }

    const linkableUserId = secureLinkableData.linkable_providers.user_id
    const linkableProvider = secureLinkableData.linkable_providers.providers[0]

    try {
        const existingUser: SecureRegisteredUser | null = await getProviderUser(event, linkableProvider.provider, linkableProvider.provider_id)

        if (!existingUser) {
            return createError({
                statusCode: 404,
                message: 'No account found to link with'
            })
        }

        if (existingUser.id !== linkableUserId) {
            return createError({
                statusCode: 409,
                message: 'Trying to link with the wrong account'
            })
        }

        const secureUnregisteredUser: SecureUnregisteredUser = {
            ...userSessionData,
            provider_verified: secureLinkableSession.provider_verified as boolean,
        }

        const providerLinkResponse = await createUserProvider(event, existingUser.id, secureUnregisteredUser)

        if (isDatabaseError(providerLinkResponse) || isValidationError(providerLinkResponse)) {
            return createError({
                statusCode: providerLinkResponse.statusCode,
                message: providerLinkResponse.message
            })
        }

        const linkedUser: SecureRegisteredUser = providerLinkResponse.data

        await replaceUserSession(event, {
            user: {
                id: linkedUser.id,
                username: linkedUser.username,
                provider: linkedUser.provider,
                provider_id: linkedUser.provider_id,
                picture: linkedUser.picture,
            },
            secure: {
                provider_verified: linkedUser.provider_verified,
                provider_email: linkedUser.provider_email
            },
            loggedInAt: Date.now()
        })

        setResponseStatus(event, 201)
        return {
            statusCode: 201,
            message: 'Provider linked successfully'
        }
    }
    catch (error) {
        return createError({
            statusCode: 500,
            message: 'Failed to link accounts'
        })
    }
});