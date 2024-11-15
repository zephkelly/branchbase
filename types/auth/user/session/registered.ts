import { Provider } from "~~/types/auth/user/providers";
import { UUIDv7 } from "~~/server/types/uuidv7";
import { type SecureSessionData } from "~~/types/auth/user/session/secure";

export interface RegisteredUser {
    id: string;
    username: string;
    provider_id: string | null;
    picture: string;
    provider: Provider;
}

export interface RegisteredSession {
    user: RegisteredUser;
    secure: SecureSessionData & { current_session_version: string };
    logged_in_at: number;
}

// Guard functions
export function isRegisteredUser(user: any): user is RegisteredUser {
    if (user === null || user === undefined) {
        return false;
    }
    
    if (user.id === null) {
        return false;
    }

    return true;
}