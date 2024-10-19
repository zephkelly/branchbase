import { type UserData, type UserSessionData, type SecureSessionDataType } from './auth';

declare module '#auth-utils' {
    interface User extends UserData {}
    interface UserSession extends UserSessionData {}
    interface SecureSessionData extends SecureSessionDataType {}
}

export { }