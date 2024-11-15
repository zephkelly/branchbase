import { H3Event } from 'h3';
import { isRegisteredUser, RegisteredSession } from '~~/types/auth/user/session/registered';

export async function isValidSession(event: H3Event) {
    const pool = getPool()
    const client = await pool.connect()

    try {
        const session = await getUserSession(event);
        const registeredSession = session as unknown as RegisteredSession

        if (!session || !registeredSession) {
            throw createError({
                statusCode: 401,
                message: 'Invalid session'
            });
        }

        if (!isRegisteredUser(session.user)) {
            throw createError({
                statusCode: 403,
                message: 'Invalid session'
            });
        }
        

        const result = await client.query(`
            SELECT current_session_version 
            FROM private.users 
            WHERE id = $1
        `, [registeredSession.user.id]);

        if (!result.rows[0] || 
            result.rows[0].current_session_version !== registeredSession.secure.current_session_version) {
            await clearUserSession(event);
            
            throw createError({
                statusCode: 403,
                message: 'Invalid session'
            });
        }
    }
    catch (error: any) {
        if (error.statusCode) {
            throw error;
        }

        throw createError({
            statusCode: 500,
            message: 'Error validating session'
        });
    }
    finally {
        client.release();
    }
}