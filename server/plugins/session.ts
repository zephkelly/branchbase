import { UserSession } from "#auth-utils"

export default defineNitroPlugin(() => {
    sessionHooks.hook('fetch', async (session: UserSession) => {
        session.extended = {
            fromHooks: true,
        }
    })

    sessionHooks.hook('clear', async (_session: UserSession) => {
        console.log('User logged out')
    })
})