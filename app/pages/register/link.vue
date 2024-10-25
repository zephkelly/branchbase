<template>
    <div class="page wrapper-container">
        <h1>Register</h1>
        <a href="/register?nolink=true">Actually i dont want to link</a>
    </div>
</template>

<script setup lang="ts">
import { type LinkableUsersInfo } from '~~/types/auth';

const { session } = useAuthState()
const linkableUsersData = await session.value.linkable_data as LinkableUsersInfo;

onBeforeMount(() => {
    if (!session.value.user || !linkableUsersData) {
        navigateTo('/register');
    }
})
</script>