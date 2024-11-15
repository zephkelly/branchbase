import { isDatabaseError, isValidationError } from '~~/server/types/error'

import { Provider } from "~~/types/auth/user/providers"
import { isRegisteredUser } from "~~/types/auth/user/session/registered"
import { VerifiedUnregisteredCredLinkableSession, UnregisteredCredSession } from "~~/types/auth/user/session/credentials/unregistered"

import { createUser } from "~~/server/utils/auth/database/user"
import { createRegisteredSession } from "~~/server/utils/auth/handlers/sessions/registered/createRegisteredSession"
import { getOTPVerified } from "~~/server/utils/auth/handlers/tokens/otp/verify"
import { cleanupOTP } from '~~/server/utils/auth/handlers/tokens/otp/cleanup'

import { 
    isValidEmail,
    isValidUsername,
    isValidProvider,
    isValidPictureUrl,
    isValidProviderVerified,
} from '~~/utils/validation/authentication'

interface RegisterCredentialsRequest {
    username: string
    otp_id: string
}
export default defineEventHandler(async (event) => {
    try {
        const body = await readBody<RegisterCredentialsRequest>(event)
        const username: string = body.username
        const otp_id: string = body.otp_id

        if (!username || !otp_id) {
            throw createError({
                statusCode: 400,
                message: 'Invalid or missing credentials'
            })
        }

        const usernameValidation = isValidUsername(username);
        if (!usernameValidation.isValid) {
            throw createError({
                statusCode: 400,
                message: usernameValidation.message
            })
        }

        const uncastedSession = await getUserSession(event)
        const session = uncastedSession as unknown as VerifiedUnregisteredCredLinkableSession | UnregisteredCredSession
        const unregisteredUser = session.user
        const secureSession = session.secure


        // Check that the session is not malformed and of the correct type
        if (!unregisteredUser || !secureSession.password_hash || !secureSession.provider_email) {
            throw createError({
                statusCode: 403,
                message: 'Registration process not initiated properly'
            })
        }

        if (isRegisteredUser(session.user)) {
            throw createError({
                statusCode: 409,
                message: 'Session indicates you are already registered'
            })
        }

        if (unregisteredUser.provider !== Provider.Credentials) {
            throw createError({
                statusCode: 409,
                message: 'Invalid provider. Use OAuth registration route'
            })
        }

        if (secureSession.provider_verified === undefined || secureSession.provider_verified === false) {
            throw createError({
                statusCode: 403,
                message: 'Email is not verified'
            })
        }


        // Cleanup OTP from database used for email verification
        const otpVerificationResponse = await getOTPVerified(event, parseInt(otp_id))

        if (otpVerificationResponse.verified === false || !otpVerificationResponse.email) {
            throw createError({
                statusCode: 403,
                message: 'Invalid OTP used or expired. Please start registration process again'
            })
        }

        const is_otp_cleaned = await cleanupOTP(event, parseInt(otp_id), otpVerificationResponse.email)

        if (is_otp_cleaned === false) {
            throw createError({
                statusCode: 500,
                message: 'Failed to cleanup OTP from database'
            })
        }

        // Validate data before hitting database
        const provider_email = isValidEmail(secureSession.provider_email)
        const picture = isValidPictureUrl(unregisteredUser.picture)
        const provider = isValidProvider(unregisteredUser.provider)
        const provider_verified = isValidProviderVerified(secureSession.provider_verified)

        if (!provider_email.isValid) {
            throw createError({
                statusCode: 400,
                message: provider_email.message
            })
        }
        if (!picture.isValid) {
            throw createError({
                statusCode: 400,
                message: picture.message
            })
        }
        if (!provider.isValid) {
            throw createError({
                statusCode: 400,
                message: provider.message
            })
        }
        if (!provider_verified.isValid) {
            throw createError({
                statusCode: 400,
                message: provider_verified.message
            })
        }

        // TODO: Check if username is already taken, check if account is already registered

        // Create user in database
        const userCreationResponse = await createUser(event,
            usernameValidation.sanitisedData,
            provider_email.sanitisedData,
            provider.sanitisedData,
            null,
            provider_verified.sanitisedData,
            picture.sanitisedData,
            secureSession.password_hash,
        )

        if (isDatabaseError(userCreationResponse) || isValidationError(userCreationResponse)) {
            throw createError({
                statusCode: userCreationResponse.statusCode,
                message: userCreationResponse.message
            });
        }
        
        const registeredUser = userCreationResponse.data

        // Login user with a registered session
        await createRegisteredSession(event, registeredUser)

        setResponseStatus(event, 201, 'Created')
        return {
            statusCode: 201,
            message: 'User registered successfully',
        }
    }
    catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            message: 'Failed to register user'
        })
    }
})