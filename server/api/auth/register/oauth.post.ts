import { isRegisteredUser, UnregisteredUser, RegisteredUser, SecureSessionDataType, Provider } from '@/types/auth'
import { isValidLength } from '~/utils/inputSanitisation'
import { getCredentialUserExists, getProviderUserExists, createUser } from '@/server/utils/database/user'

import type { DatabaseError, ValidationError } from '@/server/types/error'
import type { UserCreationResponse } from '@/server/types/user'

import { sanitiseOAuthRegistrationInput } from '~/server/utils/validation/register'

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
    
    // Validate and sanitize all input data (including session data)
    const sanitisationResult = sanitiseOAuthRegistrationInput({
        username: body.username,
        provider_email: userSecureSessionData.provider_email as string,
        picture: userSessionData.picture,
        provider: userSessionData.provider,
        provider_id: userSessionData.provider_id,
        provider_verified: userSecureSessionData.provider_verified
    });

    if (!sanitisationResult.isValid) {
        return createError({
            statusCode: 422,
            message: sanitisationResult.message
        });
    }

    const sanitisedData = sanitisationResult.sanitisedData;

    // Check for existing users
    if (sanitisedData.provider_id === null || sanitisedData.provider_id === undefined) {
        const credentialsUser = await getCredentialUserExists(event, sanitisedData.primary_email)
        if (credentialsUser) {
            return createError({
                statusCode: 409,
                message: 'A user with this email already exists'
            })
        }
    } else {
        const providerUser = await getProviderUserExists(
            event, 
            sanitisedData.provider!, 
            sanitisedData.provider_id
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
        const newUser: UserCreationResponse = await createUser(event, sanitisedData);

        if (isDatabaseError(newUser) || isValidationError(newUser)) {
            return createError({
                statusCode: newUser.statusCode,
                message: newUser.message
            });
        }

        const registeredUser: RegisteredUser = newUser.data

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
                provider_email: sanitisedData.provider_email
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

export function isDatabaseError(error: UserCreationResponse): error is DatabaseError {
    return (error as DatabaseError).type === 'DATABASE_ERROR';
}

export function isValidationError(error: UserCreationResponse): error is ValidationError {
    return (error as ValidationError).type === 'VALIDATION_ERROR';
}