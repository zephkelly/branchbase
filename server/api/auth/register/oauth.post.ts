import { ref } from 'vue';

// Types
import { isDatabaseError, isValidationError } from '~~/server/types/error'
import { UserCreationResponse } from '~~/server/types/user'
import { isRegisteredUser, UnregisteredUser, SecureRegisteredUser, SecureSessionDataType, Provider } from '~~/types/user'

// Utilities
import { getRandomAvatar } from '~~/server/utils/avatarSelector';

import { 
    getCredentialUserExists,
    getProviderUserExists,
    createUser
} from '~~/server/utils/database/user'

import { 
    isValidEmail,
    isValidUsername,
    isValidProvider,
    isValidProviderId,
    isValidPictureUrl,
    isValidProviderVerified,
} from '~~/utils/validation/authentication'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // Get and validate session first
    const session = await getUserSession(event)
    if (!session?.user) {
        return createError({
            statusCode: 403,
            statusMessage: 'You have not initiated the registration process properly'
        })
    }

    if (isRegisteredUser(session.user)) {
        return createError({
            statusCode: 409,
            statusMessage: 'User session indicates that you are already registered'
        })
    }

    const userSessionData = session.user as UnregisteredUser
    const userSecureSessionData = session.secure as SecureSessionDataType

    // Input data
    const username = isValidUsername(body.username as string)
    const provider_email = isValidEmail(userSecureSessionData.provider_email as string)
    const picture = isValidPictureUrl(getRandomAvatar())
    const provider = isValidProvider(userSessionData.provider as Provider)
    const provider_id = isValidProviderId(userSessionData.provider_id as string)
    const provider_verified = isValidProviderVerified(userSecureSessionData.provider_verified as boolean)

    // Input validation and formatting
    if (!username.isValid) {
        return createError({
            statusCode: 400,
            statusText: 'Invalid input data',
            statusMessage: username.message
        })
    }

    if (!provider_email.isValid) {
        return createError({
            statusCode: 400,
            statusText: 'Invalid input data',
            statusMessage: provider_email.message
        })
    }

    if (!picture.isValid) {
        return createError({
            statusCode: 400,
            statusText: 'Invalid input data',
            statusMessage: picture.message
        })
    }

    if (!provider.isValid) {
        return createError({
            statusCode: 400,
            statusText: 'Invalid input data',
            statusMessage: provider.message
        })
    }

    if (!provider_verified.isValid) {
        return createError({
            statusCode: 400,
            statusText: 'Invalid input data',
            statusMessage: provider_verified.message
        })
    }

    // Check for existing users
    if (!provider_id.isValid) {
        const credentialsUser = await getCredentialUserExists(event, provider_email.sanitisedData)
        if (credentialsUser) {
            return createError({
                statusCode: 409,
                statusMessage: 'A user with this email already exists'
            })
        }
    } else {
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
    }

    try {
        // Create user with sanitized data
        const newUser: UserCreationResponse = await createUser(event, 
            username.sanitisedData,
            provider_email.sanitisedData,
            provider.sanitisedData,
            provider_id.sanitisedData,
            provider_verified.sanitisedData,
            picture.sanitisedData
        );

        if (isDatabaseError(newUser) || isValidationError(newUser)) {
            return createError({
                statusCode: newUser.statusCode,
                statusMessage: newUser.message
            });
        }

        const registeredUser: SecureRegisteredUser = newUser.data

        await replaceUserSession(event, {
            user: {
                id: registeredUser.id,
                username: registeredUser.username,
                provider: registeredUser.provider,
                provider_id: registeredUser.provider_id,
                picture: registeredUser.picture,
            },
            secure: {
                provider_verified: registeredUser.provider_verified,
                provider_email: provider_email.sanitisedData,
            },
            loggedInAt: Date.now()
        })

        setResponseStatus(event, 201)
        return {
            statusCode: 201,
            statusMessage: 'User registered successfully'
        }
    }
    catch (error) {
        console.error('Error registering user:', error)

        return createError({
            statusCode: 500,
            statusMessage: 'Unexpected error registering user, contact support'
        })
    }
})