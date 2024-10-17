import { UserSession } from "#auth-utils"

export default defineNitroPlugin(() => {
    sessionHooks.hook('fetch', async (session: UserSession) => {
        session.extended = {
            fromHooks: true,
        }

        Object.defineProperty(session, 'isRegistered', {
            get: async function () {
                if (this.user && this.user.email) {
                    return await userExists(this.user.email)
                }
                return false
            }
        })
    })

    sessionHooks.hook('clear', async (_session: UserSession) => {
        console.log('User logged out')
    })
})