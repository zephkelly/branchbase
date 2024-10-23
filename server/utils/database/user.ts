import { H3Event } from 'h3';

import { isValidEmail, sanitizeEmail, isValidLength, truncateInput, stripHtmlTags, escapeHtml } from '@/utils/inputSanitisation'

import { type RegisteredUser, Provider, VerificationStatus } from '~/types/auth';
import { type ValidationError, ErrorType, PostgresError } from '@/server/types/error'
import type { UnregisteredUserInput, UserCreationResponse } from '@/server/types/user'

const VALID_PROVIDERS = Object.values(Provider);
const MAX_DISPLAY_NAME_LENGTH = 36;
const MAX_PICTURE_URL_LENGTH = 255;

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

// WE PROBABLY NEED TO ADD A PRIMARY PROVIDER FIELD TO THE USERS TABLE
export async function getCredentialUserExists(event: H3Event, email: string): Promise<boolean> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database
    
    if (!email) {
        setResponseStatus(event, 400)
        return false
    }

    try {
        const query = `
            SELECT EXISTS (
                SELECT 1 
                FROM private.users u
                INNER JOIN private.user_providers up ON u.id = up.user_id
                WHERE up.provider_email = $1 
                AND up.provider = $2
            );`
        const values = [email, Provider.Credentials]
        const result = await pool.query(query, values)
        return result.rows[0].exists
    }
    catch (error) {
        console.error('Error in getCredentialUserExists', error)
        setResponseStatus(event, 500)
        return false
    }
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

export async function createUser(event: H3Event, unregisteredUserData: UnregisteredUserInput): Promise<UserCreationResponse> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database

    let { username, primary_email, provider, provider_id, provider_verified, picture } = unregisteredUserData;
  
    const client = await pool.connect()

    try {
        if (!username || !primary_email || !provider || !provider_id || provider_verified === null || provider_verified === undefined || !picture) {
            setResponseStatus(event, 400)
            return createValidationError('general', 'Please provide all required fields')
        }

        if (primary_email) {
            primary_email = sanitizeEmail(primary_email)

            if (!isValidEmail(primary_email)) {
                setResponseStatus(event, 400)
                return createValidationError('email', 'Invalid email format')
            }
        }

        username = stripHtmlTags(username);
        username = escapeHtml(username);
        if (!isValidLength(username, 1, MAX_DISPLAY_NAME_LENGTH)) {
            setResponseStatus(event, 400)
            return createValidationError('username', `Username must be between 1 and ${MAX_DISPLAY_NAME_LENGTH} characters`);
        }
        username = truncateInput(username, MAX_DISPLAY_NAME_LENGTH);

        if (!VALID_PROVIDERS.includes(provider)) {
            setResponseStatus(event, 400)
            return createValidationError('provider', 'Invalid provider');
        }

        picture = stripHtmlTags(picture);
        picture = escapeHtml(picture);
        if (!isValidLength(picture, 1, MAX_PICTURE_URL_LENGTH)) {
            setResponseStatus(event, 400)
            return createValidationError('picture', `Picture URL must be between 1 and ${MAX_PICTURE_URL_LENGTH} characters`);
        }
        picture = truncateInput(picture, MAX_PICTURE_URL_LENGTH);

        if (typeof provider_id !== 'string') {
            setResponseStatus(event, 400)
            return createValidationError('provider_id', 'Provider ID must be a string');
        }

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
            primary_email,  // Using primary_email as provider_email initially
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

function createValidationError(field: string, message: string): ValidationError {
    return {
        type: ErrorType.VALIDATION_ERROR,
        field,
        message,
        statusCode: 400
    };
}