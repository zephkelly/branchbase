import { isValidEmail, sanitizeEmail, isValidLength, truncateInput, stripHtmlTags, escapeHtml } from '@/utils/inputSanitisation'
import { User } from '#auth-utils'
import { BackendUser, UnregisteredUser } from '~/types/auth';

const MAX_DISPLAY_NAME_LENGTH = 36;
const MAX_PICTURE_URL_LENGTH = 255;
const VALID_PROVIDERS = ['google'];

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

export async function userExistsById(id: string): Promise<boolean> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database

    try {
        if (!id || typeof id !== 'string') {
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

export async function getUserById(id: string): Promise<User | null> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database

    try {
        if (!id || typeof id !== 'string') {
            throw new ValidationError('Invalid user ID', 400);
        }

        const query = 'SELECT id, email, display_name, provider, picture FROM users WHERE id = $1'
        const result = await pool.query(query, [id])

        if (result.rows.length === 0) {
            return null
        }

        const fetchedUser: User = {
            id: result.rows[0].id,
            email: result.rows[0].email,
            provider: result.rows[0].provider,
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

export async function getUserByEmail(email: string): Promise<BackendUser | null> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database

    try {
        email = sanitizeEmail(email)

        if (!isValidEmail(email)) {
            throw new ValidationError('Invalid email format', 400);
        }

        const query = 'SELECT id, email, provider, display_name, picture FROM users WHERE email = $1'
        const result = await pool.query(query, [email])

        if (result.rows.length === 0) {
            return null
        }

        const fetchedUser: BackendUser = {
            id: result.rows[0].id,
            email: result.rows[0].email,
            provider: result.rows[0].provider,
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

type UserInput = Pick<UnregisteredUser, 'email' | 'picture' | 'provider'> & { display_name: string }

export async function createUser(userInput: UserInput, sanitize: boolean = true): Promise<BackendUser> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database

    try {
        let { email, display_name, provider, picture } = userInput;

        if (!display_name || !email || !provider) {
            throw new ValidationError('Required fields are missing. Please provide email, display_name and provider', 400);
        }

        if (sanitize) {
            email = sanitizeEmail(email)
            if (!isValidEmail(email)) {
                throw new ValidationError('Invalid email format', 400);
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
        }

        const userAlreadyExists = await userExistsByEmail(email)

        if (userAlreadyExists) {
            throw new ValidationError('User already exists', 409);
        }

        const query = `
        INSERT INTO users (email, display_name, provider, picture)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, display_name, provider, picture
    `
        const values = [email, display_name, provider, picture]
        const result = await pool.query(query, values)

        const newUser: BackendUser = {
            id: result.rows[0].id,
            email: result.rows[0].email,
            provider: result.rows[0].provider,
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

