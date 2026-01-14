const axios = require("axios");

const testCases = [
  {
    name: "Google Pay Payment",
    text: "Paid ₹500 to Zomato\nTransaction successful\nUPI ID: zomato@paytm",
  },
  {
    name: "PhonePe Transfer",
    text: "You sent ₹1,250.00 to Rahul Kumar\nUPI: rahul@ybl\nDate: 13 Jan 2025",
  },
  {
    name: "Paytm Refund",
    text: "Refund received ₹350\nFrom: Amazon Pay\nRef: AMZ123456",
  },
  {
    name: "Bank SMS",
    text: "Rs.2500 debited from A/c XX1234 at SWIGGY on 13-01-25",
  },
];

async function testGroqOCR() {
  console.log("🧪 Testing Groq OCR Parser\n");
  console.log("Server: http://localhost:3000/api/ocr/parse\n");

  for (const testCase of testCases) {
    console.log(`\n📝 Test: ${testCase.name}`);
    console.log(`Input: "${testCase.text.substring(0, 50)}..."`);

    try {
      const response = await axios.post("http://localhost:3000/api/ocr/parse", {
        text: testCase.text,
      });

      if (response.data.success) {
        const { amount, merchant, type, confidence } = response.data.data;
        console.log(`✅ Success:`);
        console.log(`   Amount: ₹${amount}`);
        console.log(`   Merchant: ${merchant}`);
        console.log(`   Type: ${type}`);
        console.log(`   Confidence: ${confidence || "N/A"}%`);
      } else {
        console.log(`❌ Failed: ${response.data.message}`);
      }
    } catch (error) {
      if (error.response) {
        console.log(`❌ Error: ${error.response.data.message}`);
      } else {
        console.log(`❌ Error: ${error.message}`);
      }
    }
  }

  console.log("\n\n✨ Testing complete!");
}

testGroqOCR();
