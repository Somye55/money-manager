/**
 * KeyStorage - Base interface and abstract class for secure API key storage
 *
 * This module provides the foundation for platform-specific key storage implementations.
 * It defines the interface that all storage implementations must follow and provides
 * common validation logic shared across platforms.
 *
 * Requirements: 1.3, 1.4, 7.1, 7.2, 10.2
 */

/**
 * Supported AI providers
 */
export const PROVIDERS = {
  CHATGPT: "chatgpt",
  GROQ: "groq",
  GEMINI: "gemini",
};

/**
 * Valid provider names
 */
export const VALID_PROVIDERS = Object.values(PROVIDERS);

/**
 * KeyStorage Interface
 *
 * Defines the contract that all platform-specific storage implementations must follow.
 * This ensures consistent behavior across web and Android platforms.
 */
export class KeyStorageInterface {
  /**
   * Store an encrypted API key
   * @param {string} provider - Provider name ('chatgpt' | 'groq' | 'gemini')
   * @param {string} key - API key to store
   * @returns {Promise<void>}
   * @throws {Error} If storage fails
   */
  async setKey(provider, key) {
    throw new Error("setKey() must be implemented by subclass");
  }

  /**
   * Retrieve and decrypt an API key
   * @param {string} provider - Provider name
   * @returns {Promise<string|null>} Decrypted key or null if not found
   * @throws {Error} If retrieval fails
   */
  async getKey(provider) {
    throw new Error("getKey() must be implemented by subclass");
  }

  /**
   * Remove an API key from storage
   * @param {string} provider - Provider name
   * @returns {Promise<void>}
   * @throws {Error} If removal fails
   */
  async removeKey(provider) {
    throw new Error("removeKey() must be implemented by subclass");
  }

  /**
   * Check if a key exists for a provider
   * @param {string} provider - Provider name
   * @returns {Promise<boolean>} True if key exists
   */
  async hasKey(provider) {
    throw new Error("hasKey() must be implemented by subclass");
  }

  /**
   * Get list of all providers with stored keys
   * @returns {Promise<string[]>} Array of provider names
   */
  async getProviders() {
    throw new Error("getProviders() must be implemented by subclass");
  }

  /**
   * Clear all stored keys
   * @returns {Promise<void>}
   * @throws {Error} If clearing fails
   */
  async clearAll() {
    throw new Error("clearAll() must be implemented by subclass");
  }
}

/**
 * BaseKeyStorage - Abstract base class with common validation logic
 *
 * Provides shared functionality that both web and Android implementations can use.
 * Includes input validation, error handling, and security checks.
 */
export class BaseKeyStorage extends KeyStorageInterface {
  /**
   * Validate provider name
   * @param {string} provider - Provider name to validate
   * @throws {Error} If provider is invalid
   */
  validateProvider(provider) {
    if (!provider || typeof provider !== "string") {
      throw new Error("Provider must be a non-empty string");
    }

    if (!VALID_PROVIDERS.includes(provider)) {
      throw new Error(
        `Invalid provider: ${provider}. Must be one of: ${VALID_PROVIDERS.join(", ")}`,
      );
    }
  }

  /**
   * Validate API key format
   * @param {string} key - API key to validate
   * @throws {Error} If key is invalid
   */
  validateKey(key) {
    if (!key || typeof key !== "string") {
      throw new Error("API key must be a non-empty string");
    }

    if (key.trim().length === 0) {
      throw new Error("API key cannot be empty or whitespace");
    }

    // Basic length check - most API keys are at least 20 characters
    if (key.length < 20) {
      throw new Error("API key appears to be too short");
    }

    // Check for common placeholder values
    const placeholders = [
      "your-api-key",
      "api-key-here",
      "replace-me",
      "xxx",
      "test",
    ];
    if (
      placeholders.some((placeholder) =>
        key.toLowerCase().includes(placeholder),
      )
    ) {
      throw new Error("API key appears to be a placeholder value");
    }
  }

