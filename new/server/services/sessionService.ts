import { H3Event } from "h3"
import { UUIDv7 } from "~/types/uuidv7"
import { getDatabase } from "~/server/utils/database"
import { IRegisteredUser, IRegisteredSession, ISecureSessionData } from "#auth-utils"

export const SESSION_CONSTANTS = {
    MAX_AGE: 60 * 60 * 24 * 7,
    TABLE_NAME: 'private.users',
};

export class SessionService {
    private db = getDatabase();
    
    private queries = {
        updateSessionVersion: `
        UPDATE ${SESSION_CONSTANTS.TABLE_NAME}
        SET current_session_version = $1
        WHERE id = $2
        `
    };

    async createRegisteredSession(event: H3Event, user: IRegisteredUser & ISecureSessionData): Promise<void> {
        const session_uuid: string = new UUIDv7().generate();
        
        try {
            await this.db.transaction(async (client) => {
                await client.query(this.queries.updateSessionVersion, [session_uuid, user.id]);

                const session: IRegisteredSession = {
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
                };

                // @ts-expect-error
                await replaceUserSession(event, session, {
                    maxAge: SESSION_CONSTANTS.MAX_AGE
                });
            });
        }
        catch (error) {
            console.error('Session creation failed:', error);
            throw createError({
                statusCode: 500,
                message: 'Failed to create registered session'
            });
        }
    }

    async validateSession(sessionId: string): Promise<boolean> {
        try {
            const result = await this.db.query(
                `SELECT EXISTS(
                    SELECT 1 FROM ${SESSION_CONSTANTS.TABLE_NAME}
                    WHERE current_session_version = $1
                )`,
                [sessionId]
            );
            return result.rows[0].exists;
        }
        catch (error) {
            console.error('Session validation failed:', error);
            return false;
        }
    }
}