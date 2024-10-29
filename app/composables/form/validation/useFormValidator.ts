import type { FormConfig, FormState, FieldState } from './types'
import { ValidationBuilder } from '~/composables/form/validation/validationBuilder'

/**
 * A composable for handling form state, validation, and updates.
 * 
 * @template T - The type describing the form's data structure
 * @param config - Configuration object defining the form's fields and their properties
 * 
 * @example
 * interface LoginForm {
 *   username: string;
 *   password: string;
 *   rememberMe: boolean;
 * }
 * 
 * const { formState, validate, updateField, isValid } = useForm<LoginForm>({
 *   username: { 
 *     value: '',
 *     rules: [validate.required(), validate.minLength(3)]
 *   },
 *   password: { 
 *     value: '',
 *     rules: [validate.required(), validate.minLength(8)]
 *   },
 *   rememberMe: { value: false }
 * });
 */
export const useFormValidator = <T extends Record<string, any>>(config: FormConfig<T>) => {
    /**
     * Reactive form state containing all field states
     */
    const formState = ref<FormState<T>>({} as FormState<T>);
    
    // Initialize form state with default configurations
    for (const [key, fieldConfig] of Object.entries(config)) {
        if (key in config) {
            formState.value[key as keyof T] = {
                value: fieldConfig.value,
                error: null,
                isDirty: false,
                isValid: true,
                isDisabled: fieldConfig.disabled ?? false,
                isTouched: false,
                isValidating: false
            };
        }
    }

    /**
     * ValidationBuilder instance for creating validation rules
     */
    const validate = new ValidationBuilder();

    /**
     * Validates a single field in the form
     * 
     * @param fieldName - The name of the field to validate
     * @returns Promise resolving to whether the field is valid
     */
    const validateField = async (fieldName: keyof T): Promise<boolean> => {
        const field = formState.value[fieldName];
        const fieldConfig = config[fieldName];
        
        if (!field.isDirty || field.isDisabled || !fieldConfig.rules) {
            return true;
        }

        field.isValidating = true;
        field.error = null;

        try {
            for (const rule of fieldConfig.rules) {
                const isValid = await Promise.resolve(rule.validate(field.value));
                if (!isValid) {
                    field.error = rule.message;
                    field.isValid = false;
                    return false;
                }
            }

            field.error = null
            field.isValid = true;
            return true;
        }
        finally {
            field.isValidating = false;
        }
    };

    /**
     * Updates a field's value and triggers validation
     * 
     * @param fieldName - The name of the field to update
     * @param value - The new value for the field
     */
    const updateField = async (fieldName: keyof T, value: any) => {
        const field = formState.value[fieldName];
        const fieldConfig = config[fieldName];

        if (!field || !fieldConfig) return;

        // Apply sanitisation if configured
        const sanitisedValue = fieldConfig.sanitise ? fieldConfig.sanitise(value) : value;
        
        field.value = sanitisedValue;
        field.isDirty = true;
        field.isTouched = true;

        // Validate this field
        await validateField(fieldName);

        // Validate dependent fields
        if (fieldConfig.deps) {
            for (const depField of fieldConfig.deps) {
                if (depField in config) {  // Type guard for dependency
                    await validateField(depField as keyof T);
                }
            }
        }
    };

    /**
     * Computed property that returns all form values, with any configured transformations applied
     */
    const values = computed(() => {
        const entries = Object.entries(formState.value) as [string, FieldState<any>][];
        return entries.reduce<T>((acc, [key, field]) => {
            const fieldConfig = config[key as keyof T];
            if (fieldConfig) {
                return {
                    ...acc,
                    [key]: fieldConfig.transform
                        ? fieldConfig.transform(field.value)
                        : field.value
                };
            }
            return acc;
        }, {} as T);
    });

    /**
     * Computed property that indicates whether the entire form is valid
     */
    const isValid = computed(() => {
        const fields = Object.values(formState.value) as FieldState<any>[];
        return fields.every(field => field.isValid && !field.isValidating);
    });

    /**
     * Computed property that returns all form validation errors
     */
    const errors = computed(() => {
        const entries = Object.entries(formState.value) as [keyof T, FieldState<any>][];
        return entries.reduce<Record<keyof T, string | null>>(
            (acc, [key, field]) => ({
                ...acc,
                [key]: field.error
            }),
            {} as Record<keyof T, string | null>
        );
    });

    /**
     * Resets the form to its initial state
     */
    const resetForm = () => {
        for (const [key, fieldConfig] of Object.entries(config)) {
            if (key in config) {  // Type guard
                formState.value[key as keyof T] = {
                    value: fieldConfig.value,
                    error: null,
                    isDirty: false,
                    isValid: true,
                    isDisabled: fieldConfig.disabled ?? false,
                    isTouched: false,
                    isValidating: false
                };
            }
        }
    };

    return {
        formState,      // The reactive form state
        validate,       // ValidationBuilder instance for creating rules
        validateField,  // Function to validate a single field
        updateField,    // Function to update a field's value
        values,         // Computed property with all form values
        isValid,        // Computed property indicating form validity
        errors,         // Computed property with all form errors
        resetForm       // Function to reset the form
    };
};