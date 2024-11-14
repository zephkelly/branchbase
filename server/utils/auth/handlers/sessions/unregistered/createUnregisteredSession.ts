import { H3Event } from 'h3'

import { UnregisteredUser } from '~~/types/auth/user/session/unregistered'
import { UnregisteredOAuthSession } from '~~/types/auth/user/session/oauth/unregistered'
import { UnregisteredCredUser, UnregisteredCredSession } from '~~/types/auth/user/session/credentials/unregistered'

export async function createUnregisteredSession(event: H3Event, user: UnregisteredUser| UnregisteredCredUser, password_hash?: string) {
    if (password_hash) {
        return createUnregisteredCredentialsSession(event, user as UnregisteredCredUser, password_hash)
    }

    return createUnregisteredOAuthSession(event, user as UnregisteredUser)
}

export async function createUnregisteredOAuthSession(event: H3Event, user: UnregisteredUser) {
    const session: UnregisteredOAuthSession = {
        user: user,
        secure: {
            provider_email: user.provider_email,
            provider_verified: user.provider_verified
        },
        logged_in_at: Date.now()
    }

    await replaceUserSession(event, {
        ...session
    }, {
        maxAge: 60 * 60
    })

    setResponseStatus(event, 200, "Ok")
    return {
        statusCode: 200,
        statusMessage: "Ok"
    }
}

export async function createUnregisteredCredentialsSession(event: H3Event, user: UnregisteredCredUser, password_hash: string) {
    const session: UnregisteredCredSession = {
        user: user,
        confirmed_password: true,
        secure: {
            provider_email: user.provider_email,
            provider_verified: user.provider_verified,
            password_hash: password_hash
        },
        logged_in_at: Date.now()
    }

    await replaceUserSession(event, {
        ...session
    }, {
        maxAge: 60 * 60
    })
}