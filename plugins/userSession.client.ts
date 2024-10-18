import { type User } from '#auth-utils';
import { isRegisteredUser } from '~/types/auth';

export default defineNuxtPlugin(async (nuxtApp) => {
    const userSession = await useUserSession()

    const user = userSession.user.value

    if (isRegisteredUser(user as User)) {
        console.log('User is logged in and fully registered. Skipping registration checks.')
        return
    }

    console.log('Try to show complete registration / signup modals');
    const { createUserRegistration } = await import('@/utils/useUserRegistration')
    const userRegistration = createUserRegistration()

    userRegistration.checkRegistrationStatus()
});