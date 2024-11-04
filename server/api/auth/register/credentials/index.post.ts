// import { isRegisteredUser, Provider, UnregisteredUser, LinkableData, LinkableUserProviderData } from "~~/types/user"
import { isRegisteredUser } from "~~/types/auth/user/session/registered"
import { UnregisteredUser, UnregisteredLinkableData } from "~~/types/auth/user/session/unregistered"
import { UnregisteredCredUser, SecureUnregisteredLinkableCredSessionData } from "~~/types/auth/user/session/credentials/unregistered"
import { Provider } from "~~/types/auth/user/providers"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const email = body.email
    const password = body.password
    const confirm_password = body.confirm_password

    if (!password || !confirm_password || !email) {
        return createError({
            statusCode: 400,
            statusMessage: 'Invalid or missing credentials'
        })
    }

    if (password !== confirm_password) {
        return createError({
            statusCode: 400,
            statusMessage: 'Passwords do not match'
        })
    }

    // Get and validate session first
    const session = await getUserSession(event)
    const unregisteredUser = session.user as UnregisteredUser
    const secureSession = session.secure as SecureUnregisteredLinkableCredSessionData

    if (!unregisteredUser) {
        return createError({
            statusCode: 403,
            statusMessage: 'You have not initiated the registration process properly'
        })
    }

    if (!secureSession.provider_email) {
        return createError({
            statusCode: 403,
            statusMessage: 'You have not initiated the registration process properly'
        })
    }

    if (email !== secureSession.provider_email) {
        return createError({
            statusCode: 403,
            statusMessage: 'You have not initiated the registration process properly'
        })
    }

    if (isRegisteredUser(session.user)) {
        return createError({
            statusCode: 409,
            statusMessage: 'Already registered'
        })
    }

    if (unregisteredUser.provider !== Provider.Credentials || unregisteredUser.provider_id !== undefined) {
        return createError({
            statusCode: 409,
            statusMessage: 'Invalid provider'
        })
    }

    const hasLinkableData: boolean = secureSession.linkable_data !== undefined

    if (hasLinkableData) {
        const hashedPassword = await hashPassword(password)

        const temporaryLinkableUser: UnregisteredCredUser = {
            id: null,
            username: null,
            provider: Provider.Credentials,
            provider_email: email,
            provider_verified: false,
            picture: '',
        }

        const sessionLinkableData = session.linkable_data as UnregisteredLinkableData

        if (!sessionLinkableData) {
            return createError({
                statusCode: 403,
                statusMessage: 'No linkable account data found in session'
            })
        }

        const linkableData: UnregisteredLinkableData = {
            provider_email: email,
            existing_users_count: sessionLinkableData.existing_users_count as number,
        }

        await replaceUserSession(event, {
            user: temporaryLinkableUser,
            linkable_data: linkableData,
            confirmed_password: true,
            secure: {
                provider_email: email,
                provider_verified: false,
                linkable_data: secureSession.linkable_data,
                password_hash: hashedPassword
            },
            loggedInAt: Date.now()
        }, {
            maxAge: 60 * 60 // 1 hour
        })
    }

    setResponseStatus(event, 200)
    return {
        statusCode: 200,
        registered: true
    } 
})