import { H3Event } from "h3";
import { UserSession } from "#auth-utils";

import { UnregisteredUser } from "~~/types/auth/user/session/unregistered";
import { UnregisteredCredUser, UnregisteredCredSession } from "~~/types/auth/user/session/credentials/unregistered";

export async function createVerifiedUnregisteredSession(event: H3Event, userSession: any) {
    const temporaryVerifiedUser = userSession.user as UnregisteredUser | UnregisteredCredUser

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

    const confirmedPassword =  (userSession as UnregisteredCredSession).confirmed_password
    const passwordHash = (userSession as UnregisteredCredSession).secure.password_hash

    await replaceUserSession(event, {
        user: temporaryVerifiedUser,
        confirm_password: confirmedPassword,
        secure: {
            provider_email: temporaryVerifiedUser.provider_email,
            provider_verified: true,
            password_hash: passwordHash
        },
        logged_in_at: Date.now()
    }, {
        maxAge: 60 * 60
    })

    console.log('Verified unregistered session created')
}