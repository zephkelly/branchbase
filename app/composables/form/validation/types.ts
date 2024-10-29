export interface ValidationRule {
    validate: (value: any) => boolean | Promise<boolean>
    message: string
}

export interface FieldConfig<T = any> {
    value: T
    rules?: ValidationRule[]
    sanitise?: (value: T) => T
    disabled?: boolean
    deps?: string[]  // Field dependencies
    transform?: (value: T) => any  // Transform before submission
}
  
export interface FieldState<T = any> {
    value: T
    error: string | null
    isDirty: boolean
    isValid: boolean
    isDisabled: boolean
    isTouched: boolean
    isValidating?: boolean
}
  
export type FormConfig<T> = {
    [K in keyof T]: FieldConfig<T[K]>
}
  
export type FormState<T> = {
    [K in keyof T]: FieldState<T[K]>
}