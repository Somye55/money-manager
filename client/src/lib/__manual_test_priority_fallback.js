/**
 * Manual Test for Priority and Fallback Logic
 *
 * This file provides manual tests for the KeyManager priority and fallback functionality.
 * Run this in the browser console to verify functionality.
 *
 * Usage:
 * 1. Import this file in your app
 * 2. Open browser console
 * 3. Run: await testPriorityAndFallback()
 */

import { keyManager } from "./keyManager.js";
import { getKeyStorage } from "./keyStorageFactory.js";

/**
 * Test priority and fallback functionality
 */
export async function testPriorityAndFallback() {
  console.log("=== Priority and Fallback Manual Test ===\n");

  try {
    // Test 1: Get default priority
    console.log("Test 1: Get default priority order");
    const defaultPriority = await keyManager.getPriority();
    console.log("Default priority:", defaultPriority);
    console.assert(
      Array.isArray(defaultPriority),
      "Priority should be an array",
    );
    console.assert(defaultPriority.length === 3, "Should have 3 providers");
    console.assert(
      defaultPriority.includes("groq") &&
        defaultPriority.includes("gemini") &&
        defaultPriority.includes("chatgpt"),
      "Should include all providers",
    );
    console.log("✓ Test 1 passed\n");

    // Test 2: Set custom priority
    console.log("Test 2: Set custom priority order");
    const customPriority = ["chatgpt", "groq", "gemini"];
    await keyManager.setPriority(customPriority);
    const retrievedPriority = await keyManager.getPriority();
    console.log("Custom priority set:", customPriority);
    console.log("Retrieved priority:", retrievedPriority);
    console.assert(
      JSON.stringify(retrievedPriority) === JSON.stringify(customPriority),
      "Retrieved priority should match custom priority",
    );
    console.log("✓ Test 2 passed\n");

    // Test 3: Try to set invalid priority
    console.log("Test 3: Set priority with invalid provider");
    try {
      await keyManager.setPriority(["invalid_provider", "groq"]);
      console.error("Should have thrown error for invalid provider");
      return false;
    } catch (error) {
      console.log("Correctly rejected invalid provider:", error.message);
      console.assert(
        error.message.includes("Invalid provider"),
        "Should have invalid provider error",
      );
    }
    console.log("✓ Test 3 passed\n");

    // Test 4: Get active key when no keys configured
    console.log("Test 4: Get active key with no keys configured");
    const activeKeyEmpty = await keyManager.getActiveKey();
    console.log("Active key (no keys):", activeKeyEmpty);
    console.assert(
      activeKeyEmpty === null,
      "Should return null when no keys exist",
    );
    console.log("✓ Test 4 passed\n");

    // Test 5: Get next key when no keys configured
    console.log("Test 5: Get next key with no keys configured");
    const nextKeyEmpty = await keyManager.getNextKey("groq");
    console.log("Next key (no keys):", nextKeyEmpty);
    console.assert(
      nextKeyEmpty === null,
      "Should return null when no keys exist",
    );
    console.log("✓ Test 5 passed\n");

    // Test 6: Simulate keys and test active key
    console.log("Test 6: Simulate keys and test active key");
    const storage = await getKeyStorage();

    // Store mock keys directly (bypassing validation for testing)
    await storage.setKey(
      "groq",
      "gsk_test1234567890abcdefghijklmnopqrstuvwxyz1234567890ab",
    );
    await storage.setKey("gemini", "AIzatest1234567890abcdefghijklmnopqr");

    // Reset priority to default
    await keyManager.setPriority(["groq", "gemini", "chatgpt"]);

    const activeKey = await keyManager.getActiveKey();
    console.log("Active key:", activeKey);
    console.assert(activeKey !== null, "Should return a key");
    console.assert(
      activeKey.provider === "groq",
      "Should return groq (first in priority)",
    );
    console.assert(
      typeof activeKey.key === "string",
      "Should return key string",
    );
    console.log("✓ Test 6 passed\n");

    // Test 7: Test fallback logic
    console.log("Test 7: Test fallback logic");
    const nextKey = await keyManager.getNextKey("groq");
    console.log("Next key after groq:", nextKey);
    console.assert(nextKey !== null, "Should return fallback key");
    console.assert(
      nextKey.provider === "gemini",
      "Should return gemini (next in priority)",
    );
    console.log("✓ Test 7 passed\n");

    // Test 8: Test fallback when at end of priority list
    console.log("Test 8: Test fallback at end of priority list");
    const noMoreKeys = await keyManager.getNextKey("gemini");
    console.log("Next key after gemini:", noMoreKeys);
    console.assert(
      noMoreKeys === null,
      "Should return null (no more fallbacks)",
    );
    console.log("✓ Test 8 passed\n");

    // Test 9: Test fallback with failed provider not in list
    console.log("Test 9: Test fallback with unknown failed provider");
    const unknownFallback = await keyManager.getNextKey("unknown_provider");
    console.log("Next key after unknown:", unknownFallback);
    console.assert(
      unknownFallback === null,
      "Should return null for unknown provider",
    );
    console.log("✓ Test 9 passed\n");

    // Test 10: Test priority order affects active key
    console.log("Test 10: Test priority order affects active key");
    await keyManager.setPriority(["gemini", "groq", "chatgpt"]);
    const activeKeyAfterReorder = await keyManager.getActiveKey();
    console.log("Active key after reorder:", activeKeyAfterReorder);
    console.assert(
      activeKeyAfterReorder.provider === "gemini",
      "Should return gemini (now first in priority)",
    );
    console.log("✓ Test 10 passed\n");

    // Cleanup
    console.log("Cleaning up test keys...");
    await storage.removeKey("groq");
    await storage.removeKey("gemini");
    console.log("Cleanup complete\n");

    console.log("=== All priority and fallback tests passed! ===");
    return true;
  } catch (error) {
    console.error("Test failed:", error);
    console.error("Stack:", error.stack);
    return false;
  }
}

