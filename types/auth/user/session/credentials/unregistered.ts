import { type UnregisteredUser, type UnregisteredLinkableData, type VerifiedUnregisteredLinkableData } from "~~/types/auth/user/session/unregistered";
import { type SecureSessionData } from "~~/types/auth/user/session/secure";

// Unregistered cred user types

// Unregistered cred user type
export interface UnregisteredCredUser extends Omit<UnregisteredUser, "provider_id"> {
}

// Secure unregistered cred session data
export interface SecureUnregisteredCredSessionData extends SecureSessionData {
    password_hash: string;
}

// Standard unregistered cred session
export interface UnregisteredCredSession {
    user: UnregisteredCredUser;
    secure: SecureUnregisteredCredSessionData;
    logged_in_at: number;
    confirmed_password: boolean;
}

// Unregistered cred session with linkable data
export interface UnregisteredCredLinkableSession {
    user: UnregisteredCredUser;
    secure: SecureUnregisteredCredSessionData;
    linkable_data: UnregisteredLinkableData;
    logged_in_at: number;
}

// Verified unregistered cred session with extra linkable data
export interface VerifiedUnregisteredCredLinkableSession {
    user: UnregisteredCredUser & { confirmed_password: true };
    secure: SecureUnregisteredCredSessionData;
    linkable_data: VerifiedUnregisteredLinkableData;
    logged_in_at: number;
}


// Guard functions
export function isUnregisteredCredUser(user: any): user is UnregisteredCredUser {
    return user.id === null;
}