import { isDatabaseError, isValidationError } from '~~/server/types/error'

import { Provider } from "~~/types/auth/user/providers"
import { isRegisteredUser } from "~~/types/auth/user/session/registered"
import { VerifiedUnregisteredCredLinkableSession, UnregisteredCredSession } from "~~/types/auth/user/session/credentials/unregistered"

import { createUser } from "~~/server/utils/database/user"
import { createRegisteredSession } from "~~/server/utils/auth/sessions/registered/standardSession"
import { getOTPUsed } from "~~/server/utils/database/tokens/otp/used"

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
    const body = await readBody<RegisterCredentialsRequest>(event)
    const username: string = body.username
    const otp_id: string = body.otp_id

    if (!username || !otp_id) {
        return createError({
            statusCode: 400,
            statusMessage: 'Invalid or missing credentials'
        })
    }

    const usernameValidation = isValidUsername(username);
    if (!usernameValidation.isValid) {
        return createError({
            statusCode: 400,
            statusMessage: usernameValidation.message
        })
    }

    const uncastedSession = await getUserSession(event)
    const session = uncastedSession as unknown as VerifiedUnregisteredCredLinkableSession | UnregisteredCredSession
    const unregisteredUser = session.user
    const secureSession = session.secure


    // Check that the session is not malformed and of the correct type
    if (!unregisteredUser || !secureSession.password_hash || !secureSession.provider_email) {
        return createError({
            statusCode: 403,
            statusMessage: 'Registration process not initiated properly'
        })
    }

    if (isRegisteredUser(session.user)) {
        return createError({
            statusCode: 409,
            statusMessage: 'Session indicates you are already registered'
        })
    }

    if (unregisteredUser.provider !== Provider.Credentials) {
        return createError({
            statusCode: 409,
            statusMessage: 'Invalid provider. Use OAuth registration route'
        })
    }

    if (secureSession.provider_verified === undefined || secureSession.provider_verified === false) {
        return createError({
            statusCode: 403,
            statusMessage: 'Email is not verified'
        })
    }


    // Cleanup OTP from database used for email verification
    const otpVerificationResponse = await getOTPUsed(event, parseInt(otp_id))

    if (otpVerificationResponse.verified === false) {
        return createError({
            statusCode: 403,
            statusMessage: 'Invalid OTP used or expired. Please start registration process again'
        })
    }

    // Validate data before hitting database
    const provider_email = isValidEmail(secureSession.provider_email)
    const picture = isValidPictureUrl(unregisteredUser.picture)
    const provider = isValidProvider(unregisteredUser.provider)
    const provider_verified = isValidProviderVerified(secureSession.provider_verified)

    if (!provider_email.isValid) {
        return createError({
            statusCode: 400,
            statusMessage: provider_email.message
        })
    }
    if (!picture.isValid) {
        return createError({
            statusCode: 400,
            statusMessage: picture.message
        })
    }
    if (!provider.isValid) {
        return createError({
            statusCode: 400,
            statusMessage: provider.message
        })
    }
    if (!provider_verified.isValid) {
        return createError({
            statusCode: 400,
            statusMessage: provider_verified.message
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
        return createError({
            statusCode: userCreationResponse.statusCode,
            statusMessage: userCreationResponse.message
        });
    }
    
    const registeredUser = userCreationResponse.data


    // Login user with a registered session
    await createRegisteredSession(event, registeredUser)

    setResponseStatus(event, 201, 'Created')
    return {
        statusCode: 201,
        statusMessage: 'User registered successfully',
    }
})