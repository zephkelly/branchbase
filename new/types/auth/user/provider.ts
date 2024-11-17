export enum Provider {
    Google = 'google',
    GitHub = 'github',
    Discord = 'discord',
    Credentials = 'credentials'
}

export interface ProviderData {
    provider: Provider;
    provider_id: string;
    provider_email: string;
    provider_verified: boolean;
}