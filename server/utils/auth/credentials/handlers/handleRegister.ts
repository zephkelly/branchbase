import { H3Event } from 'h3'

import { Provider } from '~~/types/auth/user/providers'
import { UnregisteredCredUser } from '~~/types/auth/user/session/credentials/unregistered'
import { createUnverifiedLinkableSession } from '~~/server/utils/auth/sessions/unregistered/unverifiedLinkableSession'
import { createUnregisteredSession } from '../../sessions/unregistered/standardSession'

export async function handleRegisterCredentials(
    event: H3Event,
    body: {
        email: string,
        password: string,
        confirm_password: string
    }
) {
    try {
        const { email, password, confirm_password } = body
    
        if (!password || !confirm_password || !email) {
            return createError({
                statusCode: 400,
                statusMessage: 'Invalid or missing credentials'
            })
        }
    
        if (password !== confirm_password) {
            return createError({
                statusCode: 400,
                statusMessage: 'Passwords do not match'
            })
        }
    
        const existingUser = await getEmailProviderUser(event, Provider.Credentials, email)
    
        if (existingUser) {
            return createError({
                statusCode: 409,
                statusMessage: 'Invalid credentials'
            })
        }

        const password_hash = await hashPassword(password)
    
        const linkableUsersAndProviders = await getUsersProvidersByEmail(event, email);
        
        const temporaryUser: UnregisteredCredUser = {
            id: null,
            username: null,
            provider: Provider.Credentials,
            provider_email: email,
            provider_verified: false,
            picture: getRandomAvatar(),
        }

        if (linkableUsersAndProviders) {
            return createUnverifiedLinkableSession(event,
                temporaryUser,
                linkableUsersAndProviders,
                password_hash
            );
        }

        return createUnregisteredSession(event, temporaryUser, password_hash);
    }
    catch (error) {
        console.error(error)
        return {
            statusCode: 500,
            statusMessage: 'Internal server error'
        }
    }
}