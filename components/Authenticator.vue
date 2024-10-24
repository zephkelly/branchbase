<template>
    <template v-if="ready">
        <slot
            v-bind="bindings"
            name="shared"
        />
        <slot
            v-if="registered"
            v-bind="bindings"
            name="default"
        />
        <slot
            v-else-if="loggedIn && !registered"
            v-bind="bindings"
            name="unregistered"
        />
        <slot
            v-else
            v-bind="bindings"
            name="public"
        />
    </template>
    <slot
        v-else
        name="loading"
    />
</template>

<script setup lang="ts">
const state = useAuthState()
const { ready, registered, loggedIn } = state

const bindings = computed(() => ({
    ...state,
    user: state.user.value
}))
</script>