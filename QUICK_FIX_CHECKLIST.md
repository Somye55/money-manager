# Quick Fix Checklist ✓

## The Issue

❌ Notifications not showing popups even with permissions granted

## The Fix

✅ Added communication bridge between Android service and JavaScript

---

## What You Must Do Now

### ☐ Step 1: Rebuild the App (CRITICAL!)

```bash
rebuild-and-install.bat
```

⏱️ Takes ~5 minutes

**Why?** Code changes don't work until you rebuild!

---

### ☐ Step 2: Run Quick Test

```bash
quick-test.bat
```

⏱️ Takes ~2 minutes

**What it does:**

- ✓ Checks permissions
- ✓ Tests overlay (you'll see a popup!)
- ✓ Monitors logs

---

### ☐ Step 3: Grant Permissions (if prompted)

**Notification Access:**

```
Settings → Apps → Special app access → Notification access → MoneyManager → ON
```

**Display Over Apps:**

```
Settings → Apps → MoneyManager → Display over other apps → ON
```

---

### ☐ Step 4: Test with Real Notification

1. Keep command prompt open (from quick-test.bat)
2. Send a WhatsApp message to yourself
3. **You should see a popup on your phone!**

---

## Success Indicators

When it's working, you'll see:

### On Your Phone:

✅ Popup appears when notification arrives
✅ Toast message: "Money Manager: Notification monitoring active"

### In Logs:

✅ `NotificationListener: >>> onNotificationPosted() called <<<`
✅ `NotificationListener: FINANCIAL APP DETECTED`
✅ `OverlayService: >>> OVERLAY VIEW ADDED SUCCESSFULLY <<<`

---

## If It Doesn't Work

### 1. Did you rebuild?

```bash
rebuild-and-install.bat
```

### 2. Are permissions granted?

```bash
adb shell settings get secure enabled_notification_listeners
adb shell appops get com.moneymanager.app SYSTEM_ALERT_WINDOW
```

### 3. Does test overlay work?

```bash
adb shell am start-foreground-service -n com.moneymanager.app/.OverlayService --es title "Test" --es text "Test" --es package "test"
```

### 4. Check logs

```bash
adb logcat -c
adb logcat -s NotificationListener:D OverlayService:D
```

---

## Common Mistakes

❌ **Not rebuilding the app** - Changes won't work!
❌ **Not granting both permissions** - Need notification access AND overlay
❌ **Battery optimization enabled** - Can kill the service
❌ **Not testing with financial apps** - Only WhatsApp, Paytm, GPay, etc. trigger popups

---

## Files to Use

| File                              | Purpose                  | When to Use              |
| --------------------------------- | ------------------------ | ------------------------ |
| `rebuild-and-install.bat`         | Rebuild and install app  | **First! Always!**       |
| `quick-test.bat`                  | Quick test with prompts  | After rebuild            |
| `debug-notification-listener.bat` | Full diagnostics         | If quick test fails      |
| `TROUBLESHOOTING_NO_POPUP.md`     | Detailed troubleshooting | When stuck               |
| `FIX_INSTRUCTIONS.md`             | Step-by-step guide       | For detailed walkthrough |

---

## Timeline

```
Rebuild:        ████████░░ 5 min
Test:           ██░░░░░░░░ 2 min
Permissions:    █░░░░░░░░░ 1 min (if needed)
Verify:         ░░░░░░░░░░ Immediate
                ─────────────────
Total:          ~10 minutes
```

---

## Quick Start (Copy-Paste)

```bash
# 1. Rebuild and install
rebuild-and-install.bat

# 2. Test
quick-test.bat

# 3. If issues, debug
debug-notification-listener.bat
```

---

## What Changed in Code

### Before:

```
Notification → NotificationListener → [DEAD END]
```

### After:

```
Notification → NotificationListener → LocalBroadcast → Plugin → JavaScript → UI
```

---

## Support

If still not working after following all steps:

1. Run: `debug-notification-listener.bat`
2. Save output
3. Check: `TROUBLESHOOTING_NO_POPUP.md`
4. Provide:
   - Log output
   - Android version
   - Phone manufacturer
   - Whether test overlay works

---

# 🎯 Start Now!

```bash
rebuild-and-install.bat
```

**Then follow the prompts!**