  /**
   * Sanitize provider name (lowercase, trim)
   * @param {string} provider - Provider name
   * @returns {string} Sanitized provider name
   */
  sanitizeProvider(provider) {
    return provider.toLowerCase().trim();
  }

  /**
   * Sanitize API key (trim whitespace)
   * @param {string} key - API key
   * @returns {string} Sanitized key
   */
  sanitizeKey(key) {
    return key.trim();
  }

  /**
   * Redact API key for logging (show only last 4 characters)
   * @param {string} key - API key to redact
   * @returns {string} Redacted key (e.g., "****xyz123")
   */
  redactKey(key) {
    if (!key || key.length < 4) {
      return "****";
    }
    return "****" + key.slice(-4);
  }

  /**
   * Validate and sanitize inputs before storage operations
   * @param {string} provider - Provider name
   * @param {string} key - API key
   * @returns {{provider: string, key: string}} Sanitized inputs
   * @throws {Error} If validation fails
   */
  validateAndSanitize(provider, key) {
    // Sanitize first
    const sanitizedProvider = this.sanitizeProvider(provider);
    const sanitizedKey = this.sanitizeKey(key);

    // Then validate
    this.validateProvider(sanitizedProvider);
    this.validateKey(sanitizedKey);

    return {
      provider: sanitizedProvider,
      key: sanitizedKey,
    };
  }

  /**
   * Handle storage errors with consistent error messages
   * @param {Error} error - Original error
   * @param {string} operation - Operation that failed
   * @returns {Error} Formatted error
   */
  handleStorageError(error, operation) {
    const message = `Key storage ${operation} failed: ${error.message}`;
    const storageError = new Error(message);
    storageError.originalError = error;
    return storageError;
  }

  /**
   * setKey implementation with validation
   * Subclasses should call this via super.setKey() or implement their own validation
   */
  async setKey(provider, key) {
    try {
      const { provider: validProvider, key: validKey } =
        this.validateAndSanitize(provider, key);
      // Subclasses must implement actual storage logic
      throw new Error("setKey() storage logic must be implemented by subclass");
    } catch (error) {
      throw this.handleStorageError(error, "setKey");
    }
  }

  /**
   * getKey implementation with validation
   * Subclasses should call this via super.getKey() or implement their own validation
   */
  async getKey(provider) {
    try {
      const sanitizedProvider = this.sanitizeProvider(provider);
      this.validateProvider(sanitizedProvider);
      // Subclasses must implement actual retrieval logic
      throw new Error(
        "getKey() retrieval logic must be implemented by subclass",
      );
    } catch (error) {
      throw this.handleStorageError(error, "getKey");
    }
  }

  /**
   * removeKey implementation with validation
   * Subclasses should call this via super.removeKey() or implement their own validation
   */
  async removeKey(provider) {
    try {
      const sanitizedProvider = this.sanitizeProvider(provider);
      this.validateProvider(sanitizedProvider);
      // Subclasses must implement actual removal logic
      throw new Error(
        "removeKey() removal logic must be implemented by subclass",
      );
    } catch (error) {
      throw this.handleStorageError(error, "removeKey");
    }
  }

  /**
   * hasKey implementation with validation
   * Subclasses should call this via super.hasKey() or implement their own validation
   */
  async hasKey(provider) {
    try {
      const sanitizedProvider = this.sanitizeProvider(provider);
      this.validateProvider(sanitizedProvider);
      // Subclasses must implement actual check logic
      throw new Error("hasKey() check logic must be implemented by subclass");
    } catch (error) {
      throw this.handleStorageError(error, "hasKey");
    }
  }

  /**
   * getProviders implementation
   * Subclasses must implement this method
   */
  async getProviders() {
    throw new Error("getProviders() must be implemented by subclass");
  }

  /**
   * clearAll implementation
   * Subclasses must implement this method
   */
  async clearAll() {
    throw new Error("clearAll() must be implemented by subclass");
  }
}

/**
 * Export default base class for platform-specific implementations to extend
 */
export default BaseKeyStorage;
