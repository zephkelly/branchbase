import { userExists } from "@/server/utils/database/user"

export default defineOAuthGoogleEventHandler({
    config: {
        authorizationParams: {
            access_type: 'offline',
            prompt: 'consent',
        },
    },
    async onSuccess(event, { user }) {
        const existingUser = await userExists(user.email)

        if (existingUser === false) {
            await setUserSession(event, {
                user: {
                    email: user.email,
                    provider: 'google',
                    registered: false,
                },
                loggedInAt: Date.now(),
            })

            return sendRedirect(event, '/register')
        }

        const session = await setUserSession(event, {
            user: {
                email: user.email,
                provider: 'google',
            },
            loggedInAt: Date.now(),
        })

        return sendRedirect(event, '/')
    },
    onError(event, error) {
        console.error('Error logging in with Google:', error)
        return sendRedirect(event, '/login')
    }
})