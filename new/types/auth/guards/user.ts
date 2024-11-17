import type { User } from "#auth-utils";

export function isUnregisteredUser(sessionUser: User): boolean {
    if (sessionUser.id && sessionUser.id !== null) {
        return false;
    }

    return true;
}

export function isRegisteredUser(sessionUser: User): boolean {
    if (sessionUser.id && sessionUser.id === null) {
        return false;
    }

    return true;
}