// import type { SecureRegisteredUser } from '../../types/user';
import type { DatabaseError, ValidationError } from './error'

import { RegisteredUser } from '~~/types/auth/user/session/registered';
import { SecureSessionData } from '~~/types/auth/user/session/secure';

export type UserCreationError = DatabaseError | ValidationError;

export interface UserCreationSuccess {
    type: 'SUCCESS';
    data: RegisteredUser & SecureSessionData;
}

export type UserCreationResponse = UserCreationError | UserCreationSuccess;