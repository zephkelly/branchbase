import { H3Event } from 'h3';

import { isValidEmail, sanitizeEmail, isValidLength, truncateInput, stripHtmlTags, escapeHtml } from '@/utils/inputSanitisation'

import { type RegisteredUser, type UnregisteredUser, Provider, VerificationStatus } from '~/types/auth';
import { type ValidationError, ErrorType, PostgresError } from '@/server/types/error'
import type { UserCreationResponse } from '@/server/types/user'

const VALID_PROVIDERS = Object.values(Provider);

export async function getProviderUser(event: H3Event, provider: Provider, provider_id: string): Promise<RegisteredUser | null> {
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

    if (typeof provider_id !== 'string') {
        setResponseStatus(event, 400)
        return null
    }

    try {
        const query =
            `SELECT 
                u.id,
                u.username,
                u.picture
            FROM private.users u
            LEFT JOIN private.user_providers up 
                ON u.id = up.user_id 
                AND up.provider_verified = true
            WHERE up.provider = $1 
                AND up.provider_id = $2;`
        const result = await pool.query(query, [provider, provider_id])

        if (result.rows.length === 0) {
            setResponseStatus(event, 404)
            return null
        }

        const retrievedUser: RegisteredUser = {
            id: result.rows[0].id,
            username: result.rows[0].username,
            provider: provider,
            provider_id: provider_id,
            picture: result.rows[0].picture,
            verification_status: result.rows[0].provider_verified
        }

        return retrievedUser;
    }
    catch (error) {
        console.error('Error in getProvider', error)
        setResponseStatus(event, 500)
        return null
    }
}

export async function getCredentialUserExists(event: H3Event, email: string): Promise<boolean> {
    return false;
}

export async function getProviderUserExists(event: H3Event, provider: Provider, provider_id: number): Promise<boolean> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database
    
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
                FROM private.user_providers 
                WHERE provider = $1 
                AND provider_id = $2
            );`
        const values = [provider, provider_id]
        const result = await pool.query(query, values)
        return result.rows[0].exists
    }
    catch (error) {
        console.error('Error in getProviderUserExists', error)
        setResponseStatus(event, 500)
        return false
    }
}

type UnregisteredUserInput = Omit<UnregisteredUser, 'id'> & { username: string, provider_verified: boolean | null };


/**
 * Creates a new user in the database.
 * @warning This function does NOT sanitise or validate input data.
 */
export async function createUser(event: H3Event, unregisteredUserData: UnregisteredUserInput): Promise<UserCreationResponse> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database

    let { username, primary_email, provider, provider_id, provider_verified, picture } = unregisteredUserData;
  
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        // Insert user
        const userQuery = `
            INSERT INTO private.users (
                primary_email,
                username,
                picture,
                verification_status
            )
            VALUES ($1, $2, $3, $4)
            RETURNING id, primary_email, username, picture, verification_status
        `
        const verificationStatus = provider_verified === true 
            ? VerificationStatus.VerifiedBasic 
            : VerificationStatus.Unverified;

        const userValues = [
            primary_email,
            username,
            picture,
            verificationStatus
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
                provider_verified
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `
        const providerValues = [
            userId,
            provider,
            provider_id,
            primary_email,
            provider_verified
        ]

        await client.query(providerQuery, providerValues)

        // Commit transaction
        await client.query('COMMIT')

        const newUser: RegisteredUser = {
            id: parseInt(userId),
            username: userResult.rows[0].username,
            picture: userResult.rows[0].picture,
            provider,
            provider_id,
            verification_status: verificationStatus
        }

        return {
            type: 'SUCCESS',
            data: newUser
        };
    }
    catch (error: any) {
        await client.query('ROLLBACK')
        console.error('Error in createUser', error)
        
        if (error && typeof error === 'object' && 'code' in error) {
            const pgError = error as PostgresError;
            
            // PostgreSQL unique violation code
            if (pgError.code === '23505') { 
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
}