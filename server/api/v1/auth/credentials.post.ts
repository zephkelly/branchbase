import { handleRegisterCredentials } from "~~/server/utils/auth/handlers/credentials/handleRegister";
import { handleLoginCredentials } from "~~/server/utils/auth/handlers/credentials/handleLogin";

interface CredentialsLoginRequest {
    email: string;
    password: string;
    confirm_password: string;
}

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody<CredentialsLoginRequest>(event)

        const { email, password, confirm_password } = body;

        if (!email || !password) {
            throw createError({
                statusCode: 400,
                message: 'Invalid or missing credentials'
            })
        }

        // User is trying to register
        if (confirm_password) {
            await handleRegisterCredentials(event, {
                email,
                password,
                confirm_password
            })

            setResponseStatus(event, 201, 'Created')
            return {
                statusCode: 201,
                message: 'User successfully registered'
            }
        }

        // User is trying to log in
        await handleLoginCredentials(event, {
            email,
            password
        })

        setResponseStatus(event, 200, 'OK')
        return {
            statusCode: 200,
            message: 'User successfully logged in'
        }
    }
    catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            message: 'Error handling credentials'
        })
    }
})