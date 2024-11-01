import { isRegisteredUser, Provider, UnregisteredUser, LinkableData, LinkableUserProviderData } from "~~/types/user"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const email = body.email
    const password = body.password
    const confirm_password = body.confirm_password

    if (!password || !confirm_password || !email) {
        return createError({
            statusCode: 400,
            statusMessage: 'Invalid or missing credentials'
        })
    }

    if (password !== confirm_password) {
        return createError({
            statusCode: 400,
            statusMessage: 'Passwords do not match'
        })
    }

    // Get and validate session first
    const session = await getUserSession(event)

    if (!session?.user) {
        return createError({
            statusCode: 403,
            statusMessage: 'You have not initiated the registration process properly'
        })
    }

    if (!session.secure?.provider_email) {
        return createError({
            statusCode: 403,
            statusMessage: 'You have not initiated the registration process properly'
        })
    }

    if (email !== session.secure.provider_email) {
        return createError({
            statusCode: 403,
            statusMessage: 'You have not initiated the registration process properly'
        })
    }

    if (isRegisteredUser(session.user)) {
        return createError({
            statusCode: 409,
            statusMessage: 'Already registered'
        })
    }

    if (session.user.provider !== 'credentials' || session.user.provider_id !== null) {
        return createError({
            statusCode: 409,
            statusMessage: 'Invalid provider'
        })
    }

    const userSessionData = session.user as UnregisteredUser
    const secureSessionData = session.secure

    const hasLinkableData:boolean = secureSessionData.linkable_data !== undefined

    if (hasLinkableData) {
        const hashedPassword = await hashPassword(password)

        const temporaryLinkableUser: UnregisteredUser = {
            id: null,
            username: null,
            provider: Provider.Credentials,
            provider_id: null,
            provider_email: email,
            provider_verified: false,
            picture: '',
        }

        const linkableData: LinkableData = {
            provider_email: email,
            existing_users_count: session.linkable_data?.existing_users_count as number,
        }

        await replaceUserSession(event, {
            user: temporaryLinkableUser,
            linkable_data: linkableData,
            confirmed_password: true,
            secure: {
                provider_email: email,
                provider_verified: false,
                linkable_data: session.secure?.linkable_data as LinkableUserProviderData[],
                password_hash: hashedPassword
            },
            loggedInAt: Date.now()
        }, {
            maxAge: 60 * 60 // 1 hour
        })
    }

    setResponseStatus(event, 200)
    return {
        statusCode: 200,
        registered: true
    } 
})