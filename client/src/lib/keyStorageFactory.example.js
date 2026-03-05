/**
 * Key Storage Factory - Usage Examples
 *
 * This file demonstrates how to use the key storage factory
 * in different scenarios.
 */

import getKeyStorage, { getPlatform } from "./keyStorageFactory.js";

/**
 * Example 1: Basic key storage operations
 */
async function basicUsageExample() {
  console.log("=== Basic Usage Example ===");

  // Get the storage instance
  const storage = await getKeyStorage();

  // Store a key
  await storage.setKey(
    "groq",
    "gsk_example_key_12345678901234567890123456789012345678",
  );
  console.log("✓ Key stored successfully");

  // Retrieve the key
  const key = await storage.getKey("groq");
  console.log("✓ Key retrieved:", key ? "success" : "failed");

  // Check if key exists
  const exists = await storage.hasKey("groq");
  console.log("✓ Key exists:", exists);

  // Get all providers
  const providers = await storage.getProviders();
  console.log("✓ Stored providers:", providers);

  // Remove the key
  await storage.removeKey("groq");
  console.log("✓ Key removed successfully");
}

/**
 * Example 2: Multiple providers
 */
async function multipleProvidersExample() {
  console.log("\n=== Multiple Providers Example ===");

  const storage = await getKeyStorage();

  // Store keys for multiple providers
  const keys = {
    chatgpt: "sk_example_chatgpt_key_1234567890123456789012345678901234567890",
    groq: "gsk_example_groq_key_12345678901234567890123456789012345678",
    gemini: "AIza_example_gemini_key_12345678901234567890123456789012",
  };

  for (const [provider, key] of Object.entries(keys)) {
    await storage.setKey(provider, key);
    console.log(`✓ Stored key for ${provider}`);
  }

  // Get all providers
  const providers = await storage.getProviders();
  console.log("✓ All providers:", providers);

  // Retrieve each key
  for (const provider of providers) {
    const key = await storage.getKey(provider);
    console.log(`✓ Retrieved key for ${provider}:`, key ? "success" : "failed");
  }

  // Clear all keys
  await storage.clearAll();
  console.log("✓ All keys cleared");
}

/**
 * Example 3: Platform detection
 */
async function platformDetectionExample() {
  console.log("\n=== Platform Detection Example ===");

  const platform = getPlatform();
  console.log("✓ Current platform:", platform);

  const storage = await getKeyStorage();
  console.log("✓ Storage implementation:", storage.constructor.name);

  if (platform === "android") {
    console.log("  → Using Android Keystore for encryption");
  } else {
    console.log("  → Using Web Crypto API for encryption");
  }
}

/**
 * Example 4: Error handling
 */
async function errorHandlingExample() {
  console.log("\n=== Error Handling Example ===");

  const storage = await getKeyStorage();

  try {
    // Try to store with invalid provider
    await storage.setKey("invalid_provider", "some_key");
  } catch (error) {
    console.log("✓ Caught invalid provider error:", error.message);
  }

  try {
    // Try to store with invalid key (too short)
    await storage.setKey("groq", "short");
  } catch (error) {
    console.log("✓ Caught invalid key error:", error.message);
  }

  try {
    // Try to get non-existent key
    const key = await storage.getKey("chatgpt");
    console.log("✓ Non-existent key returns:", key === null ? "null" : key);
  } catch (error) {
    console.log("✗ Unexpected error:", error.message);
  }
}

/**
 * Example 5: Metadata operations (Web platform only)
 */
async function metadataExample() {
  console.log("\n=== Metadata Example ===");

  const storage = await getKeyStorage();

  // Store a key
  await storage.setKey(
    "groq",
    "gsk_example_key_12345678901234567890123456789012345678",
  );
  console.log("✓ Key stored");

  // Update metadata (if supported)
  if (typeof storage.updateKeyMetadata === "function") {
    await storage.updateKeyMetadata("groq", {
      lastTested: Date.now(),
      valid: true,
    });
    console.log("✓ Metadata updated");

    // Get metadata
    const metadata = await storage.getKeyMetadata("groq");
    console.log("✓ Metadata:", metadata);
  } else {
    console.log("⚠ Metadata operations not supported on this platform");
  }

  // Clean up
  await storage.removeKey("groq");
}

/**
 * Example 6: Singleton pattern verification
 */
async function singletonExample() {
  console.log("\n=== Singleton Pattern Example ===");

  // Get storage instance multiple times
  const storage1 = await getKeyStorage();
  const storage2 = await getKeyStorage();
  const storage3 = await getKeyStorage();

  // Verify they're the same instance
  console.log("✓ storage1 === storage2:", storage1 === storage2);
  console.log("✓ storage2 === storage3:", storage2 === storage3);
  console.log("✓ All instances are identical (singleton pattern)");
}

/**
 * Run all examples
 */
async function runAllExamples() {
  try {
    await basicUsageExample();
    await multipleProvidersExample();
    await platformDetectionExample();
    await errorHandlingExample();
    await metadataExample();
    await singletonExample();

    console.log("\n✓ All examples completed successfully!");
  } catch (error) {
    console.error("\n✗ Example failed:", error);
  }
}

// Export examples for testing
export {
  basicUsageExample,
  multipleProvidersExample,
  platformDetectionExample,
  errorHandlingExample,
  metadataExample,
  singletonExample,
  runAllExamples,
};

// Run examples if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples();
}
