import { UserSession } from "#auth-utils"
import { isUnregisteredUser } from "~~/types/auth/user/session/unregistered"
import { isValidSession } from "../utils/auth/handlers/sessions/isValidSession"

export default defineNitroPlugin(() => {
    sessionHooks.hook('fetch', async (session: UserSession, event) => {
        if (!session) {
            return
        }

        if (isUnregisteredUser(session.user)) {
            return
        }

        try {
            await isValidSession(event)
        }
        catch (err) {
            await clearUserSession(event)
            throw err
        }
    })

    sessionHooks.hook('clear', async (_session: UserSession) => { })
})