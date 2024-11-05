import { H3Event } from "h3";
import { UnregisteredCredUser, UnregisteredCredSession, isUnregisteredCredSession } from "~~/types/auth/user/session/credentials/unregistered";
import { UnregisteredOAuthSession, isUnregisteredOAuthSession } from "~~/types/auth/user/session/oauth/unregistered";

export async function createVerifiedUnregisteredSession(event: H3Event, session: UnregisteredCredSession | UnregisteredOAuthSession) {
    if (isUnregisteredOAuthSession(session)) {
        return createVerifiedUnregisteredOAuthSession(event, session as UnregisteredOAuthSession)
    }

    if (isUnregisteredCredSession(session)) {
        return createVerifiedUnregisteredCredentialsSession(event, session as UnregisteredCredSession)
    }
}

export async function createVerifiedUnregisteredOAuthSession(event: H3Event, session: UnregisteredOAuthSession) {
    const unregisteredUser = session.user

    if (!unregisteredUser) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid user session'
        })
    }

    if (!unregisteredUser.provider_verified === null && unregisteredUser.provider_verified === true) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Already verified'
        })
    }

    unregisteredUser.provider_verified = true
    const verifiedUnregisteredSession: UnregisteredOAuthSession = {
        user: unregisteredUser,
        secure: {
            provider_email: unregisteredUser.provider_email,
            provider_verified: true
        },
        logged_in_at: Date.now()
    }

    await replaceUserSession(event, {
        ...verifiedUnregisteredSession
    }, {
        maxAge: 60 * 60
    })

    setResponseStatus(event, 200, "Ok")
    return {
        statusCode: 200,
        statusMessage: "Ok",
        data: verifiedUnregisteredSession
    }
}

export async function createVerifiedUnregisteredCredentialsSession(event: H3Event, session: UnregisteredCredSession) {
    const unregisteredUser = session.user as UnregisteredCredUser
    const confirmedPassword: boolean = session.confirmed_password
    const passwordHash: string = session.secure.password_hash

    if (!unregisteredUser) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid user session'
        })
    }
    
    if (!unregisteredUser.provider_verified === null && unregisteredUser.provider_verified === true) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Already verified'
        })
    }

    unregisteredUser.provider_verified = true
    const verifiedUnregisteredSession: UnregisteredCredSession = {
        user: unregisteredUser,
        secure: {
            provider_email: unregisteredUser.provider_email,
            provider_verified: true,
            password_hash: passwordHash
        },
        confirmed_password: confirmedPassword,
        logged_in_at: Date.now(),
    }

    await replaceUserSession(event, {
        ...verifiedUnregisteredSession
    }, {
        maxAge: 60 * 60
    })

    setResponseStatus(event, 200, "Ok")
    return {
        statusCode: 200,
        statusMessage: "Ok",
        data: verifiedUnregisteredSession
    }
}