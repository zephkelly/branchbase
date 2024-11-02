import { Provider } from "~~/types/auth/user/providers";

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


// Kept on backend during linkable unregistered session
export interface SecureUnregisteredSessionData {
    provider_verified: boolean;
    provider_email: string;
}
export interface SecureUnregisteredLinkableSessionData extends SecureUnregisteredSessionData {
    linkable_data: LinkableUserProviderData[];
}


// Guard functions
export function isUnregisteredUser(user: any): user is UnregisteredUser {
    return user.id === null;
}