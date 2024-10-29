import type { SanitiserConfig, SanitiseResult } from './types';

export const sanitiseString = (
    value: string,
    config: SanitiserConfig
): SanitiseResult<string> => {
    const modifications: string[] = [];
    let modified = false;
    let result = value;
  
    if (config.trim && result !== result.trim()) {
        result = result.trim();
        modifications.push('trimmed');
        modified = true;
    }
  
    if (config.lowercase && result !== result.toLowerCase()) {
        result = result.toLowerCase();
        modifications.push('converted to lowercase');
        modified = true;
    }
  
    if (config.uppercase && result !== result.toUpperCase()) {
        result = result.toUpperCase();
        modifications.push('converted to uppercase');
        modified = true;
    }
  
    if (config.removeSpaces) {
        const noSpaces = result.replace(/\s/g, '');
        if (result !== noSpaces) {
            result = noSpaces;
            modifications.push('removed spaces');
            modified = true;
        }
    }
  
    if (config.removeSpecialChars) {
        const alphanumeric = result.replace(/[^a-zA-Z0-9]/g, '');
        if (result !== alphanumeric) {
            result = alphanumeric;
            modifications.push('removed special characters');
            modified = true;
        }
    }
  
    if (config.maxLength && result.length > config.maxLength) {
        result = result.slice(0, config.maxLength);
        modifications.push(`truncated to ${config.maxLength} characters`);
        modified = true;
    }
  
    return { value: result, modified, modifications };
};
  
export const sanitiseNumber = (
    value: number | string,
    config: SanitiserConfig
): SanitiseResult<number> => {
    const modifications: string[] = [];
    let modified = false;
    let result = typeof value === 'string' ? parseFloat(value) : value;
  
    if (isNaN(result)) {
        return {
            value: 0,
            modified: true,
            modifications: ['converted invalid number to 0'],
        };
    }
  
    if (config.toInteger) {
        const intValue = Math.floor(result);
        if (result !== intValue) {
            result = intValue;
            modifications.push('converted to integer');
            modified = true;
        }
    }
  
    if (config.roundTo !== undefined) {
        const factor = Math.pow(10, config.roundTo);
        const rounded = Math.round(result * factor) / factor;
        if (result !== rounded) {
            result = rounded;
            modifications.push(`rounded to ${config.roundTo} decimal places`);
            modified = true;
        }
    }
  
    if (config.min !== undefined && result < config.min) {
        result = config.min;
        modifications.push(`clamped to minimum value ${config.min}`);
        modified = true;
    }
  
    if (config.max !== undefined && result > config.max) {
        result = config.max;
        modifications.push(`clamped to maximum value ${config.max}`);
        modified = true;
    }
  
    return { value: result, modified, modifications };
};