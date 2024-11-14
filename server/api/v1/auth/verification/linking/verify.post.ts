import { verifyOTP } from "~~/server/utils/auth/database/tokens/otp/verify";

const MAXIMUM_VERIFICATION_ATTEMPTS = 5

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { otp } = body

    if (!otp) {
        throw createError({
            statusCode: 400,
            message: 'OTP required'
        })
    }
    
    const otp_id = await verifyOTP(event, otp, MAXIMUM_VERIFICATION_ATTEMPTS)

    setResponseStatus(event, 200, 'OK') 
    return {
        otp_id: otp_id
    }
});