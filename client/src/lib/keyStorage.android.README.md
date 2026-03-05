# AndroidKeyStorage - Android Platform Implementation

This module implements secure API key storage for Android using the Android Keystore System.

## Overview

The `AndroidKeyStorage` class provides hardware-backed encryption for API keys on Android devices:

- **Android Keystore System** - Hardware-backed encryption when available
- **AES/GCM/NoPadding** - Industry-standard authenticated encryption
- **SharedPreferences** - Encrypted data storage
- **Capacitor Bridge** - Native code communication

## Architecture

```
JavaScript Layer (keyStorage.android.js)
    ↓
Capacitor Plugin Bridge (SecureStorage.js)
    ↓
Native Android Plugin (SecureStoragePlugin.java)
    ↓
Android Keystore System (Hardware-backed)
    ↓
SharedPreferences (Encrypted storage)
```

## Native Plugin Implementation

The `SecureStoragePlugin.java` provides three core methods:

### 1. `set(key, value)`

Encrypts and stores a value:

```java
// Generate/retrieve encryption key from Android Keystore
KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
SecretKey secretKey = keyStore.getKey(KEY_ALIAS, null);

// Encrypt with AES/GCM/NoPadding
Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
cipher.init(Cipher.ENCRYPT_MODE, secretKey);
byte[] iv = cipher.getIV();
byte[] ciphertext = cipher.doFinal(plaintext.getBytes());

// Combine IV + ciphertext and store in SharedPreferences
byte[] combined = [iv][ciphertext];
String encrypted = Base64.encode(combined);
sharedPreferences.putString(key, encrypted);
```

### 2. `get(key)`

Retrieves and decrypts a value:

```java
// Retrieve encrypted data from SharedPreferences
String encrypted = sharedPreferences.getString(key);
byte[] combined = Base64.decode(encrypted);

// Extract IV and ciphertext
byte[] iv = combined[0:12];
byte[] ciphertext = combined[12:];

// Decrypt with Android Keystore
SecretKey secretKey = keyStore.getKey(KEY_ALIAS, null);
Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
cipher.init(Cipher.DECRYPT_MODE, secretKey, new GCMParameterSpec(128, iv));
byte[] plaintext = cipher.doFinal(ciphertext);
```

### 3. `remove(key)`

Removes a stored value:

```java
sharedPreferences.edit().remove(key).apply();
```

## JavaScript Usage

```javascript
import { AndroidKeyStorage } from "./keyStorage.android.js";

const storage = new AndroidKeyStorage();

// Store a key
await storage.setKey("groq", "gsk_abc123...");

// Retrieve a key
const key = await storage.getKey("groq");

// Check if key exists
const exists = await storage.hasKey("groq");

// Remove a key
await storage.removeKey("groq");

// Get all providers with keys
const providers = await storage.getProviders();

// Clear all keys
await storage.clearAll();
```

## Security Features

### Hardware-Backed Encryption

- Uses Android Keystore System for key generation and storage
- Encryption keys never leave the secure hardware (when available)
- Keys are bound to the device and cannot be extracted

### AES-256-GCM Encryption

- **Algorithm**: AES (Advanced Encryption Standard)
- **Mode**: GCM (Galois/Counter Mode) - provides authentication
- **Key Size**: 256 bits
- **IV**: 12 bytes (96 bits) - randomly generated per encryption
- **Tag**: 128 bits - authentication tag to detect tampering

### Key Generation

```java
KeyGenParameterSpec spec = new KeyGenParameterSpec.Builder(
    KEY_ALIAS,
    KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT
)
.setBlockModes(KeyProperties.BLOCK_MODE_GCM)
.setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
.setKeySize(256)
.setUserAuthenticationRequired(false)
.setRandomizedEncryptionRequired(true)
.build();
```

## Testing the Plugin

### Manual Testing on Android Device/Emulator

1. Build and run the Android app:

```bash
cd client
npm run build
npx cap sync android
npx cap open android
```

2. Open Chrome DevTools for debugging:

```
chrome://inspect
```

3. Test in browser console:

```javascript
// Import the storage
import { AndroidKeyStorage } from "./lib/keyStorage.android.js";
const storage = new AndroidKeyStorage();

// Test set
await storage.setKey("groq", "gsk_test123456789012345678901234567890");
console.log("✓ Key stored");

// Test get
const key = await storage.getKey("groq");
console.log("✓ Key retrieved:", key.slice(-4));

// Test has
const exists = await storage.hasKey("groq");
console.log("✓ Key exists:", exists);

// Test remove
await storage.removeKey("groq");
console.log("✓ Key removed");

// Verify removal
const existsAfter = await storage.hasKey("groq");
console.log("✓ Key exists after removal:", existsAfter);
```

### Verifying Encryption

To verify that data is actually encrypted in SharedPreferences:

1. Connect to device via ADB:

```bash
adb shell
```

2. View SharedPreferences file:

```bash
run-as com.moneymanager.app
cat /data/data/com.moneymanager.app/shared_prefs/secure_storage_prefs.xml
```

3. You should see Base64-encoded encrypted data, NOT plaintext keys

## Error Handling

The plugin handles various error scenarios:

- **Plugin not available**: Throws error if not on Android platform
- **Encryption failure**: Returns descriptive error message
- **Key not found**: Returns `null` instead of throwing
- **Storage failure**: Wraps native errors with context

## Platform Detection

The storage automatically detects the platform:

```javascript
import { Capacitor } from "@capacitor/core";

const isAndroid = Capacitor.getPlatform() === "android";
```

Only use `AndroidKeyStorage` on Android. For web, use `WebKeyStorage`.

## Requirements Satisfied

- **1.3**: Encrypted API key storage using Android Keystore
- **1.4**: Platform-specific secure storage (Android Keystore)
- **7.1**: AES-256-GCM encryption
- **7.2**: Hardware-backed secure storage
- **10.2**: Consistent interface across platforms

## Files

- `SecureStoragePlugin.java` - Native Android plugin implementation
- `SecureStorage.js` - Capacitor plugin registration
- `keyStorage.android.js` - JavaScript wrapper for Android platform
- `MainActivity.java` - Plugin registration in app

## Next Steps

- Integrate with KeyManager for key lifecycle management
- Add metadata storage for key validation status
- Implement key rotation if needed
- Add biometric authentication option (future enhancement)
