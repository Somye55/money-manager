# 🔧 Quick Start - Run This First!

## ⚡ 3-Step Setup (5 minutes)

### Step 1: Run Database Migration (2 minutes)

1. **Open Supabase SQL Editor**

   - Go to: https://supabase.com/dashboard/project/gksvdkluflewnqwnstey/sql
   - Click "New Query"

2. **Copy the Migration**

   - Open `supabase_migration.sql` in this project
   - Press `Ctrl+A` to select all
   - Press `Ctrl+C` to copy

3. **Run in Supabase**
   - Paste into the SQL Editor (`Ctrl+V`)
   - Click "Run" button (or press `Ctrl+Enter`)
   - Wait for "Success" message

✅ **Verify**: Go to Table Editor - you should see 4 tables:

- User
- UserSettings
- Category
- Expense

---

### Step 2: Enable Google OAuth (2 minutes)

1. **Go to Authentication Settings**

   - Link: https://supabase.com/dashboard/project/gksvdkluflewnqwnstey/auth/providers
   - Find "Google" in the list

2. **Enable Google Provider**
   - Toggle "Enable Google Provider" to ON
   - Enter your Google Client ID and Secret (see SUPABASE_SETUP_GUIDE.md)
   - Click "Save"

✅ **Verify**: Green checkmark next to Google provider

---

### Step 3: Test the App (1 minute)

1. **Open the app**

   - Go to: http://localhost:5173
   - Should see login page

2. **Login**

   - Click "Continue with Google"
   - Sign in with your Google account
   - Should redirect to Dashboard

3. **Add an expense**

   - Click "Add" button
   - Fill in amount and description
   - Select category
   - Click "Add Expense"

4. **Check Dashboard**
   - Should see your expense
   - Chart should update
   - Balance should calculate

✅ **Done!** Your app is fully set up!

---

## 🎯 Quick Test Flow

```
1. Login → See Dashboard (empty)
2. Click Add → Fill form → Save
3. Back to Dashboard → See expense
4. Click Settings → Change currency → Save
5. Back to Dashboard → See currency updated
```

---

## 🐛 If Something Goes Wrong

### "Cannot find table User"

→ Run the migration SQL again in Supabase

### "Google login not working"

→ Check Google provider is enabled in Supabase Auth

### "No categories showing"

→ Check if migration created the Category table  
→ Try logging out and back in

### "Can't see my data"

→ Check browser console for errors
→ Verify RLS policies are enabled
→ Check Supabase Dashboard → Logs

---

## 📚 More Help

- **Complete Setup Guide**: `SETUP_COMPLETE.md`
- **Supabase Reference**: `SUPABASE_REFERENCE.md`
- **Implementation Details**: `IMPLEMENTATION_SUMMARY.md`
- **Google OAuth Setup**: `SUPABASE_SETUP_GUIDE.md`

---

**Ready in 5 minutes!** 🚀
