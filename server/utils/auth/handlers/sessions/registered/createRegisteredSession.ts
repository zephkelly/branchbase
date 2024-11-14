import { H3Event } from "h3"
import { RegisteredUser, RegisteredSession } from "~~/types/auth/user/session/registered"
import { SecureSessionData } from "~~/types/auth/user/session/secure"

export async function createRegisteredSession(event: H3Event, user: RegisteredUser & SecureSessionData) {
    const session: RegisteredSession = {
        user: {
            id: user.id,
            username: user.username,
            provider: user.provider,
            provider_id: user.provider_id,
            picture: user.picture,
        },
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
}