import { Provider, VerificationStatus, RegisteredUser, UnregisteredUser } from '@/types/auth'
import { getProviderUser } from '@/server/utils/database/user'

export default defineOAuthGoogleEventHandler({
    config: {
        authorizationParams: {
            access_type: 'offline'
        },
    },
    async onSuccess(event, { user, tokens }) {
        const provider: Provider = Provider.Google
        const provider_id: string = user.sub
        const provider_email: string = user.email
        const provider_verified: boolean = user.email_verified
        const picture: string = user.picture

        const existingUser: RegisteredUser | null = await getProviderUser(event, provider, provider_id)

        // Send the user through the register flow if they are new
        if (existingUser === null) {
            const temporaryUser: UnregisteredUser = {
                id: null,
                username: null,
                provider: provider,
                provider_id: provider_id,
                picture: picture,
            }
            
            await setUserSession(event, {
                user: temporaryUser,
                secure: {
                    primary_email: provider_email,
                    provider_verified: provider_verified,
                    // expires_in: tokens.expires_in,
                    // access_token: tokens.access_token,
                    // refresh_token: tokens.refresh_token,
                    verification_status: VerificationStatus.Pending,
                },
                loggedInAt: Date.now(),
            }, {
                maxAge: 60 * 60 // 1 hour 
            })
            
            return sendRedirect(event, '/register')
        }

        // Otherwise, log the user in
        const registeredUser: RegisteredUser = {
            id: existingUser.id,
            username: existingUser.username,
            provider: existingUser.provider,
            provider_id: existingUser.provider_id,
            picture: existingUser.picture
        }

        await setUserSession(event, {
            user: registeredUser,
            secure: {
                verification_status: existingUser.verification_status,
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