import { getUserByEmail } from "@/server/utils/database/user"
import { VerificationStatus, Provider, isRegisteredUser, isUnregisteredUser, RegisteredUser, UnregisteredUser } from "@/types/auth"
import { type User } from '#auth-utils'

export default defineOAuthGoogleEventHandler({
    config: {
        authorizationParams: {
            access_type: 'offline'
        },
    },
    async onSuccess(event, { user, tokens }) {
        const existingUser: RegisteredUser | null = await getUserByEmail(event, user.email)

        if (existingUser === null) {

            const unregisteredUser: UnregisteredUser = {
                id: null,
                display_name: null,
                picture: user.picture,
                provider: Provider.Google,
                provider_id: user.sub,
                email: user.email
            }

            await setUserSession(event, {
                user: unregisteredUser,
                secure: {
                    expires_in: tokens.expires_in,
                    access_token: tokens.access_token,
                    refresh_token: tokens.refresh_token,
                    verification_status: VerificationStatus.Pending,
                },
                loggedInAt: Date.now(),
            }, {
                maxAge: 60 * 60 // 1 hour 
            })
            
            return sendRedirect(event, '/register')
        }

        const registeredUser: RegisteredUser = {
            id: existingUser.id,
            display_name: existingUser.display_name,
            provider: existingUser.provider,
            provider_id: existingUser.provider_id,
            picture: existingUser.picture,
        }

        await setUserSession(event, {
            user: registeredUser,
            secure: {
                expires_in: tokens.expires_in,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                verification_status: VerificationStatus.VerifiedBasic,
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