import { isValidEmail, sanitizeEmail } from '@/utils/inputSanitisation'
import { User } from '#auth-utils'

type UserInput = Pick<User, 'email' | 'display_name' | 'provider' | 'picture'>

export async function userExists(email: string): Promise<boolean> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database

    try {
        email = sanitizeEmail(email)

        if (!isValidEmail(email)) {
            return false
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

export async function getUser(email: string): Promise<User | null> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database

    try {
        email = sanitizeEmail(email)

        if (!isValidEmail(email)) {
            return null
        }

        const query = 'SELECT email, display_name, provider, picture FROM users WHERE email = $1'
        const result = await pool.query(query, [email])

        if (result.rows.length === 0) {
            return null
        }

        return {
            email: result.rows[0].email,
            display_name: result.rows[0].display_name,
            provider: result.rows[0].provider,
            picture: result.rows[0].picture,
        }
    }
    catch (error) {
        console.error('Error getting user:', error)
        throw error
    }
}

export async function createUser(userInput: UserInput, sanitize: boolean = true): Promise<User> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database
  
    try {
        let { email, display_name, provider, picture } = userInput;

        if (!display_name || display_name.length === 0 || !email || email.length === 0 || !provider || provider.length === 0) {
            throw new Error('Required fields are missing. Please provide email, display_name and provider')
        }

        if (sanitize) {
            email = sanitizeEmail(email)

            if (!isValidEmail(email)) {
                throw new Error('Invalid email')
            }
        }
    
        const userAlreadyExists = await userExists(email)

        if (userAlreadyExists) {
            throw new Error('User already exists')
        }
    
        const query = `
            INSERT INTO users (email, display_name, provider, picture)
            VALUES ($1, $2, $3, $4)
            RETURNING id, email, display_name, provider, picture
        `
        const values = [email, display_name, provider, picture]
        const result = await pool.query(query, values)
    
        const newUser: User = {
            email: result.rows[0].email,
            provider: result.rows[0].provider,
            display_name: result.rows[0].display_name,
        }
    
        return newUser
    }
    catch (error) {
        console.error('Error creating user:', error)
        throw error
    }
}

