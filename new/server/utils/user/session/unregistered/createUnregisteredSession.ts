import { H3Event } from 'h3'
import { IUnregisteredUser, IUnregisteredCredUser, IUnregisteredCredSession, IUnregisteredOAuthSession } from '#auth-utils'


export async function createUnregisteredSession(event: H3Event, user: IUnregisteredUser| IUnregisteredCredUser, password_hash?: string) {
    if (password_hash) {
        return createUnregisteredCredentialsSession(event, user as IUnregisteredCredUser, password_hash)
    }

    return createUnregisteredOAuthSession(event, user as IUnregisteredUser)
}


export async function createUnregisteredOAuthSession(event: H3Event, user: IUnregisteredUser) {
    const session: IUnregisteredOAuthSession = {
        user: user,
        secure: {
            provider_email: user.provider_email,
            provider_verified: user.provider_verified
        },
        logged_in_at: Date.now()
    }

    //@ts-expect-error
    await replaceUserSession(event, session, {
        maxAge: 60 * 60
    })

    setResponseStatus(event, 200, "Ok")
    return {
        statusCode: 200,
        statusMessage: "Ok"
    }
}


export async function createUnregisteredCredentialsSession(event: H3Event, user: IUnregisteredCredUser, password_hash: string) {
    const session: IUnregisteredCredSession = {
        user: user,
        confirmed_password: true,
        secure: {
            provider_email: user.provider_email,
            provider_verified: user.provider_verified,
            password_hash: password_hash
        },
        logged_in_at: Date.now()
    }

    //@ts-expect-error
    await replaceUserSession(event, session, {
        maxAge: 60 * 60
    })
}