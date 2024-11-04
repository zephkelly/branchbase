import { Provider } from "../../providers";
import { type SecureSessionData } from "~~/types/auth/user/session/secure";
import { type UnregisteredUser, type UnregisteredLinkableData, type SecureUnregisteredLinkableSessionData, type VerifiedUnregisteredLinkableData } from "~~/types/auth/user/session/unregistered";

// Standard unregistered oauth session
export interface UnregisteredOAuthSession {
    user: UnregisteredUser;
    secure: SecureSessionData;
    logged_in_at: number;
}

// Unregistered oauth session with linkable data
export interface UnregisteredOAuthLinkableSession {
    user: UnregisteredUser;
    secure: SecureUnregisteredLinkableSessionData;
    linkable_data: UnregisteredLinkableData;
    logged_in_at: number;
}

// Verified unregistered oauth session with extra linkable data
export interface VerifiedUnregisteredOAuthLinkableSession {
    user: UnregisteredUser;
    secure: SecureUnregisteredLinkableSessionData;
    linkable_data: VerifiedUnregisteredLinkableData;
    logged_in_at: number;
}


// Guard functions
export function isUnregisteredOAuthSession(session: any): session is UnregisteredOAuthSession {
    return session.user.id === null && session.user.provider_id !== null && session.user.provider !== Provider.Credentials;
}