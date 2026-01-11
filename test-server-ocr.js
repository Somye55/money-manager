const http = require("http");

const testText = `To Nisha Sharma
+91 97581 34039
Pay again
Completed
8 Jan 2026, 11:46 pm
116896766920
Bank of Baroda 2247
UPI transaction ID
To: NISHA SHARMA
Google Pay ns9758134039@oksbi
From: SOMYE VERMA (Bank of Baroda)
Google Pay• xyzgob@okhdfcbank
Google transaction ID
CICAgJiYtNOEfW
POWERED BY
UPI»
UNIFIED PAYMENTS INTERFACE
G Pay`;

const data = JSON.stringify({
  text: testText,
});

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/api/ocr/parse",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length,
  },
};

console.log("🧪 Testing OCR endpoint...");
console.log("URL: http://localhost:3000/api/ocr/parse");
console.log("");

const req = http.request(options, (res) => {
  let responseData = "";

  res.on("data", (chunk) => {
    responseData += chunk;
  });

  res.on("end", () => {
    console.log("Status Code:", res.statusCode);
    console.log("");

    try {
      const parsed = JSON.parse(responseData);
      console.log("✅ Response:");
      console.log(JSON.stringify(parsed, null, 2));

      if (parsed.success && parsed.data) {
        console.log("");
        console.log("📊 Parsed Data:");
        console.log("  Amount:", parsed.data.amount);
        console.log("  Merchant:", parsed.data.merchant);
        console.log("  Type:", parsed.data.type);
        console.log("  Confidence:", parsed.data.confidence + "%");

        if (parsed.data.amount === 34039) {
          console.log("");
          console.log("✅ Amount parsed correctly!");
        } else {
          console.log("");
          console.log("⚠️ Expected amount: 34039, got:", parsed.data.amount);
        }
      }
    } catch (e) {
      console.log("❌ Failed to parse response:");
      console.log(responseData);
    }
  });
});

req.on("error", (error) => {
  console.error("❌ Request failed:", error.message);
  console.log("");
  console.log("Make sure server is running:");
  console.log("  cd server");
  console.log("  npm run dev");
});

req.write(data);
req.end();
