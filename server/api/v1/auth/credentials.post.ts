import { useTypeValidator } from '~/composables/useTypeValidator'
import { handleRegisterCredentials } from "~~/server/utils/auth/handlers/credentials/handleRegister";
import { handleLoginCredentials } from "~~/server/utils/auth/handlers/credentials/handleLogin";

interface CredentialsLoginRequest {
    email: string;
    password: string;
    confirm_password?: string;
}

export default defineEventHandler(async (event) => {
    const { validateInterface } = useTypeValidator();

    try {
        const body = await readBody<CredentialsLoginRequest>(event)

        const template: CredentialsLoginRequest = {
            email: '',           // Empty string indicates string type
            password: '',        // Empty string indicates string type
            confirm_password: undefined
        }

        const typedBody = validateInterface<CredentialsLoginRequest>(body, template)

        // User is trying to register
        if (typedBody.confirm_password) {
            await handleRegisterCredentials(event, {
                email: typedBody.email,
                password: typedBody.password,
                confirm_password: typedBody.confirm_password
            });

            setResponseStatus(event, 201, 'Created')
            return {
                statusCode: 201,
                message: 'User successfully registered'
            }
        }

        // User is trying to log in
        await handleLoginCredentials(event, {
            email: typedBody.email,
            password: typedBody.password
        });

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