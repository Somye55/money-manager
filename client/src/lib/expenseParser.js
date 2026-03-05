/**
 * Expense Parser
 *
 * Parses expense data from OCR text, screenshots, or notification text
 * using AI providers (ChatGPT, Groq, or Gemini) with automatic fallback.
 *
 * Integrates with KeyManager to use user-provided API keys with priority-based
 * provider selection and automatic fallback on failure.
 *
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 5.2, 5.3, 8.1, 8.2
 */

import { keyManager } from "./keyManager.js";
import { getProvider } from "./aiProviders.js";

/**
 * System prompt used across all AI providers for consistent parsing behavior
 */
const SYSTEM_PROMPT = `You are an expert at parsing financial transaction information from OCR text extracted from various sources:
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

/**
 * ExpenseParser class for parsing expense data using AI providers
 */
export class ExpenseParser {
  constructor() {
    // Developer-provided Groq key for fallback (migration support)
    this.developerGroqKey = process.env.GROQ_API_KEY || null;
  }

  /**
   * Parse expense data from any source
   * Automatically selects provider based on priority and implements fallback
   *
   * @param {ParseSource} source - Source data to parse
   * @returns {Promise<ParseResponse>} Parsed expense data
   */
  async parse(source) {
    const startTime = Date.now();

    try {
      // Validate input
      if (!source || !source.text) {
        throw new Error("Invalid parse source: text is required");
      }

      // Get active key from KeyManager
      const activeKey = await keyManager.getActiveKey();

      // If no user keys, fall back to developer key (migration support)
      if (!activeKey) {
        return await this._parseWithDeveloperKey(source, startTime);
      }

      // Try parsing with active provider
      try {
        const result = await this.parseWithProvider(
          activeKey.provider,
          activeKey.key,
          source.text,
        );

        return {
          success: true,
          data: result,
          provider: activeKey.provider,
          confidence: result.confidence,
          processingTime: Date.now() - startTime,
        };
      } catch (error) {
        console.warn(
          `[ExpenseParser] Primary provider ${activeKey.provider} failed:`,
          error.message,
        );

        // Try fallback providers
        return await this._parseWithFallback(
          activeKey.provider,
          source,
          startTime,
        );
      }
    } catch (error) {
      console.error("[ExpenseParser] Parse failed:", error.message);
      return {
        success: false,
        error: error.message || "Failed to parse expense data",
        provider: "none",
        confidence: 0,
        processingTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Parse with a specific provider (internal method)
   *
   * @param {string} provider - Provider name ('chatgpt', 'groq', or 'gemini')
   * @param {string} key - API key for the provider
   * @param {string} text - Text to parse
   * @returns {Promise<ExpenseData>} Parsed expense data
   */
  async parseWithProvider(provider, key, text) {
    // Format request for the specific provider
    const request = this.formatRequest(provider, text);

    // Get provider configuration
    const providerConfig = getProvider(provider);
    if (!providerConfig) {
      throw new Error(`Unknown provider: ${provider}`);
    }

    // Make API request
    const response = await this._makeRequest(
      providerConfig,
      key,
      request,
      provider,
    );

    // Parse response
    const expenseData = this.parseResponse(provider, response);

    // Add metadata
    expenseData.timestamp = Date.now();
    expenseData.rawText = text;

    return expenseData;
  }

  /**
   * Format request for specific provider
   *
   * @param {string} provider - Provider name
   * @param {string} text - Text to parse
   * @returns {Object} Formatted request object
   */
  formatRequest(provider, text) {
    switch (provider) {
      case "chatgpt":
        return {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: text },
          ],
          temperature: 0.3,
          max_tokens: 200,
        };

      case "groq":
        return {
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: text },
          ],
          temperature: 0.3,
          max_tokens: 200,
        };

      case "gemini":
        return {
          contents: [
            {
              parts: [
                { text: `${SYSTEM_PROMPT}\n\nOCR Text:\n"""\n${text}\n"""` },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 200,
          },
        };

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  /**
   * Parse provider response into standardized ExpenseData
   *
   * @param {string} provider - Provider name
   * @param {Object} response - Raw API response
   * @returns {ExpenseData} Standardized expense data
   */
  parseResponse(provider, response) {
    let text;

    switch (provider) {
      case "chatgpt":
        // OpenAI response format
        text = response.choices?.[0]?.message?.content;
        break;

      case "groq":
        // Groq uses OpenAI-compatible format
        text = response.choices?.[0]?.message?.content;
        break;

      case "gemini":
        // Gemini response format
        text = response.candidates?.[0]?.content?.parts?.[0]?.text;
        break;

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    if (!text) {
      throw new Error("Empty response from AI provider");
    }

    // Clean up response - remove markdown code blocks if present
    let cleanText = text.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/```\n?/g, "");
    }

    // Parse JSON
    const parsed = JSON.parse(cleanText);

    // Validate response structure
    if (
      typeof parsed.amount !== "number" ||
      typeof parsed.merchant !== "string" ||
      typeof parsed.type !== "string" ||
      typeof parsed.confidence !== "number"
    ) {
      throw new Error("Invalid response structure from AI provider");
    }

    // Validate type
    if (parsed.type !== "debit" && parsed.type !== "credit") {
      throw new Error(`Invalid transaction type: ${parsed.type}`);
    }

    return {
      amount: parsed.amount,
      merchant: parsed.merchant,
      type: parsed.type,
      confidence: parsed.confidence,
    };
  }

  /**
   * Make HTTP request to AI provider
   * @private
   */
  async _makeRequest(providerConfig, key, requestBody, provider) {
    const url =
      provider === "gemini"
        ? `${providerConfig.apiEndpoint}?key=${key}`
        : providerConfig.apiEndpoint;

    const headers = {
      "Content-Type": "application/json",
    };

    // Add authorization header for non-Gemini providers
    if (provider !== "gemini") {
      headers["Authorization"] = `Bearer ${key}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed (${response.status}): ${errorText.substring(0, 100)}`,
      );
    }

    return await response.json();
  }

  /**
   * Parse with fallback providers
   * @private
   */
  async _parseWithFallback(failedProvider, source, startTime) {
    let lastError = null;

    // Try each fallback provider
    let nextKey = await keyManager.getNextKey(failedProvider);

    while (nextKey) {
      try {
        console.log(
          `[ExpenseParser] Trying fallback provider: ${nextKey.provider}`,
        );

        const result = await this.parseWithProvider(
          nextKey.provider,
          nextKey.key,
          source.text,
        );

        return {
          success: true,
          data: result,
          provider: nextKey.provider,
          confidence: result.confidence,
          processingTime: Date.now() - startTime,
        };
      } catch (error) {
        console.warn(
          `[ExpenseParser] Fallback provider ${nextKey.provider} failed:`,
          error.message,
        );
        lastError = error;

        // Try next fallback
        nextKey = await keyManager.getNextKey(nextKey.provider);
      }
    }

    // All providers failed, try developer key as last resort
    if (this.developerGroqKey) {
      console.log(
        "[ExpenseParser] All user providers failed, trying developer key",
      );
      return await this._parseWithDeveloperKey(source, startTime);
    }

    // No more fallbacks available
    throw new Error(
      lastError?.message || "All AI providers failed to parse expense data",
    );
  }

  /**
   * Parse using developer-provided Groq key (migration support)
   * @private
   */
  async _parseWithDeveloperKey(source, startTime) {
    if (!this.developerGroqKey) {
      throw new Error(
        "No API keys configured. Please add an API key in Settings.",
      );
    }

    try {
      console.log("[ExpenseParser] Using developer-provided Groq key");

      const result = await this.parseWithProvider(
        "groq",
        this.developerGroqKey,
        source.text,
      );

      return {
        success: true,
        data: result,
        provider: "groq (developer)",
        confidence: result.confidence,
        processingTime: Date.now() - startTime,
      };
    } catch (error) {
      console.error(
        "[ExpenseParser] Developer key parsing failed:",
        error.message,
      );
      throw new Error(
        "Failed to parse expense data. Please configure your own API key in Settings.",
      );
    }
  }
}

// Export singleton instance
export const expenseParser = new ExpenseParser();

/**
 * @typedef {Object} ParseSource
 * @property {'ocr'|'screenshot'|'notification'} type - Source type
 * @property {string} text - Text to parse
 * @property {Object} [metadata] - Optional metadata
 */

/**
 * @typedef {Object} ExpenseData
 * @property {number} amount - Transaction amount
 * @property {string} merchant - Merchant or payee name
 * @property {'debit'|'credit'} type - Transaction type
 * @property {number} confidence - Confidence score (0-100)
 * @property {number} timestamp - Parse timestamp
 * @property {string} rawText - Original text
 */

/**
 * @typedef {Object} ParseResponse
 * @property {boolean} success - Whether parsing succeeded
 * @property {ExpenseData} [data] - Parsed expense data (if success)
 * @property {string} [error] - Error message (if failed)
 * @property {string} provider - Provider used for parsing
 * @property {number} confidence - Confidence score
 * @property {number} processingTime - Time taken in milliseconds
 */
