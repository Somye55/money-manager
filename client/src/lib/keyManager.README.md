# KeyManager

The KeyManager class coordinates key operations between the storage and validation layers. It manages the complete lifecycle of API keys including validation before storage, status tracking, and secure retrieval.

## Features

- **Key Validation**: Validates API keys with providers before storing
- **Format Validation**: Checks key format matches provider requirements
- **Status Caching**: Caches key statuses to minimize storage reads
- **Security**: Ensures API keys never appear in logs or error messages
- **Masked Display**: Provides masked key display (e.g., "sk-...xyz123")

## Usage

```javascript
import { keyManager } from "./lib/keyManager.js";

// Add a new API key
const result = await keyManager.setKey("groq", "gsk_...");
if (result.success) {
  console.log("Key saved successfully");
} else {
  console.error("Failed to save key:", result.error);
}

// Test a stored key
const testResult = await keyManager.testKey("groq");
if (testResult.success) {
  console.log("Key is valid");
}

// Get all key statuses
const statuses = await keyManager.getKeyStatuses();
console.log("ChatGPT configured:", statuses.chatgpt.configured);
console.log("Groq valid:", statuses.groq.valid);

// Remove a key
await keyManager.removeKey("groq");

// Check if any valid key exists
const hasKey = await keyManager.hasValidKey();
```

## API Reference

### `setKey(provider, key)`

Add or update an API key. Validates the key before storing.

**Parameters:**

- `provider` (string): Provider name ('chatgpt', 'groq', or 'gemini')
- `key` (string): API key to store

**Returns:** `Promise<Result>`

- `success` (boolean): Whether the operation succeeded
- `error` (string, optional): Error message if operation failed

**Process:**

1. Validates provider name
2. Validates key format using provider's regex
3. Tests key with provider API
4. Stores key if validation succeeds
5. Updates status cache

### `removeKey(provider)`

Remove an API key from storage.

**Parameters:**

- `provider` (string): Provider name

**Returns:** `Promise<Result>`

### `testKey(provider)`

Test a stored API key by validating it with the provider.

**Parameters:**

- `provider` (string): Provider name

**Returns:** `Promise<Result>`

- Updates status cache with validation result

### `getKeyStatuses()`

Get status of all providers (configured and unconfigured).

**Returns:** `Promise<{[provider: string]: KeyStatus}>`

**KeyStatus:**

- `configured` (boolean): Whether a key exists in storage
- `valid` (boolean|null): Validation result (null = not tested yet)
- `lastTested` (number|null): Timestamp of last validation
- `maskedKey` (string|null): Masked key (e.g., "sk-...xyz123")
- `error` (string|null): Last error message if validation failed

### `hasValidKey()`

Check if any valid key exists in storage.

**Returns:** `Promise<boolean>`

## Security Features

### Key Masking

Keys are masked for display, showing only the last 4 characters:

- ChatGPT: `sk-...xyz123`
- Groq: `gsk_...abc456`
- Gemini: `AIza...def789`

### Error Sanitization

All error messages are sanitized to remove API keys:

- Replaces `sk-[A-Za-z0-9]{48,}` with `[REDACTED]`
- Replaces `gsk_[A-Za-z0-9]{52,}` with `[REDACTED]`
- Replaces `AIza[A-Za-z0-9_-]{35,}` with `[REDACTED]`

### Logging

API keys never appear in console logs or error messages. All errors are sanitized before logging.

## Status Caching

The KeyManager maintains an in-memory cache of key statuses to minimize storage reads. The cache is updated when:

- A key is added or updated
- A key is removed
- A key is tested

## Error Handling

All methods return a `Result` object with `success` and optional `error` fields. Errors are caught and sanitized to prevent key exposure.

## Requirements Satisfied

- **1.1**: API key input and storage
- **1.2**: Key validation before saving
- **1.3**: Encrypted storage
- **1.5**: Keys never appear in logs
- **2.1**: Test request to provider
- **2.2**: Mark key as valid on success
- **2.3**: Display error on validation failure
- **3.3**: Remove key after confirmation
- **7.5**: Redact keys from log messages
- **7.6**: Clear keys from memory after use

## Dependencies

- `keyStorageFactory`: Platform-agnostic storage
- `keyValidator`: Key validation with providers
- `aiProviders`: Provider configuration

## Testing

See `keyManager.test.js` for unit tests covering:

- Key addition and removal
- Format validation
- Key validation
- Status caching
- Error sanitization
- Masked key display
