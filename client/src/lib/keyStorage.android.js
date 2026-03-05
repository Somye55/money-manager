/**
 * AndroidKeyStorage - Android platform implementation using Android Keystore
 *
 * This module implements secure key storage for Android using:
 * - Android Keystore System (hardware-backed when available)
 * - SharedPreferences for encrypted data storage
 * - Capacitor plugin bridge for native code communication
 *
 * Requirements: 1.3, 1.4, 7.2, 10.2
 */

import { BaseKeyStorage } from "./keyStorage.js";
import { Capacitor } from "@capacitor/core";
import { SecureStorage } from "../plugins/SecureStorage.js";

/**
 * Storage key prefix for API keys
 */
const KEY_PREFIX = "ai_key_";

/**
 * Storage key for metadata
 */
const METADATA_PREFIX = "ai_key_metadata_";

/**
 * AndroidKeyStorage - Secure key storage for Android platform
 *
 * Uses Android Keystore via Capacitor plugin for hardware-backed encryption.
 * All API keys are encrypted by the Android Keystore before storage in SharedPreferences.
 */
export class AndroidKeyStorage extends BaseKeyStorage {
  constructor() {
    super();
    this.isAndroid = Capacitor.getPlatform() === "android";
  }

  /**
   * Get the SecureStorage plugin
   * @returns {Object} Plugin instance
   * @throws {Error} If plugin is not available
   * @private
   */
  getPlugin() {
    if (!this.isAndroid) {
      throw new Error(
        "AndroidKeyStorage is only available on Android platform",
      );
    }

    return SecureStorage;
  }

  /**
   * Store an encrypted API key
   * @param {string} provider - Provider name
   * @param {string} key - API key to store
   * @returns {Promise<void>}
   */
  async setKey(provider, key) {
    try {
      // Validate and sanitize inputs
      const { provider: validProvider, key: validKey } =
        this.validateAndSanitize(provider, key);

      // Get plugin
      const plugin = this.getPlugin();

      // Store key using native plugin (encryption handled by Android Keystore)
      const storageKey = KEY_PREFIX + validProvider;
      await plugin.set({
        key: storageKey,
        value: validKey,
      });

      // Store metadata
      const metadata = {
        provider: validProvider,
        createdAt: Date.now(),
        lastTested: null,
        valid: null,
      };

      const metadataKey = METADATA_PREFIX + validProvider;
      await plugin.set({
        key: metadataKey,
        value: JSON.stringify(metadata),
      });

      console.log(
        `[AndroidKeyStorage] Successfully stored key for ${validProvider}`,
      );
    } catch (error) {
      throw this.handleStorageError(error, "setKey");
    }
  }

  /**
   * Retrieve and decrypt an API key
   * @param {string} provider - Provider name
   * @returns {Promise<string|null>}
   */
  async getKey(provider) {
    try {
      // Validate provider
      const sanitizedProvider = this.sanitizeProvider(provider);
      this.validateProvider(sanitizedProvider);

      // Get plugin
      const plugin = this.getPlugin();

      // Retrieve key using native plugin (decryption handled by Android Keystore)
      const storageKey = KEY_PREFIX + sanitizedProvider;
      const result = await plugin.get({ key: storageKey });

      if (!result || result.value === null || result.value === undefined) {
        return null;
      }

      console.log(
        `[AndroidKeyStorage] Successfully retrieved key for ${sanitizedProvider}`,
      );
      return result.value;
    } catch (error) {
      // If key doesn't exist, return null instead of throwing
      if (error.message && error.message.includes("not found")) {
        return null;
      }
      throw this.handleStorageError(error, "getKey");
    }
  }

  /**
   * Remove an API key from storage
   * @param {string} provider - Provider name
   * @returns {Promise<void>}
   */
  async removeKey(provider) {
    try {
      // Validate provider
      const sanitizedProvider = this.sanitizeProvider(provider);
      this.validateProvider(sanitizedProvider);

      // Get plugin
      const plugin = this.getPlugin();

      // Remove key
      const storageKey = KEY_PREFIX + sanitizedProvider;
      await plugin.remove({ key: storageKey });

      // Remove metadata
      const metadataKey = METADATA_PREFIX + sanitizedProvider;
      await plugin.remove({ key: metadataKey });

      console.log(
        `[AndroidKeyStorage] Successfully removed key for ${sanitizedProvider}`,
      );
    } catch (error) {
      // Ignore errors if key doesn't exist
      if (error.message && error.message.includes("not found")) {
        return;
      }
      throw this.handleStorageError(error, "removeKey");
    }
  }

  /**
   * Check if a key exists for a provider
   * @param {string} provider - Provider name
   * @returns {Promise<boolean>}
   */
  async hasKey(provider) {
    try {
      // Validate provider
      const sanitizedProvider = this.sanitizeProvider(provider);
      this.validateProvider(sanitizedProvider);

      // Try to get the key
      const key = await this.getKey(sanitizedProvider);
      return key !== null;
    } catch (error) {
      throw this.handleStorageError(error, "hasKey");
    }
  }

  /**
   * Get list of all providers with stored keys
   * @returns {Promise<string[]>}
   */
  async getProviders() {
    try {
      const providers = [];

      // Check each known provider
      const { VALID_PROVIDERS } = await import("./keyStorage.js");

      for (const provider of VALID_PROVIDERS) {
        const hasKey = await this.hasKey(provider);
        if (hasKey) {
          providers.push(provider);
        }
      }

      return providers;
    } catch (error) {
      throw this.handleStorageError(error, "getProviders");
    }
  }

