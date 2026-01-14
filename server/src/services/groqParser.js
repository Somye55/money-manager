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
            content: `You are an expert at parsing financial transaction information from OCR text extracted from payment app screenshots (Google Pay, PhonePe, Paytm, etc.).

Extract the following information:
1. Amount (numeric value only, no currency symbols)
2. Merchant/Payee name
3. Transaction type (either "debit" or "credit")
4. Confidence score (0-100 based on clarity)

RULES:
- If amount is not found, set amount to 0
- If merchant is not found, set merchant to "Payment"
- Type should be "debit" for payments/sent money, "credit" for received/refund
- Confidence should be 0-100 based on how clear the information is
- Return ONLY valid JSON, nothing else`,
          },
          {
            role: "user",
            content: ocrText,
          },
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
        temperature: 0.1,
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
      return jsonResponse;
    } catch (error) {
      console.error("❌ Groq parsing error:", error.message);
      throw error;
    }
  }
}

module.exports = new GroqParser();
