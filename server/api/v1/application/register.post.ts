import { UUIDv7 } from "~~/server/types/uuidv7";
import { isValidSession } from "~~/server/utils/auth/handlers/sessions/isValidSession";
import { RegisteredSession } from "~~/types/auth/user/session/registered";

import { generateSecureToken } from "~~/server/utils/auth/handlers/tokens/base64/token";

interface ApplicationRegistrationRequest {
    name: string;
    redirectUris?: string[];
}
  
export default defineEventHandler({
    onRequest: [
        async (event) => await isValidSession(event),
    ],
    handler: async (event) => {
        const pool = await getPool();
        const client = await pool.connect();

            const session = await getUserSession(event);
            const registeredSession = session as any as RegisteredSession;

            const body = await readBody<ApplicationRegistrationRequest>(event);
  
            if (body.redirectUris) {
                if (body.redirectUris.length === 0) {
                    throw createError({
                        statusCode: 400,
                        message: 'At least one redirect URI is required'
                    });
                }

                for (const uri of body.redirectUris) {
                    try {
                        new URL(uri);
                    } catch {
                        throw createError({
                            statusCode: 400,
                            message: `Invalid redirect URI: ${uri}`
                        });
                    }
                }
            }

            const client_id = `app_${new UUIDv7().generate()}`;
            const client_secret = await generateSecureToken(32);
            const default_scopes = ['read:basic', 'write:basic'];

        try {
            const application = await client.query(
                `INSERT INTO private.applications (
                    client_id,
                    client_secret,
                    name,
                    owner_id,
                    scopes,
                    redirect_uris
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING client_id, name, scopes, created_at`, [
                    client_id,
                    client_secret,
                    body.name,
                    registeredSession.user.id,
                    default_scopes,
                    body.redirectUris || [],
                ]
            );
          
            setResponseStatus(event, 201);
            return {
                statusCode: 201,
                message: 'Application registered successfully. Save the client secret as it will not be shown again.',
                data: {
                    application: application.rows[0],
                    client_secret: client_secret
                }
            };
        }
        catch (error: any) {
            console.log(error);
            if (error.statusCode) {
                throw error;
            }
    
            throw createError({
                statusCode: 500,
                message: 'Error creating application'
            });
        }
        finally {
            client.release();
        }
    }
})
