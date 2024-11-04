import { type UnregisteredUser, type UnregisteredLinkableData, type LinkableUserProviderData, type VerifiedUnregisteredLinkableData } from "~~/types/auth/user/session/unregistered";
import { type SecureSessionData } from "~~/types/auth/user/session/secure";
import { Provider } from "../../providers";

// Unregistered cred user types

// Unregistered cred user type
export interface UnregisteredCredUser extends Omit<UnregisteredUser, "provider_id"> {
}

// Secure unregistered cred session data
export interface SecureUnregisteredCredSessionData extends SecureSessionData {
    password_hash: string;
}

export interface SecureUnregisteredLinkableCredSessionData extends SecureUnregisteredCredSessionData {
    linkable_users: LinkableUserProviderData[];
}

// Standard unregistered cred session
export interface UnregisteredCredSession {
    user: UnregisteredCredUser;
    secure: SecureUnregisteredCredSessionData;
    confirmed_password: boolean;
    logged_in_at: number;
}

// Unregistered cred session with linkable data
export interface UnregisteredCredLinkableSession extends UnregisteredCredSession {
    secure: SecureUnregisteredLinkableCredSessionData
    linkable_data: UnregisteredLinkableData;
}

// Verified unregistered cred session with extra linkable data
export interface VerifiedUnregisteredCredLinkableSession extends UnregisteredCredSession {
    secure: SecureUnregisteredLinkableCredSessionData;
    linkable_data: VerifiedUnregisteredLinkableData;
}


// Guard functions
export function isUnregisteredCredSession(session: any): session is UnregisteredCredSession {
    return session.user.id === null && session.user.provider_id !== null && session.user.provider === Provider.Credentials;
}