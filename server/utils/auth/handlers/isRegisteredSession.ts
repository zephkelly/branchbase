import { H3Event } from 'h3';
import { isRegisteredUser } from '~~/types/auth/user/session/registered';

export async function isRegisteredSession(event: H3Event): Promise<void> {
    const session = await getUserSession(event)

    if (!session) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    if (isRegisteredUser(session.user) === false) {
        throw createError({
            statusCode: 403,
            message: 'Forbidden'
        })
    }
}