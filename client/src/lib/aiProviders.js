/**
 * AI Provider Configuration
 *
 * Defines configuration for supported AI providers (ChatGPT, Groq, Gemini)
 * including API endpoints, key formats, and metadata for UI display.
 */

export const PROVIDERS = [
  {
    name: "chatgpt",
    displayName: "ChatGPT (OpenAI)",
    apiEndpoint: "https://api.openai.com/v1/chat/completions",
    testEndpoint: "https://api.openai.com/v1/models",
    keyFormat: /^sk-[A-Za-z0-9]{48,}$/,
    helpUrl: "https://platform.openai.com/api-keys",
    icon: "openai-icon",
    color: "#10a37f",
  },
  {
    name: "groq",
    displayName: "Groq",
    apiEndpoint: "https://api.groq.com/openai/v1/chat/completions",
    testEndpoint: "https://api.groq.com/openai/v1/models",
    keyFormat: /^gsk_[A-Za-z0-9]{52,}$/,
    helpUrl: "https://console.groq.com/keys",
    icon: "groq-icon",
    color: "#f55036",
  },
  {
    name: "gemini",
    displayName: "Gemini (Google)",
    apiEndpoint:
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
    testEndpoint: "https://generativelanguage.googleapis.com/v1beta/models",
    keyFormat: /^AIza[A-Za-z0-9_-]{35,}$/,
    helpUrl: "https://makersuite.google.com/app/apikey",
    icon: "gemini-icon",
    color: "#4285f4",
  },
];

/**
 * Get provider configuration by name
 * @param {string} providerName - Provider name ('chatgpt', 'groq', or 'gemini')
 * @returns {Object|null} Provider configuration or null if not found
 */
export function getProvider(providerName) {
  return PROVIDERS.find((p) => p.name === providerName) || null;
}

/**
 * Validate provider name
 * @param {string} providerName - Provider name to validate
 * @returns {boolean} True if provider name is valid
 */
export function isValidProvider(providerName) {
  return PROVIDERS.some((p) => p.name === providerName);
}

/**
 * Get all provider names
 * @returns {string[]} Array of provider names
 */
export function getProviderNames() {
  return PROVIDERS.map((p) => p.name);
}
