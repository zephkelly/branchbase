import { BaseUser, UserSessionData, SecureSessionDataType, RegisteredUser, UnregisteredUser } from './auth';

declare module '#auth-utils' {
    interface User extends BaseUser {
        id: string | null;
        display_name: string | null;
        email?: string;
    }
    interface UserSession extends UserSessionData {}
    interface SecureSessionData extends SecureSessionDataType {}
}

export { }