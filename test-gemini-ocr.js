/**
 * Test script for Gemini OCR TEXT PARSING
 * Run with: node test-gemini-ocr.js
 *
 * IMPORTANT: This tests ONLY text parsing (not OCR)
 * - OCR (image to text) is done by ML Kit on Android device
 * - Gemini AI only parses the extracted text to find amount/merchant
 */

const testCases = [
  {
    name: "Google Pay Payment",
    text: "Payment Successful\n₹1,250\nPaid to Zomato\nTransaction ID: 123456789",
  },
  {
    name: "PhonePe Transfer",
    text: "Money Sent\nRs. 500.00\nTo: John Doe\nUPI ID: john@paytm",
  },
  {
    name: "Bank SMS",
    text: "Your A/c XX1234 is debited with Rs.2,500.00 on 10-Jan-25. Info: UPI/Amazon",
  },
  {
    name: "Paytm Cashback",
    text: "Cashback Received!\n₹50 credited to your wallet\nFrom: Paytm",
  },
  {
    name: "Complex Screenshot",
    text: "PAYMENT DETAILS\nAmount: INR 1,999\nMerchant: Flipkart\nStatus: Success\nDate: 10/01/2025",
  },
  {
    name: "Simple Amount",
    text: "Paid ₹350 to Uber",
  },
  {
    name: "With Commas",
    text: "Transaction successful\nAmount: Rs. 12,450.50\nTo: Swiggy",
  },
];

async function testGeminiParsing() {
  const serverUrl = process.env.SERVER_URL || "http://localhost:3000";

  console.log("🧪 Testing Gemini OCR Text Parsing");
  console.log("📡 Server URL:", serverUrl);
  console.log("ℹ️  Note: This tests TEXT PARSING only (not OCR)");
  console.log("ℹ️  OCR is done by ML Kit on Android device");
  console.log("─".repeat(60));

  let passCount = 0;
  let failCount = 0;

  for (const testCase of testCases) {
    console.log(`\n📝 Test: ${testCase.name}`);
    console.log(`📄 Input text:\n${testCase.text}`);
    console.log("─".repeat(40));

    try {
      const response = await fetch(`${serverUrl}/api/ocr/parse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: testCase.text }),
      });

      if (!response.ok) {
        console.log(`❌ HTTP Error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.log(`   Error details: ${errorText}`);
        failCount++;
        continue;
      }

      const result = await response.json();

      if (result.success) {
        const { amount, merchant, type, confidence } = result.data;
        console.log(`✅ Success!`);
        console.log(`   💰 Amount: ${amount}`);
        console.log(`   🏪 Merchant: ${merchant}`);
        console.log(`   📊 Type: ${type}`);
        console.log(`   🎯 Confidence: ${confidence}%`);
        passCount++;
      } else {
        console.log(`❌ Parsing failed: ${result.error || "Unknown error"}`);
        failCount++;
      }
    } catch (error) {
      console.log(`❌ Request failed: ${error.message}`);
      failCount++;
    }
  }

  console.log("\n" + "─".repeat(60));
  console.log(`✨ Testing complete!`);
  console.log(`✅ Passed: ${passCount}/${testCases.length}`);
  console.log(`❌ Failed: ${failCount}/${testCases.length}`);

  if (failCount > 0) {
    console.log("\n⚠️  Some tests failed. Common issues:");
    console.log("   1. Server not running (run: npm run server:dev)");
    console.log("   2. GEMINI_API_KEY not set in server/.env");
    console.log("   3. Invalid API key");
    console.log("   4. Network/firewall issues");
  }
}

// Run tests
testGeminiParsing().catch(console.error);
