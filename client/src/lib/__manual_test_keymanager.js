/**
 * Manual Test for KeyManager
 *
 * This file provides manual tests for the KeyManager class.
 * Run this in the browser console to verify functionality.
 *
 * Usage:
 * 1. Import this file in your app
 * 2. Open browser console
 * 3. Run: await testKeyManager()
 */

import { keyManager } from "./keyManager.js";

/**
 * Test KeyManager functionality
 */
export async function testKeyManager() {
  console.log("=== KeyManager Manual Test ===\n");

  try {
    // Test 1: Get initial statuses
    console.log("Test 1: Get initial key statuses");
    const initialStatuses = await keyManager.getKeyStatuses();
    console.log("Initial statuses:", initialStatuses);
    console.assert(
      initialStatuses.chatgpt !== undefined,
      "ChatGPT status should exist",
    );
    console.assert(
      initialStatuses.groq !== undefined,
      "Groq status should exist",
    );
    console.assert(
      initialStatuses.gemini !== undefined,
      "Gemini status should exist",
    );
    console.log("✓ Test 1 passed\n");

    // Test 2: Check if any valid key exists
    console.log("Test 2: Check for valid keys");
    const hasKey = await keyManager.hasValidKey();
    console.log("Has valid key:", hasKey);
    console.log("✓ Test 2 passed\n");

    // Test 3: Try to add key with invalid format
    console.log("Test 3: Add key with invalid format");
    const invalidFormatResult = await keyManager.setKey("groq", "invalid_key");
    console.log("Invalid format result:", invalidFormatResult);
    console.assert(
      !invalidFormatResult.success,
      "Should fail with invalid format",
    );
    console.assert(
      invalidFormatResult.error.includes("Invalid key format"),
      "Should have format error message",
    );
    console.log("✓ Test 3 passed\n");

    // Test 4: Try to add key with invalid provider
    console.log("Test 4: Add key with invalid provider");
    const invalidProviderResult = await keyManager.setKey(
      "invalid_provider",
      "key",
    );
    console.log("Invalid provider result:", invalidProviderResult);
    console.assert(
      !invalidProviderResult.success,
      "Should fail with invalid provider",
    );
    console.assert(
      invalidProviderResult.error.includes("Invalid provider"),
      "Should have provider error message",
    );
    console.log("✓ Test 4 passed\n");

    // Test 5: Try to test non-existent key
    console.log("Test 5: Test non-existent key");
    const testNonExistentResult = await keyManager.testKey("chatgpt");
    console.log("Test non-existent result:", testNonExistentResult);
    console.assert(
      !testNonExistentResult.success,
      "Should fail when key doesn't exist",
    );
    console.assert(
      testNonExistentResult.error.includes("No API key configured"),
      "Should have no key error message",
    );
    console.log("✓ Test 5 passed\n");

    // Test 6: Try to remove non-existent key (should succeed)
    console.log("Test 6: Remove non-existent key");
    const removeNonExistentResult = await keyManager.removeKey("chatgpt");
    console.log("Remove non-existent result:", removeNonExistentResult);
    console.assert(
      removeNonExistentResult.success,
      "Should succeed even if key doesn't exist",
    );
    console.log("✓ Test 6 passed\n");

    // Test 7: Key masking
    console.log("Test 7: Key masking");
    const testKey =
      "gsk_1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefgh";
    const masked = keyManager._maskKey(testKey);
    console.log("Original key:", testKey);
    console.log("Masked key:", masked);
    console.assert(masked.includes("..."), "Should contain ellipsis");
    console.assert(masked.includes("efgh"), "Should show last 4 characters");
    console.assert(
      !masked.includes("1234567890"),
      "Should not show middle characters",
    );
    console.log("✓ Test 7 passed\n");

    // Test 8: Error sanitization
    console.log("Test 8: Error sanitization");
    const errorWithKey = new Error(
      "Failed with key: sk-1234567890abcdefghijklmnopqrstuvwxyz1234567890ab",
    );
    const sanitized = keyManager._sanitizeError(errorWithKey);
    console.log("Original error:", errorWithKey.message);
    console.log("Sanitized error:", sanitized);
    console.assert(
      !sanitized.includes("sk-1234567890"),
      "Should not contain API key",
    );
    console.assert(
      sanitized.includes("[REDACTED]"),
      "Should contain [REDACTED]",
    );
    console.log("✓ Test 8 passed\n");

    console.log("=== All tests passed! ===");
    return true;
  } catch (error) {
    console.error("Test failed:", error);
    return false;
  }
}

/**
 * Test with real API key (requires user to provide key)
 * WARNING: Only use this with a test API key that you can revoke
 */
export async function testWithRealKey(provider, apiKey) {
  console.log(`=== Testing with real ${provider} key ===\n`);

  try {
    // Add the key
    console.log("1. Adding key...");
    const addResult = await keyManager.setKey(provider, apiKey);
    console.log("Add result:", addResult);

    if (!addResult.success) {
      console.error("Failed to add key:", addResult.error);
      return false;
    }

    // Get statuses
    console.log("\n2. Getting statuses...");
    const statuses = await keyManager.getKeyStatuses();
    console.log(`${provider} status:`, statuses[provider]);

    // Test the key
    console.log("\n3. Testing key...");
    const testResult = await keyManager.testKey(provider);
    console.log("Test result:", testResult);

    // Get updated statuses
    console.log("\n4. Getting updated statuses...");
    const updatedStatuses = await keyManager.getKeyStatuses();
    console.log(`${provider} status:`, updatedStatuses[provider]);

    // Remove the key
    console.log("\n5. Removing key...");
    const removeResult = await keyManager.removeKey(provider);
    console.log("Remove result:", removeResult);

    // Verify removal
    console.log("\n6. Verifying removal...");
    const finalStatuses = await keyManager.getKeyStatuses();
    console.log(`${provider} status:`, finalStatuses[provider]);

    console.log("\n=== Real key test completed! ===");
    return true;
  } catch (error) {
    console.error("Real key test failed:", error);
    return false;
  }
}

// Export for use in browser console
if (typeof window !== "undefined") {
  window.testKeyManager = testKeyManager;
  window.testWithRealKey = testWithRealKey;
  console.log("KeyManager test functions available:");
  console.log("  - testKeyManager()");
  console.log("  - testWithRealKey(provider, apiKey)");
}
