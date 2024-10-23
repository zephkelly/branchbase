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