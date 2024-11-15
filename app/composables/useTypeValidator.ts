type TypeName = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'undefined' | 'null';

export const useTypeValidator = () => {
    const getTypeOf = (value: unknown): TypeName => {
        if (value === undefined) return 'undefined';
        if (value === null) return 'null';
        if (Array.isArray(value)) return 'array';
        return typeof value as TypeName;
    };

    // Primitive validators
    const validateString = (value: unknown, fieldName: string = 'value'): string => {
        if (value === undefined || value === null) {
            throw createError({
                statusCode: 400,
                message: 'Validation Error',
                data: [`${fieldName} is required`]
            });
        }
        
        if (typeof value !== 'string') {
            throw createError({
                statusCode: 400,
                message: 'Validation Error',
                data: [`${fieldName} must be a string, got ${getTypeOf(value)}`]
            });
        }
        
        return value;
    };

    const validateNumber = (value: unknown, fieldName: string = 'value'): number => {
        if (value === undefined || value === null) {
            throw createError({
                statusCode: 400,
                message: 'Validation Error',
                data: [`${fieldName} is required`]
            });
        }
        
        if (typeof value !== 'number' || isNaN(value)) {
            throw createError({
                statusCode: 400,
                message: 'Validation Error',
                data: [`${fieldName} must be a number, got ${getTypeOf(value)}`]
            });
        }
        
        return value;
    };

    const validateBoolean = (value: unknown, fieldName: string = 'value'): boolean => {
        if (value === undefined || value === null) {
            throw createError({
                statusCode: 400,
                message: 'Validation Error',
                data: [`${fieldName} is required`]
            });
        }
        
        if (typeof value !== 'boolean') {
            throw createError({
                statusCode: 400,
                message: 'Validation Error',
                data: [`${fieldName} must be a boolean, got ${getTypeOf(value)}`]
            });
        }
        
        return value;
    };

    // Optional primitive validators
    const validateOptionalString = (value: unknown, fieldName: string = 'value'): string | undefined => {
        if (value === undefined) return undefined;
        return validateString(value, fieldName);
    };

    const validateOptionalNumber = (value: unknown, fieldName: string = 'value'): number | undefined => {
        if (value === undefined) return undefined;
        return validateNumber(value, fieldName);
    };

    const validateOptionalBoolean = (value: unknown, fieldName: string = 'value'): boolean | undefined => {
        if (value === undefined) return undefined;
        return validateBoolean(value, fieldName);
    };

    // Interface validator
    const validateInterface = <T extends object>(value: unknown, template: T, path: string = 'object'): T => {
        if (value === undefined || value === null) {
            throw createError({
                statusCode: 400,
                message: 'Validation Error',
                data: [`${path} is required and must be an object`]
            });
        }
    
        if (typeof value !== 'object') {
            throw createError({
                statusCode: 400,
                message: 'Validation Error',
                data: [`${path} must be an object, got ${getTypeOf(value)}`]
            });
        }
    
        const errors: string[] = [];
        
        const validateObject = (
            value: unknown,
            template: unknown,
            path: string[] = [],
            requiredKeys: Set<string> = new Set()
        ): void => {
            if (!value || typeof value !== 'object') {
                errors.push(`Expected object at ${path.join('.') || 'root'}`);
                return;
            }
    
            const valueObj = value as Record<string, unknown>;
            const templateObj = template as Record<string, unknown>;
    
            // Get required keys from template type
            Object.entries(templateObj).forEach(([key, value]) => {
                if (value !== undefined) {
                    requiredKeys.add(key);
                }
            });
    
            // Check for extra properties
            const extraKeys = Object.keys(valueObj).filter(
                key => !(key in templateObj)
            );
            
            if (extraKeys.length > 0) {
                extraKeys.forEach(key => {
                    errors.push(
                        `Unexpected property ${path.length ? `${path.join('.')}.${key}` : key}`
                    );
                });
            }
    
            // Check all template properties
            Object.entries(templateObj).forEach(([key, templateValue]) => {
                const currentPath = [...path, key];
                const currentValue = valueObj[key];
                
                // Skip validation if field is optional (undefined in template) and value is undefined
                if (!requiredKeys.has(key) && currentValue === undefined) {
                    return;
                }
    
                // Skip if value is undefined or null for optional fields
                if ((currentValue === undefined || currentValue === null) && !requiredKeys.has(key)) {
                    return;
                }
    
                // Required field is missing
                if ((currentValue === undefined || currentValue === null) && requiredKeys.has(key)) {
                    errors.push(`Missing required property: ${currentPath.join('.')}`);
                    return;
                }
    
                const currentType = getTypeOf(currentValue);
                const expectedType = getTypeOf(templateValue);
    
                // Handle nested objects
                if (expectedType === 'object' && currentType === 'object') {
                    validateObject(currentValue, templateValue, currentPath, new Set());
                    return;
                }
    
                // Handle arrays
                if (expectedType === 'array' && currentType === 'array') {
                    (currentValue as unknown[]).forEach((item, index) => {
                        if (Array.isArray(templateValue) && templateValue.length > 0) {
                            validateObject(item, templateValue[0], [...currentPath, `[${index}]`], new Set());
                        }
                    });
                    return;
                }
    
                // Handle primitive types
                if (currentType !== expectedType) {
                    // If the template value is undefined, accept either undefined or string
                    if (!(expectedType === 'undefined' && currentType === 'string')) {
                        errors.push(
                            `Type mismatch at ${currentPath.join('.')}: expected ${expectedType}, got ${currentType}`
                        );
                    }
                }
            });
        };
    
        validateObject(value, template);
    
        if (errors.length > 0) {
            throw createError({
                statusCode: 400,
                message: 'Validation Error',
                data: errors
            });
        }
    
        return value as T;
    };

    return {
        validateString,
        validateNumber,
        validateBoolean,

        validateOptionalString,
        validateOptionalNumber,
        validateOptionalBoolean,

        validateInterface
    };
};