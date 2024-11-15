import { H3Event } from 'h3'
import { OTPPurpose } from '~~/server/types/otp';

import { createVerifiedLinkableSession } from "~~/server/utils/auth/sessions/unregistered/createVerifiedLinkableSession";
import { createVerifiedUnregisteredSession } from "~~/server/utils/auth/sessions/unregistered/createVerifiecUnregisteredSession";
import { UnregisteredCredLinkableSession, UnregisteredCredSession } from '~~/types/auth/user/session/credentials/unregistered';
import { UnregisteredOAuthLinkableSession, UnregisteredOAuthSession } from '~~/types/auth/user/session/oauth/unregistered';

import { getPool } from '~~/server/utils/database';

const DEFAULT_MAX_VERIFICATION_ATTEMPTS = 5

export async function verifyOTP(event: H3Event, otp: string, verification_attempts: number = DEFAULT_MAX_VERIFICATION_ATTEMPTS): Promise<string> {
    const pool = getPool()
    const client = await pool.connect()

    try {
        const session = await getUserSession(event)
        const secureData = session?.secure as any
        const email = (secureData.provider_email) ? secureData.provider_email : null

        if (!session || !email) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized'
            })
        }

        if (!otp) {
            throw createError({
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

            throw createError({
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
            
            throw createError({
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
                throw createError({
                    statusCode: 401,
                    statusText: 'Invalid OTP',
                    message: 'Maximum verification attempts reached. Request a new OTP.'
                })
            }
            
            throw createError({
                statusCode: 401,
                statusText: 'Invalid OTP',
                message: `Invalid OTP. ${remainingAttempts} attempts remaining.`
            })
        }

        // Mark token as used
        const markUsedQuery = `
            UPDATE private.otp_tokens 
            SET used_at = NOW()
            WHERE id = $1
        `
        await client.query(markUsedQuery, [token.id])
        
        if (session.linkable_data) {
            const linkableSession = session as unknown as UnregisteredCredLinkableSession | UnregisteredOAuthLinkableSession
            await createVerifiedLinkableSession(event, linkableSession)
        }
        else {
            const unregisteredSession = session as unknown as UnregisteredCredSession | UnregisteredOAuthSession
            await createVerifiedUnregisteredSession(event, unregisteredSession)
        }
        
        await client.query('COMMIT')

        return token.id
    }
    catch (err) {
        await client.query('ROLLBACK')

        throw err
    } 
    finally {
        client.release()
    }
}


interface OTPVerificationResult {
    verified: boolean;
    email: string;
}

export async function getOTPVerified(event: H3Event, otp_id: string): Promise<OTPVerificationResult> {
    const pool = getPool()
    const client = await pool.connect()

    // Input validation
    if (!otp_id) {
        throw createError({
            statusCode: 400,
            message: 'Missing required parameters'
        })
    }
    if (typeof otp_id !== 'string') {
        throw createError({
            statusCode: 400,
            message: 'Invalid OTP ID'
        })
    }

    try {
        // Check for used OTP and get email
        const checkQuery = `
            SELECT email
            FROM private.otp_tokens
            WHERE id = $1
            AND used_at IS NOT NULL;
        `
        
        const checkResult = await client.query(checkQuery, [otp_id])
        
        if (checkResult.rows.length === 0) {
            throw createError({
                statusCode: 404,
                message: 'OTP not found or not used'
            })
        }

        return {
            verified: true,
            email: checkResult.rows[0].email
        }
    }
    catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            message: 'Failed to verify OTP'
        })
    }
    finally {
        client.release()
    }
}