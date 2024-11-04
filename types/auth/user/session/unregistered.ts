import { Provider } from "~~/types/auth/user/providers";
import { type SecureSessionData } from "~~/types/auth/user/session/secure";

export interface UnregisteredUser {
    id: null;
    username: null;
    provider_email: string;
    provider_verified: boolean;
    provider_id: string;
    picture: string;
    provider: Provider;
}

export interface LinkableUserProviderData {
    username: number;
    picture: string;
    user_id: number;
    providers: Array<{
        provider: Provider;
        provider_id: string;
    }>;
}

// Sent to frontend after verifying OTP
export interface UnregisteredLinkableData {
    provider_email: string;
    existing_users_count: number;
}

export interface VerifiedUnregisteredLinkableData extends UnregisteredLinkableData {
    linkable_data: LinkableUserProviderData[];
}

export interface SecureUnregisteredLinkableSessionData extends SecureSessionData {
    linkable_data: LinkableUserProviderData[];
}

// Guard functions
export function isUnregisteredUser(user: any): user is UnregisteredUser {
    if (user === null) {
        return false;
    }

    if (user.id !== undefined || user.id !== null) {
        return false;
    }

    return true;
}