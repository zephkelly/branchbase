import { H3Event } from "h3"
import { RegisteredUser, RegisteredSession } from "~~/types/auth/user/session/registered"
import { SecureSessionData } from "~~/types/auth/user/session/secure"

export async function createRegisteredSession(event: H3Event, user: RegisteredUser & SecureSessionData) {
    const session: RegisteredSession = {
        user: user as RegisteredUser,
        secure: user as SecureSessionData,
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
        statusMessage: "Ok",
        data: session
    }
}