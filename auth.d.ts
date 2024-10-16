declare module '#auth-utils' {
    interface User {
        email?: string;
        password?: string;
        google?: string;
    }
  
    interface UserSession {
        extended?: any;
        loggedInAt: number;
        secure?: Record<string, unknown>;
    }
}
  
export {}