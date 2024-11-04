import { H3Event } from 'h3';

import { UserSession } from '#auth-utils';

import { Provider } from '~~/types/auth/user/providers';

import { RegisteredUser } from '~~/types/auth/user/session/registered';
import { UnregisteredUser } from '~~/types/auth/user/session/unregistered';

import { LinkableUserProviderData } from '~~/types/auth/user/session/unregistered';

import { SecureUnregisteredCredSessionData } from '~~/types/auth/user/session/credentials/unregistered';

// import { type SecureRegisteredUser, UserSessionData, UnregisteredUser, Provider, LinkableUserProviderData } from '../../../types/user';
import { ErrorType, PostgresError } from '~~/server/types/error';
import type { UserCreationResponse } from '~~/server/types/user'
import type { UserProviderCreationResponse } from '~~/server/types/userProvider';

const VALID_PROVIDERS = Object.values(Provider);

interface SecureRegisteredUser extends RegisteredUser {
    provider_verified: boolean;
    provider_email: string;
    password_hash?: string;
}
export async function getProviderUser(event: H3Event, provider: Provider, provider_id: string): Promise<SecureRegisteredUser | null> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database

    if (!provider || !provider_id) {
        setResponseStatus(event, 400)
        return null
    }

    if (!VALID_PROVIDERS.includes(provider)) {
        setResponseStatus(event, 400)
        return null
    }

    if ((typeof provider_id !== 'string' && typeof provider_id !== 'number') || provider_id === '') {
        setResponseStatus(event, 400)
        console.error('Invalid provider_id:', provider_id)
        return null
    }

    try {
        const query =
            `SELECT 
                u.id,
                u.username,
                u.picture,
                up.provider_email,
                up.provider_verified
            FROM private.users u
            INNER JOIN private.user_providers up ON u.id = up.user_id
            WHERE up.provider = $1 
            AND up.provider_id = $2;`
        const result = await pool.query(query, [provider, provider_id])
        
        if (result.rows.length === 0) {
            setResponseStatus(event, 404)
            return null
        }

        const retrievedUser: SecureRegisteredUser = {
            id: result.rows[0].id,
            username: result.rows[0].username,
            provider: provider,
            provider_id: provider_id,
            provider_email: result.rows[0].provider_email,
            picture: result.rows[0].picture,
            provider_verified: result.rows[0].provider_verified
        }

        return retrievedUser;
    }
    catch (error) {
        console.error('Error in getProvider', error)
        setResponseStatus(event, 500)
        return null
    }
}

export async function getEmailProviderUser(event: H3Event, provider: Provider, provider_email: string): Promise<SecureRegisteredUser | null> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database

    if (!provider || !provider_email) {
        setResponseStatus(event, 400)
        return null
    }

    if (!VALID_PROVIDERS.includes(provider)) {
        setResponseStatus(event, 400)
        return null
    }

    try {
        const query =
            `SELECT 
                u.id,
                u.username,
                u.picture,
                up.provider_email,
                up.provider_verified,
                up.password
            FROM private.users u
            INNER JOIN private.user_providers up ON u.id = up.user_id
            WHERE up.provider = $1 
            AND up.provider_email = $2;`
        const result = await pool.query(query, [provider, provider_email])
        
        if (result.rows.length === 0) {
            setResponseStatus(event, 404)
            return null
        }

        const retrievedUser: SecureRegisteredUser = {
            id: result.rows[0].id,
            username: result.rows[0].username,
            provider: provider,
            provider_id: null,
            provider_email: result.rows[0].provider_email,
            picture: result.rows[0].picture,
            provider_verified: result.rows[0].provider_verified,
            password_hash: result.rows[0].password
        }

        return retrievedUser;
    }
    catch (error) {
        console.error('Error in getProvider', error)
        setResponseStatus(event, 500)
        return null
    }
}

