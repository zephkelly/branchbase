import { verifyConnection } from '~~/server/utils/mailer'

export default defineNitroPlugin(async () => {
    try {
        await verifyConnection()
    } catch (err) {
        console.error('Mail server initialization failed:', err)
        throw err
    }
})