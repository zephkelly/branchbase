import { getUserByEmail } from "@/server/utils/database/user"
import { BackendUser } from "~/types/auth"

export default defineOAuthGoogleEventHandler({
    config: {
        authorizationParams: {
            access_type: 'offline',
            prompt: 'consent',
        },
    },
    async onSuccess(event, { user }) {
        const existingUser: BackendUser | null = await getUserByEmail(user.email)

        if (existingUser === null) {
            await setUserSession(event, {
                user: {
                    email: user.email,
                    provider: 'google',
                    picture: user.picture,
                    registered: false,
                },
                loggedInAt: Date.now(),
            }, {
                maxAge: 60 * 60 // 1 hour 
            })

            return sendRedirect(event, '/register')
        }

        await setUserSession(event, {
            user: {
                id: existingUser.id,
                picture: user.picture,
                display_name: existingUser?.display_name,
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