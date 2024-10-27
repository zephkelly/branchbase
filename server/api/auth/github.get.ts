import { Provider, SecureRegisteredUser, RegisteredUser, UnregisteredUser, LinkableData, SecureLinkableData } from '~~/types/user'
import { getProviderUser, getUsersByProviderEmail, updateProviderEmail } from './../../utils/database/user'
import { ref } from 'vue'
import { H3Event } from 'h3'

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
    async onSuccess(event: H3Event, { user, tokens }) {
        const provider: Provider = Provider.GitHub
        const provider_id: string = user.id
        const provider_email = ref<string | null>(user.email as string | null);
        const provider_verified = ref<boolean>(false);
        const picture: string = user.avatar_url

        // Secondary call to grab primary email if it wasn't returned in the initial response
        if (provider_email.value === null || provider_email.value === '') {
            const res = await $fetch<GitHubEmailsResponse>('https://api.github.com/user/emails', {
                headers: {
                    Authorization: `token ${tokens.access_token}`
                }
            })

            for (const email of res) {
                if (email.primary) {
                    provider_email.value = email.email
                    provider_verified.value = email.verified
                    break
                }
            }

            if (provider_email.value === null || provider_email.value === '') {
                console.error('No primary email found in GitHub emails response')
                return sendRedirect(event, '/login')
            }
        }

        try { 
            const existingUser: SecureRegisteredUser | null = await getProviderUser(event, provider, provider_id)

            // We have an existing user provider connected to a user account
            if (existingUser) {
                if (existingUser.provider_email !== provider_email.value) {
                    await updateProviderEmail(event, existingUser.provider, existingUser.provider_id as string, provider_email.value, provider_verified.value)
                }

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
                        provider_verified: provider_email.value !== null ? provider_email.value: null,
                        provider_email: existingUser.provider_email !== undefined ? existingUser.provider_email : null,
                    },
                    loggedInAt: Date.now(),
                })

                return sendRedirect(event, '/')
            }

            // If the user is not registered with this provider,
            // check if they have other accounts with the same email
            const existingUsers = await getUsersByProviderEmail(event, provider_email.value)

            // Create a temporary 'Linkable' user session,
            // redirect to the register page with linkable data
            if (existingUsers) {
                const temporaryLinkableUser: UnregisteredUser = {
                    id: null,
                    username: null,
                    provider: provider,
                    provider_id: provider_id,
                    provider_email: provider_email.value,
                    picture: picture,
                }

                const linkableData: LinkableData = {
                    provider_email: provider_email.value,
                    existing_accounts_number: existingUsers.length,
                }

                const secureLinkableData: SecureLinkableData = {
                    linkable_providers: existingUsers[0],
                }

                await setUserSession(event, {
                    user: temporaryLinkableUser,
                    linkable_data: linkableData,
                    secure: {
                        provider_email: provider_email.value,
                        provider_verified: provider_verified.value,
                        linkable_data: secureLinkableData,
                    },
                    loggedInAt: Date.now(),
                }, {
                    maxAge: 60 * 60 // 1 hour
                })

                return sendRedirect(event, '/register')
            }

            const temporaryUser: UnregisteredUser = {
                id: null,
                username: null,
                provider: provider,
                provider_id: provider_id,
                provider_email: provider_email.value,
                picture: picture,
            }

            await setUserSession(event, {
                user: temporaryUser,
                secure: {
                    provider_email: provider_email.value,
                    provider_verified: provider_verified.value,
                },
                loggedInAt: Date.now(),
            }, {
                maxAge: 60 * 60 // 1 hour
            })

            return sendRedirect(event, '/register')
        }
        catch (error) {
            console.error('Error logging in with GitHub:', error)
            return sendRedirect(event, '/login')
        }
    },
    onError(event, error) {
        console.error('Error logging in with GitHub:', error)
        return sendRedirect(event, '/login')
    }
})