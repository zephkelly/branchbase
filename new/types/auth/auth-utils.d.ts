declare module '#auth-utils' {
    interface User extends
        IRegisteredUser,
        IUnregisteredUser,
        IUnregisteredCredUser {}

    interface SecureSessionData extends 
        ISecureSessionData,
        ISecureUnregisteredCredSessionData,
        ISecureUnregisteredLinkableSessionData,
        ISecureUnregisteredLinkableCredSessionData {}

    interface UserSession extends 
        IRegisteredSession, 
        IUnregisteredOAuthSession, 
        IUnregisteredOAuthLinkableSession, 
        IVerifiedUnregisteredOAuthLinkableSession, 
        IUnregisteredCredSession, 
        IUnregisteredCredLinkableSession,
        IVerifiedUnregisteredCredLinkableSession {}


    // Linkable user data on sign up
    interface ILinkableUserProviderData {
        username: number;
        picture: string;
        user_id: number;
        providers: Array<{
            provider: Provider;
            provider_id: string;
        }>;
    }

    // Sent to frontend after verifying OTP
    interface IUnregisteredLinkableData {
        provider_email: string;
        existing_users_count: number;
    }

    interface IVerifiedUnregisteredLinkableData extends IUnregisteredLinkableData {
        linkable_users: ILinkableUserProviderData[];
    }

    interface ISecureUnregisteredLinkableSessionData extends ISecureSessionData {
        linkable_users: ILinkableUserProviderData[];
    }


    
    // Registered types
    interface IRegisteredUser {
        id: string;
        username: string;
        provider_id: string | null;
        picture: string;
        provider: Provider;
    }

    interface ISecureSessionData {
        provider_verified: boolean;
        provider_email: string;
    }

    export interface IRegisteredSession {
        user: IRegisteredUser;
        secure: ISecureSessionData & { current_session_version: string };
        logged_in_at: number;
    }
    


    // Unregistered types
    // -------- Oauth
    interface IUnregisteredUser {
        id: null;
        username: null;
        provider_email: string;
        provider_verified: boolean;
        provider_id: string;
        picture: string;
        provider: Provider;
    }

    interface IUnregisteredOAuthSession {
        user: IUnregisteredUser;
        secure: ISecureSessionData;
        logged_in_at: number;
    }
    
    interface IUnregisteredOAuthLinkableSession {
        user: IUnregisteredUser;
        secure: ISecureUnregisteredLinkableSessionData;
        linkable_data: IUnregisteredLinkableData;
        logged_in_at: number;
    }
    
    interface IVerifiedUnregisteredOAuthLinkableSession {
        user: IUnregisteredUser;
        secure: ISecureUnregisteredLinkableSessionData;
        linkable_data: IVerifiedUnregisteredLinkableData;
        logged_in_at: number;
    }



    // --------- Creds
    interface IUnregisteredCredUser extends Omit<IUnregisteredUser, "provider_id"> {}

    interface ISecureUnregisteredCredSessionData extends ISecureSessionData {
        password_hash: string;
    }

    interface ISecureUnregisteredLinkableCredSessionData extends ISecureUnregisteredCredSessionData {
        linkable_users: LinkableUserProviderData[];
    }

    interface IUnregisteredCredSession {
        user: IUnregisteredCredUser;
        secure: ISecureUnregisteredCredSessionData;
        confirmed_password: boolean;
        logged_in_at: number;
    }

    interface IUnregisteredCredLinkableSession extends IUnregisteredCredSession {
        secure: ISecureUnregisteredLinkableCredSessionData
        linkable_data: IUnregisteredLinkableData;
    }

    interface IVerifiedUnregisteredCredLinkableSession extends IUnregisteredCredSession {
        secure: ISecureUnregisteredLinkableCredSessionData;
        linkable_data: IVerifiedUnregisteredLinkableData;
    }
}

export {};