import { Provider } from "~~/types/auth/user/providers";
import { type SecureSessionData } from "~~/types/auth/user/session/secure";

export interface RegisteredUser {
    id: number;
    username: string;
    provider_id: string | null;
    picture: string;
    provider: Provider;
}

export interface RegisteredSession {
    user: RegisteredUser;
    secure: SecureSessionData;
    logged_in_at: number;
}

// Guard functions
export function isRegisteredUser(user: any): user is RegisteredUser {
    if (user === null) {
        return false;
    }
    
    if (user.id === undefined || user.id === null) {
        return false;
    }

    return true;
}