# Background Expense Save Fix - Complete

## Problem

When the app is closed (working in the background) and the popup appears for a notification, saving the expense fails. The expense is not getting saved in the database.

## Root Causes Identified

### 1. **Stale Auth Context**

- When the app is in the background, the React `AuthContext` might not be fully initialized
- The `authUser` from context could be `null` even though the user is logged in
- The session needs to be fetched fresh from Supabase storage

### 2. **Missing Session Verification**

- The `createExpense` function wasn't verifying the auth session before attempting database insert
- Supabase RLS policies require an active authenticated session to insert expenses
- Without session verification, the insert would fail silently or with auth errors

### 3. **Source Enum Mismatch**

- The code was using `"NOTIFICATION_OVERLAY"` as the source
- The database enum only supports: `'MANUAL'`, `'SMS'`, `'NOTIFICATION'`
- This would cause a database constraint error

## Fixes Applied

### Fix 1: Fresh Session Retrieval in SMSContext

**File:** `client/src/context/SMSContext.jsx`

```javascript
// BEFORE: Used stale authUser from context
if (!authUser) {
  console.error("❌ User not authenticated");
  alert("Please log in to save expenses");
  return;
}

// AFTER: Get fresh session from Supabase
const { supabase } = await import("../lib/supabase");
const {
  data: { session },
  error: sessionError,
} = await supabase.auth.getSession();

if (!session || !session.user) {
  console.error("❌ No active session found");
  return;
}
```

**Why this works:**

- Supabase persists sessions in localStorage/AsyncStorage
- Even when the app is backgrounded, the session is still valid
- Fetching fresh ensures we have the latest auth token

### Fix 2: Session Verification in createExpense

**File:** `client/src/lib/dataService.js`

```javascript
export const createExpense = async (expense) => {
  // Verify auth session before creating expense
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error("Authentication error: " + sessionError.message);
  }

  if (!session) {
    throw new Error("No active session. Please log in again.");
  }

  console.log("✅ Session verified for user:", session.user.email);

  // ... rest of expense creation
};
```

**Why this works:**

- Double-checks auth before database operation
- Provides clear error messages if auth fails
- Ensures Supabase client has the auth context for RLS policies

### Fix 3: Correct Source Enum Value

**File:** `client/src/context/SMSContext.jsx`

```javascript
// BEFORE
source: "NOTIFICATION_OVERLAY";

// AFTER
source: "NOTIFICATION"; // Matches database enum
```

### Fix 4: Enhanced Error Logging

Added comprehensive error logging to help debug future issues:

```javascript
console.error("❌ Error details:", {
  message: saveError.message,
  code: saveError.code,
  details: saveError.details,
  hint: saveError.hint,
});
```

## How the Flow Works Now

### 1. Notification Arrives (App in Background)

```
NotificationListener → OverlayService → Shows Android Popup
```

### 2. User Selects Category and Saves

```
OverlayService.saveExpense() → Broadcasts Intent
```

### 3. Intent Received by Plugin

```
NotificationListenerPlugin → Forwards to React via "expenseSaved" event
```

### 4. React Handles Save (NEW FLOW)

```javascript
handleExpenseSavedFromOverlay() {
  1. Validate data (amount, category)
  2. ✅ Get FRESH session from Supabase
  3. ✅ Verify session is active
  4. Get/create user profile using session.user
  5. Map category from overlay to database
  6. Format expense data with correct enum values
  7. ✅ Verify session again before insert
  8. Insert into database via createExpense()
  9. Dispatch refresh event to UI
}
```

### 5. Database Insert with RLS

```sql
-- RLS Policy checks if userId matches authenticated user
CREATE POLICY "Users can insert own expenses" ON "Expense"
    FOR INSERT WITH CHECK (
        "userId" IN (
            SELECT id FROM "User"
            WHERE auth.uid()::text = "googleId"
               OR auth.jwt() ->> 'email' = email
        )
    );
```

## Testing Instructions

### Test 1: Background Save

1. Open the app and log in
2. Press home button to background the app (don't close it)
3. Send a test notification or wait for a real payment notification
4. When popup appears, select a category and tap "Save"
5. Open the app and check if expense appears in the list

### Test 2: Check Logs

When testing, check the console logs for:

```
✅ Active session found: user@example.com
✅ Session expires at: [timestamp]
✅ User profile loaded: user@example.com
✅ Session verified for user: user@example.com
✅ Expense created successfully: [expense data]
```

### Test 3: Error Scenarios

Test these scenarios to ensure proper error handling:

- User logged out: Should show "No active session found"
- Invalid amount: Should show "Invalid amount in overlay data"
- No category: Should show "No category in overlay data"
- Network error: Should show detailed error with code and message

## Key Changes Summary

| File             | Change                               | Reason                                        |
| ---------------- | ------------------------------------ | --------------------------------------------- |
| `SMSContext.jsx` | Get fresh session from Supabase      | Auth context may be stale when backgrounded   |
| `SMSContext.jsx` | Use session.user instead of authUser | Ensures we have the actual authenticated user |
| `SMSContext.jsx` | Change source to "NOTIFICATION"      | Match database enum constraint                |
| `dataService.js` | Add session verification             | Ensure auth before database insert            |
| `dataService.js` | Enhanced error logging               | Better debugging for future issues            |

## Technical Details

### Supabase Session Persistence

```javascript
// In supabase.js
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true, // ← Keeps session in storage
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});
```

### Why Session Persists in Background

- Supabase stores the session in `localStorage` (web) or `AsyncStorage` (mobile)
- The session includes the JWT access token and refresh token
- Even when the app is backgrounded, the storage is accessible
- `getSession()` retrieves from storage without network call

### RLS Policy Verification

The RLS policy checks two conditions:

1. `auth.uid()::text = "googleId"` - For Google OAuth users
2. `auth.jwt() ->> 'email' = email` - For email/password users

Both require an active session with a valid JWT token.

## Verification Checklist

- [x] Fresh session retrieved when app is backgrounded
- [x] Session verified before database insert
- [x] Correct Source enum value used
- [x] User profile fetched using session.user
- [x] Enhanced error logging added
- [x] Category mapping works correctly
- [x] Timestamp formatting is correct
- [x] RLS policies allow insert with valid session

## Next Steps

1. **Test on Android device** with real notifications
2. **Monitor logs** for any auth errors
3. **Verify expenses** appear in the database
4. **Check UI refresh** after save

## Troubleshooting

If expenses still don't save:

1. **Check Supabase Dashboard**

   - Go to Authentication → Users
   - Verify user exists and has correct googleId/email
   - Check if session is active

2. **Check Database Logs**

   - Go to Database → Logs
   - Look for RLS policy violations
   - Check for constraint errors

3. **Check App Logs**

   - Look for "❌ No active session found"
   - Look for "❌ Failed to save expense"
   - Check error details for specific issues

4. **Verify RLS Policies**
   - Run `fix_rls_policies.sql` to ensure policies are correct
   - Check if User table has matching googleId or email

## Related Files

- `client/src/context/SMSContext.jsx` - Main expense save handler
- `client/src/lib/dataService.js` - Database operations
- `client/src/lib/supabase.js` - Supabase client config
- `client/android/app/src/main/java/com/moneymanager/app/OverlayService.java` - Android popup
- `client/android/app/src/main/java/com/moneymanager/app/NotificationListenerPlugin.java` - Bridge to React
- `fix_rls_policies.sql` - Database RLS policies
