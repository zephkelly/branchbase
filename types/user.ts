// import { type User } from '#auth-utils'

// Base user data on session
// export interface UserData {
//     id: number | null;
//     provider_id: string | null;
//     username: string | null;
//     picture: string;
//     provider: Provider;
// }

// Registered user types
// Frontend types (accessible in the frontend)
// export interface RegisteredUser extends UserData {
//     id: number;
//     username: string;
// }

// Backend types (if you have to use this in any front end code, you're doing it wrong!)
// export interface SecureRegisteredUser extends RegisteredUser {
//     provider_verified: boolean;
//     provider_email: string;
//     password_hash?: string;
// }

// Unregistered user types
// Frontend types
// export interface UnregisteredUser extends UserData {
//     id: null;
//     username: null;
//     provider_email: string;
//     provider_verified: boolean;
// }

// // Backend types
// export interface SecureUnregisteredUser extends UnregisteredUser {
//     provider_verified: boolean;
// }

// Session type
// export interface UserSessionData {
//     loggedInAt: number;
//     user: RegisteredUser | UnregisteredUser;
//     secure: SecureSession;
//     linkable_data?: LinkableData | VerifiedLinkableData;
//     confirmed_password?: boolean;
// }


// export interface LinkableUserProviderData {
//     username: number;
//     picture: string;
//     user_id: number;
//     providers: Array<{
//         provider: Provider;
//         provider_id: string;
//     }>;
// }

// This is initially sent to the client before verifying the OTP
// export interface LinkableData {
//     provider_email: string;
//     existing_users_count: number;
// }

// We send extra information to the client after verifying OTP
// export interface VerifiedLinkableData extends LinkableData {
//     linkable_providers: LinkableUserProviderData[];
// }

// // Normal secure user session
// export interface SecureSession {
//     provider_verified: boolean | null;
//     provider_email: string | null;
//     linkable_data?: LinkableUserProviderData[];
//     password_hash?: string;
// }

// export type SecureSessionDataType = SecureSession;

// Type guard functions
// export function isRegisteredUser(user: User | null | undefined): user is RegisteredUser {
//     if (user === null || user === undefined) {
//         return false;
//     }
//     return (user as RegisteredUser).id !== null;
// }

// export function isUnregisteredUser(user: User | null | undefined): user is UnregisteredUser {
//     if (user === null || user === undefined) {
//         return false;
//     }
//     return (user as RegisteredUser).id === null;
// }