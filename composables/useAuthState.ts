import { computed } from 'vue'
import { useUserSession } from '#imports'
import { isRegisteredUser, type RegisteredUser, type UnregisteredUser  } from '@/types/auth'

export function useAuthState() {
    const { loggedIn, user, clear, ready, session } = useUserSession()

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
        clear,
        ready,
        session,
        registered,
        error
    }
}