# Vercel Prisma Generation Fix

## 🔴 The Error

```
PrismaClientInitializationError: Prisma has detected that this project was built on Vercel,
which caches dependencies. This leads to an outdated Prisma Client because Prisma's
auto-generation isn't triggered.
```

## ✅ The Solution

### Changes Made:

1. **Updated `server/vercel.json`**
   - Added `installCommand` to run `prisma generate` after npm install
   - This ensures Prisma Client is generated fresh on every deployment

2. **Updated `server/package.json`**
   - Added `vercel-build` script that Vercel will run during build
   - Kept `postinstall` as backup

3. **Updated `server/prisma/schema.prisma`**
   - Added `binaryTargets = ["native", "rhel-openssl-3.0.x"]`
   - This ensures the correct Prisma binary for Vercel's runtime (AWS Lambda)

## 🚀 Deploy the Fix

### Step 1: Push Changes

```bash
git add .
git commit -m "Fix Prisma generation on Vercel"
git push origin main
```

### Step 2: Vercel Will Auto-Deploy

Watch your Vercel dashboard for the new deployment.

### Step 3: Verify Build Logs

In Vercel dashboard, check the build logs. You should see:

```
✔ Generated Prisma Client (5.22.0) to ./node_modules/@prisma/client
```

### Step 4: Test the Deployment

```bash
curl https://your-project.vercel.app/health
```

Should return:

```json
{ "status": "ok", "timestamp": "2026-01-18T..." }
```

## 🔍 What Each Fix Does

### 1. `installCommand` in vercel.json

```json
"installCommand": "npm install && npx prisma generate"
```

- Runs after dependencies are installed
- Generates Prisma Client with the correct binary for Vercel's environment
- Bypasses Vercel's dependency caching issue

### 2. `vercel-build` script

```json
"vercel-build": "prisma generate"
```

- Vercel looks for this script specifically
- Runs during the build phase
- Double ensures Prisma Client is generated

### 3. Binary Targets in schema.prisma

```prisma
binaryTargets = ["native", "rhel-openssl-3.0.x"]
```

- `native`: For local development
- `rhel-openssl-3.0.x`: For Vercel's AWS Lambda runtime (Amazon Linux 2)
- Ensures the correct Prisma engine binary is included

## 📊 Expected Build Output

In Vercel build logs, you should see:

```
Running "npm install && npx prisma generate"
...
✔ Generated Prisma Client (5.22.0) to ./node_modules/@prisma/client
...
Running "vercel-build" script
✔ Generated Prisma Client (5.22.0) to ./node_modules/@prisma/client
...
Build Completed
```

## ⚠️ Important Notes

### Database Migrations

- Migrations are NOT run automatically on Vercel
- Your database schema should already be up-to-date
- If you need to run migrations, do it manually:
  ```bash
  npx prisma migrate deploy
  ```

### Environment Variables

Make sure these are still set in Vercel:

- `DATABASE_URL`
- `DIRECT_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `GROQ_API_KEY`

### Cold Starts

- First request after deployment may be slower (cold start)
- Subsequent requests will be faster
- This is normal for serverless functions

## 🧪 Testing Checklist

After deployment:

- [ ] `/health` endpoint returns 200 OK
- [ ] `/api/ocr/parse` endpoint works (test with sample text)
- [ ] No Prisma errors in Vercel function logs
- [ ] Database queries work correctly

## 🔧 If Still Failing

### Check Build Logs

1. Go to Vercel Dashboard
2. Click on your deployment
3. Go to "Build Logs" tab
4. Look for "Generated Prisma Client" message

### Check Function Logs

1. Go to Vercel Dashboard
2. Click on your deployment
3. Go to "Functions" tab
4. Click on a function to see runtime logs

### Common Issues

**Issue**: Build succeeds but runtime fails

- **Solution**: Check that `binaryTargets` includes `rhel-openssl-3.0.x`

**Issue**: "Cannot find module '@prisma/client'"

- **Solution**: Ensure `prisma` is in `dependencies`, not `devDependencies`

**Issue**: Database connection fails

- **Solution**: Verify `DATABASE_URL` environment variable is set correctly

## 📝 Files Changed

```
server/
├── vercel.json          ← Added installCommand
├── package.json         ← Added vercel-build script
└── prisma/
    └── schema.prisma    ← Added binaryTargets
```

## 🎯 Next Steps

1. ✅ Push changes to GitHub
2. ✅ Wait for Vercel auto-deploy
3. ✅ Check build logs for "Generated Prisma Client"
4. ✅ Test `/health` endpoint
5. ✅ Test `/api/ocr/parse` endpoint
6. ✅ Update client to use Vercel URL

---

**This should fix the Prisma generation issue!** 🎉
