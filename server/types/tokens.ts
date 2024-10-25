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