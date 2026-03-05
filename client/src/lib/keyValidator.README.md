# KeyValidator

The `KeyValidator` class validates API keys by testing them against their respective AI providers (ChatGPT, Groq, Gemini). It distinguishes between different error types to provide helpful feedback to users.

## Features

- **Provider-specific validation**: Each provider has a different API endpoint and authentication method
- **10-second timeout**: All validation requests complete within 10 seconds or return a timeout error
- **Error type detection**: Distinguishes between invalid keys, network errors, rate limits, and timeouts
- **Singleton pattern**: Exports a singleton instance for app-wide use

## Usage

```javascript
import { keyValidator } from "./lib/keyValidator.js";

// Validate a key
const result = await keyValidator.validate("chatgpt", "sk-...");

if (result.valid) {
  console.log("Key is valid!");
} else {
  console.error(`Validation failed: ${result.error}`);
  console.error(`Error type: ${result.errorType}`);
}
```

## API

### `validate(provider, key)`

Validates an API key by testing it with the provider.

**Parameters:**

- `provider` (string): Provider name ('chatgpt', 'groq', or 'gemini')
- `key` (string): API key to validate

**Returns:** `Promise<ValidationResult>`

```typescript
interface ValidationResult {
  valid: boolean;
  error?: string;
  errorType?: "invalid_key" | "network_error" | "rate_limit" | "timeout";
}
```

### Provider-Specific Methods

#### `testChatGPT(key)`

Tests a ChatGPT (OpenAI) API key by calling the `/v1/models` endpoint.

**Authentication:** Bearer token in Authorization header

#### `testGroq(key)`

Tests a Groq API key by calling the `/openai/v1/models` endpoint.

**Authentication:** Bearer token in Authorization header

#### `testGemini(key)`

Tests a Gemini (Google) API key by calling the `/v1beta/models` endpoint.

**Authentication:** API key as query parameter

## Error Types

The validator distinguishes between the following error types:

- **`invalid_key`**: The API key is invalid or has been revoked (HTTP 401/403)
- **`network_error`**: Unable to connect to the provider or other network issues
- **`rate_limit`**: Rate limit exceeded for this API key (HTTP 429)
- **`timeout`**: Validation request took longer than 10 seconds

## Implementation Details

### Timeout Handling

All validation requests use `AbortController` to enforce a 10-second timeout:

```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000);

const response = await fetch(url, {
  signal: controller.signal,
});

clearTimeout(timeoutId);
```

### Error Detection

The validator examines HTTP status codes and exception types to determine the error type:

- **401/403**: Invalid key
- **429**: Rate limit exceeded
- **AbortError**: Timeout
- **Network errors**: Connection issues
- **Other errors**: Unknown error type

### Provider Differences

Each provider has a different authentication method:

**ChatGPT & Groq:**

```javascript
headers: {
  'Authorization': `Bearer ${key}`,
  'Content-Type': 'application/json'
}
```

**Gemini:**

```javascript
// API key as query parameter
const url = `${endpoint}?key=${key}`;
```

## Requirements

This component satisfies the following requirements:

- **2.1**: Send test request to AI provider when user provides key
- **2.2**: Mark key as valid if test request succeeds
- **2.3**: Display descriptive error if test request fails
- **2.4**: Complete validation within 10 seconds or display timeout error
- **2.5**: Distinguish between network errors and invalid key errors

## Testing

See `keyValidator.test.js` for unit tests covering:

- Successful validation for each provider
- Invalid key detection
- Network error handling
- Timeout handling
- Rate limit detection

## Related Files

- `aiProviders.js`: Provider configuration (endpoints, key formats)
- `aiErrors.js`: Error types and messages
- `aiTypes.js`: TypeScript type definitions
- `keyManager.js`: Uses KeyValidator to validate keys before storage
