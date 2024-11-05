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
            const randomTime = Math.floor(Math.random() * 1000)

            await setTimeout(() => {
                return createError({
                    statusCode: 400,
                    statusMessage: 'Invalid or missing credentials'
                })
            }, randomTime);
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

        await createRegisteredSession(event, existingUser);
        return {
            statusCode: 200,
            statusMessage: 'OK'
        }
    }
    catch (error) {
        console.error(error)
        return {
            statusCode: 500,
            statusMessage: 'Internal server error'
        }
    }
}