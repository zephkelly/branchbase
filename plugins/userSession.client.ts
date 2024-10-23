import { type User } from '#auth-utils';
import { isRegisteredUser } from '~/types/auth';

export default defineNuxtPlugin(async (nuxtApp) => {
    const userSession = await useUserSession()

    const user = userSession.user.value

    if (user && isRegisteredUser(user as User)) {
        console.log('User logged in, not importing userRegistration')
        return
    }

    console.log('Try to show complete registration / signup modals');
    const { createUserRegistration } = await import('@/utils/useUserRegistration')
    const userRegistration = createUserRegistration()

    userRegistration.checkRegistrationStatus()
});