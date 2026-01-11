# 🚀 Quick Start Card - OCR Fix

## The Fix (One Line)

Added `android:usesCleartextTraffic="true"` to AndroidManifest.xml to allow HTTP connections to localhost development server.

---

## 3 Steps to Test

### 1️⃣ Start Server

```bash
cd server
npm run dev
```

✅ Should see: "Server running on port 3000"

### 2️⃣ Rebuild App

```bash
fix-and-test-ocr.bat
```

✅ Installs app and grants permissions

### 3️⃣ Test

Share a payment screenshot → Money Manager
✅ Popup appears with parsed amount

---

## Quick Commands

| Task             | Command                                                               |
| ---------------- | --------------------------------------------------------------------- |
| Start server     | `cd server && npm run dev`                                            |
| Test server      | `node test-server-ocr.js`                                             |
| Rebuild app      | `fix-and-test-ocr.bat`                                                |
| Watch logs       | `adb logcat \| findstr "OCRProcessor"`                                |
| Grant permission | `adb shell appops set com.moneymanager.app SYSTEM_ALERT_WINDOW allow` |

---

## Troubleshooting

| Problem            | Solution                                          |
| ------------------ | ------------------------------------------------- |
| Server not running | `cd server && npm run dev`                        |
| Cleartext error    | Uninstall app, clean build, reinstall             |
| No popup           | Grant overlay permission                          |
| Wrong amount       | Check server logs, test with `test-server-ocr.js` |

---

## Expected Flow

```
Screenshot → Share → OCR → Server → Gemini → Popup → Save
   (1s)      (0s)   (1s)   (0.5s)   (2s)    (0s)   (0.5s)
                    Total: ~5 seconds
```

---

## Success Indicators

✅ Server: `Server running on port 3000`
✅ Test: `✅ Amount parsed correctly!`
✅ Logs: `✅ Gemini parsed - Amount: 34039.0`
✅ UI: Popup shows correct amount

---

## Documentation

- **Start Here:** `START_HERE_OCR_FIX.md`
- **Detailed Fix:** `HTTP_CLEARTEXT_FIX.md`
- **Architecture:** `OCR_FIX_SUMMARY.md`
- **Flow Diagram:** `OCR_FLOW_DIAGRAM.md`
- **Checklist:** `FINAL_CHECKLIST.md`

---

## What Changed

| File                  | Change                              |
| --------------------- | ----------------------------------- |
| `AndroidManifest.xml` | Added `usesCleartextTraffic="true"` |

That's it! One line fix. 🎉

---

## Test Now

```bash
fix-and-test-ocr.bat
```

Then share a payment screenshot! 📱✨