export async function getUsersProvidersByEmail(event: H3Event, email: string): Promise<LinkableUserProviderData[] | null> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database
   
    try {
        const query = `
            WITH user_provider_counts AS (
                SELECT 
                    u.username,
                    u.picture,
                    up.user_id,
                    COUNT(*) as provider_count,
                    array_agg(jsonb_build_object(
                        'provider', up.provider,
                        'provider_id', up.provider_id
                    )) as providers
                FROM private.user_providers up
                JOIN private.users u ON u.id = up.user_id
                WHERE up.user_id IN (
                    SELECT DISTINCT user_id
                    FROM private.user_providers
                    WHERE provider_email = $1
                )
                GROUP BY up.user_id, u.username, u.picture
            )
            SELECT 
                username,
                picture,
                provider_count,
                providers
            FROM user_provider_counts
            ORDER BY username
        `

        const result = await pool.query(query, [email])
        
        if (result.rows.length === 0) return null

        const validUsers: LinkableUserProviderData[] = []
        
        for (const row of result.rows) {
            if (row.provider_count === 1 || row.provider_count === '1') {
                validUsers.push({
                    username: row.username,
                    picture: row.picture,
                    user_id: row.user_id,
                    providers: row.providers.map((p: any) => ({
                        provider: p.provider as Provider,
                        provider_id: p.provider_id
                    }))
                })
            }
            else if (row.provider_count === 0) {
                // Add users with no providers to orphaned users file
            }
        }


        return validUsers.length > 0 ? validUsers : null
    }
    catch (error) {
        console.error('Error in getUsersByProviderEmail:', error)
        throw error
    }
}

export async function getCredentialUserExists(event: H3Event, email: string): Promise<boolean> {
    return false;
}

export async function getProviderUserExists(event: H3Event, provider: Provider, provider_id: string): Promise<boolean> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database

    // Input validation
    if (!provider || !provider_id) {
        setResponseStatus(event, 400)
        return false
    }

    if (!VALID_PROVIDERS.includes(provider)) {
        setResponseStatus(event, 400)
        return false
    }

    if (typeof provider_id !== 'number') {
        setResponseStatus(event, 400)
        return false
    }

    try {
        const query = `
            SELECT EXISTS (
                SELECT 1
                FROM private.user_providers up
                INNER JOIN private.users u ON u.id = up.user_id
                WHERE up.provider = $1
                AND up.provider_id = $2
            );`

        const values = [provider, provider_id]
        const result = await pool.query(query, values)
        return result.rows[0].exists
    }
    catch (error) {
        console.error('Error in getProviderUserExists:', error)
        setResponseStatus(event, 500)
        return false
    }
}

export async function updateProviderEmail(event: H3Event, provider: Provider, provider_id: string, new_email: string, new_provider_verified_status: boolean): Promise<boolean> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database

    if (!provider || !provider_id || !new_email) {
        setResponseStatus(event, 400)
        return false
    }

    if (!VALID_PROVIDERS.includes(provider)) {
        setResponseStatus(event, 400)
        return false
    }

    if ((typeof provider_id !== 'string' && typeof provider_id !== 'number') || typeof new_email !== 'string') {
        setResponseStatus(event, 400)
        return false
    }

    try {
        const query = `
            UPDATE private.user_providers
            SET provider_email = $1,
                provider_verified = $2
            WHERE provider = $3
            AND provider_id = $4
        `

        const values = [new_email, new_provider_verified_status, provider, provider_id]
        await pool.query(query, values)
        return true
    }
    catch (error) {
        console.error('Error in updateProviderEmail:', error)
        setResponseStatus(event, 500)
        return false
    }
}   

type UnregisteredUserInput = Omit<UnregisteredUser, 'id'> & { provider_verified: boolean }
/**
 * Creates a new user in the database.
 * @warning This function does NOT validate input data.
 */
export async function createUser(
    event: H3Event, 
    username: string,
    provider_email: string,
    provider: Provider,
    provider_id: string | null,
    provider_verified: boolean,
    picture: string,
    password_hash?: string
): Promise<UserCreationResponse> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database

    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        // Insert user
        const userQuery = `
            INSERT INTO private.users (
                username,
                picture
            )
            VALUES ($1, $2)
            RETURNING id, picture
        `

        const userValues = [
            username,
            picture
        ]

        const userResult = await client.query(userQuery, userValues)
        const userId = userResult.rows[0].id

        // Insert provider information
        const providerQuery = `
            INSERT INTO private.user_providers (
                user_id,
                provider,
                provider_id,
                provider_email,
                provider_verified,
                is_primary,
                password
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `
        const providerValues = [
            userId,
            provider,
            provider_id,
            provider_email,
            provider_verified,
            true,
            password_hash
        ]

        await client.query(providerQuery, providerValues)

        // Commit transaction
        await client.query('COMMIT')

        const newUser: SecureRegisteredUser = {
            id: parseInt(userId),
            username: username as string,
            picture: userResult.rows[0].picture,
            provider,
            provider_id,
            provider_verified: provider_verified,
            provider_email
        }

        return {
            type: 'SUCCESS',
            data: newUser
        };
    }
    catch (error: any) {
        await client.query('ROLLBACK')
        console.log('error:', error.code)

        if (error && error.code) {
            const pgError = error as PostgresError;

            // PostgreSQL unique violation code
            if (pgError.code === '23505') {
                if (pgError.constraint === 'users_username_key') {
                    setResponseStatus(event, 409)
                    return {
                        type: ErrorType.VALIDATION_ERROR,
                        field: 'username',
                        message: 'This username is already taken',
                        statusCode: 409
                    }
                }

                if (pgError.constraint === 'user_providers_provider_provider_id_key') {
                    setResponseStatus(event, 409)
                    return {
                        type: ErrorType.VALIDATION_ERROR,
                        field: 'provider_id',
                        message: 'This account is already registered',
                        statusCode: 409
                    }
                }
                if (pgError.constraint === 'users_primary_email_key') {
                    setResponseStatus(event, 409)
                    return {
                        type: ErrorType.VALIDATION_ERROR,
                        field: 'email',
                        message: 'This email is already registered',
                        statusCode: 409
                    }
                }
            }
        }

        setResponseStatus(event, 500)
        return {
            type: ErrorType.DATABASE_ERROR,
            message: 'Failed to create user',
            statusCode: 500
        }
    }
    finally {
        client.release()
    }
}

