/**
 * Type Definitions for AI Key Management
 *
 * This file contains JSDoc type definitions for the BYOK feature.
 * While the project uses JavaScript, these JSDoc types provide
 * IDE autocomplete and type checking support.
 */

/**
 * Status of an API key for a specific provider
 * @typedef {Object} KeyStatus
 * @property {'chatgpt'|'groq'|'gemini'} provider - Provider name
 * @property {boolean} configured - Whether a key exists in storage
 * @property {boolean|null} valid - Validation result (null = not tested yet)
 * @property {number|null} lastTested - Timestamp of last validation (null if never tested)
 * @property {string|null} maskedKey - Masked key showing last 4 characters (e.g., "sk-...xyz123")
 * @property {string|null} error - Last error message if validation failed
 */

/**
 * Result of key validation
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether the key is valid
 * @property {string} [error] - Error message if validation failed
 * @property {'invalid_key'|'network_error'|'rate_limit'|'timeout'} [errorType] - Type of error
 */

/**
 * Request to parse expense data using AI
 * @typedef {Object} ParseRequest
 * @property {'chatgpt'|'groq'|'gemini'} provider - AI provider to use
 * @property {string} key - API key for the provider
 * @property {string} text - Text to parse (OCR output, notification text, etc.)
 * @property {'ocr'|'screenshot'|'notification'} source - Source of the text
 * @property {Object} [metadata] - Optional metadata
 * @property {string} [metadata.imageUri] - URI of screenshot image
 * @property {number} [metadata.timestamp] - Timestamp of the expense
 * @property {string} [metadata.appName] - App name for notification source
 */

/**
 * Response from expense parsing
 * @typedef {Object} ParseResponse
 * @property {boolean} success - Whether parsing succeeded
 * @property {ExpenseData} [data] - Parsed expense data (if successful)
 * @property {string} [error] - Error message (if failed)
 * @property {string} provider - Provider that was used
 * @property {number} confidence - Confidence score (0-1)
 * @property {number} processingTime - Time taken to process in milliseconds
 */

/**
 * Parsed expense data
 * @typedef {Object} ExpenseData
 * @property {number} amount - Expense amount
 * @property {string} merchant - Merchant name
 * @property {'debit'|'credit'} type - Transaction type
 * @property {number} confidence - Confidence score (0-1)
 * @property {number} timestamp - Timestamp of the expense
 * @property {string} rawText - Original text that was parsed
 * @property {string} [category] - Optional AI-suggested category
 */

/**
 * Result of an operation (generic success/error result)
 * @typedef {Object} Result
 * @property {boolean} success - Whether the operation succeeded
 * @property {string} [error] - Error message if operation failed
 */

/**
 * Provider configuration
 * @typedef {Object} ProviderConfig
 * @property {'chatgpt'|'groq'|'gemini'} name - Provider identifier
 * @property {string} displayName - Human-readable provider name
 * @property {string} apiEndpoint - API endpoint for parsing requests
 * @property {string} testEndpoint - API endpoint for validation
 * @property {RegExp} keyFormat - Regular expression for key format validation
 * @property {string} helpUrl - URL where users can get API keys
 * @property {string} icon - Icon identifier for UI
 * @property {string} color - Brand color for UI (hex code)
 */

// Export empty object to make this a module
export {};
