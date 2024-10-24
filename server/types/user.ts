import type { UnregisteredUser, RegisteredUser } from '@/types/auth'
import type { DatabaseError, ValidationError } from '@/server/types/error'

export type UserCreationError = DatabaseError | ValidationError;

export interface UserCreationSuccess {
    type: 'SUCCESS';
    data: RegisteredUser;
}

export type UserCreationResponse = UserCreationError | UserCreationSuccess;