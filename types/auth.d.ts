import { UserData, RegisteredUser, UnregisteredUser, UserSessionData, SecureSessionDataType, SecureSessionData, LinkableData, SecureLinkableData, type UserData } from './user';

declare module '#auth-utils' {
    interface User extends UserData {}

    interface UserSession extends UserSessionData {}

    interface SecureSessionData extends SecureSessionDataType {}
}

export {};