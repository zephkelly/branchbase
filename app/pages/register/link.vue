<template>
    <div class="page wrapper-container">
        <Authenticator>
            <template #unregistered="{ user, session }">
                <h1>Register</h1>
                <a href="/register?nolink=true">Actually i dont want to link</a>
                <div class="linkable-users">
                    <h2>Linkable Users</h2>
                    <p>{{ session.value?.linkable_data }}</p>
                    <form @submit.prevent="linkProvider">
                        <button type="submit">Link</button>
                    </form>
                </div>
            </template>
        </Authenticator>
    </div>
</template>

<script setup lang="ts">
import { type LinkableData } from '~~/types/user';

const { fetch: getNewSession } = useUserSession()
const { session, user } = useAuthState()
const linkableUsersData = await session.value.linkable_data as LinkableData;

const router = useRouter()

const linkProvider = async () => {
    try {
        const response = await fetch('/api/auth/register/link', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error('Linking failed')
        }

        await getNewSession()

        router.push('/')
    }
    catch (error) {
        console.error('Error during registration:', error)
    }
}

onBeforeMount(() => {
    if (!session.value.user || !linkableUsersData) {
        navigateTo('/register');
    }
})
</script>