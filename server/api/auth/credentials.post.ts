import { navigateTo } from 'nuxt/app'
import { ref } from 'vue'
import { handleCredentialsLogin } from '~~/server/utils/auth/handlers/credentialsHandler'

import { getRandomAvatar } from '~~/server/utils/avatarSelector'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    try {
        const email = body.email
        const password = body.password

        if (!email || !password) {
            return createError({
                statusCode: 400,
                statusMessage: 'Invalid or missing credentials'
            })
        }

        const avatarImage: string = getRandomAvatar()

        const response = await handleCredentialsLogin(event, {
            provider_email: email,
            password: password,
            picture: avatarImage
        })

        const responseStatus = response.statusCode
        const responseMessage = response.statusMessage

        if (responseStatus) {
            setResponseStatus(event, responseStatus, responseMessage)
            return
        }

        if (response.registered) {
            return sendRedirect(event, '/')
        }
        else {
            setResponseStatus(event, 200)
            return {
                registered: false
            }
        }
    }
    catch (error) {
        console.error(error)
        return createError({
            statusCode: 500,
            statusMessage: 'Error logging in with credentials'
        })
    }
})