import { H3Error } from "h3";
import { handleVerifyOTP } from "~~/server/utils/database/tokens/otp/verify";
import { getOTPUsed } from "~~/server/utils/database/tokens/otp/used";

const MAXIMUM_VERIFICATION_ATTEMPTS = 5

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { otp } = body
    
    if (!otp) {
        throw createError({
            statusCode: 400,
            statusMessage: 'OTP required'
        })
    }
    

    return await handleVerifyOTP(event, otp, MAXIMUM_VERIFICATION_ATTEMPTS)
});