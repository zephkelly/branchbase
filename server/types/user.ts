import type { SecureRegisteredUser } from '../../types/user';
import type { DatabaseError, ValidationError } from './error'

export type UserCreationError = DatabaseError | ValidationError;

export interface UserCreationSuccess {
    type: 'SUCCESS';
    data: SecureRegisteredUser;
}

export type UserCreationResponse = UserCreationError | UserCreationSuccess;