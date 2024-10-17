import { isValidEmail, sanitizeEmail } from '@/utils/inputSanitisation'

export async function userExists(email: string, sanitise: boolean = false): Promise<boolean> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database

    try {
        if (sanitise) {
            email = sanitizeEmail(email)

            if (!isValidEmail(email)) {
                return false
            }
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