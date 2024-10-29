import type { FormConfig, FormState, FieldState } from './types'
import { ValidationBuilder } from '~/composables/form/validation/validationBuilder'

export const useForm = <T extends Record<string, any>>(config: FormConfig<T>) => {
    const formState = ref<FormState<T>>({} as FormState<T>);
    
    // Initialise form state
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

    const validate = new ValidationBuilder();

    // Validate a single field
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

    // Get form values
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

    // Check form validity
    const isValid = computed(() => {
        const fields = Object.values(formState.value) as FieldState<any>[];
        return fields.every(field => field.isValid && !field.isValidating);
    });

    // Get all errors
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

  // Reset form
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
        formState,
        validate,
        validateField,
        updateField,
        values,
        isValid,
        errors,
        resetForm
    };
};