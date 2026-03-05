/**
 * KeyManager Usage Examples
 *
 * This file demonstrates how to use the KeyManager class
 * for managing API keys in the application.
 */

import { keyManager } from "./keyManager.js";

/**
 * Example 1: Add a new API key
 */
async function addKeyExample() {
  console.log("=== Adding API Key ===");

  const result = await keyManager.setKey("groq", "gsk_your_api_key_here");

  if (result.success) {
    console.log("✓ Key saved successfully");
  } else {
    console.error("✗ Failed to save key:", result.error);
  }
}

/**
 * Example 2: Test a stored key
 */
async function testKeyExample() {
  console.log("\n=== Testing API Key ===");

  const result = await keyManager.testKey("groq");

  if (result.success) {
    console.log("✓ Key is valid");
  } else {
    console.error("✗ Key validation failed:", result.error);
  }
}

/**
 * Example 3: Get all key statuses
 */
async function getStatusesExample() {
  console.log("\n=== Getting Key Statuses ===");

  const statuses = await keyManager.getKeyStatuses();

  for (const [provider, status] of Object.entries(statuses)) {
    console.log(`\n${provider}:`);
    console.log(`  Configured: ${status.configured}`);
    console.log(`  Valid: ${status.valid}`);
    console.log(
      `  Last Tested: ${status.lastTested ? new Date(status.lastTested).toLocaleString() : "Never"}`,
    );
    console.log(`  Masked Key: ${status.maskedKey || "N/A"}`);
    if (status.error) {
      console.log(`  Error: ${status.error}`);
    }
  }
}

/**
 * Example 4: Check if any valid key exists
 */
async function checkValidKeyExample() {
  console.log("\n=== Checking for Valid Keys ===");

  const hasKey = await keyManager.hasValidKey();

  if (hasKey) {
    console.log("✓ At least one valid key exists");
  } else {
    console.log("✗ No valid keys configured");
  }
}

/**
 * Example 5: Remove a key
 */
async function removeKeyExample() {
  console.log("\n=== Removing API Key ===");

  const result = await keyManager.removeKey("groq");

  if (result.success) {
    console.log("✓ Key removed successfully");
  } else {
    console.error("✗ Failed to remove key:", result.error);
  }
}

/**
 * Example 6: Complete workflow
 */
async function completeWorkflowExample() {
  console.log("\n=== Complete Workflow ===");

  // 1. Check initial state
  console.log("\n1. Initial state:");
  let hasKey = await keyManager.hasValidKey();
  console.log(`   Has valid key: ${hasKey}`);

  // 2. Add a key
  console.log("\n2. Adding key...");
  const addResult = await keyManager.setKey("groq", "gsk_your_api_key_here");
  console.log(`   Result: ${addResult.success ? "Success" : addResult.error}`);

  // 3. Check status
  console.log("\n3. Checking status...");
  const statuses = await keyManager.getKeyStatuses();
  console.log(`   Groq configured: ${statuses.groq.configured}`);
  console.log(`   Groq valid: ${statuses.groq.valid}`);
  console.log(`   Groq masked key: ${statuses.groq.maskedKey}`);

  // 4. Test the key
  console.log("\n4. Testing key...");
  const testResult = await keyManager.testKey("groq");
  console.log(`   Result: ${testResult.success ? "Valid" : testResult.error}`);

  // 5. Remove the key
  console.log("\n5. Removing key...");
  const removeResult = await keyManager.removeKey("groq");
  console.log(
    `   Result: ${removeResult.success ? "Success" : removeResult.error}`,
  );

  // 6. Check final state
  console.log("\n6. Final state:");
  hasKey = await keyManager.hasValidKey();
  console.log(`   Has valid key: ${hasKey}`);
}

/**
 * Example 7: Error handling
 */
async function errorHandlingExample() {
  console.log("\n=== Error Handling ===");

  // Try to add key with invalid format
  console.log("\n1. Invalid key format:");
  const invalidFormatResult = await keyManager.setKey("groq", "invalid_key");
  console.log(
    `   Result: ${invalidFormatResult.success ? "Success" : invalidFormatResult.error}`,
  );

  // Try to test non-existent key
  console.log("\n2. Test non-existent key:");
  const testNonExistentResult = await keyManager.testKey("chatgpt");
  console.log(
    `   Result: ${testNonExistentResult.success ? "Success" : testNonExistentResult.error}`,
  );

  // Try to use invalid provider
  console.log("\n3. Invalid provider:");
  const invalidProviderResult = await keyManager.setKey(
    "invalid_provider",
    "key",
  );
  console.log(
    `   Result: ${invalidProviderResult.success ? "Success" : invalidProviderResult.error}`,
  );
}

// Run examples (uncomment to test)
// addKeyExample();
// testKeyExample();
// getStatusesExample();
// checkValidKeyExample();
// removeKeyExample();
// completeWorkflowExample();
// errorHandlingExample();

export {
  addKeyExample,
  testKeyExample,
  getStatusesExample,
  checkValidKeyExample,
  removeKeyExample,
  completeWorkflowExample,
  errorHandlingExample,
};
