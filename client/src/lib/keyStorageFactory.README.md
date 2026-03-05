# Key Storage Factory

## Overview

The Key Storage Factory provides a platform-agnostic way to access secure key storage functionality. It automatically detects whether the app is running on web or Android and returns the appropriate storage implementation.

## Usage

### Basic Usage

```javascript
import getKeyStorage from "./lib/keyStorageFactory.js";

// Get the storage instance
const storage = await getKeyStorage();

// Use the storage instance
await storage.setKey("groq", "gsk_abc123...");
const key = await storage.getKey("groq");
```

### Platform Detection

```javascript
import { getPlatform } from "./lib/keyStorageFactory.js";

const platform = getPlatform(); // 'web' or 'android'
console.log(`Running on ${platform} platform`);
```

## How It Works

1. **Platform Detection**: Uses `Capacitor.getPlatform()` to detect the current platform
2. **Dynamic Import**: Loads the appropriate storage implementation based on platform
3. **Singleton Pattern**: Returns the same instance on subsequent calls for efficiency

## Platform-Specific Implementations

### Web Platform

- Uses `WebKeyStorage` from `keyStorage.web.js`
- Storage: IndexedDB
- Encryption: Web Crypto API (AES-256-GCM)
- Key Derivation: PBKDF2 with browser fingerprint

### Android Platform

- Uses `AndroidKeyStorage` from `keyStorage.android.js`
- Storage: SharedPreferences
- Encryption: Android Keystore System (hardware-backed)
- Bridge: Capacitor SecureStorage plugin

## API

### `getKeyStorage()`

Returns the platform-appropriate storage instance.

**Returns**: `Promise<BaseKeyStorage>` - Storage instance with the following methods:

- `setKey(provider, key)` - Store an encrypted API key
- `getKey(provider)` - Retrieve and decrypt an API key
- `removeKey(provider)` - Remove an API key
- `hasKey(provider)` - Check if a key exists
- `getProviders()` - Get list of all providers with stored keys
- `clearAll()` - Clear all stored keys
- `updateKeyMetadata(provider, metadata)` - Update key metadata
- `getKeyMetadata(provider)` - Get key metadata

**Example**:

```javascript
const storage = await getKeyStorage();
await storage.setKey("chatgpt", "sk-abc123...");
```

### `getPlatform()`

Returns the current platform identifier.

**Returns**: `'web' | 'android'`

**Example**:

```javascript
const platform = getPlatform();
if (platform === "android") {
  console.log("Running on Android");
}
```

### `resetStorageInstance()` (Private)

Resets the singleton instance. Used for testing purposes only.

## Integration with Other Components

### Key Manager

The Key Manager uses the factory to get the storage instance:

```javascript
import getKeyStorage from "./keyStorageFactory.js";

class KeyManager {
  async setKey(provider, key) {
    const storage = await getKeyStorage();
    await storage.setKey(provider, key);
  }
}
```

### Expense Parser

The Expense Parser accesses keys through the Key Manager, which uses the factory internally.

## Error Handling

The factory handles platform detection errors gracefully:

- If platform detection fails, defaults to web platform
- If storage initialization fails, throws descriptive error
- All storage operations include error handling from the base class

## Testing

For testing, you can reset the singleton instance:

```javascript
import { resetStorageInstance } from "./keyStorageFactory.js";

// In test teardown
afterEach(() => {
  resetStorageInstance();
});
```

## Requirements

This module satisfies the following requirements:

- **10.1**: Cross-platform consistency - Identical interface across platforms
- **10.2**: Platform-specific storage - Uses appropriate secure storage for each platform

## Security Considerations

1. **No Key Exposure**: The factory never logs or exposes API keys
2. **Platform Isolation**: Each platform uses its native secure storage
3. **Singleton Pattern**: Ensures consistent encryption keys across app lifecycle
4. **Lazy Loading**: Storage implementations loaded only when needed

## Future Enhancements

Potential improvements for future versions:

- Support for iOS platform (currently defaults to web)
- Storage migration utilities for platform switches
- Performance monitoring and metrics
- Storage health checks and diagnostics
