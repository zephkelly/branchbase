import { Provider, VerificationStatus, RegisteredUser, UnregisteredUser } from '~~/types/auth'
import { getProviderUser, getUsersByProviderEmail } from './../../utils/database/user'
import { ref } from 'vue'

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
        const provider: Provider = Provider.GitHub
        const provider_id: string = user.id
        const provider_email = ref<string | null>(user.email as string | null);
        const provider_verified = ref<boolean>(false);
        const picture: string = user.avatar_url

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

        const existingUser: RegisteredUser | null = await getProviderUser(event, provider, provider_id)

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
                    provider_verified: existingUser.provider_verified,
                    provider_email: existingUser.provider_email,
                },
                loggedInAt: Date.now(),
            })

            return sendRedirect(event, '/')
        }

        const existingUsers = await getUsersByProviderEmail(event, provider_email.value)

        if (existingUsers) {
            const temporaryLinkableUser: UnregisteredUser = {
                id: null,
                username: null,
                provider: provider,
                provider_id: provider_id,
                picture: picture,
            }

            await setUserSession(event, {
                user: temporaryLinkableUser,
                linkable_data: {
                    provider_email: provider_email.value,
                    existing_accounts_number: existingUsers.length,
                },
                secure: {
                    provider_email: provider_email.value,
                    provider_verified: provider_verified.value,
                    secure_linkable_data: {
                        users: existingUsers,
                    },
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
        // Send the user through the register flow if they are new
        // if (existingUser === null) {
        //     const temporaryUser: UnregisteredUser = {
        //         id: null,
        //         username: null,
        //         provider: provider,
        //         provider_id: provider_id,
        //         picture: picture,
        //     }
            
        //     await setUserSession(event, {
        //         user: temporaryUser,
        //         secure: {
        //             provider_email: provider_email.value,
        //             provider_verified: provider_verified.value,
        //         },
        //         loggedInAt: Date.now(),
        //     }, {
        //         maxAge: 60 * 60 // 1 hour 
        //     })
            
        //     return sendRedirect(event, '/register')
        // }

        // // Otherwise, log the user in
        // const registeredUser: RegisteredUser = {
        //     id: existingUser.id,
        //     username: existingUser.username,
        //     provider: existingUser.provider,
        //     provider_id: existingUser.provider_id,
        //     picture: existingUser.picture
        // }

        // await setUserSession(event, {
        //     user: registeredUser,
        //     secure: {
        //         provider_verified: existingUser.provider_verified,
        //         provider_email: existingUser.provider_email,
        //     },
        //     loggedInAt: Date.now(),
        // })

        return sendRedirect(event, '/register')
    },
    onError(event, error) {
        console.error('Error logging in with GitHub:', error)
        return sendRedirect(event, '/login')
    }
})