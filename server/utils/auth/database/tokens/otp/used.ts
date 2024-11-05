import { H3Event } from 'h3'

interface OTPVerificationResult {
    verified: boolean;
    email?: string;
}

export async function getOTPUsed(event: H3Event, otp_id: number): Promise<OTPVerificationResult> {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database
    const client = await pool.connect()

    // Input validation
    if (!otp_id) {
        setResponseStatus(event, 400)
        return { verified: false }
    }
    if (typeof otp_id !== 'number') {
        console.log('NAN')
        setResponseStatus(event, 400)
        return { verified: false }
    }

    try {
        await client.query('BEGIN')

        // Check for used OTP and get email
        const checkQuery = `
            SELECT email
            FROM private.otp_tokens
            WHERE id = $1
            AND used_at IS NOT NULL;
        `
       
        const checkResult = await client.query(checkQuery, [otp_id])

        if (checkResult.rows.length === 0) {
            await client.query('ROLLBACK')
            return { verified: false }
        }

        const email = checkResult.rows[0].email

        // Delete the used OTP token
        const deleteOTPQuery = `
            DELETE FROM private.otp_tokens
            WHERE id = $1
            AND used_at IS NOT NULL;
        `
        await client.query(deleteOTPQuery, [otp_id])

        // Delete the corresponding rate limit entry
        const deleteRateLimitQuery = `
            DELETE FROM private.otp_rate_limits
            WHERE email = $1
            AND limit_type = 'otp_creation';
        `
        await client.query(deleteRateLimitQuery, [email])

        await client.query('COMMIT')
        return { 
            verified: true,
            email 
        }

    }
    catch (error) {
        await client.query('ROLLBACK')
        console.error('Error in getOTPUsed:', error)
        setResponseStatus(event, 500)
        return { verified: false }
    }
    finally {
        client.release()
    }
}