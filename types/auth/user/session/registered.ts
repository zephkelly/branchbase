import { Provider } from "~~/types/auth/user/providers";

export interface RegisteredUser {
    id: number;
    username: string;
    provider_id: string | null;
    picture: string;
    provider: Provider;
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