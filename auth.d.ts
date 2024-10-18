declare module '#auth-utils' {
    export type Provider = 'google' | 'github' | 'credentials';

    interface User {
        email: string;
        provider: Provider;
        display_name?: string;
        picture?: string;
        registered?: boolean;
    }

    interface UserSession {
        loggedInAt: number;
        extended?: any;
        secure?: Record<string, unknown>;
    }
}

export { }