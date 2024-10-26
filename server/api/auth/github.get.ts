import { Provider, SecureRegisteredUser, RegisteredUser, UnregisteredUser, LinkableData, SecureLinkableData } from '~~/types/user'
import { getProviderUser, getUsersByProviderEmail } from './../../utils/database/user'
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
        
        const existingUser: SecureRegisteredUser | null = await getProviderUser(event, provider, provider_id)

        // We have an existing user provide connected to a user account
        if (existingUser) {
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
                    provider_verified: existingUser.provider_verified !== undefined ? existingUser.provider_verified : null,
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
        // redirect to the register page with the linkable data
        if (existingUsers) {
            const temporaryLinkableUser: UnregisteredUser = {
                id: null,
                username: null,
                provider: provider,
                provider_id: provider_id,
                picture: picture,
            }

            const linkableData: LinkableData = {
                provider_email: provider_email.value,
                existing_accounts_number: existingUsers.length,
            }

            const secureLinkableData: SecureLinkableData = {
                linkable_providers: existingUsers,
            }
    
            createTemporaryLinkableUserSession(event, 
                temporaryLinkableUser, 
                linkableData, 
                secureLinkableData, 
                provider_email.value, 
                provider_verified.value
            );

            return sendRedirect(event, '/register')
        }

        // Create a temp user session if the user has never registered
        // And has no linkable accounts
        const temporaryUser: UnregisteredUser = {
            id: null,
            username: null,
            provider: provider,
            provider_id: provider_id,
            picture: picture,
        }

        createTemporaryUserSession(event, temporaryUser, provider_email.value, provider_verified.value);

        return sendRedirect(event, '/register')
    },
    onError(event, error) {
        console.error('Error logging in with GitHub:', error)
        return sendRedirect(event, '/login')
    }
})

async function createTemporaryUserSession(event: H3Event, user: UnregisteredUser, provider_email: string, provider_verified: boolean) {
    await setUserSession(event, {
        user: user,
        secure: {
            provider_email: provider_email,
            provider_verified: provider_verified,
        },
        loggedInAt: Date.now(),
    }, {
        maxAge: 60 * 60 // 1 hour
    })
}


async function createTemporaryLinkableUserSession(event: H3Event, user: UnregisteredUser, linkableData: LinkableData, secureLinkableData: SecureLinkableData, provider_email: string, provider_verified: boolean) {
    await setUserSession(event, {
        user: user,
        linkable_data: linkableData,
        secure: {
            provider_email: provider_email,
            provider_verified: provider_verified,
            linkable_data: secureLinkableData,
        },
        loggedInAt: Date.now(),
    }, {
        maxAge: 60 * 60 // 1 hour
    })
}