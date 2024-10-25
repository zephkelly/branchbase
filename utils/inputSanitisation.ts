const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

/**
 * Type guard to check if a value is a string
 */
function isString(value: unknown): value is string {
    return typeof value === 'string';
}

/**
 * Validates an email address.
 * @param email The email address to validate.
 * @returns True if the email is valid, false otherwise.
 */
export function isValidEmail(email: unknown): boolean {
    if (!isString(email)) return false;
    return EMAIL_REGEX.test(email);
}

/**
 * Sanitizes an email address by trimming whitespace and converting to lowercase.
 * @param email The email address to sanitize.
 * @returns The sanitized email address.
 * @throws Error if input is not a string
 */
export function sanitizeEmail(email: unknown): string {
    if (!isString(email)) {
        throw new Error('Input must be a string');
    }
    return email.trim().toLowerCase();
}

/**
 * Checks if the input length is within the specified range.
 * @param input The input to check.
 * @param minLength The minimum allowed length.
 * @param maxLength The maximum allowed length.
 * @returns True if the input length is within range, false otherwise.
 */
export function isValidLength(input: unknown, minLength: number, maxLength: number): boolean {
    if (!isString(input)) return false;
    const length = input.trim().length;
    return length >= minLength && length <= maxLength;
}

/**
 * Checks if the number is within the specified range.
 * @param input The number to check.
 * @param minLength The minimum allowed value.
 * @param maxLength The maximum allowed value.
 * @returns True if the number is within range, false otherwise.
 */
export function isValidLengthNumber(input: unknown, minLength: number, maxLength: number): boolean {
    if (typeof input !== 'number') return false;
    return input >= minLength && input <= maxLength;
}

/**
 * Truncates the input to the specified maximum length.
 * @param input The input string to truncate.
 * @param maxLength The maximum allowed length.
 * @returns The truncated string.
 * @throws Error if input is not a string
 */
export function truncateInput(input: unknown, maxLength: number): string {
    if (!isString(input)) {
        throw new Error('Input must be a string');
    }
    return input.trim().slice(0, maxLength);
}

/**
 * Removes any HTML tags from the input string.
 * @param input The input string to sanitize.
 * @returns The sanitized string without HTML tags.
 * @throws Error if input is not a string
 */
export function stripHtmlTags(input: unknown): string {
    if (!isString(input)) {
        throw new Error('Input must be a string');
    }
    return input.replace(/<[^>]*>/g, '');
}

/**
 * Map of special characters to their HTML entities
 */
const HTML_ENTITY_MAP: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
} as const;

/**
 * Escapes special characters to prevent XSS attacks.
 * @param input The input string to escape.
 * @returns The escaped string.
 * @throws Error if input is not a string
 */
export function escapeHtml(input: unknown): string {
    if (!isString(input)) {
        throw new Error('Input must be a string');
    }
    
    return input.replace(
        /[&<>"'`=/]/g,
        char => HTML_ENTITY_MAP[char] || char
    );
}