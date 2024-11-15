import { H3Event } from 'h3'

import { Provider } from '~~/types/auth/user/providers'
import { UnregisteredCredUser } from '~~/types/auth/user/session/credentials/unregistered'
import { createUnverifiedLinkableSession } from '~~/server/utils/auth/sessions/unregistered/createUnverifiedLinkableSession'
import { createUnregisteredSession } from '~~/server/utils/auth/sessions/unregistered/createUnregisteredSession'

import { getEmailProviderUser, getUsersProvidersByEmail } from '~~/server/utils/auth/database/user'

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
            throw createError({
                statusCode: 400,
                statusText: 'Bad Request',
                message: 'Invalid or missing credentials'
            })
        }
    
        if (password !== confirm_password) {
            throw createError({
                statusCode: 400,
                statusText: 'Bad Request',
                message: 'Passwords do not match'
            })
        }
    
        const existingUser = await getEmailProviderUser(event, Provider.Credentials, email)
    
        if (existingUser) {
            throw createError({
                statusCode: 409,
                statusText: 'Conflict',
                message: 'An account with this email already exists'
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
            await createUnverifiedLinkableSession(event,
                temporaryUser,
                linkableUsersAndProviders,
                password_hash
            );
        }
        else {
            await createUnregisteredSession(event, temporaryUser, password_hash);
        }
    }
    catch (error: any) {
        console.error(error)
        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            message: 'Error registering user'
        })
    }
}