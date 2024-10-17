declare module '#auth-utils' {
    export type Provider = 'google' | 'github' | 'email';

    interface User {
        email: string;
        provider: Provider;
        registered?: boolean;
    }

    interface UserSession {
        loggedInAt: number;
        extended?: any;
        secure?: Record<string, unknown>;
    }
}

export { }