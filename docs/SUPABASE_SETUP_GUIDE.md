# Supabase Google OAuth Setup Guide

This guide will help you enable **Google OAuth** authentication in your Supabase project.

## Project Details

- **Supabase URL**: https://gksvdkluflewnqwnstey.supabase.co
- **Project Ref**: gksvdkluflewnqwnstey

---

## 🔐 Enable Google OAuth Provider

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure the OAuth consent screen if you haven't already:

   - Choose **External** for user type
   - Fill in the required app information (App name, User support email, Developer contact email)
   - Add scopes: `email`, `profile`, `openid`
   - Save and continue

6. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: `Money Manager App`
   - **Authorized JavaScript origins**:
     - `https://gksvdkluflewnqwnstey.supabase.co`
   - **Authorized redirect URIs**:
     - `https://gksvdkluflewnqwnstey.supabase.co/auth/v1/callback`
7. Click **Create** and copy:
   - **Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)
   - **Client Secret**

### Step 2: Configure Google Provider in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/gksvdkluflewnqwnstey)
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list and click on it
4. Toggle **Enable Google Provider** to ON
5. Paste your **Google Client ID** and **Google Client Secret**
6. (Optional) Add scopes if needed (default is fine)
7. Click **Save**

### Step 3: Update Redirect URLs (if needed)

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Add your redirect URLs:
   - For local development: `http://localhost:5173` (or your dev port)
   - For production: Your deployed app URL

---

## 🧪 Testing the Authentication

### Test Google OAuth:

1. Start your app: `npm run dev` (in the client directory)
2. Go to the login page
3. Click "Continue with Google"
4. You should be redirected to Google's OAuth consent screen
5. After approval, you'll be redirected back to your app dashboard

---

## 🐛 Troubleshooting

### "Unsupported provider: provider is not enabled"

- **Solution**: Make sure Google provider is enabled in Supabase Dashboard (Authentication → Providers)
- Check that you've saved the configuration

### Google OAuth redirect error

- **Solution**: Verify redirect URLs match in both:
  - Google Cloud Console (Authorized redirect URIs)
  - Supabase Dashboard (URL Configuration)

### "Invalid credentials" error

- **Solution**:
  - Double-check that Client ID and Secret are correct
  - Make sure there are no extra spaces
  - Try regenerating credentials in Google Cloud Console

### OAuth consent screen errors

- **Solution**:
  - Ensure all required fields are filled in consent screen
  - Add your email as a test user if app is in testing mode
  - Verify authorized domains are configured

---

## 📋 Checklist

- [ ] Google Cloud Console project created
- [ ] OAuth consent screen configured
- [ ] OAuth Client ID and Secret created
- [ ] Redirect URIs added in Google Cloud Console
- [ ] Google provider enabled in Supabase
- [ ] Client ID and Secret pasted in Supabase
- [ ] Redirect URLs configured in Supabase
- [ ] Tested Google login successfully

---

## 📞 Support

If you encounter any issues:

1. Check Supabase logs: Dashboard → Logs → Auth
2. Check browser console for errors
3. Verify all credentials are correct
4. Ensure you're using the correct Supabase project

## 🔗 Useful Links

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google Cloud Console](https://console.cloud.google.com/)

---

**Created**: 2025-12-08
**Last Updated**: 2025-12-08
