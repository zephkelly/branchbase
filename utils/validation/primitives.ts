/**
 * Type guard to check if a value is a string
 */
export function isString(value: unknown): value is string {
    return typeof value === 'string';
}

/**
 * Type guard to check if a value is a number
 */
export function isNumber(value: unknown): value is number {
   if (typeof value === 'number') {
         return !isNaN(value);
   }

    if (typeof value === 'string') {
            const num = Number(value.trim());
            return !isNaN(num);
    }

    return false;
}

/**
 * Checks if the input length is within the specified range.
 * @param input The input to check.
 * @param minLength The minimum allowed length.
 * @param maxLength The maximum allowed length.
 * @returns True if the input length is within range, false otherwise.
 */
export function isValidLengthString(input: unknown, minLength: number, maxLength: number): boolean {
    if (!isString(input)) return false;
    const length = input.trim().length;
    return length >= minLength && length <= maxLength;
}

export function minLengthString(input: unknown, min: number) {
    if (!isString(input)) return false;
    return input.trim().length >= min;
}

export function maxLengthString(input: unknown, max: number) {
    if (!isString(input)) return false;
    return input.trim().length <= max;
}