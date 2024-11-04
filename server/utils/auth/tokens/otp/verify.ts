import { H3Error, H3Event } from 'h3'
import { OTPPurpose } from '~~/server/types/otp';
import { SecureSessionData } from "~~/types/auth/user/session/secure";

import { createVerifiedLinkableSession } from "~~/server/utils/auth/sessions/unregistered/verifiedLinkableSession";
import { createVerifiedUnregisteredSession } from "~~/server/utils/auth/sessions/unregistered/verifiedSession";

const DEFAULT_MAX_VERIFICATION_ATTEMPTS = 5

export async function handleVerifyOTP(event: H3Event, otp: string, verification_attempts: number = DEFAULT_MAX_VERIFICATION_ATTEMPTS) {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database
    const client = await pool.connect()

    try {
        const session = await getUserSession(event)
        const secureData = session?.secure as any
        const email = (secureData.provider_email) ? secureData.provider_email : null

        if (!session || !email) {
            return createError({
                statusCode: 401,
                statusMessage: 'Unauthorized'
            })
        }

        if (!otp) {
            return createError({
                statusCode: 400,
                statusMessage: 'OTP required'
            })
        }

        await client.query('BEGIN')

        const checkTokenQuery = `
            SELECT id, verification_attempts, expires_at, used_at
            FROM private.otp_tokens
            WHERE email = $1 
            AND purpose = $2
            AND expires_at > NOW()
            AND used_at IS NULL
        `
        const tokenResult = await client.query(checkTokenQuery, [email, OTPPurpose.ACCOUNT_LINKING])

        if (tokenResult.rows.length === 0) {
            await client.query('ROLLBACK')

            return createError({
                statusCode: 404,
                statusText: 'No OTP found. Please request a new one.'
            })
        }

        const token = tokenResult.rows[0]

        // Check if max attempts reached
        if (token.verification_attempts >= verification_attempts) {
            // Delete the token as max attempts reached
            const deleteTokenQuery = `
                DELETE FROM private.otp_tokens 
                WHERE id = $1
            `
            await client.query(deleteTokenQuery, [token.id])
            await client.query('COMMIT')
            
            return createError({
                statusCode: 429,
                statusMessage: 'Maximum verification attempts. Please request a new OTP.'
            })
        }

        // Update attempts counter and last attempt timestamp
        const updateAttemptsQuery = `
            UPDATE private.otp_tokens 
            SET verification_attempts = verification_attempts + 1,
                last_verification_attempt = NOW()
            WHERE id = $1
            RETURNING otp, verification_attempts
        `
        const updateResult = await client.query(updateAttemptsQuery, [token.id])
        const updatedToken = updateResult.rows[0]

        // Verify OTP
        if (updatedToken.otp !== otp) {
            const remainingAttempts = verification_attempts - updatedToken.verification_attempts
            await client.query('COMMIT')

            // If this was the last attempt, include that in the message
            if (remainingAttempts === 0) {
                return createError({
                    statusCode: 401,
                    statusMessage: 'Maximum verification attempts reached. Request a new OTP.'
                })
            }
            
            return createError({
                statusCode: 401,
                statusMessage: `Invalid OTP. ${remainingAttempts} attempts remaining.`
            })
        }

        // Mark token as used
        const markUsedQuery = `
            UPDATE private.otp_tokens 
            SET used_at = NOW()
            WHERE id = $1
        `
        await client.query(markUsedQuery, [token.id])
        await client.query('COMMIT')

        if (session.linkable_data) {
            await createVerifiedLinkableSession(event, session)
        }
        else {
            await createVerifiedUnregisteredSession(event, session)
        }

        setResponseStatus(event, 200, 'Ok')
        return {
            otp_id: token.id
        }
    }
    catch (err) {
        await client.query('ROLLBACK')

        if (err instanceof H3Error) {
            return err
        }

        console.error('Error verifying OTP:', err)
        return createError({
            statusCode: 500,
            statusMessage: 'Server error verifying OTP'
        })
    } 
    finally {
        client.release()
    }
}