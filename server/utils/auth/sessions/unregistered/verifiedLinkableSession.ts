import { H3Event } from "h3";

import { VerifiedUnregisteredCredLinkableSession, UnregisteredCredLinkableSession, isUnregisteredCredSession } from "~~/types/auth/user/session/credentials/unregistered";
import { UnregisteredOAuthLinkableSession, VerifiedUnregisteredOAuthLinkableSession, isUnregisteredOAuthSession } from "~~/types/auth/user/session/oauth/unregistered";

export async function createVerifiedLinkableSession(event: H3Event, session: UnregisteredOAuthLinkableSession | UnregisteredCredLinkableSession) {
    if (isUnregisteredOAuthSession(session)) {
        return createVerifiedLinkableUnregisteredOAuthSession(event, session)
    }

    if (isUnregisteredCredSession(session)) {
        return createVerifiedLinkableUnregisteredCredentialsSession(event, session)
    }
}

export async function createVerifiedLinkableUnregisteredOAuthSession(event: H3Event, session: UnregisteredOAuthLinkableSession) {
    const unregisteredLinkableUser = session.user
    const publicLinkableData = session.linkable_data
    const secureLinkableUsers = session.secure.linkable_users

    if (!unregisteredLinkableUser) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid user session'
        })
    }

    if (!unregisteredLinkableUser.provider_verified === null && unregisteredLinkableUser.provider_verified === true) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Already verified'
        })
    }

    unregisteredLinkableUser.provider_verified = true

    const verifiedUnregisteredSession: VerifiedUnregisteredOAuthLinkableSession = {
        user: unregisteredLinkableUser,
        secure: {
            provider_email: unregisteredLinkableUser.provider_email,
            provider_verified: unregisteredLinkableUser.provider_verified,
            linkable_users: secureLinkableUsers
        },
        linkable_data: {
            ...publicLinkableData,
            linkable_users: secureLinkableUsers
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
        statusMessage: "Ok"
    }
}

export async function createVerifiedLinkableUnregisteredCredentialsSession(event: H3Event, session: UnregisteredCredLinkableSession) {
    const unregisteredLinkableUser = session.user
    const confirmedPassword: boolean = session.confirmed_password
    const passwordHash: string = session.secure.password_hash
    const publicLinkableData = session.linkable_data
    const secureLinkableUsers = session.secure.linkable_users

    if (!unregisteredLinkableUser) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid user session'
        })
    }
    
    if (!unregisteredLinkableUser.provider_verified === null && unregisteredLinkableUser.provider_verified === true) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Already verified'
        })
    }

    unregisteredLinkableUser.provider_verified = true

    const verifiedUnregisteredSession: VerifiedUnregisteredCredLinkableSession = {
        user: unregisteredLinkableUser,
        secure: {
            provider_email: unregisteredLinkableUser.provider_email,
            provider_verified: true,
            password_hash: passwordHash,
            linkable_users: secureLinkableUsers
        },
        confirmed_password: confirmedPassword,
        linkable_data: {
            ...publicLinkableData,
            linkable_users: secureLinkableUsers
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
        statusMessage: "Ok"
    }
}