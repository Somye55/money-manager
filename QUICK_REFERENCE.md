# 🚀 Gemini Integration - Quick Reference

## What It Does

```
Screenshot → ML Kit OCR → Gemini AI → Parsed Expense
             (image→text)  (text→data)
```

**ML Kit**: Extracts text from image (on-device)
**Gemini**: Parses text to find amount/merchant (cloud)

## Setup (5 Minutes)

```bash
# 1. Get API key: https://aistudio.google.com/app/apikey

# 2. Add to server/.env
echo "GEMINI_API_KEY=your_key_here" >> server/.env

# 3. Install & start
cd server && npm install && npm run dev

# 4. Test
npm run test:gemini
```

## Test Commands

```bash
# Start server
npm run server:dev

# Test Gemini
npm run test:gemini

# Test endpoint
curl -X POST http://localhost:3000/api/ocr/parse \
  -H "Content-Type: application/json" \
  -d '{"text": "Paid ₹500 to Zomato"}'
```

## Configuration

### Emulator (Default)

✅ No changes needed! Uses `http://10.0.2.2:3000`

### Physical Device

```gradle
// client/android/app/build.gradle
buildConfigField "String", "SERVER_URL", "\"http://YOUR_IP:3000\""
```

## Files Changed

```
server/
├── src/services/geminiParser.js  ← NEW
├── src/index.js                  ← UPDATED
├── package.json                  ← UPDATED
└── .env                          ← UPDATED

client/android/app/
├── src/.../OCRProcessor.java     ← UPDATED
└── build.gradle                  ← UPDATED
```

## Troubleshooting

| Problem              | Fix                                |
| -------------------- | ---------------------------------- |
| "API key not found"  | Add to `server/.env`               |
| "Connection refused" | Start server: `npm run server:dev` |
| Always local parser  | Check API key, server logs         |

## Documentation

- `START_HERE_GEMINI.md` - Start here!
- `SETUP_CHECKLIST.md` - Step-by-step
- `INTEGRATION_VERIFICATION.md` - How it works
- `FINAL_INTEGRATION_SUMMARY.md` - Complete summary

## Key Points

✅ ML Kit does OCR (image → text)
✅ Gemini parses text (text → data)
✅ Images never leave device
✅ Free tier: 1,500 requests/day
✅ Fallback to local parser
✅ ~2 seconds total time

## Next Steps

1. Get API key
2. Add to `server/.env`
3. Run `npm run server:dev`
4. Run `npm run test:gemini`
5. Test with Android app

---

**Ready!** See `START_HERE_GEMINI.md` for details.
