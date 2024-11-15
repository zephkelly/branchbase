import { UserSession } from "#auth-utils"
import { RegisteredSession } from "~~/types/auth/user/session/registered"

import { getPool } from "~~/server/utils/database"
import { isRegisteredSession } from "../utils/auth/sessions/isRegisteredSession"


export default defineNitroPlugin(() => {
    sessionHooks.hook('fetch', async (session: UserSession, event) => {
        const registeredSession = session as unknown as RegisteredSession

        if (!registeredSession.user.id || !isRegisteredSession(event)) {
            return;
        }
        
        const pool = getPool()
        const client = await pool.connect()

        const result = await client.query(`
            SELECT current_session_version 
            FROM private.users 
            WHERE id = $1
        `, [registeredSession.user.id]);

        if (!result.rows[0] || 
            result.rows[0].current_session_version !== registeredSession.secure.current_session_version) {
            await clearUserSession(event);
            throw createError({
                statusCode: 401,
                message: 'Session invalidated'
            });
        }
    })

    sessionHooks.hook('clear', async (_session: UserSession) => { })
})