import { type ValidationRule } from "./types";

/**
 * Builder class for creating chains of validation rules.
 * Supports both synchronous and asynchronous validation rules.
 * 
 * @example
 * const validator = new ValidationBuilder()
 *   .required()
 *   .minLength(3)
 *   .pattern(/^[A-Z]/, 'Must start with capital letter')
 *   .build();
 */
export class ValidationBuilder {
    /** Internal storage for validation rules */
    private rules: ValidationRule[] = [];
  
    /**
     * Validates that a value is not empty
     * - For strings: checks if the trimmed length is > 0
     * - For arrays: checks if length is > 0
     * - For other types: checks if value is not null or undefined
     * 
     * @param message - Custom error message
     * @example
     * const validator = new ValidationBuilder()
     *   .required('Name is required')
     *   .build();
     */
    required(message = 'This field is required'): this {
        this.rules.push({
            validate: (value: any): boolean => {
                if (typeof value === 'string') return value.trim().length > 0;
                if (Array.isArray(value)) return value.length > 0;
                return value !== null && value !== undefined;
            },
            message
        });
        return this;
    }
  
    /**
     * Validates that a numeric value is greater than or equal to a minimum value
     * 
     * @param min - The minimum allowed value
     * @param message - Custom error message
     * @example
     * const validator = new ValidationBuilder()
     *   .min(18, 'Must be 18 or older')
     *   .build();
     */
    min(min: number, message = `Minimum value is ${min}`): this {
        this.rules.push({
            validate: (value: number) => Number(value) >= min,
            message
        });
        return this;
    }
  
    /**
     * Validates that a numeric value is less than or equal to a maximum value
     * 
     * @param max - The maximum allowed value
     * @param message - Custom error message
     * @example
     * const validator = new ValidationBuilder()
     *   .max(100, 'Maximum score is 100')
     *   .build();
     */
    max(max: number, message = `Maximum value is ${max}`): this {
        this.rules.push({
            validate: (value: number) => Number(value) <= max,
            message
        });
        return this;
    }
  
    /**
     * Validates that a string's length is greater than or equal to a minimum length
     * 
     * @param min - The minimum required length
     * @param message - Custom error message
     * @example
     * const validator = new ValidationBuilder()
     *   .minLength(8, 'Password must be at least 8 characters')
     *   .build();
     */
    minLength(min: number, message = `Minimum length is ${min}`): this {
        this.rules.push({
            validate: (value: string) => String(value).length >= min,
            message
        });
        return this;
    }
  
    /**
     * Validates that a string's length is less than or equal to a maximum length
     * 
     * @param max - The maximum allowed length
     * @param message - Custom error message
     * @example
     * const validator = new ValidationBuilder()
     *   .maxLength(100, 'Bio must be 100 characters or less')
     *   .build();
     */
    maxLength(max: number, message = `Maximum length is ${max}`): this {
        this.rules.push({
            validate: (value: string) => String(value).length <= max,
            message
        });
        return this;
    }
  
    /**
     * Validates that a string matches a regular expression pattern
     * 
     * @param regex - The regular expression to test against
     * @param message - Custom error message
     * @example
     * const validator = new ValidationBuilder()
     *   .pattern(/^[A-Z][a-z]*$/, 'Must start with capital letter')
     *   .build();
     */
    pattern(regex: RegExp, message: string): this {
        this.rules.push({
            validate: (value: string) => regex.test(String(value)),
            message
        });
        return this;
    }
  
    /**
     * Validates that a string is a properly formatted email address
     * 
     * @param message - Custom error message
     * @example
     * const validator = new ValidationBuilder()
     *   .email('Please enter a valid email')
     *   .build();
     */
    email(message = 'Invalid email format'): this {
        return this.pattern(
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            message
        );
    }
  
    /**
     * Validates that a string is a valid username
     * - Must be alphanumeric with optional underscores and hyphens
     * - Length between 1 and 20 characters
     * 
     * @param message - Custom error message
     * @example
     * const validator = new ValidationBuilder()
     *   .username('Invalid username format')
     *   .build();
     */
    username(message = 'Invalid username format'): this {
        return this.pattern(
            /^[a-zA-Z0-9_-]+$/,
            message
        )
        .minLength(1)
        .maxLength(20);
    }
  
    /**
     * Adds a custom validation rule
     * Supports both synchronous and asynchronous validation functions
     * 
     * @param validateFn - Custom validation function
     * @param message - Error message for failed validation
     * @example
     * const validator = new ValidationBuilder()
     *   .custom(value => value % 2 === 0, 'Must be even number')
     *   .build();
     * 
     * // Async validation
     * const validator = new ValidationBuilder()
     *   .custom(async value => {
     *     const result = await checkAvailability(value);
     *     return result.available;
     *   }, 'Username not available')
     *   .build();
     */
    custom(validateFn: (value: any) => boolean | Promise<boolean>, message: string): this {
        this.rules.push({ validate: validateFn, message });
        return this;
    }
  
    /**
     * Builds and returns the array of validation rules
     * 
     * @returns Array of validation rules to be used with the form
     * @example
     * const rules = new ValidationBuilder()
     *   .required()
     *   .email()
     *   .build();
     */
    build(): ValidationRule[] {
        return this.rules;
    }
}