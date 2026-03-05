/**
 * KeyStorageFactory - Platform-agnostic storage factory
 *
 * This module provides a factory that automatically detects the platform
 * (web vs Android) and returns the appropriate storage implementation.
 * It exports a singleton instance for app-wide use.
 *
 * Requirements: 10.1, 10.2
 */

import { Capacitor } from "@capacitor/core";

/**
 * Detect the current platform
 * @returns {'web' | 'android'} Platform identifier
 */
function detectPlatform() {
  const platform = Capacitor.getPlatform();

  // Capacitor returns 'android', 'ios', or 'web'
  // We only support web and android for key storage
  if (platform === "android") {
    return "android";
  }

  // Default to web for all other platforms (web, ios, etc.)
  return "web";
}

/**
 * Create storage instance based on platform
 * @returns {Promise<BaseKeyStorage>} Platform-specific storage instance
 */
async function createStorage() {
  const platform = detectPlatform();

  if (platform === "android") {
    // Dynamically import Android storage
    const { default: AndroidKeyStorage } =
      await import("./keyStorage.android.js");
    return AndroidKeyStorage;
  } else {
    // Dynamically import Web storage
    const { default: WebKeyStorage } = await import("./keyStorage.web.js");
    return WebKeyStorage;
  }
}

/**
 * Singleton storage instance
 * Initialized lazily on first access
 */
let storageInstance = null;

/**
 * Get the platform-appropriate storage instance
 * @returns {Promise<BaseKeyStorage>} Storage instance
 */
export async function getKeyStorage() {
  if (!storageInstance) {
    storageInstance = await createStorage();
  }
  return storageInstance;
}

/**
 * Get the current platform
 * @returns {'web' | 'android'} Platform identifier
 */
export function getPlatform() {
  return detectPlatform();
}

/**
 * Reset the storage instance (useful for testing)
 * @private
 */
export function resetStorageInstance() {
  storageInstance = null;
}

/**
 * Export default getter function
 */
export default getKeyStorage;
