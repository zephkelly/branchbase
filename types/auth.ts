import { type User } from '#auth-utils';

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
    // email?: string;
    provider_id?: number;
    verification_status: VerificationStatus;
}

export interface UnregisteredUser extends BaseUser {
    id: null;
    username: string | null;
    primary_email: string;
    provider_id: number | null;
    provider_verified: boolean;
}

export type BackendUser = RegisteredUser | UnregisteredUser;

export interface UserSessionData {
    loggedInAt: number;
    user: BackendUser;
    secure: Record<string, unknown>;
}

export interface SecureSessionDataType {
    expires_in: number;
    access_token: string;
    refresh_token: string;
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