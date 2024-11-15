import { getPool } from '~~/server/utils/database';

async function invalidateUserSession(user_id: string) {
    const pool = getPool();
    const client = await pool.connect();

    await client.query(`
        UPDATE private.users
        SET current_session_version = $1
        WHERE id = $2
    `, [Date.now(), user_id]);
}