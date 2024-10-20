import { getUserByProviderId } from "@/server/utils/database/user"
import { VerificationStatus, Provider, isRegisteredUser, isUnregisteredUser } from "@/types/auth"
import { type User } from '#auth-utils'

export default defineOAuthGitHubEventHandler({
    config: {
        authorizationParams: {
            access_type: 'offline'
        },
    },
    async onSuccess(event, { user, tokens }) {
        const existingUser: User | null = await getUserByProviderId(event, Provider.GitHub, user.id)
        
        console.log('existing user', existingUser)
        if (existingUser === null) {
            await setUserSession(event, {
                user: {
                    id: null,
                    display_name: user.login,
                    picture: user.avatar_url,
                    provider: Provider.GitHub,
                    provider_id: user.id,
                    email: null
                },
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


        if (isRegisteredUser(existingUser) === false) {
            return sendRedirect(event, '/register')
        }

        await setUserSession(event, {
            user: {
                id: existingUser.id,
                picture: existingUser.picture,
                display_name: existingUser?.display_name,
                provider: Provider.GitHub,
                provider_id: existingUser.provider_id,
            },
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
        console.error('Error logging in with GitHub:', error)
        // return sendRedirect(event, '/login')
    }
})