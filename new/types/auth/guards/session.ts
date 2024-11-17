import type { UserSession } from "#auth-utils";

export function isUnregisteredSession(session: UserSession): boolean {
    if (!session.secure) {
        return false;
    }

    if (session.secure.provider_verified === null) {
        return false;
    }

    if (session.secure.provider_verified === true) {
        return false;
    }

    return true;
}

export function isRegisteredSession(session: UserSession): boolean {
    if (!session.secure) {
        return false;
    }

    if (session.secure.provider_verified === null) {
        return false;
    }

    if (session.secure.provider_verified === false) {
        return false;
    }

    return true;
}