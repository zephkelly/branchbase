import { computed } from 'vue'
import { useUserSession } from '#imports'
import { isRegisteredUser, type RegisteredUser, type UnregisteredUser } from '~~/types/user'

export function useAuthState() {
    const { loggedIn, user, clear, ready, session, fetch } = useUserSession()

    // Strongly typed user
    const typedUser = computed(() => {
        if (!user.value) return null
        return isRegisteredUser(user.value)
            ? user.value as RegisteredUser
            : user.value as UnregisteredUser
    })

    // Check if user is registered
    const registered = computed(() =>
        loggedIn.value && isRegisteredUser(user.value)
    )

    const error = computed(() =>
        loggedIn.value && !user.value || loggedIn.value && !session.value
    )

    return {
        loggedIn,
        user: typedUser,
        ready,
        session,
        registered,
        error,
        clearSession: clear,
        getNewSession: fetch
    }
}