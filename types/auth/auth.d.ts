// import { UserData, RegisteredUser, UnregisteredUser, UserSessionData, SecureSessionDataType, SecureSessionData, LinkableData, SecureLinkableData, type UserData } from './user';
import type { SecureUnregisteredCredSessionData, UnregisteredCredLinkableSession, UnregisteredCredSession, VerifiedUnregisteredCredLinkableSession } from "./user/session/credentials/unregistered";
import type { UnregisteredOAuthLinkableSession, UnregisteredOAuthSession, VerifiedUnregisteredOAuthLinkableSession } from "./user/session/oauth/unregistered";
import { type RegisteredUser } from "./user/session/registered";
import { type SecureUnregisteredLinkableSessionData, type SecureUnregisteredSessionData, type UnregisteredUser } from "./user/session/unregistered";

type MergedUser = RegisteredUser | UnregisteredUser;

type MergedOAuthSession = UnregisteredOAuthSession | UnregisteredOAuthLinkableSession | VerifiedUnregisteredOAuthLinkableSession;
type MergedCredSession = UnregisteredCredSession | UnregisteredCredLinkableSession | VerifiedUnregisteredCredLinkableSession
type MergedUserSession = MergedCredSession | MergedOAuthSession;

type MergedSecureSessionData = SecureUnregisteredCredSessionData | SecureUnregisteredSessionData | SecureUnregisteredLinkableSessionData;

declare module '#auth-utils' {
    interface User extends MergedUser {}

    interface UserSession extends MergedUserSession {}

    interface SecureSessionData extends MergedSecureSessionData {}
}

export {};