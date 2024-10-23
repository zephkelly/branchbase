import { isRegisteredUser, UnregisteredUser, RegisteredUser } from '@/types/auth'
import { isValidLength } from '~/utils/inputSanitisation'
import { getCredentialUserExists, getProviderUserExists, createUser } from '@/server/utils/database/user'

import { UserSession } from '#auth-utils'

import type { DatabaseError, ValidationError } from '@/server/types/error'
import type { UserCreationResponse } from '@/server/types/user'

// const USERNAME_MAX_LENGTH = 20
// const USERNAME_MIN_LENGTH = 1

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { username } = body

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
        return createError({
            statusCode: 422,
            message: usernameValidation.message
        });
    }

    const session: UserSession = await getUserSession(event)

    if (!session || !session.user) {
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
    const userSessionData = session.user as UnregisteredUser;

    const { primary_email, picture, provider, provider_id, provider_verified } = userSessionData

    if (!primary_email || !picture || !provider || !provider_id || !provider_verified) {
        return createError({
            statusCode: 400,
            message: 'Invalid temporary user session data, did you tamper with the request?'
        })
    }

    if (userSessionData.provider_id === null || userSessionData.provider_id === undefined) {
        const credentialsUser = await getCredentialUserExists(event, primary_email)

        if (credentialsUser) {
            return createError({
                statusCode: 409,
                message: 'A user with this email already exists'
            })
        }
    }
    else if (userSessionData.provider_id) {
        const providerUser = await getProviderUserExists(event, provider, provider_id)

        if (providerUser) {
            return createError({
                statusCode: 409,
                message: 'A user with this provider ID already exists'
            })
        }
    }
    else {
        return createError({
            statusCode: 400,
            message: 'Invalid temporary user session data, did you tamper with the request?'
        })
    }

    try {
        const newUser: UserCreationResponse = await createUser(event, {
            primary_email,
            username,
            picture,
            provider,
            provider_id,
            provider_verified
        });

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
    }
    catch (error) {
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