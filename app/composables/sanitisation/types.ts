export type SanitiserConfig = {
    trim?: boolean;
    lowercase?: boolean;
    uppercase?: boolean;
    removeSpaces?: boolean;
    removeSpecialChars?: boolean;
    maxLength?: number;
    toNumber?: boolean;
    toInteger?: boolean;
    roundTo?: number;
    min?: number;
    max?: number;
};
  
export type ArraySanitiserConfig = {
    unique?: boolean;
    sort?: boolean;
    maxItems?: number;
};
  
export type SanitiseResult<T> = {
    value: T;
    modified: boolean;
    modifications: string[];
};