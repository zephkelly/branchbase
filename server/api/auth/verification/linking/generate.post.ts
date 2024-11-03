import { OTPPurpose } from "~~/server/types/otp"
import { handleGenerateOTP } from "~~/server/utils/auth/tokens/otp/generate"
import { SecureSessionData } from "~~/types/auth/user/session/secure"

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)
    const secureData = session.secure as SecureSessionData
    const email = (secureData.provider_email) ? secureData.provider_email : null

    if (!session || !email) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    return handleGenerateOTP(event, email, OTPPurpose.ACCOUNT_LINKING)
})