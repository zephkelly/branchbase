export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // Get and validate session first
    const session = await getUserSession(event)
    if (!session?.user) {
        return createError({
            statusCode: 403,
            statusMessage: 'You have not initiated the registration process properly'
        })
    }
})