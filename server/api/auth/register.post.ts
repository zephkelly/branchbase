import { createUser } from '@/server/utils/database/user'

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)

    if (!session || !session.user) {
        return createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    const body = await readBody(event)

    const { display_name } = body
    const { email, provider, picture } = session.user

    if (!display_name) {
        return createError({
            statusCode: 400,
            message: 'Display name is required'
        })
    }

    try {
        const newUser = await createUser({
            email,
            display_name,
            picture,
            provider,
        })

        await replaceUserSession(event, {
            user: {
                email: newUser.email,
                provider: newUser.provider,
                picture: newUser.picture,
                display_name: newUser.display_name,
            },
            loggedInAt: Date.now(),
        })

        setResponseStatus(event, 201)
        return {
            message: 'User registered successfully',
        }
    }
    catch (error) {
        console.error('Error registering user:', error)
        return createError({
            statusCode: 500,
            message: 'Error registering user'
        })
    }
})