import { getUser } from "@/server/utils/database/user"
import { User } from "#auth-utils"

export default defineOAuthGoogleEventHandler({
    config: {
        authorizationParams: {
            access_type: 'offline',
            prompt: 'consent',
        },
    },
    async onSuccess(event, { user }) {
        const existingUser: User | null = await getUser(user.email)
        console.log('existingUser:', existingUser)

        if (existingUser === null) {
            await setUserSession(event, {
                user: {
                    email: user.email,
                    provider: 'google',
                    picture: user.picture,
                    registered: false,
                },
                loggedInAt: Date.now(),
            })

            return sendRedirect(event, '/register')
        }

        await setUserSession(event, {
            user: {
                email: user.email,
                provider: 'google',
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