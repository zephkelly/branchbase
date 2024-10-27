export enum ErrorType {
    DATABASE_ERROR = 'DATABASE_ERROR',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export interface DatabaseError {
    type: ErrorType.DATABASE_ERROR;
    message: string;
    statusCode: number;
  }
  
export interface ValidationError {
    type: ErrorType.VALIDATION_ERROR;
    field: string;
    message: string;
    statusCode: number;
}

export interface PostgresError extends Error {
    code: string;
    constraint?: string;
    detail?: string;
    schema?: string;
    table?: string;
    column?: string;
}

export function isDatabaseError(error: any): error is DatabaseError {
    return (error as DatabaseError).type === 'DATABASE_ERROR';
}

export function isValidationError(error: any): error is ValidationError {
    return (error as ValidationError).type === 'VALIDATION_ERROR';
}