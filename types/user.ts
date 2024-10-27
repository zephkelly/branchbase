import { type User } from '#auth-utils'

// User types
export enum Provider {
    Google = 'google',
    GitHub = 'github',
    Discord = 'discord',
    Credentials = 'credentials'
}

export enum VerificationStatus {
    Unverified = 'unverified',
    Pending = 'pending',
    VerifiedBasic = 'verified_basic',
    VerifiedTrusted = 'verified_trusted',
    Rejected = 'rejected'
}

// Base user data on session
export interface UserData {
    id: number | null;
    provider_id: string | null;
    username: string | null;
    picture: string;
    provider: Provider;
}

// Registered user types
// Frontend types (accessible in the frontend)
export interface RegisteredUser extends UserData {
    id: number;
    username: string;
}

// Backend types (if you have to use this in any front end code, you're doing it wrong!)
export interface SecureRegisteredUser extends RegisteredUser {
    provider_verified: boolean;
    provider_email: string;
}

// Unregistered user types
// Frontend types
export interface UnregisteredUser extends UserData {
    id: null;
    username: null;
    provider_email: string;
}

// Backend types
export interface SecureUnregisteredUser extends UnregisteredUser {
    provider_verified: boolean;
}

// Session type
export interface UserSessionData {
    loggedInAt: number;
    user: RegisteredUser | UnregisteredUser;
    secure: Record<string, unknown>;
    linkable_data?: LinkableData;
}

// Normal secure user session
export interface SecureNormalSessionDataType {
    // expires_in?: number;
    // access_token?: string;
    // refresh_token?: string;
    provider_verified: boolean | null;
    provider_email: string | null;
}

// Used for temporary user sessions that are in the process of linking accounts
export interface SecureLinkableSessionDataType extends SecureNormalSessionDataType {
    linkable_data: SecureLinkableData;
}

export type SecureSessionDataType = SecureNormalSessionDataType | SecureLinkableSessionDataType;

export interface SecureUserProviderData {
    user_id: number;
    providers: Array<{
        provider: Provider;
        provider_id: string;
    }>;
}

export interface LinkableData {
    provider_email: string;
    existing_providers_number: number;
}

export interface SecureLinkableData {
    linkable_providers: SecureUserProviderData;
}

// Type guard functions
export function isRegisteredUser(user: User | null | undefined): user is RegisteredUser {
    if (user === null || user === undefined) {
        return false;
    }
    return (user as RegisteredUser).id !== null;
}

export function isUnregisteredUser(user: User | null | undefined): user is UnregisteredUser {
    if (user === null || user === undefined) {
        return false;
    }
    return (user as RegisteredUser).id === null;
}