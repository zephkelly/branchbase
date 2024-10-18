import { UnregisteredUser, RegisteredUser, UnregisteredUserSession, RegisteredUserSession } from './auth';

declare module '#auth-utils' {
    export type User = UnregisteredUser | RegisteredUser;

    export type UserSession = UnregisteredUserSession | RegisteredUserSession;
}

export { }