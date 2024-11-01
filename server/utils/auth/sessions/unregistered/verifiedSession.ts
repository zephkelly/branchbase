import { H3Event } from "h3";
import { UserSession } from "#auth-utils";
import { UnregisteredUser } from "~~/types/user"

export async function createVerifiedUnregisteredSession(event: H3Event, userSession: UserSession) {
    const temporaryVerifiedUser: UnregisteredUser = userSession.user as UnregisteredUser
    const secureLinkableData = userSession.secure?.linkable_data
    const linkableData = userSession.linkable_data

    if (!temporaryVerifiedUser) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid user session'
        })
    }
    
    if (!temporaryVerifiedUser.provider_verified === undefined || !temporaryVerifiedUser.provider_verified === null || temporaryVerifiedUser.provider_verified === true) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Already verified'
        })
    }

    temporaryVerifiedUser.provider_verified = true

    await replaceUserSession(event, {
        user: temporaryVerifiedUser,
        secure: {
            provider_email: temporaryVerifiedUser.provider_email,
            provider_verified: true
        },
        loggedInAt: Date.now()
    }, {
        maxAge: 60 * 60
    })

    console.log('Verified unregistered session created')
}