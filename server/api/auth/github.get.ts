import { Provider } from '~~/types/auth/user/providers'
import { handleOAuthLogin } from '~~/server/utils/auth/handlers/oauthHandler'

export type GitHubEmailVisibility = 'public' | 'private' | null;

export interface GitHubEmail {
    email: string;
    primary: boolean;
    verified: boolean;
    visibility: GitHubEmailVisibility;
}

export type GitHubEmailsResponse = GitHubEmail[];

export default defineOAuthGitHubEventHandler({
    config: {
        scope: ['user:email']
    },
    async onSuccess(event, { user, tokens }) {
        let provider_email = user.email;
        let provider_verified = false;
    
        // GitHub-specific email fetching logic
        if (!provider_email) {
            const res = await $fetch<GitHubEmailsResponse>('https://api.github.com/user/emails', {
                headers: {
                    Authorization: `token ${tokens.access_token}`
                }
            })
    
            const primaryEmail = res.find(email => email.primary);
            if (primaryEmail) {
                provider_email = primaryEmail.email;
                provider_verified = primaryEmail.verified;
            } else {
                console.error('No primary email found in GitHub emails response');
                return sendRedirect(event, '/login');
            }
        }
  
        return handleOAuthLogin(event, {
            provider: Provider.GitHub,
            provider_id: user.id,
            provider_email,
            provider_verified,
            picture: user.avatar_url
        });
    },
    onError(event, error) {
        console.error('Error logging in with GitHub:', error)
        return sendRedirect(event, '/login')
    }
})