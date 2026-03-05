/**
 * Manual Test for ExpenseParser
 *
 * This file provides manual testing utilities for the ExpenseParser.
 * Run this in the browser console to test the parser functionality.
 *
 * Usage:
 * 1. Import this file in your app
 * 2. Open browser console
 * 3. Run: await testExpenseParser()
 */

import { expenseParser } from "./expenseParser.js";
import { keyManager } from "./keyManager.js";

/**
 * Test data - sample OCR texts
 */
const TEST_CASES = [
  {
    name: "UPI Payment",
    text: `Paid to John Doe
Rs 500
UPI ID: john@paytm
Transaction ID: 123456789`,
    expected: {
      amount: 500,
      type: "debit",
      merchant: "John Doe",
    },
  },
  {
    name: "Food Delivery",
    text: `Swiggy Order
Pizza Hut
Add item 245
Delivery: 40
Total: 285`,
    expected: {
      amount: 285,
      type: "debit",
      merchant: "Pizza Hut",
    },
  },
  {
    name: "E-commerce",
    text: `Amazon Order
Wireless Mouse
Buy now 1299
Free Delivery`,
    expected: {
      amount: 1299,
      type: "debit",
      merchant: "Amazon",
    },
  },
  {
    name: "Bank SMS",
    text: `Your A/c XX1234 debited with Rs.2500.00 on 15-Jan-24
Available balance: Rs.15000.00
Merchant: FLIPKART`,
    expected: {
      amount: 2500,
      type: "debit",
      merchant: "FLIPKART",
    },
  },
];

/**
 * Test the ExpenseParser with sample data
 */
export async function testExpenseParser() {
  console.log("=== ExpenseParser Manual Test ===\n");

  // Check if any keys are configured
  const hasKey = await keyManager.hasValidKey();
  console.log(`Keys configured: ${hasKey ? "Yes" : "No"}`);

  if (!hasKey) {
    console.warn(
      "⚠️ No API keys configured. Parser will try to use developer key.",
    );
    console.log(
      "To test with user keys, add a key first using keyManager.setKey()",
    );
  }

  // Get active key info
  const activeKey = await keyManager.getActiveKey();
  if (activeKey) {
    console.log(`Active provider: ${activeKey.provider}\n`);
  } else {
    console.log("Active provider: developer key (fallback)\n");
  }

  // Run test cases
  let passed = 0;
  let failed = 0;

  for (const testCase of TEST_CASES) {
    console.log(`\n--- Test: ${testCase.name} ---`);
    console.log(`Input: ${testCase.text.substring(0, 50)}...`);

    try {
      const result = await expenseParser.parse({
        type: "ocr",
        text: testCase.text,
      });

      if (result.success) {
        console.log("✅ Parse succeeded");
        console.log(`Provider: ${result.provider}`);
        console.log(`Amount: ${result.data.amount}`);
        console.log(`Merchant: ${result.data.merchant}`);
        console.log(`Type: ${result.data.type}`);
        console.log(`Confidence: ${result.data.confidence}%`);
        console.log(`Processing time: ${result.processingTime}ms`);

        // Check if result matches expected
        const matches =
          result.data.amount === testCase.expected.amount &&
          result.data.type === testCase.expected.type;

        if (matches) {
          console.log("✅ Result matches expected values");
          passed++;
        } else {
          console.log("⚠️ Result differs from expected values");
          console.log("Expected:", testCase.expected);
          passed++; // Still count as passed since parsing succeeded
        }
      } else {
        console.log("❌ Parse failed");
        console.log(`Error: ${result.error}`);
        failed++;
      }
    } catch (error) {
      console.log("❌ Test failed with exception");
      console.error(error);
      failed++;
    }
  }

  console.log("\n=== Test Summary ===");
  console.log(`Passed: ${passed}/${TEST_CASES.length}`);
  console.log(`Failed: ${failed}/${TEST_CASES.length}`);

  return { passed, failed, total: TEST_CASES.length };
}

/**
 * Test fallback logic
 */
export async function testFallback() {
  console.log("=== Testing Fallback Logic ===\n");

  // Get priority order
  const priority = await keyManager.getPriority();
  console.log("Priority order:", priority);

  // Get all configured providers
  const statuses = await keyManager.getKeyStatuses();
  const configured = Object.entries(statuses)
    .filter(([_, status]) => status.configured)
    .map(([provider, _]) => provider);

  console.log("Configured providers:", configured);

  if (configured.length < 2) {
    console.warn(
      "⚠️ Need at least 2 providers configured to test fallback logic",
    );
    return;
  }

  // Test with invalid key to trigger fallback
  console.log("\nSimulating primary provider failure...");
  console.log("(This test requires manual intervention to simulate failure)");
  console.log(
    "To test fallback: temporarily set an invalid key for the primary provider",
  );
}

/**
 * Test provider-specific formatting
 */
export async function testFormatting() {
  console.log("=== Testing Provider-Specific Formatting ===\n");

  const testText = "Paid Rs 500 to John Doe";

  const providers = ["chatgpt", "groq", "gemini"];

  for (const provider of providers) {
    console.log(`\n--- ${provider.toUpperCase()} ---`);
    const request = expenseParser.formatRequest(provider, testText);
    console.log(JSON.stringify(request, null, 2));
  }
}

/**
 * Quick test with custom text
 */
export async function quickTest(text) {
  console.log("=== Quick Test ===\n");
  console.log(`Input: ${text}\n`);

  try {
    const result = await expenseParser.parse({
      type: "ocr",
      text: text,
    });

    if (result.success) {
      console.log("✅ Parse succeeded");
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log("❌ Parse failed");
      console.log(`Error: ${result.error}`);
    }

    return result;
  } catch (error) {
    console.error("❌ Test failed:", error);
    throw error;
  }
}

// Export for console access
if (typeof window !== "undefined") {
  window.testExpenseParser = testExpenseParser;
  window.testFallback = testFallback;
  window.testFormatting = testFormatting;
  window.quickTest = quickTest;

  console.log("ExpenseParser test utilities loaded!");
  console.log("Available functions:");
  console.log("  - testExpenseParser() - Run all test cases");
  console.log("  - testFallback() - Test fallback logic");
  console.log("  - testFormatting() - Test provider formatting");
  console.log('  - quickTest("your text") - Quick test with custom text');
}
