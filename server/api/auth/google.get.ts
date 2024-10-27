import { Provider, LinkableData, SecureLinkableData, RegisteredUser, SecureRegisteredUser, UnregisteredUser } from '~~/types/user'
import { getProviderUser, getUsersByProviderEmail } from './../../utils/database/user'
import { ref } from 'vue'

export default defineOAuthGoogleEventHandler({
    config: {
        authorizationParams: {
            access_type: 'offline'
        },
    },
    async onSuccess(event, { user, tokens }) {
        const provider: Provider = Provider.Google
        const provider_id: string = user.sub
        const provider_email = user.email;
        const provider_verified = ref<boolean>(false);
        const picture: string = user.picture
        
        try {
            const existingUser: SecureRegisteredUser | null = await getProviderUser(event, provider, provider_id)

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

            const existingUsers = await getUsersByProviderEmail(event, provider_email)

            console.log('Existing users:', existingUsers)
            if (existingUsers) {
                const temporaryLinkableUser: UnregisteredUser = {
                    id: null,
                    username: null,
                    provider: provider,
                    provider_id: provider_id,
                    provider_email: provider_email,
                    picture: picture,
                }

                const linkableData: LinkableData = {
                    provider_email: provider_email,
                    existing_accounts_number: existingUsers.length
                }

                const secureLinkableData: SecureLinkableData = {
                    linkable_providers: existingUsers[0]
                }

                await setUserSession(event, {
                    user: temporaryLinkableUser,
                    linkable_data: linkableData,
                    secure: {
                        provider_email: provider_email,
                        provider_verified: provider_verified.value,
                        linkable_data: secureLinkableData
                    },
                    loggedInAt: Date.now()
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
                provider_email: provider_email,
                picture: picture,
            }

            await setUserSession(event, {
                user: temporaryUser,
                secure: {
                    provider_email: provider_email,
                    provider_verified: provider_verified.value,
                },
                loggedInAt: Date.now(),
            }, {
                maxAge: 60 * 60 // 1 hour 
            })

            return sendRedirect(event, '/register')
        }
        catch (error) {
            console.error('Error logging in with Google:', error)
            return sendRedirect(event, '/login')
        }
    },
    onError(event, error) {
        console.error('Error logging in with Google:', error)
        return sendRedirect(event, '/login')
    }
})