import { isDatabaseError, isValidationError } from '~~/server/types/error'

import { Provider } from '~~/types/auth/user/providers';
import { isRegisteredUser } from '~~/types/auth/user/session/registered';
import { UnregisteredOAuthSession, VerifiedUnregisteredOAuthLinkableSession } from '~~/types/auth/user/session/oauth/unregistered';

import { 
    isValidEmail,
    isValidUsername,
    isValidProvider,
    isValidProviderId,
    isValidPictureUrl,
    isValidProviderVerified,
} from '~~/utils/validation/authentication'

import { getRandomAvatar } from '~~/server/utils/avatarSelector';
import { getProviderUserExists, createUser } from '~~/server/utils/auth/database/user'
import { createRegisteredSession } from '~~/server/utils/auth/sessions/registered/createRegisteredSession';

interface RegisterOAuthRequest {
    username: string
}
export default defineEventHandler(async (event) => {
    const body = await readBody<RegisterOAuthRequest>(event)
    const username: string = body.username

    if (!username) {
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
    const session = uncastedSession as unknown as UnregisteredOAuthSession | VerifiedUnregisteredOAuthLinkableSession
    const userSessionData = session.user
    const secureSession = session.secure

    // Check that the session is not malformed and of the correct type
    if (!userSessionData || !secureSession.provider_email) {
        return createError({
            statusCode: 403,
            statusMessage: 'Registration process not initiated properly'
        })
    }

    if (isRegisteredUser(userSessionData)) {
        return createError({
            statusCode: 409,
            statusMessage: 'Session indicates you are already registered'
        })
    }

    if (userSessionData.provider === Provider.Credentials || userSessionData.provider_id === undefined) {
        return createError({
            statusCode: 409,
            statusMessage: 'Invalid provider. Use credentials registration route'
        })
    }

    if (secureSession.provider_verified === undefined || secureSession.provider_verified === false) {
        return createError({
            statusCode: 403,
            statusMessage: 'Email is not verified on your provider account'
        })
    }

    // Validate data before hitting database
    const provider_email = isValidEmail(secureSession.provider_email)
    const picture = isValidPictureUrl(getRandomAvatar())
    const provider = isValidProvider(userSessionData.provider)
    const provider_id = isValidProviderId(userSessionData.provider_id)
    const provider_verified = isValidProviderVerified(secureSession.provider_verified)

    if (provider.sanitisedData === Provider.Credentials || !provider_id.isValid) {
        return createError({
            statusCode: 400,
            statusMessage: 'This route is for OAuth providers only'
        })
    }

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

    //TODO check if the username already exists


    // Check if user already exists
    const providerUser = await getProviderUserExists(
        event,
        provider.sanitisedData as Provider,
        provider_id.sanitisedData
    )

    if (providerUser) {
        return createError({
            statusCode: 409,
            statusMessage: 'A user with this provider ID already exists'
        })
    }

    // Create user in database
    const userCreationResponse = await createUser(event, 
        usernameValidation.sanitisedData,
        provider_email.sanitisedData,
        provider.sanitisedData,
        provider_id.sanitisedData,
        provider_verified.sanitisedData,
        picture.sanitisedData
    );

    if (isDatabaseError(userCreationResponse) || isValidationError(userCreationResponse)) {
        return createError({
            statusCode: userCreationResponse.statusCode,
            statusMessage: userCreationResponse.message
        });
    }

    const registeredUser= userCreationResponse.data


    // Login user with a registered session
    await createRegisteredSession(event, registeredUser)

    setResponseStatus(event, 201, 'Created')
    return {
        statusCode: 201,
        statusMessage: 'User registered successfully',
    }
})