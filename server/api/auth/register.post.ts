import { isRegisteredUser, UnregisteredUser, RegisteredUser } from '@/types/auth'
import { isValidLength } from '~/utils/inputSanitisation'
import { getCredentialUserExists, getProviderUserExists, createUser } from '@/server/utils/database/user'

import type { DatabaseError, ValidationError } from '@/server/types/error'
import type { UserCreationResponse } from '@/server/types/user'

import { sanitiseRegistrationInput } from '~/server/utils/validation/register'

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
    
    // Validate and sanitize all input data (including session data)
    const sanitisationResult = sanitiseRegistrationInput({
        username: body.username,
        primary_email: userSessionData.primary_email,
        picture: userSessionData.picture,
        provider: userSessionData.provider,
        provider_id: userSessionData.provider_id,
        provider_verified: userSessionData.provider_verified
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
                verification_status: registeredUser.verification_status
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

const USERNAME_CONSTRAINTS = {
    MIN_LENGTH: 1,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_-]+$/
} as const;

function validateUsername(username: string): { isValid: boolean; message?: string } {
    if (!username) {
        return { isValid: false, message: 'Username is required for registration' };
    }

    if (!isValidLength(username, USERNAME_CONSTRAINTS.MIN_LENGTH, USERNAME_CONSTRAINTS.MAX_LENGTH)) {
        return { 
            isValid: false, 
            message: `Username must be between ${USERNAME_CONSTRAINTS.MIN_LENGTH} and ${USERNAME_CONSTRAINTS.MAX_LENGTH} characters`
        };
    }

    if (!USERNAME_CONSTRAINTS.PATTERN.test(username)) {
        return {
            isValid: false,
            message: 'Username can only contain letters, numbers, underscores, and hyphens'
        };
    }

    return { isValid: true };
}

function validateSessionData(sessionData: UnregisteredUser): { isValid: boolean; message?: string } {
    const { primary_email, picture, provider, provider_id, provider_verified } = sessionData;

    if (!primary_email || !picture || !provider || provider_id === undefined || provider_verified === undefined) {
        return {
            isValid: false,
            message: 'Invalid temporary user session data'
        };
    }

    return { isValid: true };
}