import { Provider } from '~~/types/auth/user/provider'
import { handleOAuthLogin } from '~~/server/utils/user/social/handlers/handleOAuth'

export default defineOAuthGoogleEventHandler({
    config: {
        authorizationParams: {
            access_type: 'offline'
        },
    },
    async onSuccess(event, { user, tokens }) {
        return handleOAuthLogin(event, {
            provider: Provider.Google,
            provider_id: user.sub,
            provider_email: user.email,
            provider_verified: user.email_verified,
            picture: user.picture
        })
    },
    onError(event, error) {
        console.error('Error logging in with Google:', error)
        return sendRedirect(event, '/login')
    }
})