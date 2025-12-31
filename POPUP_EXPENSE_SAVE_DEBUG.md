# Popup Expense Save Debugging Guide

## Issue: Expenses not saving from popup

### Root Causes Identified:

1. **Amount Parsing Issues**

   - Only supported `Rs.XX.XX` format
   - Fixed to support multiple formats: Rs 100, ₹100, INR 100, etc.

2. **Category Mapping Problems**

   - Overlay categories didn't match database categories
   - Added intelligent mapping system

3. **Missing Error Handling**

   - No validation or user feedback on failures
   - Added comprehensive error handling and logging

4. **Authentication Timing Issues**
   - User might not be loaded when expense is saved
   - Added better validation and logging

### Fixes Applied:

#### 1. Enhanced Amount Parsing (OverlayService.java)

```java
// Now supports multiple formats:
// Rs.100.00, Rs 100.00, Rs.100, Rs 100
// ₹100.00, ₹ 100.00, ₹100, ₹ 100
// INR 100.00, INR 100
```

#### 2. Improved Category Mapping (SMSContext.jsx)

```javascript
const categoryMappings = {
  "Food & Dining": ["Food", "Food & Dining", "Dining", "Restaurant"],
  Transportation: ["Transport", "Transportation", "Travel", "Uber", "Taxi"],
  Shopping: ["Shopping", "Shop", "Purchase", "Buy"],
  // ... more mappings
};
```

#### 3. Better Error Handling

- Added validation for amount > 0
- Added validation for category selection
- Added detailed logging throughout the flow
- Added user feedback via Toast messages

#### 4. Enhanced Logging

- Android: Added detailed logs in OverlayService and NotificationListenerPlugin
- React: Added comprehensive logging in SMSContext and DataContext

### Debugging Steps:

#### 1. Check Android Logs

```bash
adb logcat -s OverlayService NotificationListenerPlugin
```

Look for:

- "saveExpense called" - confirms save button was clicked
- "Expense save broadcast sent" - confirms broadcast was sent
- "EXPENSE_SAVED broadcast received" - confirms plugin received it

#### 2. Check Browser Console

Open Chrome DevTools and look for:

- "Handling expense saved from overlay" - confirms React received the event
- "Final expense data" - shows what's being saved
- "Expense added successfully" - confirms database save

#### 3. Check Database

Verify the expense was actually saved:

- Check Supabase dashboard
- Look for new entries in Expense table
- Verify userId and categoryId are correct

#### 4. Test Categories

Ensure categories exist:

- Check if user has categories created
- Verify category names match the mapping logic
- Test with "Other" category as fallback

### Manual Testing:

1. **Trigger Test Popup**

   ```javascript
   // In browser console:
   window.NotificationListenerPlugin.testOverlay();
   ```

2. **Check Permissions**

   - Notification Listener permission
   - Overlay permission
   - User authentication status

3. **Test Different Amounts**

   - Rs.100.00
   - Rs 100
   - ₹100
   - INR 100

4. **Test Different Categories**
   - Food & Dining → Food
   - Transportation → Transport
   - Other → Other

### Common Issues:

1. **User Not Authenticated**

   - Check if user is logged in
   - Verify auth token is valid
   - Check DataContext user state

2. **Categories Not Loaded**

   - Verify categories exist in database
   - Check if categories are loaded in React context
   - Ensure category mapping logic works

3. **Amount Parsing Fails**

   - Check notification text format
   - Verify regex patterns match
   - Test with different SMS formats

4. **Broadcast Not Received**

   - Check if NotificationListenerPlugin is registered
   - Verify LocalBroadcastManager is working
   - Check intent filters

5. **Database Save Fails**
   - Check Supabase connection
   - Verify RLS policies allow insert
   - Check required fields are present

### Success Indicators:

✅ Toast message: "Expense saved: Rs.X.XX in CategoryName"
✅ Console log: "✅ Expense added successfully to context"
✅ Expense appears in app dashboard
✅ Database entry created in Supabase

### If Still Not Working:

1. Check all permissions are granted
2. Verify user is authenticated
3. Test with simple manual expense creation
4. Check network connectivity
5. Verify Supabase configuration
6. Test with different notification formats
