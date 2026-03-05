# Task 5.2 Verification: Provider Priority and Fallback Logic

## Implementation Summary

Task 5.2 has been successfully implemented. The KeyManager now supports provider priority ordering and automatic fallback logic when a provider fails.

## Changes Made

### 1. KeyManager (client/src/lib/keyManager.js)

Added four new methods to support priority and fallback:

#### `setPriority(providers)`

- Stores user-defined provider priority order
- Validates all providers in the list
- Persists to platform-specific settings storage
- **Requirements**: 5.1, 5.4

#### `getPriority()`

- Retrieves stored priority order
- Returns default order `["groq", "gemini", "chatgpt"]` if not set
- Handles errors gracefully by returning default
- **Requirements**: 5.1

#### `getActiveKey()`

- Returns first valid API key based on priority order
- Iterates through providers in priority sequence
- Returns `{provider, key}` object or `null` if no keys available
- **Requirements**: 5.1, 5.2

#### `getNextKey(failedProvider)`

- Returns next fallback key after a provider fails
- Finds failed provider in priority list
- Returns next available key in sequence
- Returns `null` if no more fallbacks available
- **Requirements**: 5.2, 5.3

### 2. Web Storage (client/src/lib/keyStorage.web.js)

Added three new methods for settings management:

#### `setSetting(key, value)`

- Stores settings in IndexedDB `settings` store
- Supports any JSON-serializable value
- Adds timestamp metadata

#### `getSetting(key)`

- Retrieves setting value from IndexedDB
- Returns `null` if setting doesn't exist
- Handles errors gracefully

#### `removeSetting(key)`

- Removes setting from IndexedDB
- Used for cleanup operations

### 3. Android Storage (client/src/lib/keyStorage.android.js)

Added three new methods for settings management:

#### `setSetting(key, value)`

- Stores settings via SecureStorage plugin
- Uses `setting_` prefix for storage keys
- JSON-serializes values with timestamp

#### `getSetting(key)`

- Retrieves setting via SecureStorage plugin
- Returns `null` if setting doesn't exist
- Handles "not found" errors gracefully

#### `removeSetting(key)`

- Removes setting via SecureStorage plugin
- Ignores errors if setting doesn't exist

### 4. Test File (client/src/lib/\_\_manual_test_priority_fallback.js)

Created comprehensive manual test suite with 10 test cases:

1. **Test 1**: Get default priority order
2. **Test 2**: Set custom priority order
3. **Test 3**: Reject invalid provider in priority
4. **Test 4**: Get active key with no keys configured
5. **Test 5**: Get next key with no keys configured
6. **Test 6**: Get active key with simulated keys
7. **Test 7**: Test fallback logic
8. **Test 8**: Test fallback at end of priority list
9. **Test 9**: Test fallback with unknown failed provider
10. **Test 10**: Test priority order affects active key

Also includes `testPriorityWithRealKeys()` for testing with actual API keys.

## How It Works

### Priority Order Flow

```
User configures keys: Groq, Gemini, ChatGPT
User sets priority: ["groq", "gemini", "chatgpt"]

┌─────────────────────────────────────┐
│ getActiveKey()                      │
├─────────────────────────────────────┤
│ 1. Get priority: ["groq", ...]     │
│ 2. Check groq → has key? YES        │
│ 3. Return {provider: "groq", key}   │
└─────────────────────────────────────┘
```

### Fallback Flow

```
Primary provider (Groq) fails during parsing

┌─────────────────────────────────────┐
│ getNextKey("groq")                  │
├─────────────────────────────────────┤
│ 1. Get priority: ["groq", ...]     │
│ 2. Find "groq" at index 0           │
│ 3. Check next: "gemini" at index 1  │
│ 4. Check gemini → has key? YES      │
│ 5. Return {provider: "gemini", key} │
└─────────────────────────────────────┘
```

### Storage Structure

**Web (IndexedDB - settings store)**:

```javascript
{
  key: "priority",
  value: ["groq", "gemini", "chatgpt"],
  updatedAt: 1234567890
}
```

**Android (SharedPreferences via SecureStorage)**:

```javascript
{
  key: "setting_priority",
  value: JSON.stringify({
    value: ["groq", "gemini", "chatgpt"],
    updatedAt: 1234567890
  })
}
```

## Requirements Satisfied

- ✅ **5.1**: Priority order maintained for provider selection
- ✅ **5.2**: Automatic fallback to next provider on failure
- ✅ **5.3**: Error handling when all providers fail (returns null)
- ✅ **5.4**: User can set priority order via setPriority()

## Testing

### Manual Testing (Browser Console)

```javascript
// Import test file in your app, then run:
await testPriorityAndFallback();

// Or test with real keys:
await testPriorityWithRealKeys({
  groq: "gsk_...",
  gemini: "AIza...",
  chatgpt: "sk-...",
});
```

### Integration Testing

The priority and fallback logic integrates with:

- **ExpenseParser**: Will use getActiveKey() to select provider
- **ExpenseParser**: Will use getNextKey() when primary fails
- **Settings UI**: Will use setPriority() for drag-and-drop reordering
- **Settings UI**: Will use getPriority() to display current order

## Next Steps

This implementation is ready for integration with:

1. **Task 5.3**: Screenshot monitoring control logic
2. **Task 6.1**: ExpenseParser integration with fallback
3. **Task 8.5**: PrioritySettings UI component

## Notes

- Default priority order is `["groq", "gemini", "chatgpt"]` as specified in design
- Priority order is stored persistently across app restarts
- Both web and Android platforms use the same API
- Error handling ensures graceful degradation (returns defaults on error)
- All API keys remain redacted in logs and error messages
