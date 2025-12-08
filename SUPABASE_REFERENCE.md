# Supabase Quick Reference

## Important Reminders

### 🔑 Accessing Supabase from Client

When using Supabase from the client, remember:

1. **Row Level Security (RLS) is ENABLED** on all tables
2. Policies check for authenticated user via `auth.uid()`
3. Users can only access their own data

### ⚠️ Known Issue with Current Setup

The current RLS policies use `auth.uid()::text = "googleId"` which expects the Supabase auth UID to match the googleId in the User table.

However, when users authenticate:

- Supabase Auth stores the user in `auth.users` table (managed by Supabase)
- Our app creates a record in the public `User` table
- We need to link these properly

### 🔧 Updated Approach

The `dataService.js` handles this by:

1. **On first login**:

   - `getOrCreateUser()` fetches user from auth
   - Creates user in `User` table with Supabase auth UID as googleId
   - Initializes default categories and settings

2. **RLS Policies**:
   - Policies check if the requesting user's auth UID matches records in the database

### 📝 Alternative: Using Service Role Key (Not Recommended for Production)

If RLS policies are causing issues during development, you can temporarily:

1. Disable RLS on tables (NOT recommended for production)
2. Use service role key (bypasses RLS, very dangerous)

**We're using RLS properly for security!**

### ✅ Correct Pattern We're Using

```javascript
// In dataService.js
export const getOrCreateUser = async (authUser) => {
  // authUser comes from Supabase Auth (supabase.auth.getUser())
  // We match by email since that's guaranteed to be unique

  const { data: existingUser } = await supabase
    .from("User")
    .select("*")
    .eq("email", authUser.email)
    .single();

  if (existingUser) return existingUser;

  // Create new user with Supabase auth UID as googleId
  const { data: newUser } = await supabase
    .from("User")
    .insert([
      {
        email: authUser.email,
        name: authUser.user_metadata?.full_name,
        googleId: authUser.id, // Supabase auth UID
      },
    ])
    .select()
    .single();

  return newUser;
};
```

### 🎯 Testing Checklist

- [ ] Run migration SQL in Supabase dashboard
- [ ] Enable Google OAuth provider
- [ ] Test login flow
- [ ] Check that User table gets populated
- [ ] Check that default categories are created
- [ ] Check that UserSettings are created
- [ ] Test adding an expense
- [ ] Test updating settings
- [ ] Verify data shows on dashboard

### 🔍 Debugging Tips

**If you get "no rows returned":**

1. Check if tables exist in Table Editor
2. Verify RLS is enabled
3. Check policy definitions
4. Look at Supabase logs (Database tab)

**If expenses don't show:**

1. Open browser DevTools → Console
2. Look for errors from Supabase
3. Check Network tab for failed requests
4. Verify user is authenticated in AuthContext

**If categories don't initialize:**

1. Check if `getOrCreateUser` is called
2. Verify default categories SQL runs
3. Check Table Editor for Category records
4. Look for errors in browser console

---

## Supabase Dashboard Links

- **Project**: https://supabase.com/dashboard/project/gksvdkluflewnqwnstey
- **Table Editor**: https://supabase.com/dashboard/project/gksvdkluflewnqwnstey/editor
- **SQL Editor**: https://supabase.com/dashboard/project/gksvdkluflewnqwnstey/sql
- **Authentication**: https://supabase.com/dashboard/project/gksvdkluflewnqwnstey/auth/users
- **Logs**: https://supabase.com/dashboard/project/gksvdkluflewnqwnstey/logs

---

**Remember**: Always test with real user authentication to ensure RLS is working properly!
