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

export interface BaseUser {
    picture: string;
    provider: Provider;
}
  
export interface RegisteredUser extends BaseUser {
    id: number;
    username: string;
    provider_id?: string;
    // Secure session data
    verification_status?: VerificationStatus;
}

export interface UnregisteredUser extends BaseUser {
    id: null;
    username: string | null;
    provider_id: string | null;
    //Secure session data
    provider_verified?: boolean;
    primary_email?: string;
}

export type BackendUser = RegisteredUser | UnregisteredUser;

export interface UserSessionData {
    loggedInAt: number;
    user: BackendUser;
    secure: Record<string, unknown>;
}

export interface SecureSessionDataType {
    expires_in?: number;
    access_token?: string;
    refresh_token?: string;
    provider_verified?: boolean;
    primary_email?: string;
    verification_status: VerificationStatus;
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