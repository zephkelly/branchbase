import { generateOTP } from "~~/server/utils/auth/tokens/otp"

export default defineEventHandler(async (event) => {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database
    const client = await pool.connect()

    try {
        const session = await getUserSession(event)
        const email = (session?.secure?.provider_email) ? session.secure.provider_email : null

        if (!session || !email) {
            throw createError({
                statusCode: 401,
                message: 'Unauthorized'
            })
        }

        await client.query('BEGIN')

        const rateLimitQuery = `
            INSERT INTO private.otp_rate_limits (
                email,
                limit_type,
                attempt_count
            )
            VALUES ($1, 'OTP_CREATION', 1)
            ON CONFLICT (email, limit_type) DO UPDATE SET
                attempt_count = 
                    CASE 
                        WHEN otp_rate_limits.window_start < NOW() - INTERVAL '1 hour'
                        THEN 1
                        ELSE otp_rate_limits.attempt_count + 1
                    END,
                window_start = 
                    CASE 
                        WHEN otp_rate_limits.window_start < NOW() - INTERVAL '1 hour'
                        THEN NOW()
                        ELSE otp_rate_limits.window_start
                    END,
                cooldown_until = 
                    CASE 
                        WHEN otp_rate_limits.attempt_count >= 5
                        THEN NOW() + INTERVAL '1 hour'
                        ELSE NULL
                    END
            RETURNING cooldown_until, attempt_count
        `

        const rateLimitResult = await client.query(rateLimitQuery, [email])
        const rateLimit = rateLimitResult.rows[0]

        if (rateLimit.cooldown_until) {
            await client.query('ROLLBACK')

            const cooldown = rateLimit.cooldown_until as Date
            const cooldownMinutes = Math.ceil((cooldown.getTime() - Date.now()) / 60000)

            return createError({
                statusCode: 429,
                statusMessage: 'Too many attempts. Try again in: ' + cooldownMinutes + ' minutes.',
            })
        }

        // Delete any existing OTP for this email (both expired and non-expired)
        const deleteExistingQuery = `
            DELETE FROM private.otp_tokens
            WHERE email = $1
                AND purpose = 'email_verification'
        `
        await client.query(deleteExistingQuery, [email])

        const optQuery = `
            INSERT INTO private.otp_tokens (
                email,
                otp,
                purpose,
                expires_at
            )
            VALUES ($1, $2, 'email_verification', NOW() + INTERVAL '15 minutes')
            RETURNING id
        `
        await client.query(optQuery, [email, generateOTP()])

        await client.query('COMMIT')

        console.log('OTP created successfully')

        // Cleanup expired tokens for all users
        // const cleanupQuery = `
        //     DELETE FROM private.otp_tokens
        //     WHERE expires_at <= NOW()
        // `
        // await client.query(cleanupQuery)

        return {
            message: 'OTP created successfully'
        }
    }
    catch (err) {
        console.error(err)
        throw createError({
            statusCode: 500,
            message: 'Server error creating OTP'
        })
    }
    finally {
        client.release()
    }
})