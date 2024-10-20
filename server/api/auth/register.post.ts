import { isRegisteredUser, UnregisteredUser } from '@/types/auth'
import { isValidLength } from '~/utils/inputSanitisation'
import { getCredentialUserExists, getProviderUserExists } from '@/server/utils/database/user'

import { UserSession } from '#auth-utils'

const USERNAME_MAX_LENGTH = 20
const USERNAME_MIN_LENGTH = 1

export default defineEventHandler(async (event) => {
    // Have we been given a username?
    const body = await readBody(event)
    const { username } = body

    if (!username) {
        return createError({
            statusCode: 422,
            message: 'Username is required for registration'
        })
    }

    // Is the username valid?
    if (!isValidLength(username, USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH)) {
        return createError({
            statusCode: 422,
            message: `Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters`
        })
    }

    // Has the user properly initiated the registration process via sessions?
    const session: UserSession = await getUserSession(event)

    if (!session || !session.user) {
        return createError({
            statusCode: 403,
            message: 'You have not initiated the registration process properly'
        })
    }

    // Is the user session indicating they are already registered?
    const userRegistered = isRegisteredUser(session.user)
    if (userRegistered) {
        return createError({
            statusCode: 409,
            message: 'User session indicates that you are already registered'
        })
    }
    // Check that the temporary session fields are valid
    const userSessionData = session.user as UnregisteredUser
    const { primary_email, picture, provider, provider_id, provider_verified } = userSessionData

    if (!primary_email || !picture || !provider || !provider_id || !provider_verified) {
        return createError({
            statusCode: 400,
            message: 'Invalid temporary user session data, did you tamper with the request?'
        })
    }

    // We cant trust that the user has not tampered with the session data, so check database

    // If there is no provider_id, then the user might be a credentials-only user
    if (userSessionData.provider_id === null || userSessionData.provider_id === undefined) {
        const credentialsUser = await getCredentialUserExists(event, primary_email)
    }
    else if (userSessionData.provider_id) {
        const providerUser = await getProviderUserExists(event, provider, provider_id)
    }
    else {
        return createError({
            statusCode: 400,
            message: 'Invalid temporary user session data, did you tamper with the request?'
        })
    }

    try {
        // const newUser: RegisteredUser = await createUser();


        // await replaceUserSession(event, {
        //     user: {
        //         id: newUser.id,
        //         display_name,
        //         picture,
        //     },
        //     loggedInAt: Date.now(),
        // })

        // setResponseStatus(event, 201)
        // return {
        //     message: 'User registered successfully',
        // }
    }
    catch (error) {
        console.error('Error registering user:', error)
        return createError({
            statusCode: 500,
            message: 'Unexpected error registering user, contact support'
        })
    }
})