import { H3Event } from 'h3'

import { Provider } from '~~/types/auth/user/providers'
import { RegisteredUser } from '~~/types/auth/user/session/registered'
import { createRegisteredSession } from '../../sessions/registered/standardSession'

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
            return createError({
                statusCode: 400,
                statusMessage: 'Invalid or missing credentials'
            })
        }
    
        const existingUser = await getEmailProviderUser(event, Provider.Credentials, email)
    
        if (!existingUser) {
            return createError({
                statusCode: 404,
                statusMessage: 'User not found'
            })
        }
    
    
        if (await verifyPassword(existingUser.password_hash, password) === false) {
            return createError({
                statusCode: 401,
                statusMessage: 'Invalid or missing credentials'
            })
        }

        return await createRegisteredSession(event, existingUser);
    }
    catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: 'Internal server error'
        })
    }
}