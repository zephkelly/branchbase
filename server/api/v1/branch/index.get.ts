import { isRegisteredSession } from "~~/server/utils/auth/sessions/isRegisteredSession"

// An example of route protection
export default defineEventHandler({
    onRequest: [
        async (event) => await isRegisteredSession(event),
    ],
    handler: async (event) => {
        const session = await getUserSession(event);
        console.log(session.secure)
        return {
            message: 'You are not logged in'
        }
    }
});