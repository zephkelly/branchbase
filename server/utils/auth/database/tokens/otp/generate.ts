import { H3Event } from 'h3'

import { RateLimitType } from "~~/server/types/ratelimit"
import { OTPPurpose } from "~~/server/types/otp"

export function generateOTPCode(length: number = 6): string {
    return Array.from(
      { length },
      () => Math.floor(Math.random() * 10)
    ).join('')
}

export async function createOTP(event: H3Event, email: string, purpose: OTPPurpose): Promise<string>{
    const nitroApp = useNitroApp()
    const pool = nitroApp.database
    const client = await pool.connect()

    const otp_code = generateOTPCode()

    try {
        await client.query('BEGIN')

        const rateLimitQuery = `
            INSERT INTO private.otp_rate_limits (
                email,
                limit_type,
                attempt_count
            )
            VALUES ($1, $2, 1)
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

        const rateLimitResult = await client.query(rateLimitQuery, [email, RateLimitType.OTP_CREATION])
        const rateLimit = rateLimitResult.rows[0]

        if (rateLimit.cooldown_until) {
            await client.query('ROLLBACK')

            const cooldown = rateLimit.cooldown_until as Date
            const cooldownMinutes = Math.ceil((cooldown.getTime() - Date.now()) / 60000)

            throw createError({
                statusCode: 429,
                message: 'Too many attempts. Try again in: ' + cooldownMinutes + ' minutes.',
            })
        }

        // Update existing OTP or create new one
        const upsertOTPQuery = `
            INSERT INTO private.otp_tokens (
                email,
                otp,
                purpose,
                expires_at,
                verification_attempts,
                last_verification_attempt,
                used_at
            )
            VALUES (
                $1, 
                $2,
                $3,
                NOW() + INTERVAL '15 minutes',
                0,
                NULL,
                NULL
            )
            ON CONFLICT (email, purpose) DO UPDATE SET
                otp = EXCLUDED.otp,
                expires_at = EXCLUDED.expires_at,
                verification_attempts = 0,
                last_verification_attempt = NULL,
                used_at = NULL
            RETURNING id
        `

        const upsertOTPValues = [
            email,
            otp_code,
            purpose
        ]

        await client.query(upsertOTPQuery, upsertOTPValues)

        await client.query('COMMIT')

        return otp_code
    }
    catch (error: any) {
        await client.query('ROLLBACK')
        if (error.statusCode) {
            throw error
        }
        console.error('Error in handleGenerateOTP:', error)
        throw createError({
            statusCode: 500,
            message: 'Server error creating OTP'
        })
    }
    finally {
        client.release()
    }
}