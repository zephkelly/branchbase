/**
 * Represents a single validation rule with a validation function and error message.
 * @interface ValidationRule
 */
export interface ValidationRule {
    /**
     * Function that performs the validation check.
     * @param value - The value to validate
     * @returns A boolean or Promise<boolean> indicating if the value is valid
     */
    validate: (value: any) => boolean | Promise<boolean>
    /**
     * Error message to display when validation fails
     */
    message: string
}

/**
 * Configuration for a single form field.
 * @interface FieldConfig
 * @template T - The type of value this field holds
 */
export interface FieldConfig<T = any> {
    value: T
    /**
     * Array of validation rules to apply to this field
     */
    rules?: ValidationRule[]
    /**
     * Optional function to clean/format the input value
     * @param value - The value to sanitize
     * @returns The sanitized value
     */
    sanitise?: (value: T) => T
    /**
     * Whether the field is disabled
     * @default false
     */
    disabled?: boolean
    /**
     * Array of field names that should be re-validated when this field changes
     * Useful for fields that depend on each other's values
     */
    deps?: string[]  // Field dependencies
    /**
     * Optional function to transform the value before form submission
     * Example: Converting a Date object to an ISO string
     * @param value - The value to transform
     * @returns The transformed value
     */
    transform?: (value: T) => any  // Transform before submission
}

/**
 * Represents the current state of a form field.
 * @interface FieldState
 * @template T - The type of value this field holds
 */
export interface FieldState<T = any> {
    value: T
    error: string | null
    /**
     * Whether the field's value has been modified from its initial state
     */
    isDirty: boolean
    /**
     * Whether the field passes all its validation rules
     */
    isValid: boolean
    /**
     * Whether the field is currently disabled
     */
    isDisabled: boolean
    /**
     * Whether the field has been interacted with
     */
    isTouched: boolean
    /**
     * Whether the field is currently running async validation
     * @default false
     */
    isValidating?: boolean
}
  
/**
 * Configuration for an entire form.
 * @template T - An object type describing the form's structure
 * @example
 * type LoginForm = {
 *   username: string;
 *   password: string;
 *   rememberMe: boolean;
 * }
 * const config: FormConfig<LoginForm> = {
 *   username: { value: '', rules: [required()] },
 *   password: { value: '', rules: [required(), minLength(8)] },
 *   rememberMe: { value: false }
 * }
 */
export type FormConfig<T> = {
    [K in keyof T]: FieldConfig<T[K]>
}

/**
 * State of an entire form.
 * @template T - An object type describing the form's structure
 * @example
 * type LoginForm = {
 *   username: string;
 *   password: string;
 *   rememberMe: boolean;
 * }
 * const state: FormState<LoginForm> = {
 *   username: { value: '', error: null, isDirty: false, ... },
 *   password: { value: '', error: null, isDirty: false, ... },
 *   rememberMe: { value: false, error: null, isDirty: false, ... }
 * }
 */
export type FormState<T> = {
    [K in keyof T]: FieldState<T[K]>
}