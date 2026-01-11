# 🚀 Physical Device Testing - Quick Start

## ✅ Configuration Complete!

Your app is now configured to work with your physical Android device:

- **Computer IP**: `10.5.48.113`
- **Server URL**: `http://10.5.48.113:3000`
- **Build**: ✅ Completed successfully

## 📱 3 Simple Steps to Test

### Step 1: Start the Server

```bash
1-start-server.bat
```

**Keep this window open!** You'll see:

```
Server running on port 3000
```

### Step 2: Install the App

```bash
2-install-app.bat
```

This will install the app on your connected phone.

### Step 3: Test OCR

1. Open Google Pay or any payment app on your phone
2. Take a screenshot of a transaction
3. Share the screenshot → Select "Money Manager"
4. Watch the magic happen! ✨

## ⚠️ Important Checklist

Before testing, make sure:

- [ ] **Same WiFi**: Phone and computer on same network
- [ ] **USB Connected**: Phone connected via USB cable
- [ ] **USB Debugging**: Enabled in Developer Options
- [ ] **Server Running**: `1-start-server.bat` window is open
- [ ] **Firewall**: Run `setup-firewall.bat` as Administrator (if needed)

## 🔧 Troubleshooting

### Problem: "Connection timeout"

**Solution 1: Check WiFi**

```bash
# On computer
ipconfig
# Should show: 10.5.48.113

# On phone
Settings → WiFi → Check network name
```

**Solution 2: Configure Firewall**
Right-click `setup-firewall.bat` → Run as Administrator

**Solution 3: Test Server**

```bash
test-server-connection.bat
```

### Problem: App won't install

**Solution:**

1. Enable USB debugging:

   - Settings → About Phone
   - Tap "Build Number" 7 times
   - Back → Developer Options
   - Enable "USB Debugging"

2. Accept the prompt on your phone:

   - "Allow USB debugging?"
   - Check "Always allow from this computer"
   - Tap "OK"

3. Verify connection:
   ```bash
   adb devices
   ```
   Should show your device

### Problem: Server won't start

**Solution:**

```bash
cd server
npm install
npm run dev
```

## 📊 What to Expect

### Successful Flow:

1. Share screenshot → App opens ✅
2. "Processing..." message ✅
3. Server window shows: `POST /api/ocr/parse 200` ✅
4. QuickExpense page with extracted data ✅

### Server Logs (Good):

```
Server running on port 3000
POST /api/ocr/parse 200 - - 1234 ms
Gemini API response: { amount: 100, ... }
```

### App Logs (Good):

```
OCRProcessor: Connecting to: http://10.5.48.113:3000/api/ocr/parse
OCRProcessor: ✅ Gemini parsing successful
MainActivity: ✅ Navigating to QuickExpense with data
```

## 🎯 Testing Tips

1. **Use Real Transactions**: Test with actual Google Pay/PhonePe screenshots
2. **Check Server Logs**: Watch the `1-start-server.bat` window
3. **Multiple Tests**: Try different transaction types
4. **Network Stability**: Ensure stable WiFi connection

## 📁 Files Created

- `1-start-server.bat` - Start OCR server
- `2-install-app.bat` - Install app on device
- `setup-firewall.bat` - Configure Windows Firewall
- `test-server-connection.bat` - Test server connectivity
- `PHYSICAL_DEVICE_SETUP.md` - Detailed troubleshooting guide

## 🆘 Still Having Issues?

1. **Check server logs** in `1-start-server.bat` window
2. **Check app logs**:
   ```bash
   adb logcat | findstr "OCRProcessor"
   ```
3. **Verify IP hasn't changed**:
   ```bash
   ipconfig
   ```
4. **Read detailed guide**: `PHYSICAL_DEVICE_SETUP.md`

## ✨ Success Indicators

You'll know it's working when:

- ✅ Server shows: `POST /api/ocr/parse 200`
- ✅ App opens automatically when sharing
- ✅ QuickExpense page shows transaction details
- ✅ Amount, date, and description are filled in

## 🎉 Ready to Test!

1. Run `1-start-server.bat`
2. Run `2-install-app.bat`
3. Share a payment screenshot
4. Enjoy automated expense tracking! 🎊

---

**Need the detailed guide?** See `PHYSICAL_DEVICE_SETUP.md`
