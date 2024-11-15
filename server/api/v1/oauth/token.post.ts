import { H3Event } from 'h3'
import { generateSecureToken } from '~~/server/utils/auth/handlers/tokens/base64/token';

export const TOKEN_COOKIE_OPTIONS = {
    domain: '.upbranched.com',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'prod',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 3600 // 1 hour for access token
} as const;

export const REFRESH_COOKIE_OPTIONS = {
    ...TOKEN_COOKIE_OPTIONS,
    maxAge: 30 * 24 * 60 * 60 // 30 days for refresh token
} as const;

export default defineEventHandler(async (event: H3Event) => {
    const pool = await getPool();
    const client = await pool.connect();
   
    try {
        const body = await readBody(event);
        const { grant_type, client_id, client_secret, refresh_token } = body;
       
        const app = await client.query(
            `SELECT id, owner_id FROM private.applications
             WHERE client_id = $1 AND client_secret = $2`,
            [client_id, client_secret]
        );
       
        if (app.rows.length === 0) {
            throw createError({
                statusCode: 401,
                message: 'Invalid client credentials'
            });
        }
       
        const application = app.rows[0];
        const expiresIn = 3600;
       
        if (grant_type === 'client_credentials') {
            const accessToken = await generateSecureToken(32);
            const refreshToken = await generateSecureToken(32);
           
            await client.query(
                `INSERT INTO private.application_access_tokens
                 (token, application_id, expires_at)
                 VALUES ($1, $2, NOW() + interval '1 hour')`,
                [accessToken, application.id]
            );

            await client.query(
                `INSERT INTO private.application_refresh_tokens
                 (token, application_id, user_id, expires_at)
                 VALUES ($1, $2, $3, NOW() + interval '30 days')`,
                [refreshToken, application.id, application.owner_id]
            );
           
            return {
                access_token: accessToken,
                refresh_token: refreshToken,
                token_type: 'Bearer',
                expires_in: expiresIn
            };
        }
       
        if (grant_type === 'refresh_token') {
            const refreshTokenResult = await client.query(
                `SELECT id, user_id FROM private.application_refresh_tokens
                 WHERE token = $1 AND application_id = $2
                 AND expires_at > NOW()`,
                [refresh_token, application.id]
            );
           
            if (refreshTokenResult.rows.length === 0) {
                throw createError({
                    statusCode: 401,
                    message: 'Invalid refresh token'
                });
            }
           
            const accessToken = await generateSecureToken(32);
            const newRefreshToken = await generateSecureToken(32);
            const userId = refreshTokenResult.rows[0].user_id;

            // Update existing refresh token
            await client.query(
                `UPDATE private.application_refresh_tokens
                 SET token = $1, expires_at = NOW() + interval '30 days'
                 WHERE id = $2`,
                [newRefreshToken, refreshTokenResult.rows[0].id]
            );
           
            await client.query(
                `INSERT INTO private.application_access_tokens
                 (token, application_id, user_id, expires_at)
                 VALUES ($1, $2, $3, NOW() + interval '1 hour')`,
                [accessToken, application.id, userId]
            );
           
            return {
                access_token: accessToken,
                refresh_token: newRefreshToken,
                token_type: 'Bearer',
                expires_in: expiresIn
            };
        }
       
        throw createError({
            statusCode: 400,
            message: 'Invalid grant type'
        });
    } finally {
        client.release();
    }
});