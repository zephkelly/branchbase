import { isRegisteredSession } from "~~/server/utils/auth/handlers/isRegisteredSession"

// An example of route protection
export default defineEventHandler({
    onRequest: [
        async (event) => await isRegisteredSession(event),
    ],
    handler: async (event) => {
        return {
            message: 'You are logged in'
        }
    }
});