import { type UnregisteredUser, type UnregisteredLinkableData, type LinkableUserProviderData } from "~~/types/auth/user/session/unregistered";
import { type SecureSessionData } from "~~/types/auth/user/session/secure";

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
    linkable_data: LinkableUserProviderData[];
}


// Guard functions
export function isUnregisteredCredUser(user: any): user is UnregisteredCredUser {
    return user.id === null;
}