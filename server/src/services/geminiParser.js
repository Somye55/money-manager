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

    const prompt = `You are an expert at parsing financial transaction information from OCR text extracted from payment app screenshots (Google Pay, PhonePe, Paytm, etc.).

Extract the following information from the text below:
1. Amount (numeric value only, no currency symbols)
2. Merchant/Payee name
3. Transaction type (either "debit" or "credit")

OCR Text:
"""
${ocrText}
"""

Respond ONLY with a valid JSON object in this exact format (no markdown, no explanation):
{
  "amount": <number>,
  "merchant": "<string>",
  "type": "<debit|credit>",
  "confidence": <0-100>
}

Rules:
- If amount is not found, set amount to 0
- If merchant is not found, set merchant to "Payment"
- Type should be "debit" for payments/sent money, "credit" for received/refund
- Confidence should be 0-100 based on how clear the information is
- Return ONLY the JSON object, nothing else`;

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
