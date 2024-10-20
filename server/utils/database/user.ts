import { User } from '#auth-utils'
import { isValidEmail, sanitizeEmail, isValidLength, truncateInput, stripHtmlTags, escapeHtml } from '@/utils/inputSanitisation'
import { BackendUser, RegisteredUser, UnregisteredUser, Provider } from '~/types/auth';
// import { ValidationError } from '@/server/utils/database/validationError';
import { H3Event } from 'h3';

const VALID_PROVIDERS = Object.values(Provider);
const MAX_DISPLAY_NAME_LENGTH = 36;
const MAX_PICTURE_URL_LENGTH = 255;

export async function getProviderUser(event: H3Event, provider: Provider, provider_id: number): Promise<RegisteredUser | null> {
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

    if (typeof provider_id !== 'number') {
        setResponseStatus(event, 400)
        return null
    }

    try {
        const query = 'SELECT id, username, picture, provider_verified FROM users WHERE provider = $1 AND provider_id = $2'
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

    try {
        const query = 'SELECT id FROM users WHERE email = $1 AND provider = $2'
        const values = [email, Provider.Credentials]

        const result = await pool.query(query, values)

        if (result.rows.length === 0) {
            return false
        }

        return true
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

    try {
        const query = 'SELECT id FROM users WHERE provider = $1 AND provider_id = $2'
        const values = [provider, provider_id]

        const result = await pool.query(query, values)

        if (result.rows.length === 0) {
            return false
        }

        return true
    }
    catch (error) {
        console.error('Error in getProviderUserExists', error)
        setResponseStatus(event, 500)
        return false
    }
}


// type UserInput = Omit<UnregisteredUser, 'id'>

// export async function createUser(userInput: UserInput, sanitize: boolean = true): Promise<RegisteredUser> {
//     const nitroApp = useNitroApp()
//     const pool = nitroApp.database

//     let { email, display_name, provider, provider_id, picture } = userInput;

//     try {
//         if (!display_name || !provider || !picture || (!email && !provider_id)) {
//             throw new ValidationError('Required fields are missing. Please provide email or provider_id, display_name, provider and picture', 400);
//         }

//         if (sanitize) {
//             if (email && email !== null && email !== undefined) {
//                 email = sanitizeEmail(email)

//                 if (!isValidEmail(email)) {
//                     throw new ValidationError('Invalid email format', 400);
//                 }
//             }

//             display_name = stripHtmlTags(display_name);
//             display_name = escapeHtml(display_name);
//             if (!isValidLength(display_name, 1, MAX_DISPLAY_NAME_LENGTH)) {
//                 throw new ValidationError(`Display name must be between 1 and ${MAX_DISPLAY_NAME_LENGTH} characters`, 400);
//             }
//             display_name = truncateInput(display_name, MAX_DISPLAY_NAME_LENGTH);

//             if (!VALID_PROVIDERS.includes(provider)) {
//                 throw new ValidationError('Invalid provider', 400);
//             }

//             if (picture) {
//                 picture = stripHtmlTags(picture);
//                 picture = escapeHtml(picture);
//                 if (!isValidLength(picture, 1, MAX_PICTURE_URL_LENGTH)) {
//                     throw new ValidationError(`Picture URL must be between 1 and ${MAX_PICTURE_URL_LENGTH} characters`, 400);
//                 }
//                 picture = truncateInput(picture, MAX_PICTURE_URL_LENGTH);
//             }

//             if (provider_id && typeof provider_id !== 'number' ) {
//                 provider_id = parseInt(provider_id);
//             }
//         }

//         let userAlreadyExists = false;

//         if (email) {
//             userAlreadyExists = await userExistsByEmail(email)
//         }
//         else if (provider_id) {
//             userAlreadyExists = await userExistsByProviderId(provider, provider_id)
//         }

//         if (userAlreadyExists) {
//             throw new ValidationError('User already exists', 409);
//         }

//         const query = `
//             INSERT INTO users (email, display_name, provider, provider_id, picture)
//             VALUES ($1, $2, $3, $4, $5)
//             RETURNING id, email, display_name, provider, provider_id, verification_status picture
//         `
//         const values = [email, display_name, provider, provider_id, picture]
//         const result = await pool.query(query, values)

//         const newUser: RegisteredUser = {
//             id: parseInt(result.rows[0].id),
//             email: result.rows[0].email,
//             provider: result.rows[0].provider,
//             provider_id: provider_id as number,
//             display_name: result.rows[0].display_name,
//             picture: result.rows[0].picture,
//         }

//         return newUser
//     }
//     catch (error) {
//         if (error instanceof ValidationError) {
//             throw error;
//         }
//         throw new Error('An unexpected error occurred while creating the user');
//     }
// }