/**
 * Creates a new provider linking to an existing user in the database.
 * Used when a user links a new provider to their existing account.
 * @warning This function does NOT sanitise or validate input data.
 */
export async function createUserProvider(event: H3Event, user_id: number, session: UserSession): Promise<UserProviderCreationResponse> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database
    const client = await pool.connect()
    
    try {
        const user = session.user as UnregisteredUser
        const isCredentialsProvider = user.provider === Provider.Credentials
        const hasHashedPassword = session.confirmed_password === true && (session.secure as SecureUnregisteredCredSessionData).password_hash

        if (isCredentialsProvider && hasHashedPassword) {
            const credentialsProviderQuery = `
                INSERT INTO private.user_providers (
                    user_id,
                    provider,
                    provider_id,
                    provider_email,
                    provider_verified,
                    password
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            `

            const credentialsProviderValues = [
                user_id,
                user.provider,
                user.provider_id,
                user.provider_email,
                user.provider_verified,
                (session.secure as SecureUnregisteredCredSessionData).password_hash
            ]

            await client.query('BEGIN')

            await pool.query(credentialsProviderQuery, credentialsProviderValues)
        }
        else {
            const providerQuery = `
                INSERT INTO private.user_providers (
                    user_id,
                    provider,
                    provider_id,
                    provider_email,
                    provider_verified
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id
            `
            
            const values = [
                user_id,
                user.provider,
                user.provider_id,
                user.provider_email,
                user.provider_verified
            ]

            await client.query('BEGIN')

            await pool.query(providerQuery, values)
        }

        const userQuery = `
            SELECT u.id, u.username, u.picture
            FROM private.users u
            WHERE u.id = $1
        `
        const userResult = await client.query(userQuery, [user_id])

        await client.query('COMMIT')

        // Construct the response with the linked user data
        const linkedUser: SecureRegisteredUser = {
            id: userResult.rows[0].id,
            username: userResult.rows[0].username,
            picture: userResult.rows[0].picture,
            provider: user.provider,
            provider_id: user.provider_id,
            provider_email: user.provider_email,
            provider_verified: user.provider_verified
        }

        return {
            type: 'SUCCESS',
            data: linkedUser
        }
    }
    catch (error: any) {
        await client.query('ROLLBACK')

        console.error('Error in createUserProvider:', error)

        if (error && typeof error.code) {
            const pgError = error as PostgresError

            // Handle specific PostgreSQL errors
            if (pgError.code === '23505') { // unique violation
                if (pgError.constraint === 'user_providers_provider_provider_id_key') {
                    setResponseStatus(event, 409)
                    return {
                        type: ErrorType.VALIDATION_ERROR,
                        field: 'provider_id',
                        message: 'This provider account is already linked to another user',
                        statusCode: 409
                    }
                }
            }
            
            if (pgError.code === '23503') { // foreign key violation
                setResponseStatus(event, 404)
                return {
                    type: ErrorType.VALIDATION_ERROR,
                    field: 'user_id',
                    message: 'User not found',
                    statusCode: 404
                }
            }
        }

        setResponseStatus(event, 500)
        return {
            type: ErrorType.DATABASE_ERROR,
            message: 'Failed to link provider to user',
            statusCode: 500
        }
    }
    finally {
        client.release()
    }
}