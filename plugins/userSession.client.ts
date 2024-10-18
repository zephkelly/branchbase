export default defineNuxtPlugin(async (nuxtApp) => {
    const userSession = await useUserSession()

    if (userSession.user.value && userSession.user.value.registered !== false) {
        console.log('User is logged in and fully registered. Skipping registration checks.')
        return
    }

    console.log('Try to show complete registration / signup modals');
    const { createUserRegistration } = await import('@/utils/useUserRegistration')
    const userRegistration = createUserRegistration()

    // Check registration status
    userRegistration.checkRegistrationStatus()
});