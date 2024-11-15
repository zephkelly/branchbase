import { Ref, ref } from 'vue';
import { H3Event } from 'h3';

import { useFormValidation } from '~/composables/form/useFormValidation';

import { cleanupOTP } from '~~/server/utils/auth/handlers/tokens/otp/cleanup';
import { getOTPVerified } from '~~/server/utils/auth/handlers/tokens/otp/verify';
import { getProviderUser, createUserProvider } from '~~/server/utils/auth/database/user';
import { createRegisteredSession } from '~~/server/utils/auth/sessions/registered/createRegisteredSession';

import { isRegisteredUser } from '~~/types/auth/user/session/registered';
import { isDatabaseError, isValidationError } from '~~/server/types/error';
import { VerifiedUnregisteredCredLinkableSession } from '~~/types/auth/user/session/credentials/unregistered';
import { VerifiedUnregisteredOAuthLinkableSession } from '~~/types/auth/user/session/oauth/unregistered';


type IUnregisteredLinkableSession = VerifiedUnregisteredCredLinkableSession | VerifiedUnregisteredOAuthLinkableSession

interface ILinkProviderRequest {
    otp_id: string;
    existing_user_index: number;
}
export default defineEventHandler(async (event) => {
    try {
        // Validate request 
        const body = await readBody<ILinkProviderRequest>(event)

        const otp_id = ref(body.otp_id)
        const existing_user_index = ref(body.existing_user_index)

        validateInput({ otp_id, existing_user_index })


        // Validate the session and linkable data
        const uncastedSession = await getUserSession(event)
        const session = uncastedSession as unknown as IUnregisteredLinkableSession
        const secureSessionData = session.secure
        const secureLinkableUsers = secureSessionData.linkable_users

        validateSession(session)


        // Verify and remove otp code and rate limit from db
        await verifyAndCleanOTP(event, otp_id.value)


        // Get the desired user from the secure linkable session data
        const existing_user_info = secureLinkableUsers[existing_user_index.value]
        const { provider: existing_provider, provider_id: existing_provider_id } = existing_user_info.providers[0]

        
        // Check if the desired user actually exists in the database
        const desired_user = await getProviderUser(event, existing_provider, existing_provider_id, secureSessionData.provider_email)
        
        if (!desired_user || desired_user.id === null || desired_user.id === undefined) {
            throw createError({
                statusCode: 404,
                message: 'No accounts found to link with'
            })
        }


        // Create a new user provider linking to the desired user
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
            message: 'Failed to link account'
        })
    }
});


function validateSession(session: VerifiedUnregisteredCredLinkableSession | VerifiedUnregisteredOAuthLinkableSession) {
    if (!session || !session.user || !session.secure || !session.secure.linkable_users) {
        throw createError({
            statusCode: 403,
            message: 'You have not initiated the linking process properly'
        });
    }

    if (!session.linkable_data) {
        throw createError({
            statusCode: 403,
            message: 'No linkable account data found in session'
        });
    }

    if (session.user.provider_verified === false || session.secure.provider_verified === false) {
        throw createError({
            statusCode: 403,
            message: 'You have not verified your email address'
        });
    }

    if (isRegisteredUser(session.user)) {
        throw createError({
            statusCode: 403,
            message: 'You are already logged in'
        });
    }
}


interface IValidateInput {
    otp_id: Ref<string>;
    existing_user_index: Ref<number>;
}
function validateInput(data: IValidateInput) {
    const validator = useFormValidation<ILinkProviderRequest>({
        otp_id: data.otp_id.value,
        existing_user_index: data.existing_user_index.value
    })
    
    validator.bindField('otp_id', data.otp_id)
    validator.bindField('existing_user_index', data.existing_user_index)
    
    validator.setFieldRules(
        'otp_id',
        validator.rules.required('OTP id is required'),
        validator.rules.isString('OTP id must be a string'),
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
}


async function verifyAndCleanOTP(event: H3Event, otp_id: string) {
    const otpVerificationResponse = await getOTPVerified(event, otp_id)
    if (otpVerificationResponse.verified === false || !otpVerificationResponse.email) {
        throw createError({
            statusCode: 403,
            message: 'Invalid OTP used or expired. Please start registration process again'
        })
    }

    const is_otp_cleaned  = await cleanupOTP(event, otp_id, otpVerificationResponse.email)
    if (is_otp_cleaned === false) {
        throw createError({
            statusCode: 500,
            message: 'Failed to cleanup OTP from database'
        })
    }
}