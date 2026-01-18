const Groq = require("groq-sdk");

class GroqParser {
  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ GROQ_API_KEY not found in environment variables");
      this.groq = null;
      return;
    }

    this.groq = new Groq({
      apiKey: apiKey,
    });
  }

  isAvailable() {
    return this.groq !== null;
  }

  async parseExpenseFromText(ocrText) {
    if (!this.isAvailable()) {
      throw new Error("Groq API not configured");
    }

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are an expert at parsing financial transaction information from OCR text extracted from various sources:
- Payment apps (Google Pay, PhonePe, Paytm, BHIM UPI)
- Food delivery apps (Swiggy, Zomato, Uber Eats)
- E-commerce apps (Amazon, Flipkart, Myntra)
- Shopping cart screenshots
- Bank SMS messages

Extract the following information:
1. Amount (numeric value only, no currency symbols)
2. Merchant/Payee name (or product/item name)
3. Transaction type (either "debit" or "credit")
4. Confidence score (0-100 based on clarity)

CRITICAL RULES FOR AMOUNT DETECTION:
- OCR often MISSES the rupee symbol (₹). Look for numbers near these keywords:
  * "Rs", "Rs.", "INR", "Rupees"
  * "Add item", "Add to cart", "Buy now", "Order now"
  * "Total", "Subtotal", "Amount", "Pay", "Price", "Paid", "Sent"
  * "Debited", "Credited", "Balance"
- In food delivery/e-commerce: numbers near action buttons are prices
  * Example: "Add item 245" → amount is 245
  * Example: "Buy now 1299" → amount is 1299
- Standalone numbers on their own line are often amounts
  * Example: Line with just "500" or "500.00" → amount is 500
- IGNORE these numbers (they are NOT amounts):
  * Phone numbers (10 digits like 9876543210)
  * Transaction IDs (12+ digits)
  * Dates (2024, 2025, etc.)
  * Account numbers (usually with "A/c" or "Account")
- If multiple numbers exist, prioritize:
  1. Numbers with currency symbols (₹, Rs)
  2. Numbers near payment keywords
  3. Standalone numbers that look like prices (2-6 digits)

MERCHANT/PAYEE DETECTION:
- Look for names after: "To", "Paid to", "Received from", "From"
- In food delivery: use restaurant/item name
- In e-commerce: use store/product name
- Remove phone numbers from merchant names
- If no clear merchant, use "Payment" or "Purchase"

TRANSACTION TYPE:
- "debit" for: paid, sent, debited, purchased, ordered, spent
- "credit" for: received, credited, refund, cashback, earned

CONFIDENCE SCORING:
- 90-100: Clear amount with currency symbol and merchant name
- 70-89: Amount found but no currency symbol, or unclear merchant
- 50-69: Amount inferred from context, merchant unclear
- 0-49: Very unclear, multiple possible amounts

Return ONLY valid JSON in this format:
{
  "amount": <number>,
  "merchant": "<string>",
  "type": "debit|credit",
  "confidence": <0-100>
}`,
          },
          {
            role: "user",
            content: `Parse this OCR text and extract expense information:\n\n${ocrText}`,
          },
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 500,
      });

      const jsonResponse = JSON.parse(
        completion.choices[0]?.message?.content || "{}"
      );

      // Validate response structure
      if (
        typeof jsonResponse.amount !== "number" ||
        typeof jsonResponse.merchant !== "string" ||
        typeof jsonResponse.type !== "string"
      ) {
        throw new Error("Invalid response structure from Groq");
      }

      console.log("✅ Groq parsed expense:", jsonResponse);
      console.log(`   Confidence: ${jsonResponse.confidence || "N/A"}%`);
      return jsonResponse;
    } catch (error) {
      console.error("❌ Groq parsing error:", error.message);
      throw error;
    }
  }
}

module.exports = new GroqParser();
