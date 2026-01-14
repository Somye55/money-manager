# 🚀 Groq OCR - Quick Start Guide

> Get AI-powered expense parsing running in 6 minutes

## ⚡ Super Quick Setup

### Step 1: Get API Key (2 min)

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up (free, no credit card)
3. Click "Create API Key"
4. Copy the key (starts with `gsk_`)

### Step 2: Add to .env (30 sec)

Open `server/.env` and add:

```env
GROQ_API_KEY=gsk_your_api_key_here
```

### Step 3: Test It (1 min)

```bash
# Terminal 1: Start server
cd server
npm run dev

# Terminal 2: Test
node test-groq-ocr.js
```

You should see:

```
✅ Success:
   Amount: ₹500
   Merchant: Zomato
   Type: debit
   Confidence: 95%
```

### Step 4: Run on Android (2 min)

```bash
cd client
npm run build
npx cap sync android
# Open in Android Studio and run
```

## ✅ Done!

Take a screenshot of a payment app and watch the magic happen!

## 🔍 Verify It's Working

Check server logs for:

```
✅ Groq parsed expense: { amount: 500, merchant: 'Zomato', type: 'debit' }
```

## 🐛 Not Working?

### "Groq API not configured"

- Check `server/.env` has `GROQ_API_KEY=gsk_...`
- Restart server after adding key

### "Connection refused"

- Server must be running: `cd server && npm run dev`
- Check port 3000 is not blocked

### Physical Device Issues

1. Get your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Update `client/android/app/build.gradle`:
   ```gradle
   buildConfigField "String", "SERVER_URL", "\"http://YOUR_IP:3000\""
   ```
3. Rebuild: `cd client && npm run build && npx cap sync android`

## 📚 More Info

- Full docs: [README_GROQ_INTEGRATION.md](README_GROQ_INTEGRATION.md)
- Groq guide: [groq.md](groq.md)
- Test script: [test-groq-ocr.js](test-groq-ocr.js)

## 🎯 Why Groq?

- **3-4x faster** than alternatives (300-500ms)
- **14,400 free requests/day** (vs 1,500 with others)
- **No credit card** required
- **95% accuracy** on messy OCR text

---

**Questions?** Check [README_GROQ_INTEGRATION.md](README_GROQ_INTEGRATION.md) FAQ section.
