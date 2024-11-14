import { H3Event } from 'h3'

export async function cleanupOTP(event: H3Event, otp_id: number, email: string): Promise<boolean> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database
    const client = await pool.connect()

    // Input validation
    if (!otp_id || !email) {
        setResponseStatus(event, 400)
        
        throw createError({
            statusCode: 400,
            message: 'Missing required parameters'
        })
    }

    try {
        await client.query('BEGIN')

        // Delete the used OTP token
        const deleteOTPQuery = `
            DELETE FROM private.otp_tokens
            WHERE id = $1
            AND email = $2
            AND used_at IS NOT NULL;
        `
        const otpResult = await client.query(deleteOTPQuery, [otp_id, email])

        // If no OTP was deleted, rollback and return error
        if (otpResult.rowCount === 0) {
            await client.query('ROLLBACK')
            
            throw createError({
                statusCode: 404,
                message: 'OTP not found or not used'
            })
        }

        // Delete the corresponding rate limit entry
        const deleteRateLimitQuery = `
            DELETE FROM private.otp_rate_limits
            WHERE email = $1
            AND limit_type = 'otp_creation';
        `
        await client.query(deleteRateLimitQuery, [email])
        
        await client.query('COMMIT')
        return true;
    }
    catch (error) {
        await client.query('ROLLBACK')
        
        throw createError({
            statusCode: 500,
            message: 'Failed to cleanup OTP from database'
        })
    }
    finally {
        client.release()
    }
}