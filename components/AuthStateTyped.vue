<template>
    <slot
        v-if="ready"
        v-bind="{ loggedIn, user: typedUser, session, clear, registered }"
    />
    <slot
        v-else
        name="loading"
    />
</template>

<script setup lang="ts">
import { type RegisteredUser, type UnregisteredUser, isRegisteredUser } from '~/types/auth';
import { useUserSession } from '#imports'

const { loggedIn, user, session, clear, ready } = useUserSession()

const registered = computed(() => loggedIn.value && isRegisteredUser(user.value))

const typedUser = computed(() => {
    if (!user.value) return null
    return isRegisteredUser(user.value) 
        ? user.value as RegisteredUser 
        : user.value as UnregisteredUser
})
</script>