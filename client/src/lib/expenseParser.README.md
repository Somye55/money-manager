# ExpenseParser

The ExpenseParser is responsible for parsing expense data from OCR text, screenshots, or notification text using AI providers (ChatGPT, Groq, or Gemini) with automatic fallback support.

## Features

- **Multi-Provider Support**: Works with ChatGPT, Groq, and Gemini
- **Automatic Fallback**: If primary provider fails, automatically tries fallback providers
- **Priority-Based Selection**: Uses KeyManager's priority order to select providers
- **Backward Compatibility**: Falls back to developer-provided keys when no user keys exist
- **Consistent Output**: Produces standardized ExpenseData regardless of provider
- **Provider-Specific Formatting**: Adapts requests to match each provider's API specification

## Usage

### Basic Usage

```javascript
import { expenseParser } from "./lib/expenseParser.js";

// Parse expense from OCR text
const result = await expenseParser.parse({
  type: "ocr",
  text: "Paid Rs 500 to John Doe via UPI",
});

if (result.success) {
  console.log("Amount:", result.data.amount);
  console.log("Merchant:", result.data.merchant);
  console.log("Type:", result.data.type);
  console.log("Confidence:", result.data.confidence);
  console.log("Provider used:", result.provider);
} else {
  console.error("Parse failed:", result.error);
}
```

### Parse from Screenshot

```javascript
const result = await expenseParser.parse({
  type: "screenshot",
  text: ocrTextFromScreenshot,
  metadata: {
    imageUri: "file:///path/to/screenshot.jpg",
    timestamp: Date.now(),
  },
});
```

### Parse from Notification

```javascript
const result = await expenseParser.parse({
  type: "notification",
  text: smsText,
  metadata: {
    appName: "Messages",
    timestamp: Date.now(),
  },
});
```

## API Reference

### `parse(source)`

Main method to parse expense data from any source.

**Parameters:**

- `source` (ParseSource): Source data to parse
  - `type` (string): Source type - 'ocr', 'screenshot', or 'notification'
  - `text` (string): Text to parse
  - `metadata` (object, optional): Additional metadata

**Returns:** Promise<ParseResponse>

- `success` (boolean): Whether parsing succeeded
- `data` (ExpenseData, optional): Parsed expense data (if success)
- `error` (string, optional): Error message (if failed)
- `provider` (string): Provider used for parsing
- `confidence` (number): Confidence score (0-100)
- `processingTime` (number): Time taken in milliseconds

### `parseWithProvider(provider, key, text)`

Parse with a specific provider (internal method).

**Parameters:**

- `provider` (string): Provider name ('chatgpt', 'groq', or 'gemini')
- `key` (string): API key for the provider
- `text` (string): Text to parse

**Returns:** Promise<ExpenseData>

### `formatRequest(provider, text)`

Format request for specific provider.

**Parameters:**

- `provider` (string): Provider name
- `text` (string): Text to parse

**Returns:** Object - Formatted request object

### `parseResponse(provider, response)`

Parse provider response into standardized ExpenseData.

**Parameters:**

- `provider` (string): Provider name
- `response` (Object): Raw API response

**Returns:** ExpenseData

## Data Types

### ParseSource

```typescript
{
  type: 'ocr' | 'screenshot' | 'notification',
  text: string,
  metadata?: {
    imageUri?: string,
    timestamp?: number,
    appName?: string
  }
}
```

### ExpenseData

```typescript
{
  amount: number,           // Transaction amount
  merchant: string,         // Merchant or payee name
  type: 'debit' | 'credit', // Transaction type
  confidence: number,       // Confidence score (0-100)
  timestamp: number,        // Parse timestamp
  rawText: string          // Original text
}
```

### ParseResponse

```typescript
{
  success: boolean,
  data?: ExpenseData,      // Present if success is true
  error?: string,          // Present if success is false
  provider: string,        // Provider used
  confidence: number,      // Confidence score
  processingTime: number   // Time in milliseconds
}
```

## How It Works

### 1. Provider Selection

The parser uses KeyManager to get the active provider based on priority order:

```javascript
const activeKey = await keyManager.getActiveKey();
// Returns: { provider: 'groq', key: 'gsk_...' }
```

### 2. Request Formatting

Each provider has a different API format. The parser adapts the request:

**ChatGPT/Groq (OpenAI-compatible):**

```json
{
  "model": "gpt-3.5-turbo",
  "messages": [
    { "role": "system", "content": "..." },
    { "role": "user", "content": "..." }
  ]
}
```

**Gemini:**

```json
{
  "contents": [
    {
      "parts": [{ "text": "..." }]
    }
  ]
}
```

### 3. Response Parsing

Each provider returns responses in different formats. The parser extracts the text and parses the JSON:

**ChatGPT/Groq:**

```javascript
text = response.choices[0].message.content;
```

**Gemini:**

```javascript
text = response.candidates[0].content.parts[0].text;
```

### 4. Fallback Logic

If the primary provider fails, the parser automatically tries fallback providers:

```
Primary (groq) fails
  ↓
Try fallback (gemini)
  ↓
Try fallback (chatgpt)
  ↓
Try developer key (if available)
  ↓
Return error
```

## Migration Support

The parser maintains backward compatibility with existing code that uses developer-provided keys:

- If no user keys are configured, it falls back to `process.env.GROQ_API_KEY`
- Once a user adds their first key, it switches to user-provided keys
- Developer key is used as last resort if all user providers fail

## Error Handling

The parser handles various error scenarios:

1. **No API Keys**: Returns error prompting user to add keys
2. **Invalid Response**: Validates response structure and returns error
3. **Network Errors**: Catches and reports network failures
4. **All Providers Failed**: Tries all fallbacks before returning error

## Testing

Use the manual test utilities to verify the parser:

```javascript
import {
  testExpenseParser,
  quickTest,
} from "./lib/__manual_test_expenseparser.js";

// Run all test cases
await testExpenseParser();

// Quick test with custom text
await quickTest("Paid Rs 500 to John Doe");
```

## Requirements Satisfied

- **6.1**: Parse expense data from OCR text using configured API key
- **6.2**: Parse expense data from screenshots using configured API key
- **6.3**: Parse expense data from SMS/notification text using configured API key
- **6.4**: Maintain same parsing accuracy regardless of provider
- **6.5**: Adapt request formats to match each provider's API specification
- **5.2**: Implement fallback to next provider when primary fails
- **5.3**: Return error when all providers fail
- **8.1**: Continue using developer keys when no user keys configured
- **8.2**: Switch to user keys once first key is added

## Integration Points

The ExpenseParser integrates with:

1. **KeyManager**: Gets active keys and handles fallback
2. **AI Providers**: Uses provider configurations for endpoints and formatting
3. **OCR Service**: Receives OCR text for parsing
4. **Screenshot Service**: Receives screenshot text for parsing
5. **SMS Service**: Receives notification text for parsing

## Next Steps

To integrate the ExpenseParser with existing features:

1. Update OCR parsing flow to use `expenseParser.parse()`
2. Update screenshot parsing flow to use `expenseParser.parse()`
3. Update notification/SMS parsing flow to use `expenseParser.parse()`
4. Replace direct Gemini API calls with ExpenseParser
5. Add error handling to prompt users to configure keys when needed
