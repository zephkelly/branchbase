import { getUserByEmail } from "@/server/utils/database/user"
import { type UserData, VerificationStatusEnum  } from "@/types/auth"

export default defineOAuthGoogleEventHandler({
    config: {
        authorizationParams: {
            access_type: 'offline'
        },
    },
    async onSuccess(event, { user, tokens }) {
        const existingUser: UserData | null = await getUserByEmail(user.email)
        
        if (existingUser === null) {
            await setUserSession(event, {
                user: {
                    id: null,
                    display_name: null,
                    picture: user.picture,
                    provider: 'google',

                    email: user.email,
                },
                secure: {
                    expires_in: tokens.expires_in,
                    access_token: tokens.access_token,
                    refresh_token: tokens.refresh_token,
                    verification_status: VerificationStatusEnum.Pending,
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
                provider: 'google',
                registered: true,
            },
            secure: {
                expires_in: tokens.expires_in,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                verification_status: VerificationStatusEnum.VerifiedBasic,
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