/**
 * Error Types and Constants for AI Key Management
 *
 * Defines error types, error messages, and constants used throughout
 * the BYOK feature for consistent error handling and user feedback.
 */

/**
 * Error types for validation failures
 */
export const ValidationErrorType = {
  INVALID_KEY: "invalid_key",
  NETWORK_ERROR: "network_error",
  RATE_LIMIT: "rate_limit",
  TIMEOUT: "timeout",
  UNKNOWN: "unknown",
};

/**
 * Error types for storage operations
 */
export const StorageErrorType = {
  ENCRYPTION_FAILED: "encryption_failed",
  DECRYPTION_FAILED: "decryption_failed",
  STORAGE_UNAVAILABLE: "storage_unavailable",
  KEY_NOT_FOUND: "key_not_found",
  INVALID_DATA: "invalid_data",
  UNKNOWN: "unknown",
};

/**
 * Error types for parsing operations
 */
export const ParseErrorType = {
  NO_VALID_KEY: "no_valid_key",
  ALL_PROVIDERS_FAILED: "all_providers_failed",
  INVALID_RESPONSE: "invalid_response",
  RATE_LIMIT: "rate_limit",
  NETWORK_ERROR: "network_error",
  UNKNOWN: "unknown",
};

/**
 * User-friendly error messages for validation errors
 */
export const ValidationErrorMessages = {
  [ValidationErrorType.INVALID_KEY]:
    "The API key is invalid or has been revoked. Please check your key and try again.",
  [ValidationErrorType.NETWORK_ERROR]:
    "Unable to connect to the AI provider. Please check your internet connection and try again.",
  [ValidationErrorType.RATE_LIMIT]:
    "Rate limit exceeded for this API key. Please wait a moment or try a different provider.",
  [ValidationErrorType.TIMEOUT]:
    "Validation request timed out. Please check your connection and try again.",
  [ValidationErrorType.UNKNOWN]:
    "An unexpected error occurred during validation. Please try again.",
};

/**
 * User-friendly error messages for storage errors
 */
export const StorageErrorMessages = {
  [StorageErrorType.ENCRYPTION_FAILED]:
    "Failed to encrypt API key. Please try again.",
  [StorageErrorType.DECRYPTION_FAILED]:
    "Failed to decrypt API key. The stored key may be corrupted.",
  [StorageErrorType.STORAGE_UNAVAILABLE]:
    "Secure storage is not available on this device.",
  [StorageErrorType.KEY_NOT_FOUND]: "API key not found in storage.",
  [StorageErrorType.INVALID_DATA]: "Stored key data is invalid or corrupted.",
  [StorageErrorType.UNKNOWN]: "An unexpected storage error occurred.",
};

/**
 * User-friendly error messages for parsing errors
 */
export const ParseErrorMessages = {
  [ParseErrorType.NO_VALID_KEY]:
    "No valid API key configured. Please add an API key in Settings to use AI features.",
  [ParseErrorType.ALL_PROVIDERS_FAILED]:
    "All AI providers failed to parse the expense. Please check your API keys and try again.",
  [ParseErrorType.INVALID_RESPONSE]:
    "Received invalid response from AI provider. Please try again.",
  [ParseErrorType.RATE_LIMIT]:
    "Rate limit exceeded. Please wait a moment or configure an alternative provider.",
  [ParseErrorType.NETWORK_ERROR]:
    "Network error occurred while parsing. Please check your connection.",
  [ParseErrorType.UNKNOWN]: "An unexpected error occurred during parsing.",
};

/**
 * Constants for validation
 */
export const ValidationConstants = {
  TIMEOUT_MS: 10000, // 10 seconds
  MAX_RETRIES: 2,
  RETRY_DELAY_MS: 1000,
};

/**
 * Constants for key storage
 */
export const StorageConstants = {
  KEY_PREFIX: "ai_key_",
  SETTINGS_KEY: "ai_settings",
  PRIORITY_KEY: "ai_priority",
  SCREENSHOT_ENABLED_KEY: "screenshot_monitoring_enabled",
  DB_NAME: "moneymanager_keys",
  DB_VERSION: 1,
  STORE_NAME: "api_keys",
  SETTINGS_STORE_NAME: "settings",
};

/**
 * Constants for parsing
 */
export const ParseConstants = {
  DEFAULT_TIMEOUT_MS: 30000, // 30 seconds
  MAX_FALLBACK_ATTEMPTS: 3,
  MIN_CONFIDENCE_THRESHOLD: 0.5,
  DEFAULT_PRIORITY: ["groq", "gemini", "chatgpt"],
};

/**
 * Create a standardized error object
 * @param {string} type - Error type from one of the error type constants
 * @param {string} message - Error message
 * @param {Object} [details] - Additional error details
 * @returns {Error} Error object with type and details
 */
export function createError(type, message, details = {}) {
  const error = new Error(message);
  error.type = type;
  error.details = details;
  return error;
}

/**
 * Get user-friendly error message for a validation error
 * @param {string} errorType - Error type from ValidationErrorType
 * @returns {string} User-friendly error message
 */
export function getValidationErrorMessage(errorType) {
  return (
    ValidationErrorMessages[errorType] ||
    ValidationErrorMessages[ValidationErrorType.UNKNOWN]
  );
}

/**
 * Get user-friendly error message for a storage error
 * @param {string} errorType - Error type from StorageErrorType
 * @returns {string} User-friendly error message
 */
export function getStorageErrorMessage(errorType) {
  return (
    StorageErrorMessages[errorType] ||
    StorageErrorMessages[StorageErrorType.UNKNOWN]
  );
}

/**
 * Get user-friendly error message for a parse error
 * @param {string} errorType - Error type from ParseErrorType
 * @returns {string} User-friendly error message
 */
export function getParseErrorMessage(errorType) {
  return (
    ParseErrorMessages[errorType] || ParseErrorMessages[ParseErrorType.UNKNOWN]
  );
}

/**
 * Redact API key from string (for logging)
 * Replaces the key with asterisks, showing only last 4 characters
 * @param {string} text - Text that may contain API key
 * @param {string} key - API key to redact
 * @returns {string} Text with redacted key
 */
export function redactKey(text, key) {
  if (!key || key.length < 8) return text;
  const last4 = key.slice(-4);
  const redacted = "***" + last4;
  return text.replace(new RegExp(key, "g"), redacted);
}

/**
 * Mask API key for display (show only last 4 characters)
 * @param {string} key - API key to mask
 * @returns {string} Masked key (e.g., "sk-...xyz123")
 */
export function maskKey(key) {
  if (!key || key.length < 8) return "****";
  const prefix = key.split("-")[0] || key.substring(0, 2);
  const last4 = key.slice(-4);
  return `${prefix}-...${last4}`;
}