  /**
   * Clear all stored keys
   * @returns {Promise<void>}
   */
  async clearAll() {
    try {
      const providers = await this.getProviders();

      // Remove each key
      for (const provider of providers) {
        await this.removeKey(provider);
      }

      console.log("[AndroidKeyStorage] Successfully cleared all keys");
    } catch (error) {
      throw this.handleStorageError(error, "clearAll");
    }
  }

  /**
   * Update key metadata (lastTested, valid status)
   * @param {string} provider - Provider name
   * @param {Object} metadata - Metadata to update
   * @returns {Promise<void>}
   */
  async updateKeyMetadata(provider, metadata) {
    try {
      const sanitizedProvider = this.sanitizeProvider(provider);
      this.validateProvider(sanitizedProvider);

      // Get plugin
      const plugin = this.getPlugin();

      // Get existing metadata
      const metadataKey = METADATA_PREFIX + sanitizedProvider;
      let existingMetadata = {};

      try {
        const result = await plugin.get({ key: metadataKey });
        if (result && result.value) {
          existingMetadata = JSON.parse(result.value);
        }
      } catch (error) {
        // Metadata doesn't exist yet, use empty object
      }

      // Merge metadata
      const updatedMetadata = {
        ...existingMetadata,
        ...metadata,
        provider: sanitizedProvider,
      };

      // Store updated metadata
      await plugin.set({
        key: metadataKey,
        value: JSON.stringify(updatedMetadata),
      });

      console.log(
        `[AndroidKeyStorage] Updated metadata for ${sanitizedProvider}`,
      );
    } catch (error) {
      throw this.handleStorageError(error, "updateKeyMetadata");
    }
  }

  /**
   * Get key metadata without decrypting the key
   * @param {string} provider - Provider name
   * @returns {Promise<Object|null>}
   */
  async getKeyMetadata(provider) {
    try {
      const sanitizedProvider = this.sanitizeProvider(provider);
      this.validateProvider(sanitizedProvider);

      // Get plugin
      const plugin = this.getPlugin();

      // Get metadata
      const metadataKey = METADATA_PREFIX + sanitizedProvider;
      const result = await plugin.get({ key: metadataKey });

      if (!result || result.value === null || result.value === undefined) {
        return null;
      }

      return JSON.parse(result.value);
    } catch (error) {
      // If metadata doesn't exist, return null
      if (error.message && error.message.includes("not found")) {
        return null;
      }
      throw this.handleStorageError(error, "getKeyMetadata");
    }
  }

  /**
   * Store a setting value
   * @param {string} key - Setting key (e.g., 'priority', 'screenshot_enabled')
   * @param {any} value - Setting value
   * @returns {Promise<void>}
   */
  async setSetting(key, value) {
    try {
      if (!key || typeof key !== "string") {
        throw new Error("Setting key must be a non-empty string");
      }

      // Get plugin
      const plugin = this.getPlugin();

      // Store setting
      const storageKey = `setting_${key}`;
      await plugin.set({
        key: storageKey,
        value: JSON.stringify({
          value: value,
          updatedAt: Date.now(),
        }),
      });

      // For screenshot_monitoring_enabled, also write to plain SharedPreferences
      // so the Android ScreenshotListenerService can read it
      if (key === "screenshot_monitoring_enabled") {
        try {
          await plugin.setPlainPreference({
            key: "screenshot_monitoring_enabled",
            value: value.toString(),
          });
          console.log(
            `[AndroidKeyStorage] Synced screenshot monitoring setting to SharedPreferences: ${value}`,
          );
        } catch (error) {
          console.warn(
            "[AndroidKeyStorage] Failed to sync to SharedPreferences:",
            error,
          );
        }
      }

      console.log(`[AndroidKeyStorage] Successfully stored setting: ${key}`);
    } catch (error) {
      throw this.handleStorageError(error, "setSetting");
    }
  }

  /**
   * Retrieve a setting value
   * @param {string} key - Setting key
   * @returns {Promise<any|null>} Setting value or null if not found
   */
  async getSetting(key) {
    try {
      if (!key || typeof key !== "string") {
        throw new Error("Setting key must be a non-empty string");
      }

      // Get plugin
      const plugin = this.getPlugin();

      // Retrieve setting
      const storageKey = `setting_${key}`;
      const result = await plugin.get({ key: storageKey });

      if (!result || result.value === null || result.value === undefined) {
        return null;
      }

      const parsed = JSON.parse(result.value);
      return parsed.value;
    } catch (error) {
      // If setting doesn't exist, return null
      if (error.message && error.message.includes("not found")) {
        return null;
      }
      throw this.handleStorageError(error, "getSetting");
    }
  }

  /**
   * Remove a setting
   * @param {string} key - Setting key
   * @returns {Promise<void>}
   */
  async removeSetting(key) {
    try {
      if (!key || typeof key !== "string") {
        throw new Error("Setting key must be a non-empty string");
      }

      // Get plugin
      const plugin = this.getPlugin();

      // Remove setting
      const storageKey = `setting_${key}`;
      await plugin.remove({ key: storageKey });

      console.log(`[AndroidKeyStorage] Successfully removed setting: ${key}`);
    } catch (error) {
      // Ignore errors if setting doesn't exist
      if (error.message && error.message.includes("not found")) {
        return;
      }
      throw this.handleStorageError(error, "removeSetting");
    }
  }
}

/**
 * Export singleton instance
 */
export default new AndroidKeyStorage();
