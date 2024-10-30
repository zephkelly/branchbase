import { ref, computed } from 'vue'

export interface ValidationRule {
    validate: (value: any) => boolean
    message: string
    transform?: (value: any) => any
}

export interface FieldState {
    value: any
    error: string | null
    isDirty: boolean
    isValid: boolean
}

export type FormState<T> = {
    [K in keyof T]: FieldState
}

export type ValidationRules<T> = {
    [K in keyof T]?: ValidationRule[]
}
  
export const useFormValidation = <T extends Record<string, any>>(initialValues: T) => {
    const formState = ref<FormState<T>>({} as FormState<T>)
    const externalRefs: Partial<Record<keyof T, Ref>> = {}
  
    for (const [key, value] of Object.entries(initialValues)) {
        formState.value[key as keyof T] = {
            value,
            error: null,
            isDirty: false,
            isValid: true
        }
    }
  
    const validationRules = ref<ValidationRules<T>>({})
  
    const rules = {
        required: (message = 'This field is required'): ValidationRule => ({
            validate: (value: any) => {
                if (typeof value === 'string') return value.trim().length > 0
                return value !== null && value !== undefined
            },
            message
        }),
    
        minLength: (min: number, message = `Must be at least ${min} characters`): ValidationRule => ({
            validate: (value: string) => value.trim().length >= min,
            message
        }),
    
        maxLength: (max: number, message = `Must be no more than ${max} characters`): ValidationRule => ({
            validate: (value: string) => value.trim().length <= max,
            message,
            transform: (value: string) => {
                if (typeof value === 'string' && value.length > max+1) {
                    return value.slice(0, max)
                }
                return value
            }
        }),
    
        pattern: (regex: RegExp, message: string): ValidationRule => ({
            validate: (value: string) => regex.test(value.trim()),
            message
        }),
    
        email: (message = 'Please enter a valid email address'): ValidationRule => ({
            validate: (value: string) => {
                const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/
                return pattern.test(value.trim().toLowerCase())
            },
            message
        }),
    
        url: (message = 'Please enter a valid URL'): ValidationRule => ({
            validate: (value: string) => {
                const pattern = /^https?:\/\/[^\s<>\"]+$/
                return pattern.test(value.trim())
            },
            message
        }),
    
        matches: (field: keyof T, message = 'Fields must match'): ValidationRule => ({
            validate: (value: any) => value === formState.value[field]?.value,
            message
        }),

        isString: (message = 'Must be a string'): ValidationRule => ({
            validate: (value: any) => typeof value === 'string',
            message,
            transform: (value: any) => {
                if (value === null || value === undefined) return ''
                return String(value)
            }
        }),

        isNumber: (message = 'Must be a number'): ValidationRule => ({
            validate: (value: any) => {
                if (typeof value === 'number') return !isNaN(value)
                if (typeof value === 'string') {
                    const num = Number(value.trim())
                    return !isNaN(num)
                }
                return false
            },
            message,
            transform: (value: any) => {
                if (typeof value === 'string') {
                    const num = Number(value.trim())
                    return isNaN(num) ? value : num
                }
                return value
            }
        }),

        isPositive: (message = 'Must be a positive number'): ValidationRule => ({
            validate: (value: number) => {
                const num = Number(value)
                return !isNaN(num) && num > 0
            },
            message
        }),
    
        custom: (validateFn: (value: any) => boolean, message: string): ValidationRule => ({
            validate: validateFn,
            message
        })
    }

    // Method to bind external ref to a field
    const bindField = (fieldName: keyof T, ref: Ref) => {
        externalRefs[fieldName] = ref
        ref.value = formState.value[fieldName].value
    }
  
    // Method to add validation rules for a field
    const setFieldRules = (fieldName: keyof T, ...fieldRules: ValidationRule[]) => {
        validationRules.value[fieldName] = fieldRules
    }
  
    // Validate a single field
    const validateField = (fieldName: keyof T): boolean => {
        const field = formState.value[fieldName]
        const rules = validationRules.value[fieldName] || []

        if (!field.isDirty) {
            return true
        }

        let transformedValue = field.value
        for (const rule of rules) {
            // Apply transformation if available
            if (rule.transform) {
                transformedValue = rule.transform(transformedValue)
                // Update both form state and external ref if value was transformed
                if (transformedValue !== field.value) {
                    field.value = transformedValue
                    if (externalRefs[fieldName]) {
                        externalRefs[fieldName]!.value = transformedValue
                    }
                }
            }

            if (!rule.validate(transformedValue)) {
                field.error = rule.message
                field.isValid = false
                return false
            }
        }

        field.error = null
        field.isValid = true
        return true
    }

  
    // Validate all fields
    const validateForm = (): boolean => {
        let isValid = true
        
        for (const fieldName of Object.keys(formState.value) as Array<keyof T>) {
            formState.value[fieldName].isDirty = true
            if (!validateField(fieldName)) {
                isValid = false
            }
        }
    
        return isValid
    }
  
    // Update a field value
    const updateField = (fieldName: keyof T, value: any) => {
        formState.value[fieldName].value = value
        formState.value[fieldName].isDirty = true
        
        // Update external ref if it exists
        if (externalRefs[fieldName]) {
            externalRefs[fieldName]!.value = value
        }
        
        validateField(fieldName)
    }
  
    // Get current form values
    const values = computed((): T => {
        return Object.entries(formState.value).reduce((acc, [key, field]) => ({
          ...acc,
          [key]: (field as FieldState).value
        }), {} as T)
    })
  
    // Check if the entire form is valid
    const isValid = computed((): boolean => {
        return (Object.values(formState.value) as FieldState[])
        .every(field => field.isValid)
    })
  
    // Get all form errors
    const errors = computed((): Record<keyof T, string | null> => {
        return Object.entries(formState.value).reduce((acc, [key, field]) => ({
            ...acc,
            [key]: (field as FieldState).error
        }), {} as Record<keyof T, string | null>)
    })
  
    // Reset the form
    const resetForm = () => {
        for (const [key, value] of Object.entries(initialValues)) {
            formState.value[key as keyof T] = {
                value,
                error: null,
                isDirty: false,
                isValid: true
            }
            // Reset external refs if they exist
            if (externalRefs[key as keyof T]) {
                externalRefs[key as keyof T]!.value = value
            }
        }
    }
  
    return {
        formState,
        rules,
        setFieldRules,
        validateField,
        validateForm,
        updateField,
        values,
        isValid,
        errors,
        resetForm,
        bindField
    }
}