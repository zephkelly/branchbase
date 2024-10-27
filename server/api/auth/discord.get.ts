import { Provider, SecureLinkableData, SecureRegisteredUser, RegisteredUser, UnregisteredUser, LinkableData } from '~~/types/user'

export default defineOAuthDiscordEventHandler({
    async onSuccess(event, { user, tokens }) {
        const provider: Provider = Provider.Discord
        const provider_id: string = user.id
        const provider_email = user.email
        const provider_verified = user.verified
        const picture = user.avatar

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
                        provider_verified: existingUser.provider_verified,
                        provider_email: existingUser.provider_email,
                    },
                    loggedInAt: Date.now(),
                })

                return sendRedirect(event, '/')
            }

            const existingUsers = await getUsersByProviderEmail(event, provider_email)


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

                console.log('secureLinkableData:', secureLinkableData)

                await setUserSession(event, {
                    user: temporaryLinkableUser,
                    linkable_data: linkableData,
                    secure: {
                        provider_email: provider_email,
                        provider_verified: provider_verified,
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
                    provider_verified: provider_verified,
                },
                loggedInAt: Date.now()
            }, {
                maxAge: 60 * 60 // 1 hour
            })

            return sendRedirect(event, '/register')
        }
        catch (error) {
            console.error('Error:', error)
            return sendRedirect(event, '/error')
        }
    },
    onError(event, error) {

    }
})