/**
 * WebKeyStorage - Web platform implementation using IndexedDB and Web Crypto API
 *
 * This module implements secure key storage for web browsers using:
 * - IndexedDB for persistent storage
 * - Web Crypto API (SubtleCrypto) for AES-256-GCM encryption
 * - PBKDF2 for key derivation with user-specific salt
 *
 * Requirements: 1.3, 1.4, 7.1, 7.2, 10.2
 */

import { BaseKeyStorage, VALID_PROVIDERS } from "./keyStorage.js";

/**
 * IndexedDB configuration
 */
const DB_NAME = "moneymanager_keys";
const DB_VERSION = 1;
const STORE_API_KEYS = "api_keys";
const STORE_SETTINGS = "settings";

/**
 * Encryption configuration
 */
const ENCRYPTION_ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits for GCM
const SALT_LENGTH = 16; // 128 bits
const PBKDF2_ITERATIONS = 100000;

/**
 * Storage keys
 */
const SALT_KEY = "encryption_salt";
const DERIVED_KEY_CACHE_KEY = "derived_key_cache";

/**
 * WebKeyStorage - Secure key storage for web platform
 *
 * Uses IndexedDB for persistence and Web Crypto API for encryption.
 * All API keys are encrypted with AES-256-GCM before storage.
 */
export class WebKeyStorage extends BaseKeyStorage {
  constructor() {
    super();
    this.db = null;
    this.derivedKeyCache = null; // Cache derived key in memory for performance
  }

