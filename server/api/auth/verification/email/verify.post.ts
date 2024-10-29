import { createVerifiedLinkableSession } from "~~/server/utils/auth/verifiedLinkableSession";

const MAXIMUM_VERIFICATION_ATTEMPTS = 5

export default defineEventHandler(async (event) => {
    const nitroApp = useNitroApp()
    const pool = nitroApp.database
    const client = await pool.connect()

    try {
        const body = await readBody(event)
        const { otp } = body

        const session = await getUserSession(event)
        const email = (session?.secure?.provider_email) ? session.secure.provider_email : null

        if (!session || !email) {
            return createError({
                statusCode: 401,
                statusText: 'Unauthorized'
            })
        }

        if (!otp) {
            return createError({
                statusCode: 400,
                statusText: 'OTP is required'
            })
        }

        await client.query('BEGIN')

        const checkTokenQuery = `
            SELECT id, verification_attempts, expires_at, used_at
            FROM private.otp_tokens
            WHERE email = $1 
            AND purpose = 'email_verification'
            AND expires_at > NOW()
            AND used_at IS NULL
        `
        const tokenResult = await client.query(checkTokenQuery, [email])

        console.log('Token result:', tokenResult.rows)
        
        if (tokenResult.rows.length === 0) {
            await client.query('ROLLBACK')
            return createError({
                statusCode: 404,
                statusText: 'No OTP found. Please request a new one.'
            })
        }

        const token = tokenResult.rows[0]

        // Check if max attempts reached
        if (token.verification_attempts >= MAXIMUM_VERIFICATION_ATTEMPTS) {
            // Delete the token as max attempts reached
            const deleteTokenQuery = `
                DELETE FROM private.otp_tokens 
                WHERE id = $1
            `
            await client.query(deleteTokenQuery, [token.id])
            await client.query('COMMIT')
            
            return createError({
                statusCode: 429,
                statusText: 'Maximum verification attempts reached. Please request a new OTP.'
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

        console.log('Updated token:', updatedToken)

        // Verify OTP
        if (updatedToken.otp !== otp) {
            const remainingAttempts = 3 - updatedToken.verification_attempts
            await client.query('COMMIT')

            console.log('Invalid OTP. Remaining attempts:', remainingAttempts)
            
            // If this was the last attempt, include that in the message
            if (remainingAttempts === 0) {
                return createError({
                    statusCode: 401,
                    statusText: 'Maximum verification attempts reached. Please request a new OTP.'
                })
            }
            
            return createError({
                statusCode: 401,
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
        await client.query('COMMIT')

        await createVerifiedLinkableSession(event, session)

        return {
            statusText: 'Success',
            otp_id: token.id
        }
    }
    catch (err) {
        await client.query('ROLLBACK')
        return createError({
            statusCode: 500,
            message: 'Server error verifying OTP'
        })
    }
    finally {
        client.release()
    }
});