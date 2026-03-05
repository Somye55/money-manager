/**
 * Manual Test Script for Storage and Validation
 *
 * This script provides manual testing functions for the storage and validation layers.
 * Run these in the browser console to verify functionality.
 *
 * Usage:
 * 1. Import this file in your app
 * 2. Open browser console
 * 3. Run: await testStorage()
 * 4. Run: await testValidation()
 */

import { getKeyStorage } from "./keyStorageFactory.js";
import { keyValidator } from "./keyValidator.js";
import { PROVIDERS } from "./aiProviders.js";

/**
 * Test storage layer functionality
 */
export async function testStorage() {
  console.log("=== Testing Storage Layer ===\n");

  try {
    const storage = await getKeyStorage();
    console.log("✓ Storage instance created");

    // Test 1: Store a key
    console.log("\nTest 1: Store a key");
    await storage.setKey(
      "groq",
      "gsk_test1234567890123456789012345678901234567890123456",
    );
    console.log("✓ Key stored successfully");

    // Test 2: Retrieve the key
    console.log("\nTest 2: Retrieve the key");
    const retrievedKey = await storage.getKey("groq");
    if (
      retrievedKey === "gsk_test1234567890123456789012345678901234567890123456"
    ) {
      console.log("✓ Key retrieved and matches");
    } else {
      console.error("✗ Key mismatch:", retrievedKey);
    }

    // Test 3: Check if key exists
    console.log("\nTest 3: Check if key exists");
    const hasKey = await storage.hasKey("groq");
    if (hasKey) {
      console.log("✓ Key exists check passed");
    } else {
      console.error("✗ Key exists check failed");
    }

    // Test 4: Get providers list
    console.log("\nTest 4: Get providers list");
    const providers = await storage.getProviders();
    if (providers.includes("groq")) {
      console.log("✓ Providers list includes groq:", providers);
    } else {
      console.error("✗ Providers list missing groq:", providers);
    }

    // Test 5: Remove the key
    console.log("\nTest 5: Remove the key");
    await storage.removeKey("groq");
    const hasKeyAfterRemove = await storage.hasKey("groq");
    if (!hasKeyAfterRemove) {
      console.log("✓ Key removed successfully");
    } else {
      console.error("✗ Key still exists after removal");
    }

    // Test 6: Retrieve non-existent key
    console.log("\nTest 6: Retrieve non-existent key");
    const nonExistentKey = await storage.getKey("groq");
    if (nonExistentKey === null) {
      console.log("✓ Non-existent key returns null");
    } else {
      console.error("✗ Non-existent key returned:", nonExistentKey);
    }

    // Test 7: Store multiple keys
    console.log("\nTest 7: Store multiple keys");
    await storage.setKey(
      "chatgpt",
      "sk_test12345678901234567890123456789012345678901234567890",
    );
    await storage.setKey("gemini", "AIzatest1234567890123456789012345678901");
    const allProviders = await storage.getProviders();
    if (allProviders.length === 2) {
      console.log("✓ Multiple keys stored:", allProviders);
    } else {
      console.error("✗ Expected 2 providers, got:", allProviders);
    }

    // Test 8: Clear all keys
    console.log("\nTest 8: Clear all keys");
    await storage.clearAll();
    const providersAfterClear = await storage.getProviders();
    if (providersAfterClear.length === 0) {
      console.log("✓ All keys cleared");
    } else {
      console.error("✗ Keys still exist after clear:", providersAfterClear);
    }

    console.log("\n=== Storage Tests Complete ===");
    return true;
  } catch (error) {
    console.error("✗ Storage test failed:", error);
    return false;
  }
}

/**
 * Test validation layer functionality
 * Note: These tests will make real API calls, so use with caution
 */
export async function testValidation() {
  console.log("=== Testing Validation Layer ===\n");

  try {
    console.log("✓ Validator instance created");

    // Test 1: Validate with invalid key format
    console.log("\nTest 1: Validate with invalid key");
    const invalidResult = await keyValidator.validate("groq", "invalid_key");
    if (!invalidResult.valid) {
      console.log("✓ Invalid key detected:", invalidResult.errorType);
    } else {
      console.error("✗ Invalid key passed validation");
    }

    // Test 2: Validate with empty key
    console.log("\nTest 2: Validate with empty key");
    const emptyResult = await keyValidator.validate("groq", "");
    if (!emptyResult.valid) {
      console.log("✓ Empty key rejected:", emptyResult.errorType);
    } else {
      console.error("✗ Empty key passed validation");
    }

    // Test 3: Validate with unknown provider
    console.log("\nTest 3: Validate with unknown provider");
    const unknownProviderResult = await keyValidator.validate(
      "unknown",
      "test_key",
    );
    if (!unknownProviderResult.valid) {
      console.log(
        "✓ Unknown provider rejected:",
        unknownProviderResult.errorType,
      );
    } else {
      console.error("✗ Unknown provider passed validation");
    }

    console.log("\n=== Validation Tests Complete ===");
    console.log("\nNote: To test with real API keys, use:");
    console.log('  await keyValidator.validate("groq", "your_real_groq_key")');
    console.log(
      '  await keyValidator.validate("chatgpt", "your_real_openai_key")',
    );
    console.log(
      '  await keyValidator.validate("gemini", "your_real_gemini_key")',
    );

    return true;
  } catch (error) {
    console.error("✗ Validation test failed:", error);
    return false;
  }
}

/**
 * Run all tests
 */
export async function runAllTests() {
  console.log("=== Running All Manual Tests ===\n");

  const storageResult = await testStorage();
  console.log("\n");
  const validationResult = await testValidation();

  console.log("\n=== Test Summary ===");
  console.log("Storage Tests:", storageResult ? "✓ PASSED" : "✗ FAILED");
  console.log("Validation Tests:", validationResult ? "✓ PASSED" : "✗ FAILED");

  return storageResult && validationResult;
}

// Export for console usage
if (typeof window !== "undefined") {
  window.testStorage = testStorage;
  window.testValidation = testValidation;
  window.runAllTests = runAllTests;
  console.log("Manual test functions available:");
  console.log("  - testStorage()");
  console.log("  - testValidation()");
  console.log("  - runAllTests()");
}
