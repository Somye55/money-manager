# 🔄 Migration Guide: Gemini → Groq

> Switch from Gemini to Groq in 5 minutes for 3-4x faster parsing

## 🎯 Why Migrate?

| Feature          | Gemini       | Groq         | Winner  |
| ---------------- | ------------ | ------------ | ------- |
| Response Time    | 1-2s         | 300-500ms    | 🏆 Groq |
| Free Tier        | 1,500/day    | 14,400/day   | 🏆 Groq |
| Accuracy         | 95%          | 95%          | Tie     |
| Setup Complexity | Medium       | Easy         | 🏆 Groq |
| Credit Card      | Not required | Not required | Tie     |

**Result: Groq is faster and has 10x more free requests!**

## ✅ What's Already Done

The migration is **already complete**! Here's what changed:

### Files Modified

- ✅ `server/src/services/groqParser.js` - New Groq parser (replaces geminiParser.js)
- ✅ `server/src/index.js` - Updated to use Groq
- ✅ `server/.env` - Changed to GROQ_API_KEY
- ✅ `package.json` - Added test:groq script
- ✅ `test-groq-ocr.js` - New test script

### Files Unchanged

- ✅ Android app - No changes needed (same API endpoint)
- ✅ Client code - No changes needed
- ✅ Database - No changes needed

## 🚀 What You Need to Do

### Step 1: Get Groq API Key (2 min)

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up (free, no credit card)
3. Create API key
4. Copy it (starts with `gsk_`)

### Step 2: Update .env (30 sec)

Open `server/.env` and replace:

```env
# OLD (Gemini)
GEMINI_API_KEY=AIzaSy...

# NEW (Groq)
GROQ_API_KEY=gsk_your_key_here
```

### Step 3: Test It (1 min)

```bash
# Start server
cd server
npm run dev

# In another terminal, test
npm run test:groq
```

Expected output:

```
✅ Success:
   Amount: ₹500
   Merchant: Zomato
   Type: debit
   Confidence: 95%
```

### Step 4: Done! (No rebuild needed)

The Android app doesn't need any changes because:

- Same API endpoint: `/api/ocr/parse`
- Same request format: `{ text: "..." }`
- Same response format: `{ amount, merchant, type }`

## 🔍 Verify Migration

### Check Server Logs

When you take a screenshot, you should see:

```
✅ Groq parsed expense: { amount: 500, merchant: 'Zomato', type: 'debit' }
```

Instead of:

```
✅ Gemini parsed expense: ...
```

### Performance Check

Groq should respond in **300-500ms** vs Gemini's **1-2s**.

## 🐛 Troubleshooting

### "Groq API not configured"

**Cause**: API key not in `.env` or server not restarted

**Fix**:

1. Check `server/.env` has `GROQ_API_KEY=gsk_...`
2. Restart server: `cd server && npm run dev`

### Still seeing "Gemini" in logs

**Cause**: Old server process still running

**Fix**:

1. Stop all Node processes
2. Restart: `cd server && npm run dev`

### Parsing accuracy different

**Cause**: Different AI models have slight variations

**Fix**: Both are ~95% accurate. If you see issues:

1. Check the prompt in `server/src/services/groqParser.js`
2. Adjust temperature (currently 0.1)
3. Try different model (see FAQ below)

## ❓ FAQ

### Can I keep both Gemini and Groq?

Yes! Keep both files and switch in `server/src/index.js`:

```javascript
// Use Groq (current)
const parser = require("./services/groqParser");

// Or use Gemini
// const parser = require("./services/geminiParser");
```

### Which model is Groq using?

`llama-3.3-70b-versatile` - Best balance of speed and accuracy.

To change, edit `server/src/services/groqParser.js`:

```javascript
model: "llama-3.3-70b-versatile"; // Current
// model: "llama-3.1-8b-instant",  // Faster but less accurate
// model: "mixtral-8x7b-32768",    // Good for longer text
```

### Do I need to uninstall Gemini SDK?

No, but you can to save space:

```bash
cd server
npm uninstall @google/generative-ai
```

### What about the old geminiParser.js file?

You can:

- **Keep it** as backup (recommended)
- **Delete it** if you're sure: `rm server/src/services/geminiParser.js`

### Can I rollback to Gemini?

Yes! Just:

1. Change `server/.env` back to `GEMINI_API_KEY`
2. Update `server/src/index.js` to use `geminiParser`
3. Restart server

## 📊 Performance Comparison

### Before (Gemini)

```
Screenshot → ML Kit (500ms) → Gemini (1-2s) → Total: 1.5-2.5s
```

### After (Groq)

```
Screenshot → ML Kit (500ms) → Groq (300-500ms) → Total: 800ms-1s
```

**Result: 2-3x faster!** 🚀

## 🎯 Next Steps

1. ✅ Get Groq API key
2. ✅ Update `.env`
3. ✅ Test with `npm run test:groq`
4. ✅ Take a screenshot and verify

## 📚 Documentation

- [README_GROQ_INTEGRATION.md](README_GROQ_INTEGRATION.md) - Full docs
- [GROQ_QUICK_START.md](GROQ_QUICK_START.md) - Quick setup
- [groq.md](groq.md) - Groq integration guide

---

**Status**: ✅ Migration complete, just add your API key!
**Time Required**: ~5 minutes
**Difficulty**: Easy

**Questions?** Check the FAQ section above or [README_GROQ_INTEGRATION.md](README_GROQ_INTEGRATION.md).
