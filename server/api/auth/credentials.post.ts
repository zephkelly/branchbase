import { navigateTo } from 'nuxt/app'
import { ref } from 'vue'
import { handleCredentialsLogin } from '~~/server/utils/auth/handlers/credentialsHandler'

import { getRandomAvatar } from '~~/server/utils/avatarSelector'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    try {
        const email = body.email
        const password = body.password

        const avatarImage: string = getRandomAvatar()

        const response = await handleCredentialsLogin(event, {
            provider_email: email,
            password: password,
            picture: avatarImage
        })

        setResponseStatus(event, response.statusCode, response.statusMessage)
        return response
    }
    catch (error) {
        console.error(error)
        console.log('Error logging in with credentials:', error)
        return createError({
            statusCode: 500,
            statusMessage: 'Error logging in with credentials'
        })
    }
})