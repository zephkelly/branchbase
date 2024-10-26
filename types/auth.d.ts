import { UserData, RegisteredUser, UnregisteredUser, type UserSessionData, SecureSessionData, LinkableData, SecureLinkableData, type UserData } from './user';

declare module '#auth-utils' {
    interface User extends UserData {}

    interface UserSession {
        user: RegisteredUser | UnregisteredUser;
        secure: SecureSessionData;
        linkable_data?: LinkableData;
        loggedInAt: number;
    }

    interface SecureSessionData {
        provider_verified: boolean | null;
        provider_email: string | null;
        linkable_data?: SecureLinkableData;
    }
}

export {};