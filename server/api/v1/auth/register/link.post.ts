import { ref } from 'vue';
import { isDatabaseError, isValidationError } from '~~/server/types/error';

import { useFormValidation } from '~/composables/form/useFormValidation';

import { getProviderUser, createUserProvider } from '~~/server/utils/auth/database/user';
import { getOTPVerified } from '~~/server/utils/auth/database/tokens/otp/verify';
import { cleanupOTP } from '~~/server/utils/auth/database/tokens/otp/cleanup';
import { createRegisteredSession } from '~~/server/utils/auth/handlers/sessions/registered/createRegisteredSession';

import { VerifiedUnregisteredCredLinkableSession } from '~~/types/auth/user/session/credentials/unregistered';
import { VerifiedUnregisteredOAuthLinkableSession } from '~~/types/auth/user/session/oauth/unregistered';


interface LinkProviderData {
    otp_id: number;
    existing_user_index: number;
}

export default defineEventHandler(async (event) => {
    const body = await readBody<LinkProviderData>(event)

    try {
        const otp_id = ref(body.otp_id)
        const existing_user_index = ref(body.existing_user_index)

        if (!otp_id || existing_user_index === undefined) {
            throw createError({
                statusCode: 400,
                message: 'Missing required fields. otp_id and existing_user_index are required'
            })
        }

        const validator = useFormValidation<LinkProviderData>({
            otp_id: Number(otp_id.value),
            existing_user_index: existing_user_index.value
        })
        
        validator.bindField('otp_id', otp_id)
        validator.bindField('existing_user_index', existing_user_index)
        
        validator.setFieldRules(
            'otp_id',
            validator.rules.required('OTP code is required'),
            validator.rules.isNumber('OTP code must be a number'),
        )
        
        validator.setFieldRules(
            'existing_user_index',
            validator.rules.required('Existing user index is required'),
            validator.rules.isNumber('Existing user index must be a number')
        )

        const isValid = validator.validateForm()
        
        if (!isValid) {
            throw createError({
                statusCode: 400,
                message: `Invalid input data: ${validator.errors.value.otp_id}`,
            })
        }
        
        const uncastedSession = await getUserSession(event)
        const session = uncastedSession as unknown as VerifiedUnregisteredCredLinkableSession | VerifiedUnregisteredOAuthLinkableSession
        const unregisteredUser = session.user
        const secureSession = session.secure

        if (!session || !unregisteredUser || !secureSession) {
            throw createError({
                statusCode: 403,
                message: 'You have not initiated the linking process properly'
            })
        }

        if (unregisteredUser.provider_verified === false || secureSession.provider_verified === false) {
            throw createError({
                statusCode: 403,
                message: 'You have not verified your email address'
            })
        }

        if (!session.linkable_data) {
            throw createError({
                statusCode: 403,
                message: 'No linkable account data found in session'
            })
        }

        if (unregisteredUser.id !== null) {
            throw createError({
                statusCode: 403,
                message: 'You are already logged in'
            })
        }

        const verifiedLinkableData = session.secure
        const secureLinkableUsers = verifiedLinkableData.linkable_users

        if (!verifiedLinkableData || !secureLinkableUsers) {
            throw createError({
                statusCode: 403,
                message: 'No linkable account data found in session'
            })
        }

        //check if the otp code has been used
        const otpVerificationResponse = await getOTPVerified(event, otp_id.value)
        if (otpVerificationResponse.verified === false || !otpVerificationResponse.email) {
            throw createError({
                statusCode: 403,
                message: 'Invalid OTP used or expired. Please start registration process again'
            })
        }

        const is_otp_cleaned  = await cleanupOTP(event, otp_id.value, otpVerificationResponse.email)
        if (is_otp_cleaned === false) {
            throw createError({
                statusCode: 500,
                message: 'Failed to cleanup OTP from database'
            })
        }

        const existing_user_info = secureLinkableUsers[existing_user_index.value]
        const { provider: existing_provider, provider_id: existing_provider_id } = existing_user_info.providers[0]

        const desired_user = await getProviderUser(event, existing_provider, existing_provider_id, verifiedLinkableData.provider_email)
        
        if (!desired_user || desired_user.id === null || desired_user.id === undefined) {
            
            throw createError({
                statusCode: 404,
                message: 'No accounts found to link with'
            })
        }

        const desired_user_id = desired_user.id
        
        const providerLinkResponse = await createUserProvider(event, desired_user_id, uncastedSession)

        if (isDatabaseError(providerLinkResponse) || isValidationError(providerLinkResponse)) {
            throw createError({
                statusCode: providerLinkResponse.statusCode,
                message: providerLinkResponse.message
            })
        }

        const linkedRegisteredUser = providerLinkResponse.data
        await createRegisteredSession(event, linkedRegisteredUser);

        setResponseStatus(event, 201, 'Ok')
        return {
            statusCode: 201,
            message: 'Account linked'
        }
    }
    catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: 'Failed to link account'
        })
    }
});