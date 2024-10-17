export default defineNuxtPlugin(async (nuxtApp) => {
    const userSession = await useUserSession()

    if (userSession.user && userSession.user && userSession.user.value) {
        if (userSession.user.value.registered === false) {
            console.log('User is not registered')
        }
    }
    else {
        console.log('User is not logged in, show them a popup modal after a few seconds')
    }
});