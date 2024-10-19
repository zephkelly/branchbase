export enum Provider {
    Google = 'google',
    GitHub = 'github',
    Credentials = 'credentials'
  }

export enum VerificationStatus {
    Pending = 'pending',
    Unverified = 'unverified',
    VerifiedBasic = 'verified_basic',
    VerifiedTrusted = 'verified_trusted',
    Rejected = 'rejected'
}

export interface BaseUser {
    picture: string;
    provider: Provider;
}
  
export interface RegisteredUser extends BaseUser {
    id: string;
    display_name: string;
    email: string;
}

export interface UnregisteredUser extends BaseUser {
    id: null;
    display_name: null;
    email: string;
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
import { type User } from '#auth-utils';

export function isRegisteredUser(user: User | null): user is RegisteredUser {
    if (user === null) {
        return false;
    }
    return (user as RegisteredUser).id !== null;
}

export function isUnregisteredUser(user: User | null): user is UnregisteredUser {
    if (user === null) {
        return false;
    }
    return (user as RegisteredUser).id === null;
}