export enum TokenType {
    OTP = 'otp',
    ACCESS_TOKEN = 'access_token',
    VERIFICATION_LINK = 'verification_link'
}

// Token purpose enumeration
export enum TokenPurpose {
    PROVIDER_LINK = 'provider_link',
    EMAIL_VERIFICATION = 'email_verification',
    PASSWORD_RESET = 'password_reset',
}

// Database record type
export interface AuthToken {
    id: number;
    user_id: number;
    token_type: TokenType;
    token: string;
    purpose: TokenPurpose;
    provider: string | null;
    provider_email: string | null;
    expires_at: Date;
    used_at: Date | null;
    created_at: Date;
    metadata: Record<string, unknown>;
}

// Input type for creating new tokens
export interface CreateAuthTokenInput {
    user_id: number;
    token_type: TokenType;
    token: string;
    purpose: TokenPurpose;
    provider?: string;
    provider_email?: string;
    expires_at: Date;
    metadata?: Record<string, unknown>;
}