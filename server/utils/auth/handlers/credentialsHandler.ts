import { H3Event } from 'h3'
import { ProviderData } from '~~/server/types/userProvider'
import { Provider, RegisteredUser, SecureRegisteredUser, UnregisteredUser, LinkableData } from '~~/types/user'

import { getEmailProviderUser } from '~~/server/utils/database/user'
import Credentials from '~/pages/register/credentials.vue';

interface CredentialsLoginResponse {
    registered: boolean;
    statusCode?: number;
    statusMessage?: string;
}

export async function handleCredentialsLogin(
    event: H3Event, 
    providerData: Omit<ProviderData & { password: string }, 'provider' | 'provider_id' | 'provider_verified'>
) {
    const {
        provider_email,
        password,
        picture
    } = providerData

    try {
        const existingUser: SecureRegisteredUser | null = await getEmailProviderUser(event, Provider.Credentials, provider_email)

        if (existingUser) {
            console.log(existingUser.password_hash)
            console.log(password)

            console.log(await verifyPassword(existingUser.password_hash as string, password))
            
            if (await verifyPassword(existingUser.password_hash as string, password) === false) {
                const response: CredentialsLoginResponse = {
                    registered: true,
                    statusCode: 401,
                    statusMessage: 'Invalid credentials'
                }

                return response
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

           
            const response: CredentialsLoginResponse = {
                registered: true
            }

            return response
        }

        const linkableUsersAndProviders = await getUsersProvidersByEmail(event, provider_email);

        if (linkableUsersAndProviders) {
            const temporaryLinkableUser: UnregisteredUser = {
                id: null,
                username: null,
                provider: Provider.Credentials,
                provider_id: null,
                provider_email,
                provider_verified: false,
                picture,
            }

            const linkableData: LinkableData = {
                provider_email,
                existing_users_count: linkableUsersAndProviders.length,
            }

            await setUserSession(event, {
                user: temporaryLinkableUser,
                linkable_data: linkableData,
                secure: {
                    provider_email,
                    provider_verified: false,
                    linkable_data: linkableUsersAndProviders
                },
                loggedInAt: Date.now(),
            })

            console.log("returning linkable user")
            const response: CredentialsLoginResponse = {
                registered: false
            }

            return response
        }

        const temporaryUser: UnregisteredUser = {
            id: null,
            username: null,
            provider: Provider.Credentials,
            provider_id: null,
            provider_email,
            provider_verified: false,
            picture,
        }

        await setUserSession(event, {
            user: temporaryUser,
            secure: {
                provider_email,
                provider_verified: false,
            },
            loggedInAt: Date.now(),
        }, {
            maxAge: 60 * 60 // 1 hour
        })

        console.log("returning new user")
        const response: CredentialsLoginResponse = {
            registered: false
        }

        return response
    }
    catch (error) {
        console.error(error)
        const response: CredentialsLoginResponse = {
            registered: false,
            statusCode: 500,
            statusMessage: 'Internal server error'
        }

        return response
    }
}