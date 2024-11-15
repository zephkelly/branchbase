import { verifyOTP } from "~~/server/utils/auth/handlers/tokens/otp/verify";

const MAXIMUM_VERIFICATION_ATTEMPTS = 5

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody<{ otp: string }>(event)
        const { otp } = body
        
        if (!otp) {
            throw createError({
                statusCode: 400,
                statusMessage: 'OTP required'
            })
        }
        
        const otp_id = await verifyOTP(event, otp, MAXIMUM_VERIFICATION_ATTEMPTS)

        setResponseStatus(event, 200, 'OK')
        return {
            otp_id: otp_id
        }
    }
    catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to verify OTP'
        })
    }
});