/**
 * Test priority and fallback with real keys
 * WARNING: Only use this with test API keys that you can revoke
 */
export async function testPriorityWithRealKeys(keys) {
  console.log("=== Testing Priority with Real Keys ===\n");
  console.log("Keys provided:", Object.keys(keys));

  try {
    // Add all provided keys
    console.log("1. Adding keys...");
    for (const [provider, key] of Object.entries(keys)) {
      console.log(`  Adding ${provider}...`);
      const result = await keyManager.setKey(provider, key);
      if (!result.success) {
        console.error(`  Failed to add ${provider}:`, result.error);
        return false;
      }
      console.log(`  ✓ ${provider} added`);
    }

    // Set priority order
    console.log("\n2. Setting priority order...");
    const providers = Object.keys(keys);
    await keyManager.setPriority(providers);
    console.log("Priority set to:", providers);

    // Get active key
    console.log("\n3. Getting active key...");
    const activeKey = await keyManager.getActiveKey();
    console.log("Active key provider:", activeKey?.provider);
    console.assert(
      activeKey?.provider === providers[0],
      "Active key should be first in priority",
    );

    // Test fallback chain
    console.log("\n4. Testing fallback chain...");
    let currentProvider = activeKey.provider;
    let fallbackCount = 0;

    while (currentProvider && fallbackCount < providers.length) {
      const nextKey = await keyManager.getNextKey(currentProvider);
      console.log(
        `  After ${currentProvider} fails, next is:`,
        nextKey?.provider || "none",
      );
      currentProvider = nextKey?.provider;
      fallbackCount++;
    }

    // Cleanup
    console.log("\n5. Cleaning up...");
    for (const provider of providers) {
      await keyManager.removeKey(provider);
      console.log(`  ✓ Removed ${provider}`);
    }

    console.log("\n=== Real keys test completed! ===");
    return true;
  } catch (error) {
    console.error("Real keys test failed:", error);
    console.error("Stack:", error.stack);
    return false;
  }
}

// Export for use in browser console
if (typeof window !== "undefined") {
  window.testPriorityAndFallback = testPriorityAndFallback;
  window.testPriorityWithRealKeys = testPriorityWithRealKeys;
  console.log("Priority and Fallback test functions available:");
  console.log("  - testPriorityAndFallback()");
  console.log("  - testPriorityWithRealKeys({ provider: 'key', ... })");
}
