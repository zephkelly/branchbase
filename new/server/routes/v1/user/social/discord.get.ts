import { Provider } from '~/types/auth/user/provider'
import { handleOAuthLogin } from '~~/server/utils/user/social/handlers/handleOAuth'

export default defineOAuthDiscordEventHandler({
    async onSuccess(event, { user, tokens }) {
        return handleOAuthLogin(event, {
            provider: Provider.Discord,
            provider_id: user.id,
            provider_email: user.email,
            provider_verified: user.verified,
        })
    },
    onError(event, error) {
        console.error('Error logging in with Discord:', error)
        return sendRedirect(event, '/login')
    }
})