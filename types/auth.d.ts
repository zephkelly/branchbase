import { BaseUser, UserSessionData, SecureSessionDataType } from './auth';

declare module '#auth-utils' {
    type User = BaseUser;
    interface UserSession extends UserSessionData {}
    interface SecureSessionData {
        auth: SecureSessionDataType;
    }
}

export { };