# Gemini OCR - Quick Start

## 🚀 Get Started in 3 Steps

### 1. Get API Key (2 minutes)

```bash
# Visit: https://aistudio.google.com/app/apikey
# Click "Create API Key"
# Copy the key
```

### 2. Configure & Install (1 minute)

```bash
# Add to server/.env
echo "GEMINI_API_KEY=your_key_here" >> server/.env

# Install dependencies
cd server && npm install
```

### 3. Start & Test (1 minute)

```bash
# Terminal 1: Start server
cd server && npm run dev

# Terminal 2: Test it
node test-gemini-ocr.js
```

## 📱 For Android Testing

### Emulator (Default - No Changes Needed)

```bash
cd client
npm run build
npx cap sync android
# Open in Android Studio and run
```

### Physical Device

1. Find your computer's IP:

   ```bash
   ipconfig  # Windows
   ifconfig  # Mac/Linux
   ```

2. Update `client/android/app/build.gradle`:

   ```gradle
   buildConfigField "String", "SERVER_URL", "\"http://YOUR_IP:3000\""
   ```

3. Rebuild:
   ```bash
   cd client
   npm run build
   npx cap sync android
   ```

## ✅ Verify It's Working

### Check Server

```bash
curl -X POST http://localhost:3000/api/ocr/parse \
  -H "Content-Type: application/json" \
  -d '{"text": "Paid ₹500 to Zomato"}'
```

Expected output:

```json
{
  "success": true,
  "data": {
    "amount": 500,
    "merchant": "Zomato",
    "type": "debit",
    "confidence": 95
  }
}
```

### Check Android Logs

```
✅ Gemini parsing successful
Gemini parsed - Amount: 500.0, Merchant: Zomato
```

## 🔧 Troubleshooting

| Issue                         | Solution                                                 |
| ----------------------------- | -------------------------------------------------------- |
| "Gemini API not configured"   | Add `GEMINI_API_KEY` to `server/.env` and restart server |
| "Connection refused"          | Check server is running on port 3000                     |
| "Always using local parser"   | Verify API key is valid, check server logs               |
| Physical device can't connect | Ensure same WiFi, update SERVER_URL with your IP         |

## 💡 How It Works

```
Screenshot → ML Kit OCR → Text → Gemini API → Parsed Data
                                      ↓ (if fails)
                                  Local Parser
```

- **Primary**: Gemini AI parses the text (better accuracy)
- **Fallback**: Local regex parser (works offline)
- **Always works**: Even without internet or API key

## 📊 Free Tier Limits

- 15 requests/minute
- 1,500 requests/day
- Perfect for personal use!

## 📚 Full Documentation

See `GEMINI_OCR_SETUP.md` for detailed information.
