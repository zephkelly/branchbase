import type { DatabaseError, ValidationError } from './error'

import { Provider } from '~~/types/auth/user/providers';
import { RegisteredUser } from '~~/types/auth/user/session/registered';
import { SecureSessionData } from '~~/types/auth/user/session/secure';

export type UserProviderCreationError = DatabaseError | ValidationError;

export interface UserProviderCreationSuccess {
    type: 'SUCCESS';
    data: RegisteredUser & SecureSessionData;
}

export type UserProviderCreationResponse = UserProviderCreationError | UserProviderCreationSuccess;

export interface ProviderData {
    provider: Provider
    provider_id: string
    provider_email: string
    provider_verified: boolean
    picture: string
}