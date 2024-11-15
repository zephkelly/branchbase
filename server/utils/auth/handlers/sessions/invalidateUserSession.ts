import { UUIDv7 } from '~~/server/types/uuidv7';
import { getPool } from '~~/server/utils/database';

export async function invalidateUserSession(user_id: string) {
    const pool = getPool();
    const client = await pool.connect();

    await client.query(`
        UPDATE private.users
        SET current_session_version = $1
        WHERE id = $2
    `, [new UUIDv7().generate(), user_id]);

    client.release();
}