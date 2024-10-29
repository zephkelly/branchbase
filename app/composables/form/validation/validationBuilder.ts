import { type ValidationRule } from "./types";

export class ValidationBuilder {
    private rules: ValidationRule[] = [];
  
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
  
    min(min: number, message = `Minimum value is ${min}`): this {
        this.rules.push({
            validate: (value: number) => Number(value) >= min,
            message
        });
        return this;
    }
  
    max(max: number, message = `Maximum value is ${max}`): this {
        this.rules.push({
            validate: (value: number) => Number(value) <= max,
            message
        });
        return this;
    }
  
    minLength(min: number, message = `Minimum length is ${min}`): this {
        this.rules.push({
            validate: (value: string) => String(value).length >= min,
            message
        });
        return this;
    }
  
    maxLength(max: number, message = `Maximum length is ${max}`): this {
        this.rules.push({
            validate: (value: string) => String(value).length <= max,
            message
        });
        return this;
    }
  
    pattern(regex: RegExp, message: string): this {
        this.rules.push({
            validate: (value: string) => regex.test(String(value)),
            message
        });
        return this;
    }
  
    email(message = 'Invalid email format'): this {
        return this.pattern(
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            message
        );
    }
  
    username(message = 'Invalid username format'): this {
        return this.pattern(
            /^[a-zA-Z0-9_-]+$/,
            message
        )
        .minLength(1)
        .maxLength(20);
    }
  
    custom(validateFn: (value: any) => boolean | Promise<boolean>, message: string): this {
        this.rules.push({ validate: validateFn, message });
        return this;
    }

    async(validateFn: (value: any) => Promise<boolean>, message: string): this {
        this.rules.push({ validate: validateFn, message });
        return this;
    }
  
    build(): ValidationRule[] {
        return this.rules;
    }
}