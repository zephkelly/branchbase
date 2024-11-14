import { OTPPurpose } from "~~/server/types/otp"
import { createOTP } from "~~/server/utils/auth/database/tokens/otp/generate"
import { SecureSessionData } from "~~/types/auth/user/session/secure"

export default defineEventHandler(async (event) => {
    try {
        const session = await getUserSession(event)
        const secureData: SecureSessionData | undefined = session.secure as SecureSessionData | undefined
        const email = (secureData?.provider_email) ? secureData.provider_email : null

        if (!session || !email) {
            throw createError({
                statusCode: 401,
                message: 'Session not found'
            })
        }

        const otp_code = await createOTP(event, email, OTPPurpose.EMAIL_VERIFICATION)

        const nitroApp = useNitroApp()
        const mailer = nitroApp.mailer
        await mailer.sendVerificationEmail('evan.connor.kelly@gmail.com', otp_code)

        setResponseStatus(event, 201, 'Created')
    }
    catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            message: 'Failed to generate verification code'
        })
    }
})