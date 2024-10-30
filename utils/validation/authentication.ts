import { isNumber, isString } from "./primitives";

export interface ValidationResult {
    isValid: boolean;
    sanitisedData?: any;
    message?: string;
}

export const EMAIL_REGEX = /\S+@\S+\.\S+/
/**
 * Validates an email address.
 * @param email The email address to validate.
 * @returns True if the email is valid, false otherwise.
*/
export function isValidEmail(email: unknown): ValidationResult {
    if (!isString(email)) {
        return { isValid: false, message: 'Email must be a string' };
    }

    const trimmedEmail = email.trim();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
        return { isValid: false, message: 'Invalid email address' };
    }

    return { isValid: true, sanitisedData: trimmedEmail };
}

export const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/
export const USERNAME_MIN_LENGTH = 1;
export const USERNAME_MAX_LENGTH = 23;
export function isValidUsername(username: unknown): ValidationResult {
    if (!isString(username)) {
        return { isValid: false, message: 'Username must be a string' };
    }
    
    const trimmedUsername = username.trim();
    if (trimmedUsername.length < USERNAME_MIN_LENGTH || trimmedUsername.length > USERNAME_MAX_LENGTH) {
        return { isValid: false, message: `Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters` };
    }

    if (!USERNAME_REGEX.test(trimmedUsername)) {
        return { isValid: false, message: 'Username can only contain letters, numbers, underscores, and hyphens' };
    }
    
    return { isValid: true, sanitisedData: trimmedUsername };
}

import { Provider } from "~~/types/user";
export const PROVIDER_MAX_LENGTH = 16;
export const isValidProvider = (provider: unknown): ValidationResult => {
    if (!isString(provider)) {
        return { isValid: false, message: 'Provider must be a string' };
    }

    const trimmedProvider = provider.trim();
    if (!Object.values(Provider).includes(trimmedProvider as Provider)) {
        return { isValid: false, message: 'Invalid provider type' };
    }

    if (trimmedProvider.length > PROVIDER_MAX_LENGTH) {
        return { isValid: false, message: `Provider must be less than ${PROVIDER_MAX_LENGTH} characters` };
    }

    return { isValid: true, sanitisedData: trimmedProvider };
}

export const PROVIDER_ID_REGEX = /^(?:\d+|[1-9]\d*|\d+\.\d+)$/;
export const PROVIDER_ID_MAX_LENGTH = 255;
export const PROVIDER_ID_MIN_LENGTH = 1;
export const isValidProviderId = (providerId: unknown): ValidationResult => {
    if (isNumber(providerId)) {
        providerId = providerId.toString();
    } 
    if (!isString(providerId)) {
        return { isValid: false, message: 'Provider ID must be a string' };
    }

    if (providerId.length === 0) {
        return { isValid: false, message: 'Provider ID cannot be empty' };
    }

    const trimmedProviderId = providerId.trim();
    if (trimmedProviderId.length < PROVIDER_ID_MIN_LENGTH || trimmedProviderId.length > PROVIDER_ID_MAX_LENGTH) {
        return { isValid: false, message: `Provider ID must be between ${PROVIDER_ID_MIN_LENGTH} and ${PROVIDER_ID_MAX_LENGTH} characters` };
    }
    if (!PROVIDER_ID_REGEX.test(trimmedProviderId)) {
        return { isValid: false, message: 'Provider ID must be a number' };
    }

    return { isValid: true, sanitisedData: trimmedProviderId };
}

export const PICTURE_URL_REGEX = /^https?:\/\/[^\s<>\"]+$/;
export const PICTURE_URL_MAX_LENGTH = 2083;
export const isValidPictureUrl = (pictureUrl: unknown): ValidationResult => {
    if (!isString(pictureUrl)) {
        return { isValid: false, message: 'Profile picture URL must be a string' };
    }

    const trimmedPictureUrl = pictureUrl.trim();
    if (trimmedPictureUrl.length > PICTURE_URL_MAX_LENGTH) {
        return { isValid: false, message: `Profile picture URL must be less than ${PICTURE_URL_MAX_LENGTH} characters` };
    }
    if (!PICTURE_URL_REGEX.test(trimmedPictureUrl)) {
        return { isValid: false, message: 'Invalid URL format' };
    }

    return { isValid: true, sanitisedData: trimmedPictureUrl };
}

export const isValidProviderVerified = (providerVerified: unknown): ValidationResult => {
    if (typeof providerVerified !== 'boolean') {
        return { isValid: false, message: 'Provider verified must be a boolean' };
    }

    return { isValid: true, sanitisedData: providerVerified };
}