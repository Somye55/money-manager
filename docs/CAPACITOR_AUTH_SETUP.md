# 🔐 Capacitor OAuth Setup Guide

## Current Configuration

Your app is now configured for Capacitor OAuth with the following setup:

### 1. **Capacitor Config** (`capacitor.config.json`)

```json
{
  "appId": "com.moneymanager.app",
  "appName": "MoneyManager",
  "webDir": "dist",
  "server": {
    "androidScheme": "https"
  },
  "plugins": {
    "CapacitorHttp": {
      "enabled": true
    }
  }
}
```

### 2. **Android Deep Links** (AndroidManifest.xml)

Added intent filter for custom scheme: `com.moneymanager.app://auth/callback`

### 3. **Supabase Redirect URLs**

You need to configure these URLs in your Supabase dashboard:

**Go to**: https://supabase.com/dashboard/project/gksvdkluflewnqwnstey/auth/url-configuration

**Add these redirect URLs**:

- `com.moneymanager.app://auth/callback` (for Android app)
- `http://localhost:3001` (for web development)
- `http://172.24.144.1:3001` (for network testing)

## 🚀 **Testing Steps**

### Step 1: Build and Sync

```bash
cd client
npm run build
npx cap sync android
```

### Step 2: Open in Android Studio

```bash
npx cap open android
```

### Step 3: Configure Supabase

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add the redirect URL: `com.moneymanager.app://auth/callback`
3. Save the configuration

### Step 4: Test OAuth Flow

1. Run the app in Android Studio
2. Tap "Continue with Google"
3. Complete Google OAuth in browser
4. App should automatically return and authenticate

## 🔧 **Troubleshooting**

### If OAuth doesn't work:

1. **Check Supabase logs** in the dashboard
2. **Verify redirect URL** is exactly: `com.moneymanager.app://auth/callback`
3. **Check Android logs** in Android Studio Logcat
4. **Ensure Google OAuth is enabled** in Supabase

### Common Issues:

- **"Invalid redirect URL"**: Make sure the URL is added to Supabase
- **App doesn't return**: Check deep link configuration in AndroidManifest.xml
- **Authentication fails**: Check Supabase project settings and Google OAuth config

## 📱 **Alternative: Browser-based OAuth**

If deep links don't work, you can use browser-based OAuth:

1. Update AuthContext to use browser OAuth
2. Handle the redirect in a web view
3. Extract tokens from the URL

Let me know if you need help with any of these steps!
