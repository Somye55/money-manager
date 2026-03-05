/**
 * KeyValidator Usage Examples
 *
 * This file demonstrates how to use the KeyValidator class.
 * These examples can be run in the browser console or in a test environment.
 */

import { keyValidator } from "./keyValidator.js";

/**
 * Example 1: Validate a ChatGPT API key
 */
async function exampleValidateChatGPT() {
  console.log("Example 1: Validating ChatGPT key...");

  const result = await keyValidator.validate(
    "chatgpt",
    "sk-proj-test123456789012345678901234567890123456",
  );

  if (result.valid) {
    console.log("✓ Key is valid!");
  } else {
    console.log(`✗ Validation failed: ${result.error}`);
    console.log(`  Error type: ${result.errorType}`);
  }

  return result;
}

/**
 * Example 2: Validate a Groq API key
 */
async function exampleValidateGroq() {
  console.log("\nExample 2: Validating Groq key...");

  const result = await keyValidator.validate(
    "groq",
    "gsk_test1234567890123456789012345678901234567890123456",
  );

  if (result.valid) {
    console.log("✓ Key is valid!");
  } else {
    console.log(`✗ Validation failed: ${result.error}`);
    console.log(`  Error type: ${result.errorType}`);
  }

  return result;
}

/**
 * Example 3: Validate a Gemini API key
 */
async function exampleValidateGemini() {
  console.log("\nExample 3: Validating Gemini key...");

  const result = await keyValidator.validate(
    "gemini",
    "AIzaSyTest1234567890123456789012345",
  );

  if (result.valid) {
    console.log("✓ Key is valid!");
  } else {
    console.log(`✗ Validation failed: ${result.error}`);
    console.log(`  Error type: ${result.errorType}`);
  }

  return result;
}

/**
 * Example 4: Handle validation errors
 */
async function exampleHandleErrors() {
  console.log("\nExample 4: Handling validation errors...");

  const result = await keyValidator.validate("chatgpt", "invalid-key");

  switch (result.errorType) {
    case "invalid_key":
      console.log("The API key is invalid. Please check your key.");
      break;
    case "network_error":
      console.log("Network error. Please check your connection.");
      break;
    case "rate_limit":
      console.log("Rate limit exceeded. Please try again later.");
      break;
    case "timeout":
      console.log("Request timed out. Please try again.");
      break;
    default:
      console.log("Unknown error occurred.");
  }

  return result;
}

/**
 * Example 5: Validate with timeout
 */
async function exampleTimeout() {
  console.log("\nExample 5: Testing timeout handling...");
  console.log("(This will take 10 seconds if the endpoint is slow)");

  const startTime = Date.now();
  const result = await keyValidator.validate(
    "chatgpt",
    "sk-proj-test123456789012345678901234567890123456",
  );
  const duration = Date.now() - startTime;

  console.log(`Request completed in ${duration}ms`);

  if (result.errorType === "timeout") {
    console.log("✓ Timeout was properly detected");
  } else {
    console.log(`Result: ${result.valid ? "valid" : result.error}`);
  }

  return result;
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log("=== KeyValidator Examples ===\n");

  try {
    await exampleValidateChatGPT();
    await exampleValidateGroq();
    await exampleValidateGemini();
    await exampleHandleErrors();
    // Uncomment to test timeout (takes 10 seconds)
    // await exampleTimeout();

    console.log("\n=== Examples Complete ===");
  } catch (error) {
    console.error("Error running examples:", error);
  }
}

// Export individual examples for selective testing
export {
  exampleValidateChatGPT,
  exampleValidateGroq,
  exampleValidateGemini,
  exampleHandleErrors,
  exampleTimeout,
};

// Uncomment to run examples when this file is imported
// runAllExamples();
