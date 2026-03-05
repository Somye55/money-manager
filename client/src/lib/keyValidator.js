/**
 * Key Validator
 *
 * Validates API keys by testing them against their respective AI providers.
 * Each provider has a different API endpoint and authentication method.
 * Distinguishes between different error types (invalid key, network error, rate limit, timeout).
 *
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

import { getProvider } from "./aiProviders.js";
import {
  ValidationErrorType,
  getValidationErrorMessage,
  ValidationConstants,
} from "./aiErrors.js";

/**
 * KeyValidator class for testing API keys against AI providers
 */
export class KeyValidator {
  /**
   * Validate an API key by testing it with the provider
   * @param {string} provider - Provider name ('chatgpt', 'groq', or 'gemini')
   * @param {string} key - API key to validate
   * @returns {Promise<ValidationResult>} Validation result
   */
  async validate(provider, key) {
    if (!provider || !key) {
      return {
        valid: false,
        error: "Provider and key are required",
        errorType: ValidationErrorType.INVALID_KEY,
      };
    }

    // Route to provider-specific validator
    switch (provider) {
      case "chatgpt":
        return await this.testChatGPT(key);
      case "groq":
        return await this.testGroq(key);
      case "gemini":
        return await this.testGemini(key);
      default:
        return {
          valid: false,
          error: `Unknown provider: ${provider}`,
          errorType: ValidationErrorType.INVALID_KEY,
        };
    }
  }

  /**
   * Test ChatGPT (OpenAI) API key
   * @param {string} key - OpenAI API key
   * @returns {Promise<ValidationResult>} Validation result
   */
  async testChatGPT(key) {
    const providerConfig = getProvider("chatgpt");
    if (!providerConfig) {
      return {
        valid: false,
        error: "ChatGPT provider configuration not found",
        errorType: ValidationErrorType.UNKNOWN,
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        ValidationConstants.TIMEOUT_MS,
      );

      const response = await fetch(providerConfig.testEndpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return { valid: true };
      }

      // Handle error responses
      return this._handleErrorResponse(response.status, await response.text());
    } catch (error) {
      return this._handleException(error);
    }
  }

  /**
   * Test Groq API key
   * @param {string} key - Groq API key
   * @returns {Promise<ValidationResult>} Validation result
   */
  async testGroq(key) {
    const providerConfig = getProvider("groq");
    if (!providerConfig) {
      return {
        valid: false,
        error: "Groq provider configuration not found",
        errorType: ValidationErrorType.UNKNOWN,
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        ValidationConstants.TIMEOUT_MS,
      );

      const response = await fetch(providerConfig.testEndpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return { valid: true };
      }

      // Handle error responses
      return this._handleErrorResponse(response.status, await response.text());
    } catch (error) {
      return this._handleException(error);
    }
  }

  /**
   * Test Gemini (Google) API key
   * @param {string} key - Gemini API key
   * @returns {Promise<ValidationResult>} Validation result
   */
  async testGemini(key) {
    const providerConfig = getProvider("gemini");
    if (!providerConfig) {
      return {
        valid: false,
        error: "Gemini provider configuration not found",
        errorType: ValidationErrorType.UNKNOWN,
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        ValidationConstants.TIMEOUT_MS,
      );

      // Gemini uses API key as query parameter
      const url = `${providerConfig.testEndpoint}?key=${key}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return { valid: true };
      }

      // Handle error responses
      return this._handleErrorResponse(response.status, await response.text());
    } catch (error) {
      return this._handleException(error);
    }
  }

  /**
   * Handle HTTP error responses
   * @private
   * @param {number} status - HTTP status code
   * @param {string} responseText - Response body text
   * @returns {ValidationResult} Validation result with error details
   */
  _handleErrorResponse(status, responseText) {
    let errorType;
    let errorMessage;

    switch (status) {
      case 401:
      case 403:
        errorType = ValidationErrorType.INVALID_KEY;
        errorMessage = getValidationErrorMessage(errorType);
        break;
      case 429:
        errorType = ValidationErrorType.RATE_LIMIT;
        errorMessage = getValidationErrorMessage(errorType);
        break;
      default:
        errorType = ValidationErrorType.NETWORK_ERROR;
        errorMessage = `Request failed with status ${status}`;
    }

    return {
      valid: false,
      error: errorMessage,
      errorType,
    };
  }

  /**
   * Handle exceptions during validation
   * @private
   * @param {Error} error - Exception that was thrown
   * @returns {ValidationResult} Validation result with error details
   */
  _handleException(error) {
    // Check if it's an abort error (timeout)
    if (error.name === "AbortError") {
      return {
        valid: false,
        error: getValidationErrorMessage(ValidationErrorType.TIMEOUT),
        errorType: ValidationErrorType.TIMEOUT,
      };
    }

    // Check for network errors
    if (
      error.message.includes("fetch") ||
      error.message.includes("network") ||
      error.message.includes("Failed to fetch")
    ) {
      return {
        valid: false,
        error: getValidationErrorMessage(ValidationErrorType.NETWORK_ERROR),
        errorType: ValidationErrorType.NETWORK_ERROR,
      };
    }

    // Unknown error
    return {
      valid: false,
      error:
        error.message || getValidationErrorMessage(ValidationErrorType.UNKNOWN),
      errorType: ValidationErrorType.UNKNOWN,
    };
  }
}

// Export singleton instance
export const keyValidator = new KeyValidator();
