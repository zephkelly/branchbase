export default defineNuxtRouteMiddleware(async (to) => {
    const userSession = await useUserSession()

    if (userSession.user?.value?.registered === false && to.path !== '/register') {
        console.log('User is not registered, redirecting to /register')
        return navigateTo('/register')
    }
})