import { User } from '#auth-utils'
import { isValidEmail, sanitizeEmail, isValidLength, truncateInput, stripHtmlTags, escapeHtml } from '@/utils/inputSanitisation'
import { BackendUser, RegisteredUser, UnregisteredUser, Provider } from '~/types/auth';
// import { ValidationError } from '@/server/utils/database/validationError';
import { H3Event } from 'h3';

const VALID_PROVIDERS = Object.values(Provider);
const MAX_DISPLAY_NAME_LENGTH = 36;
const MAX_PICTURE_URL_LENGTH = 255;

export async function userExistsByEmail(email: string): Promise<boolean> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database

    try {
        email = sanitizeEmail(email)

        if (!isValidEmail(email)) {
            throw new ValidationError('Invalid email format', 400);
        }

        const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)'
        const result = await pool.query(query, [email])
        return result.rows[0].exists
    }
    catch (error) {
        console.error('Error checking if user exists:', error)
        throw error
    }
}

export async function userExistsById(id: number): Promise<boolean> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database

    try {
        if (!id || typeof id !== 'number') {
            throw new ValidationError('Invalid user ID', 400);
        }

        const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)'
        const result = await pool.query(query, [id])

        return result.rows[0].exists as boolean
    }
    catch (error) {
        if (error instanceof ValidationError) {
            throw error;
        }

        throw new Error('An unexpected error occurred while checking if the user exists');
    }
}

export async function userExistsByProviderId(provider: Provider, provider_id: number): Promise<boolean> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database

    try {
        if (!provider || !provider_id) {
            throw new ValidationError('Invalid provider or provider ID', 400);
        }

        if (!VALID_PROVIDERS.includes(provider)) {
            throw new ValidationError('Invalid provider', 400);
        }

        const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE provider = $1 AND provider_id = $2)'
        const result = await pool.query(query, [provider, provider_id])

        return result.rows[0].exists as boolean
    }
    catch (error) {
        if (error instanceof ValidationError) {
            throw error;
        }

        throw new Error('An unexpected error occurred while checking if the user exists');
    }
}

export async function getUserById(id: number): Promise<User | null> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database

    try {
        if (!id || typeof id !== 'number') {
            throw new ValidationError('Invalid user ID', 400);
        }

        const query = 'SELECT id, email, display_name, provider, picture FROM users WHERE id = $1'
        const result = await pool.query(query, [id])

        if (result.rows.length === 0) {
            return null
        }

        const fetchedUser: RegisteredUser = {
            id: parseInt(result.rows[0].id),
            email: result.rows[0].email,
            provider: result.rows[0].provider,
            provider_id: parseInt(result.rows[0].provider_id),
            display_name: result.rows[0].display_name,
            picture: result.rows[0].picture,
        }

        return fetchedUser
    }
    catch (error) {
        if (error instanceof ValidationError) {
            throw error;
        }

        throw new Error('An unexpected error occurred while getting the user');
    }
}

export async function getUserByEmail(event: H3Event, email: string): Promise<RegisteredUser | null> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database

    if (!email || typeof email !== 'string') {
        setResponseStatus(event, 400)
        return null
    }

    try {
        email = sanitizeEmail(email)
        if (!isValidEmail(email)) {
            setResponseStatus(event, 400)
            return null
        }

        const query = 'SELECT id, email, provider, provider_id, display_name, picture FROM users WHERE email = $1'
        const result = await pool.query(query, [email])

        if (result.rows.length === 0) {
            setResponseStatus(event, 404)
            return null
        }

        const fetchedUser: RegisteredUser = {
            id: parseInt(result.rows[0].id),
            email: result.rows[0].email,
            provider: result.rows[0].provider,
            provider_id: parseInt(result.rows[0].provider_id),
            display_name: result.rows[0].display_name,
            picture: result.rows[0].picture,
        }

        return fetchedUser
    }
    catch (error) {
        console.error('Error in getUserByEmail:', error)
        setResponseStatus(event, 500)
        return null
    }
}

export async function getUserByProviderId(event: H3Event, provider: Provider, provider_id: number): Promise<RegisteredUser | null> {
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

    try {
        const query = 'SELECT id, email, display_name, picture FROM users WHERE provider = $1 AND provider_id = $2'
        const result = await pool.query(query, [provider, provider_id])

        if (result.rows.length === 0) {
            setResponseStatus(event, 404)
            return null
        }

        const fetchedUser: RegisteredUser = {
            id: parseInt(result.rows[0].id),
            email: result.rows[0].email,
            provider: provider,
            provider_id: provider_id,
            display_name: result.rows[0].display_name,
            picture: result.rows[0].picture,
        }

        return fetchedUser
    }
    catch (error) {
        console.error('Error in getUserByProviderId:', error)
        setResponseStatus(event, 500)
        return null
    }
}

type UserInput = Omit<UnregisteredUser, 'id'>

export async function createUser(userInput: UserInput, sanitize: boolean = true): Promise<RegisteredUser> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database

    let { email, display_name, provider, provider_id, picture } = userInput;

    try {
        if (!display_name || !provider || !picture || (!email && !provider_id)) {
            throw new ValidationError('Required fields are missing. Please provide email or provider_id, display_name, provider and picture', 400);
        }

        if (sanitize) {
            if (email && email !== null && email !== undefined) {
                email = sanitizeEmail(email)

                if (!isValidEmail(email)) {
                    throw new ValidationError('Invalid email format', 400);
                }
            }

            display_name = stripHtmlTags(display_name);
            display_name = escapeHtml(display_name);
            if (!isValidLength(display_name, 1, MAX_DISPLAY_NAME_LENGTH)) {
                throw new ValidationError(`Display name must be between 1 and ${MAX_DISPLAY_NAME_LENGTH} characters`, 400);
            }
            display_name = truncateInput(display_name, MAX_DISPLAY_NAME_LENGTH);

            if (!VALID_PROVIDERS.includes(provider)) {
                throw new ValidationError('Invalid provider', 400);
            }

            if (picture) {
                picture = stripHtmlTags(picture);
                picture = escapeHtml(picture);
                if (!isValidLength(picture, 1, MAX_PICTURE_URL_LENGTH)) {
                    throw new ValidationError(`Picture URL must be between 1 and ${MAX_PICTURE_URL_LENGTH} characters`, 400);
                }
                picture = truncateInput(picture, MAX_PICTURE_URL_LENGTH);
            }

            if (provider_id !== undefined && typeof provider_id !== 'number') {
                provider_id = parseInt(provider_id);
            }
        }

        let userAlreadyExists = false;

        if (email) {
            userAlreadyExists = await userExistsByEmail(email)
        }
        else if (provider_id) {
            userAlreadyExists = await userExistsByProviderId(provider, provider_id)
        }

        if (userAlreadyExists) {
            throw new ValidationError('User already exists', 409);
        }

        const query = `
            INSERT INTO users (email, display_name, provider, provider_id, picture)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, email, display_name, provider, provider_id, picture
        `
        const values = [email, display_name, provider, provider_id, picture]
        const result = await pool.query(query, values)

        const newUser: RegisteredUser = {
            id: parseInt(result.rows[0].id),
            email: result.rows[0].email,
            provider: result.rows[0].provider,
            provider_id: provider_id as number,
            display_name: result.rows[0].display_name,
            picture: result.rows[0].picture,
        }

        return newUser
    }
    catch (error) {
        if (error instanceof ValidationError) {
            throw error;
        }
        throw new Error('An unexpected error occurred while creating the user');
    }
}

