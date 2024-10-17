export const createUserRegistration = () => {
    const optedOutOfModals = ref(false)
    const isRegistrationModalOpen = ref(false)
    const isLoginModalOpen = ref(false)
    let userSession: ReturnType<typeof useUserSession>
    let router: ReturnType<typeof useRouter>

    // Lazy load dependencies
    const initDependencies = async () => {
        if (!userSession) userSession = useUserSession()
        if (!router) router = useRouter()
    }

    const showRegistrationModal = () => {
        isRegistrationModalOpen.value = true
    }

    const hideRegistrationModal = () => {
        isRegistrationModalOpen.value = false
    }

    const showLoginModal = () => {
        isLoginModalOpen.value = true
    }

    const hideLoginModal = () => {
        isLoginModalOpen.value = false
    }

    const cancelLoginModal = async () => {
        hideLoginModal()
        optedOutOfModals.value = true
    }

    const continueRegistration = async () => {
        await initDependencies()
        hideRegistrationModal()
        router.push('/register')
    }

    const cancelRegistration = async () => {
        await initDependencies()
        hideRegistrationModal()
        optedOutOfModals.value = true
        await userSession.clear()
    }

    const checkRegistrationStatus = async () => {
        await initDependencies()
        if (userSession.user.value) {
            if (userSession.user.value.registered === false) {
                console.log('User is not registered. Showing registration modal...')

                if (router.currentRoute.value.path === '/register') {
                    console.log('User is already on the registration page. Skipping modal...')
                    return
                }

                showRegistrationModal()
            }
        } else {
            console.log('User is not logged in. Showing login modal...')
            const delay = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000 // Random delay between 5-10 seconds
            setTimeout(showLoginModal, delay)
        }
    }

    const setupWatcher = async () => {
        await initDependencies()
        watch(() => userSession.user.value, (newUser) => {
            checkRegistrationStatus();
        })
    }

    setupWatcher()

    return {
        isRegistrationModalOpen,
        isLoginModalOpen,
        showRegistrationModal,
        hideRegistrationModal,
        showLoginModal,
        hideLoginModal,
        cancelLoginModal,
        continueRegistration,
        cancelRegistration,
        checkRegistrationStatus,
    }
}