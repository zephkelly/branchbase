import { UserSession } from "#auth-utils"

export default defineNitroPlugin(() => {
    sessionHooks.hook('fetch', async (session: UserSession) => {
        
    })

    sessionHooks.hook('clear', async (_session: UserSession) => {
        
    })
})