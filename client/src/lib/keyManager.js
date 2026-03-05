/**
 * Key Manager
 *
 * Coordinates key operations between storage and validation layers.
 * Manages the complete lifecycle of API keys including validation before storage,
 * status tracking, and secure retrieval.
 *
 * Requirements: 1.1, 1.2, 1.3, 1.5, 2.1, 2.2, 2.3, 3.3, 7.5, 7.6
 */

import { getKeyStorage } from "./keyStorageFactory.js";
import { keyValidator } from "./keyValidator.js";
import { getProvider, isValidProvider } from "./aiProviders.js";

/**
 * KeyManager class for managing API key lifecycle
 */
export class KeyManager {
  constructor() {
    // Cache for key statuses to avoid repeated storage reads
    this._statusCache = new Map();
  }

  /**
   * Add or update an API key
   * Validates the key before storing it
   *
   * @param {'chatgpt'|'groq'|'gemini'} provider - Provider name
   * @param {string} key - API key to store
   * @returns {Promise<Result>} Operation result
   */
  async setKey(provider, key) {
    try {
      // Validate provider name
      if (!isValidProvider(provider)) {
        return {
          success: false,
          error: `Invalid provider: ${provider}`,
        };
      }

      // Validate key format
      const providerConfig = getProvider(provider);
      if (!providerConfig.keyFormat.test(key)) {
        return {
          success: false,
          error: `Invalid key format for ${providerConfig.displayName}`,
        };
      }

      // Validate key with provider
      const validationResult = await keyValidator.validate(provider, key);
      if (!validationResult.valid) {
        return {
          success: false,
          error: validationResult.error || "Key validation failed",
        };
      }

      // Store the key
      const storage = await getKeyStorage();
      await storage.setKey(provider, key);

      // Update status cache
      this._updateStatusCache(provider, {
        configured: true,
        valid: true,
        lastTested: Date.now(),
        maskedKey: this._maskKey(key),
        error: null,
      });

      return { success: true };
    } catch (error) {
      // Ensure API keys never appear in error messages
      const sanitizedError = this._sanitizeError(error);
      console.error(
        `[KeyManager] Failed to set key for ${provider}:`,
        sanitizedError,
      );
      return {
        success: false,
        error: "Failed to save API key. Please try again.",
      };
    }
  }

  /**
   * Remove an API key
   *
   * @param {string} provider - Provider name
   * @returns {Promise<Result>} Operation result
   */
  async removeKey(provider) {
    try {
      // Validate provider name
      if (!isValidProvider(provider)) {
        return {
          success: false,
          error: `Invalid provider: ${provider}`,
        };
      }

      // Remove from storage
      const storage = await getKeyStorage();
      await storage.removeKey(provider);

      // Update status cache
      this._updateStatusCache(provider, {
        configured: false,
        valid: null,
        lastTested: null,
        maskedKey: null,
        error: null,
      });

      // Check if any keys remain
      const hasKey = await this.hasValidKey();

      // Automatically disable screenshot monitoring if no keys remain
      if (!hasKey) {
        await storage.setSetting("screenshot_monitoring_enabled", false);
      }

      return { success: true };
    } catch (error) {
      const sanitizedError = this._sanitizeError(error);
      console.error(
        `[KeyManager] Failed to remove key for ${provider}:`,
        sanitizedError,
      );
      return {
        success: false,
        error: "Failed to remove API key. Please try again.",
      };
    }
  }

  /**
   * Test a stored API key
   *
   * @param {string} provider - Provider name
   * @returns {Promise<Result>} Operation result with validation details
   */
  async testKey(provider) {
    try {
      // Validate provider name
      if (!isValidProvider(provider)) {
        return {
          success: false,
          error: `Invalid provider: ${provider}`,
        };
      }

      // Get key from storage
      const storage = await getKeyStorage();
      const key = await storage.getKey(provider);

      if (!key) {
        return {
          success: false,
          error: `No API key configured for ${provider}`,
        };
      }

      // Validate the key
      const validationResult = await keyValidator.validate(provider, key);

      // Update status cache
      this._updateStatusCache(provider, {
        configured: true,
        valid: validationResult.valid,
        lastTested: Date.now(),
        maskedKey: this._maskKey(key),
        error: validationResult.valid ? null : validationResult.error,
      });

      if (validationResult.valid) {
        return { success: true };
      } else {
        return {
          success: false,
          error: validationResult.error || "Key validation failed",
        };
      }
    } catch (error) {
      const sanitizedError = this._sanitizeError(error);
      console.error(
        `[KeyManager] Failed to test key for ${provider}:`,
        sanitizedError,
      );
      return {
        success: false,
        error: "Failed to test API key. Please try again.",
      };
    }
  }

