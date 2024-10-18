const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

/**
 * Validates an email address.
 * @param email The email address to validate.
 * @returns True if the email is valid, false otherwise.
 */
export function isValidEmail(email: string): boolean {
    return EMAIL_REGEX.test(email);
}

/**
 * Sanitizes an email address by trimming whitespace and converting to lowercase.
 * @param email The email address to sanitize.
 * @returns The sanitized email address.
 */
export function sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

/**
 * Checks if the input length is within the specified range.
 * @param input The input string to check.
 * @param minLength The minimum allowed length.
 * @param maxLength The maximum allowed length.
 * @returns True if the input length is within range, false otherwise.
 */
export function isValidLength(input: string, minLength: number, maxLength: number): boolean {
    const length = input.trim().length;
    return length >= minLength && length <= maxLength;
}

/**
 * Truncates the input to the specified maximum length.
 * @param input The input string to truncate.
 * @param maxLength The maximum allowed length.
 * @returns The truncated string.
 */
export function truncateInput(input: string, maxLength: number): string {
    return input.trim().slice(0, maxLength);
}

/**
 * Removes any HTML tags from the input string.
 * @param input The input string to sanitize.
 * @returns The sanitized string without HTML tags.
 */
export function stripHtmlTags(input: string): string {
    return input.replace(/<[^>]*>/g, '');
}

/**
 * Escapes special characters to prevent XSS attacks.
 * @param input The input string to escape.
 * @returns The escaped string.
 */
export function escapeHtml(input: string): string {
    const entityMap: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    return input.replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    });
}