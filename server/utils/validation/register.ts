import { 
    isValidEmail, 
    sanitizeEmail, 
    isValidLength, 
    stripHtmlTags, 
} from '~/utils/inputSanitisation';

interface ValidationResult {
    isValid: boolean;
    sanitisedData?: any;
    message?: string;
}

interface RegistrationInput {
    username: string;
    primary_email: string;
    picture: string;
    provider?: string;
    provider_id: string | null;
    provider_verified?: boolean;
}

const SANITISATION_CONSTRAINTS = {
    USERNAME: {
        MIN_LENGTH: 1,
        MAX_LENGTH: 20,
        PATTERN: /^[a-zA-Z0-9_-]+$/,
    },
    PROVIDER: {
        MAX_LENGTH: 50,
        PATTERN: /^[a-zA-Z0-9_-]+$/,
    },
    PICTURE_URL: {
        MAX_LENGTH: 2083, // Standard maximum URL length
        PATTERN: /^https?:\/\/[^\s<>\"]+$/,
    },
    PROVIDER_ID: {
        PATTERN: /^\d+$/,  // Only digits
        MAX_LENGTH: 255    // Keep max length constraint for the string
    }
} as const;

export function sanitiseRegistrationInput(input: RegistrationInput): ValidationResult {
    const sanitisedData: RegistrationInput = {
        username: '',
        primary_email: '',
        picture: '',
        provider: input.provider,
        provider_id: input.provider_id,
        provider_verified: input.provider_verified
    };

    const usernameValidation = sanitiseUsername(input.username);
    if (!usernameValidation.isValid) {
        return usernameValidation;
    }
    sanitisedData.username = usernameValidation.sanitisedData;

    const emailValidation = sanitiseAndValidateEmail(input.primary_email);
    if (!emailValidation.isValid) {
        return emailValidation;
    }
    sanitisedData.primary_email = emailValidation.sanitisedData;

    const pictureValidation = sanitisePictureUrl(input.picture);
    if (!pictureValidation.isValid) {
        return pictureValidation;
    }
    sanitisedData.picture = pictureValidation.sanitisedData;

    if (input.provider !== undefined) {
        const providerValidation = sanitiseProvider(input.provider);
        if (!providerValidation.isValid) {
            return providerValidation;
        }
        sanitisedData.provider = providerValidation.sanitisedData;
    }

    if (input.provider_id !== undefined) {
        const providerIdValidation = sanitiseProviderId(input.provider_id);
        if (!providerIdValidation.isValid) {
            return providerIdValidation;
        }
        sanitisedData.provider_id = providerIdValidation.sanitisedData;
    }

    if (input.provider_verified !== undefined && typeof input.provider_verified !== 'boolean') {
        return {
            isValid: false,
            message: 'Provider verification status must be a boolean value'
        };
    }

    return {
        isValid: true,
        sanitisedData
    };
}

export function sanitiseUsername(username: string): ValidationResult {
    if (!username) {
        return { isValid: false, message: 'Username is required' };
    }

    let sanitized = stripHtmlTags(username).trim();

    if (!isValidLength(sanitized, SANITISATION_CONSTRAINTS.USERNAME.MIN_LENGTH, SANITISATION_CONSTRAINTS.USERNAME.MAX_LENGTH)) {
        return {
            isValid: false,
            message: `Username must be between ${SANITISATION_CONSTRAINTS.USERNAME.MIN_LENGTH} and ${SANITISATION_CONSTRAINTS.USERNAME.MAX_LENGTH} characters`
        };
    }

    if (!SANITISATION_CONSTRAINTS.USERNAME.PATTERN.test(sanitized)) {
        return {
            isValid: false,
            message: 'Username can only contain letters, numbers, underscores, and hyphens'
        };
    }

    return {
        isValid: true,
        sanitisedData: sanitized
    };
}

export function sanitiseAndValidateEmail(email: string): ValidationResult {
    if (!email) {
        return { isValid: false, message: 'Email is required' };
    }

    const sanitized = sanitizeEmail(stripHtmlTags(email));

    if (!isValidEmail(sanitized)) {
        return {
            isValid: false,
            message: 'Invalid email format'
        };
    }

    return {
        isValid: true,
        sanitisedData: sanitized
    };
}

export function sanitisePictureUrl(url: string): ValidationResult {
    if (!url) {
        return { isValid: false, message: 'Profile picture URL is required' };
    }

    let sanitized = stripHtmlTags(url).trim();

    if (!isValidLength(sanitized, 1, SANITISATION_CONSTRAINTS.PICTURE_URL.MAX_LENGTH)) {
        return {
            isValid: false,
            message: 'Profile picture URL is too long'
        };
    }

    if (!SANITISATION_CONSTRAINTS.PICTURE_URL.PATTERN.test(sanitized)) {
        return {
            isValid: false,
            message: 'Invalid profile picture URL format'
        };
    }

    return {
        isValid: true,
        sanitisedData: sanitized
    };
}

export function sanitiseProvider(provider: string): ValidationResult {
    if (!provider) {
        return { isValid: false, message: 'Provider is required' };
    }

    let sanitized = stripHtmlTags(provider).trim();

    if (!isValidLength(sanitized, 1, SANITISATION_CONSTRAINTS.PROVIDER.MAX_LENGTH)) {
        return {
            isValid: false,
            message: 'Provider name is too long'
        };
    }

    if (!SANITISATION_CONSTRAINTS.PROVIDER.PATTERN.test(sanitized)) {
        return {
            isValid: false,
            message: 'Provider name contains invalid characters'
        };
    }

    return {
        isValid: true,
        sanitisedData: sanitized
    };
}

export function sanitiseProviderId(providerId: string | null): ValidationResult {
    if (providerId === null) {
        return {
            isValid: true,
            sanitisedData: null
        };
    }

    if (!providerId) {
        return { isValid: false, message: 'Provider ID is required' };
    }

    // Remove HTML tags and trim
    let sanitized = stripHtmlTags(providerId).trim();

    // Check pattern
    if (!SANITISATION_CONSTRAINTS.PROVIDER_ID.PATTERN.test(sanitized)) {
        return {
            isValid: false,
            message: 'Invalid provider ID format'
        };
    }

    return {
        isValid: true,
        sanitisedData: sanitized
    }
}