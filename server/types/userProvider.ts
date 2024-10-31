import { Provider } from '~~/types/user'
import type { SecureRegisteredUser } from '../../types/user';
import type { DatabaseError, ValidationError } from './error'

export type UserProviderCreationError = DatabaseError | ValidationError;

export interface UserProviderCreationSuccess {
    type: 'SUCCESS';
    data: SecureRegisteredUser;
}

export type UserProviderCreationResponse = UserProviderCreationError | UserProviderCreationSuccess;

export interface ProviderData {
    provider: Provider
    provider_id: string
    provider_email: string
    provider_verified: boolean
    picture: string
}