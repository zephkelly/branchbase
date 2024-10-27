import type { SecureRegisteredUser } from '../../types/user';
import type { DatabaseError, ValidationError } from './error'

export type UserProviderCreationError = DatabaseError | ValidationError;

export interface UserProviderCreationSuccess {
    type: 'SUCCESS';
    data: SecureRegisteredUser;
}

export type UserProviderCreationResponse = UserProviderCreationError | UserProviderCreationSuccess;