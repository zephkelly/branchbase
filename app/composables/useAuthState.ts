import { computed } from 'vue'

import { isRegisteredUser, type RegisteredUser } from '~~/types/auth/user/session/registered'
import { type UnregisteredUser } from '~~/types/auth/user/session/unregistered'

export function useAuthState() {
    const { loggedIn, user, clear, ready, session, fetch } = useUserSession()

    const typedUser = computed(() => {
        if (!user.value) return null
        return isRegisteredUser(user.value)
            ? user.value as RegisteredUser
            : user.value as UnregisteredUser
    })

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