  /**
   * Get status of all providers
   *
   * @returns {Promise<{[provider: string]: KeyStatus}>} Status for each provider
   */
  async getKeyStatuses() {
    try {
      const storage = await getKeyStorage();
      const providers = await storage.getProviders();
      const statuses = {};

      // Get status for each configured provider
      for (const provider of providers) {
        // Check cache first
        if (this._statusCache.has(provider)) {
          statuses[provider] = this._statusCache.get(provider);
        } else {
          // Load from storage
          const key = await storage.getKey(provider);
          if (key) {
            const status = {
              configured: true,
              valid: null, // Not tested yet
              lastTested: null,
              maskedKey: this._maskKey(key),
              error: null,
            };
            this._updateStatusCache(provider, status);
            statuses[provider] = status;
          }
        }
      }

      // Add unconfigured providers
      const allProviders = ["chatgpt", "groq", "gemini"];
      for (const provider of allProviders) {
        if (!statuses[provider]) {
          statuses[provider] = {
            configured: false,
            valid: null,
            lastTested: null,
            maskedKey: null,
            error: null,
          };
        }
      }

      return statuses;
    } catch (error) {
      const sanitizedError = this._sanitizeError(error);
      console.error("[KeyManager] Failed to get key statuses:", sanitizedError);
      return {
        chatgpt: {
          configured: false,
          valid: null,
          lastTested: null,
          maskedKey: null,
          error: null,
        },
        groq: {
          configured: false,
          valid: null,
          lastTested: null,
          maskedKey: null,
          error: null,
        },
        gemini: {
          configured: false,
          valid: null,
          lastTested: null,
          maskedKey: null,
          error: null,
        },
      };
    }
  }

  /**
   * Check if any valid key exists
   *
   * @returns {Promise<boolean>} True if at least one valid key exists
   */
  async hasValidKey() {
    try {
      const storage = await getKeyStorage();
      const providers = await storage.getProviders();

      // Check if any provider has a key
      return providers.length > 0;
    } catch (error) {
      const sanitizedError = this._sanitizeError(error);
      console.error(
        "[KeyManager] Failed to check for valid keys:",
        sanitizedError,
      );
      return false;
    }
  }

  /**
   * Set provider priority order
   * Determines which provider to try first when multiple keys are configured
   *
   * @param {string[]} providers - Array of provider names in priority order
   * @returns {Promise<void>}
   */
  async setPriority(providers) {
    try {
      // Validate that all providers are valid
      for (const provider of providers) {
        if (!isValidProvider(provider)) {
          throw new Error(`Invalid provider in priority list: ${provider}`);
        }
      }

      // Store priority order in settings
      const storage = await getKeyStorage();
      await storage.setSetting("priority", providers);
    } catch (error) {
      const sanitizedError = this._sanitizeError(error);
      console.error("[KeyManager] Failed to set priority:", sanitizedError);
      throw new Error("Failed to save provider priority order");
    }
  }

  /**
   * Get provider priority order
   * Returns user-defined priority or default order
   *
   * @returns {Promise<string[]>} Array of provider names in priority order
   */
  async getPriority() {
    try {
      const storage = await getKeyStorage();
      const priority = await storage.getSetting("priority");

      // Return stored priority or default order
      if (priority && Array.isArray(priority) && priority.length > 0) {
        return priority;
      }

      // Default priority order: groq, gemini, chatgpt
      return ["groq", "gemini", "chatgpt"];
    } catch (error) {
      const sanitizedError = this._sanitizeError(error);
      console.error("[KeyManager] Failed to get priority:", sanitizedError);
      // Return default on error
      return ["groq", "gemini", "chatgpt"];
    }
  }

  /**
   * Get the first valid API key based on priority order
   * Used to select which provider to use for parsing
   *
   * @returns {Promise<{provider: string, key: string}|null>} Active provider and key, or null if none available
   */
  async getActiveKey() {
    try {
      const storage = await getKeyStorage();
      const priority = await this.getPriority();

      // Try each provider in priority order
      for (const provider of priority) {
        const key = await storage.getKey(provider);
        if (key) {
          return { provider, key };
        }
      }

      // No valid keys found
      return null;
    } catch (error) {
      const sanitizedError = this._sanitizeError(error);
      console.error("[KeyManager] Failed to get active key:", sanitizedError);
      return null;
    }
  }

