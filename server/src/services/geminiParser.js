const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiParser {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ GEMINI_API_KEY not found in environment variables");
      this.genAI = null;
      return;
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    // Using Gemini 1.5 Flash - fast and accurate for text parsing
    // Alternative: "gemini-1.5-pro" for higher accuracy
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-flash-latest",
    });
  }

  isAvailable() {
    return this.genAI !== null;
  }

  async parseExpenseFromText(ocrText) {
    if (!this.isAvailable()) {
      throw new Error("Gemini API not configured");
    }

    const prompt = `You are an expert at parsing financial transaction information from OCR text extracted from various sources:
- Payment apps (Google Pay, PhonePe, Paytm, BHIM UPI)
- Food delivery apps (Swiggy, Zomato, Uber Eats)
- E-commerce apps (Amazon, Flipkart, Myntra)
- Shopping cart screenshots
- Bank SMS messages

Extract the following information from the text below:
1. Amount (numeric value only, no currency symbols)
2. Merchant/Payee name (or product/item name)
3. Transaction type (either "debit" or "credit")
4. Confidence score (0-100 based on clarity)

OCR Text:
"""
${ocrText}
"""

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

Respond ONLY with a valid JSON object in this exact format (no markdown, no explanation):
{
  "amount": <number>,
  "merchant": "<string>",
  "type": "<debit|credit>",
  "confidence": <0-100>
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean up response - remove markdown code blocks if present
      let cleanText = text.trim();
      if (cleanText.startsWith("```json")) {
        cleanText = cleanText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      } else if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/```\n?/g, "");
      }

      const parsed = JSON.parse(cleanText);

      // Validate response structure
      if (
        typeof parsed.amount !== "number" ||
        typeof parsed.merchant !== "string" ||
        typeof parsed.type !== "string"
      ) {
        throw new Error("Invalid response structure from Gemini");
      }

      console.log("✅ Gemini parsed expense:", parsed);
      return parsed;
    } catch (error) {
      console.error("❌ Gemini parsing error:", error.message);
      throw error;
    }
  }
}

module.exports = new GeminiParser();
