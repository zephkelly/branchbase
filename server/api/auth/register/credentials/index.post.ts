import { Provider } from "~~/types/auth/user/providers"
import { isRegisteredUser } from "~~/types/auth/user/session/registered"
import { UnregisteredCredUser, SecureUnregisteredCredSessionData } from "~~/types/auth/user/session/credentials/unregistered"

import { createUser } from "~~/server/utils/database/user"
import { createRegisteredSession } from "~~/server/utils/auth/sessions/registered/standardSession"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const username: string = body.username

    if (!username) {
        return createError({
            statusCode: 400,
            statusMessage: 'Invalid or missing credentials'
        })
    }

    // Get and validate session first
    const session = await getUserSession(event)
    const unregisteredUser = session.user as UnregisteredCredUser
    const secureSession = session.secure as SecureUnregisteredCredSessionData

    if (!unregisteredUser) {
        return createError({
            statusCode: 403,
            statusMessage: 'You have not initiated the registration process properly'
        })
    }

    if (!secureSession.provider_email) {
        return createError({
            statusCode: 403,
            statusMessage: 'You have not initiated the registration process properly'
        })
    }

    if (isRegisteredUser(session.user)) {
        return createError({
            statusCode: 409,
            statusMessage: 'Already registered'
        })
    }

    if (unregisteredUser.provider !== Provider.Credentials) {
        return createError({
            statusCode: 409,
            statusMessage: 'Invalid provider'
        })
    }

    if (!secureSession.password_hash) {
        return createError({
            statusCode: 403,
            statusMessage: 'You have not initiated the registration process properly'
        })
    }

    const userCreationResponse = await createUser(event,
        username,
        secureSession.provider_email,
        unregisteredUser.provider,
        null,
        secureSession.provider_verified,
        unregisteredUser.picture,
        secureSession.password_hash,
    )

    if (!userCreationResponse) {
        return createError({
            statusCode: 500,
            statusMessage: 'Failed to create user'
        })
    }

    if (userCreationResponse.type !== 'SUCCESS') {
        return createError({
            statusCode: userCreationResponse.statusCode,
            statusMessage: userCreationResponse.message
        })
    }
    
    const response = await createRegisteredSession(event, userCreationResponse.data)
    response.statusCode = 201
    response.statusMessage = 'Created'

    return response
})