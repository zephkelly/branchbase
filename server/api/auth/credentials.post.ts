// import { navigateTo } from 'nuxt/app'
// import { ref } from 'vue'
// import { handleCredentialsLogin } from '~~/server/utils/auth/handlers/credentialsHandler'

// import { getRandomAvatar } from '~~/server/utils/avatarSelector'

import { handleRegisterCredentials } from "~~/server/utils/auth/credentials/handlers/handleRegister";

interface CredentialsLoginRequest {
    email: string;
    password: string;
    confirm_password: string;
}

export default defineEventHandler(async (event) => {
    const body = await readBody<CredentialsLoginRequest>(event)

    const { email, password, confirm_password } = body;

    // There are two main flows in this intermediate credentials registration step:
    // 1. The user has tried to log in with credentials, meaning they only have password, but they are not registered yet
    // 2. The user has tried to register with credentials, meaning they have email, password, and confirm_password
    if (!email || !password) {
        return createError({
            statusCode: 400,
            statusMessage: 'Invalid or missing credentials'
        })
    }

    if (confirm_password) {
        return handleRegisterCredentials(event, {
            email,
            password,
            confirm_password
        })
    }

    // User is trying to log in
    


    // try {
    //     const email = body.email
    //     const password = (body.password) ? body.password : null

    //     if (!email) {
    //         return createError({
    //             statusCode: 400,
    //             statusMessage: 'Invalid or missing credentials'
    //         })
    //     }

    //     const avatarImage: string = getRandomAvatar()

    //     const response = await handleCredentialsLogin(event, {
    //         provider_email: email,
    //         password: password,
    //         picture: avatarImage
    //     })

    //     const responseStatus = response.statusCode
    //     const responseMessage = response.statusMessage

    //     if (responseStatus) {
    //         setResponseStatus(event, responseStatus, responseMessage)
    //         return
    //     }

    //     if (response.registered) {
    //         return sendRedirect(event, '/')
    //     }
    //     else {
    //         setResponseStatus(event, 200)
    //         return {
    //             registered: false
    //         }
    //     }
    // }
    // catch (error) {
    //     console.error(error)
    //     return createError({
    //         statusCode: 500,
    //         statusMessage: 'Error logging in with credentials'
    //     })
    // }
})