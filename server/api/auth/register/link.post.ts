import { ref } from 'vue';
import { isDatabaseError, isValidationError } from '~~/server/types/error';

import { SecureSessionData } from '~~/types/auth/user/session/secure';
import { UnregisteredUser, SecureUnregisteredLinkableSessionData } from '~~/types/auth/user/session/unregistered';

import { useFormValidation } from '~/composables/form/useFormValidation';

import { createUserProvider } from '~~/server/utils/database/user';
import { getOTPUsed } from '~~/server/utils/database/token';
import { createRegisteredSession } from '~~/server/utils/auth/sessions/registered/standardSession';

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
            return createError({
                statusCode: 400,
                statusMessage: 'Missing required fields. otp_id and existing_user_index are required'
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
            return createError({
                statusCode: 400,
                statusText: 'Invalid input data',
                statusMessage: `Invalid input data: ${validator.errors.value.otp_id}`,
            })
        }
        
        const uncastedSession = await getUserSession(event)
        const session = uncastedSession as unknown as VerifiedUnregisteredCredLinkableSession | VerifiedUnregisteredOAuthLinkableSession
        const unregisteredUser = session.user
        const secureSession = session.secure

        if (!session || !unregisteredUser || !secureSession) {
            return createError({
                statusCode: 403,
                statusMessage: 'You have not initiated the linking process properly'
            })
        }

        if (unregisteredUser.provider_verified === false || secureSession.provider_verified === false) {
            return createError({
                statusCode: 403,
                statusMessage: 'You have not verified your email address'
            })
        }

        if (!session.linkable_data) {
            return createError({
                statusCode: 403,
                statusMessage: 'No linkable account data found in session'
            })
        }

        if (unregisteredUser.id !== null) {
            return createError({
                statusCode: 403,
                statusMessage: 'You are already logged in'
            })
        }

        const verifiedLinkableData = session.secure
        const secureLinkableUsers = verifiedLinkableData.linkable_users

        if (!verifiedLinkableData || !secureLinkableUsers) {
            return createError({
                statusCode: 403,
                statusMessage: 'No linkable account data found in session'
            })
        }

        //check if the otp code has been used
        const otpVerificationResponse = await getOTPUsed(event, otp_id.value)

        if (otpVerificationResponse.verified === false) {
            return createError({
                statusCode: 403,
                statusMessage: 'OTP code has already been used. Please start the linking process again.'
            })
        }

        const existing_user_info = secureLinkableUsers[existing_user_index.value]
        const { provider: existing_provider, provider_id: existing_provider_id } = existing_user_info.providers[0]

        const desired_user = await getProviderUser(event, existing_provider, existing_provider_id, verifiedLinkableData.provider_email)
        
        if (!desired_user || desired_user.id === null || desired_user.id === undefined) {
            return createError({
                statusCode: 404,
                statusMessage: 'No accounts found to link with'
            })
        }

        const desired_user_id = desired_user.id
        
        const providerLinkResponse = await createUserProvider(event, desired_user_id, uncastedSession)

        if (isDatabaseError(providerLinkResponse) || isValidationError(providerLinkResponse)) {
            return createError({
                statusCode: providerLinkResponse.statusCode,
                statusMessage: providerLinkResponse.message
            })
        }

        const linkedRegisteredUser = providerLinkResponse.data
        await createRegisteredSession(event, linkedRegisteredUser);

        setResponseStatus(event, 201, 'Ok')
        return {
            statusCode: 201,
            statusMessage: 'Account linked'
        }
    }
    catch (error) {
        console.error('Error linking account:', error)
        return createError({
            statusCode: 500,
            statusMessage: 'An error occurred while linking accounts'
        })
    }
});