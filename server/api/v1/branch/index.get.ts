import { isValidSession } from "~~/server/utils/auth/handlers/sessions/isValidSession";
import { invalidateUserSession } from "~~/server/utils/auth/handlers/sessions/invalidateUserSession"


export default defineEventHandler({
    onRequest: [
        async (event) => await isValidSession(event),
    ],
    handler: async (event) => {
        try {
            const session: any = await getUserSession(event);

            await invalidateUserSession(session.user.id)

            return {
                message: 'You have now invalidated your session'
            }
        }
        catch (error: any) {
            if (error.statusCode) {
                throw error;
            }

            throw createError({
                statusCode: 500,
                message: 'Error logging out'
            });
        }
    }
});