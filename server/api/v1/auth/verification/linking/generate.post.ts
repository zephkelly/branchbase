import { OTPPurpose } from "~~/server/types/otp"
import { createOTP } from "~~/server/utils/auth/database/tokens/otp/generate"
import { SecureSessionData } from "~~/types/auth/user/session/secure"

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)
    const secureData: SecureSessionData | undefined = session.secure as SecureSessionData | undefined
    const email = (secureData?.provider_email) ? secureData.provider_email : null

    if (!session || !email) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    const otp_code = await createOTP(event, email, OTPPurpose.ACCOUNT_LINKING)

    const nitroApp = useNitroApp()
    const mailer = nitroApp.mailer
    await mailer.sendVerificationEmail('evan.connor.kelly@gmail.com', otp_code)

    setResponseStatus(event, 201, 'Created')
})