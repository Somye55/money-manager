# KeyStorage Base Class

This module provides the foundation for secure API key storage across platforms.

## Overview

The `keyStorage.js` module defines:

1. **KeyStorageInterface** - The contract that all storage implementations must follow
2. **BaseKeyStorage** - Abstract base class with common validation logic
3. **PROVIDERS** - Constants for supported AI providers (ChatGPT, Groq, Gemini)

## Usage

### For Platform-Specific Implementations

Extend `BaseKeyStorage` and implement the storage logic:

```javascript
import { BaseKeyStorage } from "./keyStorage.js";

class WebKeyStorage extends BaseKeyStorage {
  async setKey(provider, key) {
    // Validate inputs using parent class
    const { provider: validProvider, key: validKey } = this.validateAndSanitize(
      provider,
      key,
    );

    // Implement web-specific encryption and storage
    const encrypted = await this.encrypt(validKey);
    await this.saveToIndexedDB(validProvider, encrypted);
  }

  async getKey(provider) {
    const sanitizedProvider = this.sanitizeProvider(provider);
    this.validateProvider(sanitizedProvider);

    // Implement web-specific retrieval and decryption
    const encrypted = await this.loadFromIndexedDB(sanitizedProvider);
    if (!encrypted) return null;
    return await this.decrypt(encrypted);
  }

  // Implement other methods...
}
```

## Interface Methods

All implementations must provide:

- `setKey(provider, key)` - Store an encrypted API key
- `getKey(provider)` - Retrieve and decrypt an API key
- `removeKey(provider)` - Remove an API key
- `hasKey(provider)` - Check if a key exists
- `getProviders()` - List all providers with stored keys
- `clearAll()` - Remove all stored keys

## Validation Features

The base class provides:

### Provider Validation

- Ensures provider is one of: 'chatgpt', 'groq', 'gemini'
- Sanitizes input (lowercase, trim)

### Key Validation

- Checks for non-empty strings
- Minimum length requirement (20 characters)
- Rejects placeholder values
- Trims whitespace

### Security Features

- `redactKey(key)` - Masks keys for logging (shows last 4 chars only)
- `handleStorageError()` - Wraps errors without exposing keys
- Input sanitization to prevent injection attacks

## Constants

```javascript
import { PROVIDERS, VALID_PROVIDERS } from "./keyStorage.js";

console.log(PROVIDERS.CHATGPT); // 'chatgpt'
console.log(PROVIDERS.GROQ); // 'groq'
console.log(PROVIDERS.GEMINI); // 'gemini'
console.log(VALID_PROVIDERS); // ['chatgpt', 'groq', 'gemini']
```

## Requirements Satisfied

- **1.3**: Interface for encrypted key storage
- **1.4**: Platform-specific storage mechanism support
- **7.1**: Foundation for AES-256 encryption (implemented by subclasses)
- **7.2**: Platform-specific secure storage support
- **10.2**: Consistent validation logic across platforms

## Next Steps

Platform-specific implementations will be created:

- `keyStorage.web.js` - Web implementation using IndexedDB + Web Crypto API
- `keyStorage.android.js` - Android implementation using Keystore via Capacitor
