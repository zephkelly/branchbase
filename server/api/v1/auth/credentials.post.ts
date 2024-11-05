import { handleRegisterCredentials } from "~~/server/utils/auth/handlers/credentials/handleRegister";
import { handleLoginCredentials } from "~~/server/utils/auth/handlers/credentials/handleLogin";

interface CredentialsLoginRequest {
    email: string;
    password: string;
    confirm_password: string;
}

export default defineEventHandler(async (event) => {
    const body = await readBody<CredentialsLoginRequest>(event)

    const { email, password, confirm_password } = body;

    if (!email || !password) {
        return createError({
            statusCode: 400,
            statusMessage: 'Invalid or missing credentials'
        })
    }

    // User is trying to register
    if (confirm_password) {
        return handleRegisterCredentials(event, {
            email,
            password,
            confirm_password
        })
    }

    // User is trying to log in
    return handleLoginCredentials(event, {
        email,
        password
    })
})