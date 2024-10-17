declare module '#auth-utils' {
    interface User {
        email?: string;
    }
  
    interface UserSession {
        extended?: any;
        loggedInAt: number;
        secure?: Record<string, unknown>;
    }
}
  
export {}