import { ref } from 'vue';
import { isRegisteredUser, UnregisteredUser, SecureRegisteredUser, SecureSessionDataType, Provider } from '../../../../types/user'
import { getCredentialUserExists, getProviderUserExists, createUser } from './../../../utils/database/user'

import { isDatabaseError, isValidationError } from '~~/server/types/error'
import type { UserCreationResponse } from '~~/server/types/user'

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
            message: 'You have not initiated the registration process properly'
        })
    }

    if (isRegisteredUser(session.user)) {
        return createError({
            statusCode: 409,
            message: 'User session indicates that you are already registered'
        })
    }

    const userSessionData = session.user as UnregisteredUser
    const userSecureSessionData = session.secure as SecureSessionDataType

    // Input data
    const username = isValidUsername(body.username as string)
    const provider_email = isValidEmail(userSecureSessionData.provider_email as string)
    const picture = isValidPictureUrl(userSessionData.picture as string)
    const provider = isValidProvider(userSessionData.provider as Provider)
    const provider_id = (userSessionData.provider_id as string).trim()
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

    // We dont check provider_id, because that is null for credentials users

    // Check for existing users
    if (provider_id === null || provider_id === undefined) {
        const credentialsUser = await getCredentialUserExists(event, provider_email.sanitisedData)
        if (credentialsUser) {
            return createError({
                statusCode: 409,
                message: 'A user with this email already exists'
            })
        }
    } else {
        const providerUser = await getProviderUserExists(
            event,
            provider.sanitisedData as Provider,
            provider_id
        )
        if (providerUser) {
            return createError({
                statusCode: 409,
                message: 'A user with this provider ID already exists'
            })
        }
    }

    try {
        // Create user with sanitized data
        const newUser: UserCreationResponse = await createUser(event, 
            username.sanitisedData,
            provider_email.sanitisedData,
            provider.sanitisedData,
            provider_id,
            provider_verified.sanitisedData,
            picture.sanitisedData
        );

        if (isDatabaseError(newUser) || isValidationError(newUser)) {
            return createError({
                statusCode: newUser.statusCode,
                message: newUser.message
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
            message: 'User registered successfully'
        }
    } catch (error) {
        console.error('Error registering user:', error)
        return createError({
            statusCode: 500,
            message: 'Unexpected error registering user, contact support'
        })
    }
})