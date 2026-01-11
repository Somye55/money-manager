# Physical Device Testing Setup

## Your Configuration

- **Computer IP**: `10.5.48.113`
- **Server URL**: `http://10.5.48.113:3000`
- **Build.gradle updated**: ✅

## Quick Start (Automated)

### Option 1: One-Click Setup

```bash
test-physical-device.bat
```

This will:

1. Start the OCR server
2. Rebuild the Android app with your IP
3. Install on your connected device

### Option 2: Manual Steps

#### Step 1: Configure Firewall

```bash
# Run as Administrator
setup-firewall.bat
```

#### Step 2: Start Server

```bash
cd server
npm run dev
```

#### Step 3: Rebuild & Install App

```bash
cd client
npx cap sync android
cd android
gradlew assembleDebug
cd ..
npx cap run android
```

## Prerequisites

### 1. Same WiFi Network

- Your computer and phone MUST be on the same WiFi network
- Check your phone's WiFi settings
- Computer should show: `10.5.48.113`

### 2. USB Debugging Enabled

On your Android phone:

1. Go to Settings → About Phone
2. Tap "Build Number" 7 times
3. Go back → Developer Options
4. Enable "USB Debugging"

### 3. Windows Firewall

Run `setup-firewall.bat` as Administrator to allow port 3000

## Testing the Setup

### Test 1: Server Accessibility

```bash
test-server-connection.bat
```

You should see a JSON response from the server.

### Test 2: From Your Phone

1. Open Chrome on your phone
2. Navigate to: `http://10.5.48.113:3000/api/ocr/parse`
3. You should see "Cannot GET" (this is normal - it needs POST)

### Test 3: Full OCR Flow

1. Open Google Pay or any payment app
2. Take a screenshot of a transaction
3. Share the screenshot with Money Manager
4. The app should:
   - Open automatically ✅
   - Show "Processing..." ✅
   - Extract transaction details ✅
   - Navigate to QuickExpense page with data ✅

## Troubleshooting

### Issue: Connection Timeout

**Symptoms**: App shows white screen, logs show "Connection timeout"

**Solutions**:

1. Check server is running: Look for "OCR Server" window
2. Verify same WiFi:
   - Computer: `ipconfig` → should show `10.5.48.113`
   - Phone: Settings → WiFi → Check network name matches computer
3. Test firewall: Run `test-server-connection.bat`
4. Disable antivirus temporarily

### Issue: Server Not Starting

**Symptoms**: "OCR Server" window shows errors

**Solutions**:

```bash
cd server
npm install
npm run dev
```

### Issue: App Not Installing

**Symptoms**: `npx cap run android` fails

**Solutions**:

1. Check USB debugging is enabled
2. Accept "Allow USB debugging" prompt on phone
3. Try: `adb devices` to verify connection
4. Reconnect USB cable

### Issue: Different IP Address

If your computer's IP changes:

1. Get new IP:

   ```bash
   ipconfig
   ```

2. Update `client/android/app/build.gradle`:

   ```groovy
   buildConfigField "String", "SERVER_URL", "\"http://YOUR_NEW_IP:3000\""
   ```

3. Rebuild:
   ```bash
   cd client/android
   gradlew assembleDebug
   ```

## Network Requirements

### Firewall Ports

- **Port 3000**: OCR server (TCP)
- **Port 5173**: Vite dev server (if using)

### WiFi Configuration

- Both devices on same network
- No VPN active on either device
- No proxy settings

## Verification Checklist

Before testing, verify:

- [ ] Server running on `http://10.5.48.113:3000`
- [ ] Phone connected via USB
- [ ] USB debugging enabled
- [ ] Same WiFi network
- [ ] Firewall rule added
- [ ] App rebuilt with new IP
- [ ] App installed on phone

## Server Logs

Watch the "OCR Server" window for:

```
Server running on port 3000
POST /api/ocr/parse 200 - - 1234 ms
```

## App Logs

Use Android Studio Logcat or:

```bash
adb logcat | findstr "OCRProcessor"
```

Look for:

```
OCRProcessor: Connecting to: http://10.5.48.113:3000/api/ocr/parse
OCRProcessor: ✅ Gemini parsing successful
```

## Success Indicators

✅ Server window shows: `Server running on port 3000`
✅ Test connection returns JSON
✅ App opens when sharing screenshot
✅ QuickExpense page shows extracted data
✅ No "Connection timeout" in logs

## Quick Commands

```bash
# Start everything
test-physical-device.bat

# Just start server
cd server && npm run dev

# Just rebuild app
cd client && npx cap sync android && cd android && gradlew assembleDebug

# Install on device
cd client && npx cap run android

# View logs
adb logcat | findstr "OCRProcessor"
```

## Need Help?

If you're still having issues:

1. Check server logs in "OCR Server" window
2. Check app logs: `adb logcat | findstr "OCRProcessor"`
3. Verify IP hasn't changed: `ipconfig`
4. Test server: `test-server-connection.bat`
