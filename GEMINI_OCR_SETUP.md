# Google Gemini 2.0 Flash OCR Integration

This guide explains how to set up and use Google Gemini AI for enhanced OCR text parsing in the Money Manager app.

## Overview

The app now uses Google Gemini 2.0 Flash (experimental) to parse expense amounts from OCR-extracted text. This provides:

- **Better accuracy** for complex payment screenshots
- **Intelligent parsing** that understands context
- **Automatic fallback** to local regex parsing if Gemini is unavailable

## Architecture

```
Screenshot → ML Kit OCR → Extracted Text → Gemini API → Parsed Amount
                                              ↓ (if fails)
                                         Local Parser
```

## Setup Instructions

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Server

1. Open `server/.env`
2. Replace the placeholder with your actual API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Install Dependencies

```bash
cd server
npm install
```

This will install the `@google/generative-ai` package.

### 4. Configure Server URL (for Android)

The Android app needs to know where your server is running:

**For Emulator Testing:**

- Default: `http://10.0.2.2:3000` (already configured)
- This maps to `localhost:3000` on your development machine

**For Physical Device Testing:**

1. Find your computer's local IP address:

   ```bash
   # Windows
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)

   # Mac/Linux
   ifconfig
   # Look for inet address
   ```

2. Update `client/android/app/build.gradle`:

   ```gradle
   buildConfigField "String", "SERVER_URL", "\"http://YOUR_IP:3000\""
   ```

   Example: `"http://192.168.1.100:3000"`

3. Ensure your phone and computer are on the same WiFi network

### 5. Start the Server

```bash
cd server
npm run dev
```

The server will start on port 3000.

### 6. Rebuild Android App

```bash
cd client
npm run build
npx cap sync android
```

Then open Android Studio and run the app.

## Testing

### Test the Server Endpoint

```bash
curl -X POST http://localhost:3000/api/ocr/parse \
  -H "Content-Type: application/json" \
  -d '{"text": "Payment Successful\n₹1,250\nPaid to Zomato"}'
```

Expected response:

```json
{
  "success": true,
  "data": {
    "amount": 1250,
    "merchant": "Zomato",
    "type": "debit",
    "confidence": 95
  }
}
```

### Test in Android App

1. Take a screenshot of a payment app (Google Pay, PhonePe, etc.)
2. The app will:
   - Extract text using ML Kit OCR
   - Send text to Gemini API for parsing
   - Show overlay with parsed expense
3. Check logs in Android Studio:
   ```
   ✅ Gemini parsing successful
   Gemini parsed - Amount: 1250.0, Merchant: Zomato, Confidence: 95
   ```

## Fallback Behavior

If Gemini API fails (network issue, API key invalid, etc.), the app automatically falls back to local regex-based parsing:

```
⚠️ Gemini parsing failed, using local parser: Connection timeout
Amount parsed: 1250.0 using pattern: ₹\s*([0-9,]+\.?[0-9]*)
```

This ensures the feature always works, even without internet connectivity.

## API Costs

Google Gemini 2.0 Flash pricing (as of Jan 2025):

- **Free tier**: 15 requests per minute, 1500 requests per day
- **Paid tier**: Very low cost per request

For typical usage (few screenshots per day), the free tier is sufficient.

## Troubleshooting

### "Gemini API not configured" error

- Check that `GEMINI_API_KEY` is set in `server/.env`
- Restart the server after adding the key

### "Connection refused" in Android logs

- Verify server is running (`npm run dev`)
- Check SERVER_URL in `build.gradle` matches your setup
- For physical device, ensure same WiFi network

### Always falling back to local parser

- Check server logs for errors
- Verify API key is valid
- Test the endpoint directly with curl

### Low confidence scores

- Gemini returns confidence 0-100
- Scores below 50 indicate unclear text
- Try taking clearer screenshots

## Model Information

**Model**: `gemini-2.0-flash-exp`

- Latest experimental version (as of Jan 2025)
- Optimized for speed and accuracy
- Supports structured JSON output

To use a different model, edit `server/src/services/geminiParser.js`:

```javascript
this.model = this.genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp", // Change this
});
```

Available models:

- `gemini-2.0-flash-exp` - Latest experimental (recommended)
- `gemini-1.5-flash` - Stable version
- `gemini-1.5-pro` - Higher accuracy, slower

## Security Notes

- API key is stored server-side only (not in Android app)
- Android app sends only OCR text to server (no images)
- Server validates all requests
- No authentication required for `/api/ocr/parse` endpoint (add if needed)

## Next Steps

Consider adding:

- Rate limiting on the server endpoint
- Caching for repeated text parsing
- User authentication for the API
- Analytics for parsing accuracy