  /**
   * Get the next fallback API key after a provider fails
   * Used to implement automatic fallback when primary provider fails
   *
   * @param {string} failedProvider - Provider that just failed
   * @returns {Promise<{provider: string, key: string}|null>} Next provider and key, or null if no more fallbacks
   */
  async getNextKey(failedProvider) {
    try {
      const storage = await getKeyStorage();
      const priority = await this.getPriority();

      // Find the failed provider in priority list
      const failedIndex = priority.indexOf(failedProvider);

      // If failed provider not in list or is last, no fallback available
      if (failedIndex === -1 || failedIndex === priority.length - 1) {
        return null;
      }

      // Try remaining providers in priority order
      for (let i = failedIndex + 1; i < priority.length; i++) {
        const provider = priority[i];
        const key = await storage.getKey(provider);
        if (key) {
          return { provider, key };
        }
      }

      // No fallback keys found
      return null;
    } catch (error) {
      const sanitizedError = this._sanitizeError(error);
      console.error("[KeyManager] Failed to get next key:", sanitizedError);
      return null;
    }
  }
  /**
   * Check if screenshot monitoring can be enabled
   * Requires at least one valid API key to be configured
   *
   * @returns {Promise<boolean>} True if screenshot monitoring can be enabled
   */
  async canEnableScreenshotMonitoring() {
    try {
      return await this.hasValidKey();
    } catch (error) {
      const sanitizedError = this._sanitizeError(error);
      console.error(
        "[KeyManager] Failed to check screenshot monitoring eligibility:",
        sanitizedError,
      );
      return false;
    }
  }

  /**
   * Get screenshot monitoring state
   *
   * @returns {Promise<boolean>} True if screenshot monitoring is enabled
   */
  async getScreenshotMonitoringEnabled() {
    try {
      const storage = await getKeyStorage();
      const enabled = await storage.getSetting("screenshot_monitoring_enabled");

      // Default to false if not set
      return enabled === true;
    } catch (error) {
      const sanitizedError = this._sanitizeError(error);
      console.error(
        "[KeyManager] Failed to get screenshot monitoring state:",
        sanitizedError,
      );
      return false;
    }
  }

  /**
   * Set screenshot monitoring state
   * Validates that at least one valid key exists before enabling
   *
   * @param {boolean} enabled - Whether to enable screenshot monitoring
   * @returns {Promise<Result>} Operation result
   */
  async setScreenshotMonitoringEnabled(enabled) {
    try {
      // If enabling, check that at least one valid key exists
      if (enabled) {
        const hasKey = await this.hasValidKey();
        if (!hasKey) {
          return {
            success: false,
            error:
              "Cannot enable screenshot monitoring without a valid API key",
          };
        }
      }

      // Store the setting
      const storage = await getKeyStorage();
      await storage.setSetting("screenshot_monitoring_enabled", enabled);

      return { success: true };
    } catch (error) {
      const sanitizedError = this._sanitizeError(error);
      console.error(
        "[KeyManager] Failed to set screenshot monitoring state:",
        sanitizedError,
      );
      return {
        success: false,
        error: "Failed to update screenshot monitoring setting",
      };
    }
  }

  /**
   * Mask an API key for display (show only last 4 characters)
   * @private
   * @param {string} key - API key to mask
   * @returns {string} Masked key (e.g., "sk-...xyz123")
   */
  _maskKey(key) {
    if (!key || key.length < 4) {
      return "****";
    }
    const last4 = key.slice(-4);
    const prefix = key.split("-")[0] || "key";
    return `${prefix}-...${last4}`;
  }

  /**
   * Update status cache for a provider
   * @private
   * @param {string} provider - Provider name
   * @param {KeyStatus} status - Status to cache
   */
  _updateStatusCache(provider, status) {
    this._statusCache.set(provider, status);
  }

  /**
   * Sanitize error messages to ensure API keys never appear
   * @private
   * @param {Error|string} error - Error to sanitize
   * @returns {string} Sanitized error message
   */
  _sanitizeError(error) {
    const message = error?.message || String(error);

    // Remove anything that looks like an API key
    // ChatGPT: sk-...
    // Groq: gsk_...
    // Gemini: AIza...
    const sanitized = message
      .replace(/sk-[A-Za-z0-9]{48,}/g, "[REDACTED]")
      .replace(/gsk_[A-Za-z0-9]{52,}/g, "[REDACTED]")
      .replace(/AIza[A-Za-z0-9_-]{35,}/g, "[REDACTED]");

    return sanitized;
  }
}

// Export singleton instance
export const keyManager = new KeyManager();
