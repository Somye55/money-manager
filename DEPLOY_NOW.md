# 🚀 Deploy Now - Quick Commands

## The Issue

Prisma Client wasn't being generated on Vercel, causing crashes.

## The Fix Applied

✅ Added `installCommand` to vercel.json  
✅ Added `vercel-build` script to package.json  
✅ Added Vercel binary target to Prisma schema

## Deploy Right Now

```bash
git add .
git commit -m "Fix Prisma generation on Vercel"
git push origin main
```

That's it! Vercel will auto-deploy.

## Test After Deploy

Replace `YOUR-PROJECT` with your actual Vercel project name:

```bash
# Test health endpoint
curl https://YOUR-PROJECT.vercel.app/health

# Test OCR endpoint
curl -X POST https://YOUR-PROJECT.vercel.app/api/ocr/parse \
  -H "Content-Type: application/json" \
  -d '{"text":"Paid Rs. 500 to Starbucks"}'
```

## Expected Response

### Health Check:

```json
{ "status": "ok", "timestamp": "2026-01-18T12:50:29.023Z" }
```

### OCR Parse:

```json
{
  "success": true,
  "data": {
    "amount": 500,
    "merchant": "Starbucks",
    "type": "debit",
    "confidence": 95
  }
}
```

## What Changed

| File                          | Change                                                       |
| ----------------------------- | ------------------------------------------------------------ |
| `server/vercel.json`          | Added `installCommand: "npm install && npx prisma generate"` |
| `server/package.json`         | Added `vercel-build: "prisma generate"`                      |
| `server/prisma/schema.prisma` | Added `binaryTargets = ["native", "rhel-openssl-3.0.x"]`     |

## Monitor Deployment

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Watch the deployment progress
4. Check "Build Logs" for "✔ Generated Prisma Client"

## If It Works ✅

Update your client app to use the Vercel URL:

**In `client/.env`:**

```
VITE_API_URL=https://YOUR-PROJECT.vercel.app
```

## If It Still Fails ❌

Check the detailed guide: `VERCEL_PRISMA_FIX.md`

---

**Ready? Run the git commands above!** 🚀
