<template>
    <template v-if="ready">
        <slot
            v-bind="bindings"
            name="shared"
        />
        <template v-if="error">
            <slot
                v-bind="{ error }"
                name="error"
            />
        </template>
        <template v-else>
            <slot
                v-if="registered"
                v-bind="registeredBindings"
                name="default"
            />
            <slot
                v-else-if="loggedIn && !registered"
                v-bind="unregisteredBindings"
                name="unregistered"
            />
            <slot
                v-else
                v-bind="bindings"
                name="public"
            />
        </template>
    </template>
    <slot
        v-else
        name="loading"
    />
</template>

<script setup lang="ts">
import { type UserSession } from '#auth-utils';
import { computed } from 'vue'
import { type RegisteredUser, type UnregisteredUser, isRegisteredUser } from '~~/types/user'

// Base state without user
interface BaseState {
    ready: ComputedRef<boolean>
    registered: ComputedRef<boolean>
    loggedIn: ComputedRef<boolean>
    session: Ref<UserSession | null>
    error: ComputedRef<boolean>
    clearSession: () => void
}

// Auth state includes user
interface AuthState extends BaseState {
    user: ComputedRef<RegisteredUser | UnregisteredUser | null>
    
}

// Slot prop types
interface RegisteredSlotProps extends BaseState {
    user: RegisteredUser
}
interface UnregisteredSlotProps extends BaseState {
    user: UnregisteredUser
}
interface PublicSlotProps extends AuthState {}
const state = useAuthState() as AuthState
const {
    ready,
    registered,
    loggedIn,
    session,
    error,
    clearSession,
    user
} = state

// Base bindings with reactive state
const baseBindings: BaseState = {
    ready,
    registered,
    loggedIn,
    error,
    session,
    clearSession
}

// Type-safe user getters
const registeredUser = computed((): RegisteredUser => {
    if (!user.value || !isRegisteredUser(user.value)) {
        throw new Error('User is not registered')
    }
    return user.value
})
const unregisteredUser = computed((): UnregisteredUser => {
    if (!user.value || isRegisteredUser(user.value)) {
        throw new Error('Invalid unregistered user state')
    }
    return user.value
})

// Bindings for different states
const registeredBindings = computed((): RegisteredSlotProps => ({
    ...baseBindings,
    user: registeredUser.value
}))
const unregisteredBindings = computed((): UnregisteredSlotProps => ({
    ...baseBindings,
    user: unregisteredUser.value
}))
const bindings = computed((): AuthState => ({
    ...baseBindings,
    user
}))

// Define exposed slots for better type safety
defineSlots<{
    default(props: RegisteredSlotProps): any
    unregistered(props: UnregisteredSlotProps): any
    public(props: PublicSlotProps): any
    loading(): any
    error(props: { error: boolean }): any
    shared(props: AuthState): any
}>()
</script>