  /**
   * Initialize IndexedDB database
   * @returns {Promise<IDBDatabase>}
   * @private
   */
  async initDB() {
    if (this.db) {
      return this.db;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error(`Failed to open IndexedDB: ${request.error}`));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create api_keys store
        if (!db.objectStoreNames.contains(STORE_API_KEYS)) {
          const apiKeysStore = db.createObjectStore(STORE_API_KEYS, {
            keyPath: "provider",
          });
          // Add indexes for querying
          apiKeysStore.createIndex("createdAt", "createdAt", { unique: false });
          apiKeysStore.createIndex("lastTested", "lastTested", {
            unique: false,
          });
        }

        // Create settings store
        if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
          db.createObjectStore(STORE_SETTINGS, { keyPath: "key" });
        }
      };
    });
  }

  /**
   * Get or create encryption salt
   * @returns {Promise<Uint8Array>}
   * @private
   */
  async getSalt() {
    const db = await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_SETTINGS], "readwrite");
      const store = transaction.objectStore(STORE_SETTINGS);
      const request = store.get(SALT_KEY);

      request.onsuccess = () => {
        if (request.result && request.result.value) {
          // Salt exists, return it
          resolve(new Uint8Array(request.result.value));
        } else {
          // Generate new salt
          const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));

          // Store salt
          const putRequest = store.put({
            key: SALT_KEY,
            value: Array.from(salt), // Convert to array for storage
          });

          putRequest.onsuccess = () => resolve(salt);
          putRequest.onerror = () =>
            reject(new Error(`Failed to store salt: ${putRequest.error}`));
        }
      };

      request.onerror = () => {
        reject(new Error(`Failed to retrieve salt: ${request.error}`));
      };
    });
  }

  /**
   * Derive encryption key from user-specific salt using PBKDF2
   * @returns {Promise<CryptoKey>}
   * @private
   */
  async getDerivedKey() {
    // Return cached key if available
    if (this.derivedKeyCache) {
      return this.derivedKeyCache;
    }

    try {
      // Get or create salt
      const salt = await this.getSalt();

      // Use a combination of browser fingerprint and salt for key derivation
      // This provides user-specific encryption without requiring a password
      const keyMaterial = await this.getKeyMaterial();

      // Derive key using PBKDF2
      const derivedKey = await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: PBKDF2_ITERATIONS,
          hash: "SHA-256",
        },
        keyMaterial,
        {
          name: ENCRYPTION_ALGORITHM,
          length: KEY_LENGTH,
        },
        false, // Not extractable
        ["encrypt", "decrypt"],
      );

      // Cache the derived key
      this.derivedKeyCache = derivedKey;

      return derivedKey;
    } catch (error) {
      throw new Error(`Failed to derive encryption key: ${error.message}`);
    }
  }

  /**
   * Get key material for PBKDF2 derivation
   * Uses browser/device fingerprint as base material
   * @returns {Promise<CryptoKey>}
   * @private
   */
  async getKeyMaterial() {
    // Create a fingerprint from browser characteristics
    // This provides device-specific encryption without user input
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      new Date().getTimezoneOffset(),
      screen.width,
      screen.height,
      screen.colorDepth,
    ].join("|");

    // Convert fingerprint to key material
    const encoder = new TextEncoder();
    const keyMaterialData = encoder.encode(fingerprint);

    return crypto.subtle.importKey(
      "raw",
      keyMaterialData,
      { name: "PBKDF2" },
      false,
      ["deriveKey"],
    );
  }

  /**
   * Encrypt plaintext using AES-256-GCM
   * @param {string} plaintext - Text to encrypt
   * @returns {Promise<{iv: Uint8Array, ciphertext: ArrayBuffer}>}
   * @private
   */
  async encrypt(plaintext) {
    try {
      const key = await this.getDerivedKey();

      // Generate random IV
      const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

      // Encrypt
      const encoder = new TextEncoder();
      const data = encoder.encode(plaintext);

      const ciphertext = await crypto.subtle.encrypt(
        {
          name: ENCRYPTION_ALGORITHM,
          iv: iv,
        },
        key,
        data,
      );

      return { iv, ciphertext };
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypt ciphertext using AES-256-GCM
   * @param {Uint8Array} iv - Initialization vector
   * @param {ArrayBuffer} ciphertext - Encrypted data
   * @returns {Promise<string>}
   * @private
   */
  async decrypt(iv, ciphertext) {
    try {
      const key = await this.getDerivedKey();

      // Decrypt
      const decrypted = await crypto.subtle.decrypt(
        {
          name: ENCRYPTION_ALGORITHM,
          iv: iv,
        },
        key,
        ciphertext,
      );

      // Convert back to string
      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
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

      // Encrypt the key
      const { iv, ciphertext } = await this.encrypt(validKey);

      // Store in IndexedDB
      const db = await this.initDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_API_KEYS], "readwrite");
        const store = transaction.objectStore(STORE_API_KEYS);

        const record = {
          provider: validProvider,
          iv: Array.from(iv), // Convert to array for storage
          ciphertext: Array.from(new Uint8Array(ciphertext)), // Convert to array
          createdAt: Date.now(),
          lastTested: null,
          valid: null,
        };

        const request = store.put(record);

        request.onsuccess = () => resolve();
        request.onerror = () => {
          reject(new Error(`Failed to store key: ${request.error}`));
        };
      });
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

      // Retrieve from IndexedDB
      const db = await this.initDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_API_KEYS], "readonly");
        const store = transaction.objectStore(STORE_API_KEYS);
        const request = store.get(sanitizedProvider);

        request.onsuccess = async () => {
          if (!request.result) {
            resolve(null);
            return;
          }

          try {
            // Decrypt the key
            const iv = new Uint8Array(request.result.iv);
            const ciphertext = new Uint8Array(request.result.ciphertext).buffer;
            const decryptedKey = await this.decrypt(iv, ciphertext);
            resolve(decryptedKey);
          } catch (decryptError) {
            reject(new Error(`Failed to decrypt key: ${decryptError.message}`));
          }
        };

        request.onerror = () => {
          reject(new Error(`Failed to retrieve key: ${request.error}`));
        };
      });
    } catch (error) {
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

      // Remove from IndexedDB
      const db = await this.initDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_API_KEYS], "readwrite");
        const store = transaction.objectStore(STORE_API_KEYS);
        const request = store.delete(sanitizedProvider);

        request.onsuccess = () => resolve();
        request.onerror = () => {
          reject(new Error(`Failed to remove key: ${request.error}`));
        };
      });
    } catch (error) {
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

      // Check in IndexedDB
      const db = await this.initDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_API_KEYS], "readonly");
        const store = transaction.objectStore(STORE_API_KEYS);
        const request = store.get(sanitizedProvider);

        request.onsuccess = () => {
          resolve(!!request.result);
        };

        request.onerror = () => {
          reject(new Error(`Failed to check key existence: ${request.error}`));
        };
      });
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
      const db = await this.initDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_API_KEYS], "readonly");
        const store = transaction.objectStore(STORE_API_KEYS);
        const request = store.getAllKeys();

        request.onsuccess = () => {
          resolve(request.result || []);
        };

        request.onerror = () => {
          reject(new Error(`Failed to get providers: ${request.error}`));
        };
      });
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
      const db = await this.initDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_API_KEYS], "readwrite");
        const store = transaction.objectStore(STORE_API_KEYS);
        const request = store.clear();

        request.onsuccess = () => {
          // Clear cached derived key
          this.derivedKeyCache = null;
          resolve();
        };

        request.onerror = () => {
          reject(new Error(`Failed to clear keys: ${request.error}`));
        };
      });
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

      const db = await this.initDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_API_KEYS], "readwrite");
        const store = transaction.objectStore(STORE_API_KEYS);
        const getRequest = store.get(sanitizedProvider);

        getRequest.onsuccess = () => {
          if (!getRequest.result) {
            reject(
              new Error(`Key not found for provider: ${sanitizedProvider}`),
            );
            return;
          }

          // Update metadata
          const record = {
            ...getRequest.result,
            ...metadata,
          };

          const putRequest = store.put(record);

          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => {
            reject(new Error(`Failed to update metadata: ${putRequest.error}`));
          };
        };

        getRequest.onerror = () => {
          reject(new Error(`Failed to retrieve key: ${getRequest.error}`));
        };
      });
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

      const db = await this.initDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_API_KEYS], "readonly");
        const store = transaction.objectStore(STORE_API_KEYS);
        const request = store.get(sanitizedProvider);

        request.onsuccess = () => {
          if (!request.result) {
            resolve(null);
            return;
          }

          // Return metadata without encrypted data
          const { iv, ciphertext, ...metadata } = request.result;
          resolve(metadata);
        };

        request.onerror = () => {
          reject(new Error(`Failed to get metadata: ${request.error}`));
        };
      });
    } catch (error) {
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

      const db = await this.initDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_SETTINGS], "readwrite");
        const store = transaction.objectStore(STORE_SETTINGS);

        const record = {
          key: key,
          value: value,
          updatedAt: Date.now(),
        };

        const request = store.put(record);

        request.onsuccess = () => resolve();
        request.onerror = () => {
          reject(new Error(`Failed to store setting: ${request.error}`));
        };
      });
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

      const db = await this.initDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_SETTINGS], "readonly");
        const store = transaction.objectStore(STORE_SETTINGS);
        const request = store.get(key);

        request.onsuccess = () => {
          if (!request.result) {
            resolve(null);
            return;
          }

          resolve(request.result.value);
        };

        request.onerror = () => {
          reject(new Error(`Failed to retrieve setting: ${request.error}`));
        };
      });
    } catch (error) {
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

      const db = await this.initDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_SETTINGS], "readwrite");
        const store = transaction.objectStore(STORE_SETTINGS);
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => {
          reject(new Error(`Failed to remove setting: ${request.error}`));
        };
      });
    } catch (error) {
      throw this.handleStorageError(error, "removeSetting");
    }
  }
}

/**
 * Export singleton instance
 */
export default new WebKeyStorage();
