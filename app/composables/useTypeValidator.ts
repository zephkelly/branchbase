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
    const validateInterface = <T extends object>(value: unknown, path: string = 'object'): T => {
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
        const template = {} as T;
        
        const validateObject = (
            value: unknown,
            template: unknown,
            path: string[] = []
        ): void => {
            if (!value || typeof value !== 'object') {
                errors.push(`Expected object at ${path.join('.') || 'root'}`);
                return;
            }

            const valueObj = value as Record<string, unknown>;
            const templateObj = template as Record<string, unknown>;

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
                
                // Handle optional fields
                if (currentValue === undefined) {
                    const isOptional = templateValue === undefined || 
                        (typeof templateValue === 'object' && 
                         templateValue !== null && 
                         'optional' in templateValue && 
                         templateValue.optional === true);
                    
                    if (!isOptional) {
                        errors.push(`Missing required property: ${currentPath.join('.')}`);
                    }
                    return;
                }

                // Treat null the same as undefined
                if (currentValue === null) {
                    return;
                }

                const currentType = getTypeOf(currentValue);
                const expectedType = getTypeOf(templateValue);

                // Handle nested objects
                if (expectedType === 'object' && currentType === 'object') {
                    const templateValueObj = templateValue as Record<string, unknown>;
                    const actualTemplate = 'optional' in templateValueObj && 
                        'value' in templateValueObj ? 
                        templateValueObj.value : 
                        templateValue;
                    
                    validateObject(currentValue, actualTemplate, currentPath);
                    return;
                }

                // Handle arrays
                if (expectedType === 'array' && currentType === 'array') {
                    (currentValue as unknown[]).forEach((item, index) => {
                        if (Array.isArray(templateValue) && templateValue.length > 0) {
                            validateObject(item, templateValue[0], [...currentPath, `[${index}]`]);
                        }
                    });
                    return;
                }

                // Handle primitive types
                if (currentType !== expectedType) {
                    const actualExpectedType = typeof templateValue === 'object' && 
                        templateValue !== null && 
                        'type' in templateValue ? 
                        getTypeOf(templateValue.type) : 
                        expectedType;

                    if (currentType !== actualExpectedType) {
                        errors.push(
                            `Type mismatch at ${currentPath.join('.')}: expected ${actualExpectedType}, got ${currentType}`
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