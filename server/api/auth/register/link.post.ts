import { createUserProvider } from '~~/server/utils/database/user';
import { isDatabaseError, isValidationError } from '~~/server/types/error';
import { SecureSession, SecureUnregisteredUser, UnregisteredUser, SecureRegisteredUser } from '~~/types/user';

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    try {
        const otp_id: string | undefined = body.otp_id
        const existing_user_index: number | undefined = body.existing_user_index

        const session = await getUserSession(event)
        const userSession: UnregisteredUser = session.user as UnregisteredUser

        if (!session.user) {
            return createError({
                statusCode: 403,
                message: 'You have not initiated the linking process properly'
            })
        }

        if (!session.linkable_data) {
            return createError({
                statusCode: 403,
                message: 'No linkable account data found in session'
            })
        }

        if (session.user.id !== null) {
            return createError({
                statusCode: 403,
                message: 'You are already logged in'
            })
        }

        if (!otp_id || existing_user_index === undefined) {
            console.log(!otp_id, !existing_user_index)
            return createError({
                statusCode: 400,
                message: 'Missing required fields. otp_id and existing_user_index are required'
            })
        }

        const verifiedLinkableData = session.secure as SecureSession
        const secureLinkableUserProviderData = verifiedLinkableData.linkable_data

        if (!verifiedLinkableData || !secureLinkableUserProviderData) {
            return createError({
                statusCode: 403,
                message: 'No linkable account data found in session'
            })
        }

        const existing_user_info = secureLinkableUserProviderData[existing_user_index]
        const { provider: existing_provider, provider_id: existing_provider_id } = existing_user_info.providers[0]

        const desired_user = await getProviderUser(event, existing_provider, existing_provider_id)

        
        if (!desired_user || desired_user.id === null || desired_user.id === undefined) {
            return createError({
                statusCode: 404,
                message: 'No accounts found to link with'
            })
        }

        const desired_user_id = desired_user.id

        const secureUnregisteredUser: SecureUnregisteredUser = {
            ...userSession,
            provider_verified: (verifiedLinkableData.provider_verified) ? verifiedLinkableData.provider_verified : false,
        }
        
        const providerLinkResponse = await createUserProvider(event, desired_user_id, secureUnregisteredUser)

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
            message: 'Linked successfully'
        }
    }
    catch (error) {
        console.error('Error linking account:', error)
        return createError({
            statusCode: 500,
            message: 'An error occurred while linking accounts'
        })
    }
});