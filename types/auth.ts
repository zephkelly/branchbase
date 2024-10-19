import { type User } from '#auth-utils';

export type Provider = 'google' | 'github' | 'credentials';

export enum VerificationStatusEnum {
    Pending = 'pending',
    Unverified = 'unverified',
    VerifiedBasic = 'verified_basic',
    VerifiedTrusted = 'verified_trusted',
    Rejected = 'rejected'
}

export type VerificationStatus = VerificationStatusEnum;

export interface UserSessionData {
    loggedInAt: number;
    user: UserData;
    secure: Record<string, unknown>;
}

export interface UserData {
    // Store email instead of id for unregistered users
    email?: string;
    //Registered Users will have:
    id: string | null;              //  << Null for unregistered users
    display_name: string | null;    //  << "                         "
    picture: string;
    provider: Provider;
}

// For stricter type checking, we can use the following interfaces
export interface RegisteredUser extends Omit<UserData, 'email' | 'id' | 'display_name'> {
    id: string;
    display_name: string;
}

export interface UnregisteredUser extends Omit<UserData, 'id' | 'display_name'> {
    id: null;
    display_name: null;
    email: string;
}

export interface SecureSessionDataType {
    expires_in: number;
    access_token: string;
    refresh_token: string;
    verification_status: VerificationStatus;
}

// Type guard functions
export function isRegisteredUser(user: UserData | User): user is RegisteredUser {
    //@ts-expect-error
    return user.id !== null;
}

export function isUnregisteredUser(user: UserData | User): user is UnregisteredUser {
    //@ts-expect-error
    return user.id === null;
}