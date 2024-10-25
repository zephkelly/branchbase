import type { RegisteredUser } from '../../types/user';
import type { DatabaseError, ValidationError } from './error'

export type UserCreationError = DatabaseError | ValidationError;

export interface UserCreationSuccess {
    type: 'SUCCESS';
    data: RegisteredUser;
}

export type UserCreationResponse = UserCreationError | UserCreationSuccess;