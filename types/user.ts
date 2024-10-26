import { type User } from '#auth-utils'

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

export interface UserData {
    id: number | null;
    provider_id: string | null;
    username: string | null;
    picture: string;
    provider: Provider;
}

export interface RegisteredUser extends UserData {
    id: number;
    username: string;
}

export interface SecureRegisteredUser extends RegisteredUser {
    provider_verified: boolean;
    provider_email: string;
}

export interface UnregisteredUser extends UserData {
    id: null;
    username: null;
}

export interface UserSessionData {
    loggedInAt: number;
    user: RegisteredUser | UnregisteredUser;
    secure: Record<string, unknown>;
}

export interface SecureSessionDataType {
    // expires_in?: number;
    // access_token?: string;
    // refresh_token?: string;
    provider_verified: boolean | null;
    provider_email: string | null;
}

export interface SecureUserProviderData {
    user_id: number;
    providers: Array<{
        provider: Provider;
        provider_id: string;
    }>;
}

export interface LinkableData {
    provider_email: string;
    existing_accounts_number: number;
}

export interface SecureLinkableData {
    linkable_providers: SecureUserProviderData[];
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