import { RegisteredUser, UnregisteredUser, isRegisteredUser } from '@/types/auth'
import { createUser } from '@/server/utils/database/user'
import { ValidationError } from '@/server/utils/database/validationError'

// import { User } from '#auth-utils'

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)

    if (!session || !session.user) {
        return createError({
            statusCode: 403,
            message: 'Forbidden'
        })
    }

    const body = await readBody(event)

    const { display_name } = body
    const { email, picture, provider, provider_id } = session.user as UnregisteredUser

    if (isRegisteredUser(session.user)) {
        return createError({
            statusCode: 409,
            message: 'User is already registered'
        })
    }

    if (!display_name) {
        return createError({
            statusCode: 422,
            message: 'Display name is required'
        })
    }

    try {
        const newUser: RegisteredUser = await createUser({
            email,
            display_name,
            picture,
            provider,
            provider_id,
        })

        await replaceUserSession(event, {
            user: {
                id: newUser.id,
                display_name,
                picture,
            },
            loggedInAt: Date.now(),
        })

        setResponseStatus(event, 201)
        return {
            message: 'User registered successfully',
        }
    }
    catch (error) {
        if (error instanceof ValidationError) {
            return createError({
                statusCode: error.statusCode,
                statusMessage: error.message,
            });
        }
        console.error('Error registering user:', error)
        return createError({
            statusCode: 500,
            message: 'Error registering user'
        })
    }
})