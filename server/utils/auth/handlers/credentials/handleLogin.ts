import { H3Event } from 'h3'

import { Provider } from '~~/types/auth/user/providers'
import { getEmailProviderUser } from '~~/server/utils/auth/database/user'
import { createRegisteredSession } from '~~/server/utils/auth/sessions/registered/createRegisteredSession'

export async function handleLoginCredentials(
    event: H3Event,
    body: {
        email: string,
        password: string,
    }
) {
    try {
        const { email, password } = body
    
        if (!password || !email) {
            throw createError({
                statusCode: 400,
                message: 'Invalid or missing credentials'
            })
        }
    
        const existingUser = await getEmailProviderUser(event, Provider.Credentials, email)

        if (!existingUser) {
            throw createError({
                statusCode: 404,
                message: 'User not found'
            })
        }
    
        if (await verifyPassword(existingUser.password_hash, password) === false) {
            throw createError({
                statusCode: 401,
                message: 'Invalid or missing credentials'
            })
        }

        await createRegisteredSession(event, existingUser);
    }
    catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        console.log(error)
        throw createError({
            statusCode: 500,
            message: 'Error logging in'
        })
    }
}