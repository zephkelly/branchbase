import { H3Event } from "h3"

import { SecureSessionData } from "~~/types/auth/user/session/secure"

import { UUIDv7 } from "~~/server/types/uuidv7"
import { RegisteredUser, RegisteredSession } from "~~/types/auth/user/session/registered"

import { getPool } from "~~/server/utils/database"

export async function createRegisteredSession(event: H3Event, user: RegisteredUser & SecureSessionData) {
    const session_uuid: string = new UUIDv7().generate()
    try {
        const pool = getPool()
        const client = await pool.connect()
    
        await client.query(`
            UPDATE private.users 
            SET current_session_version = $1
            WHERE id = $2
          `, [session_uuid, user.id]);
    }
    catch (error: any) {
        throw createError({
            statusCode: 500,
            message: 'Failed to create registered session'
        });
    }

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
            provider_verified: user.provider_verified,
            current_session_version: session_uuid,
        },
        logged_in_at: Date.now()
    }

    await replaceUserSession(event, {
        ...session
    }, {
        maxAge: 60 * 60
    })
}