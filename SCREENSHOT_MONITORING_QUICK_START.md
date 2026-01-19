# 📸 Screenshot Monitoring - Quick Start Guide

## What is Screenshot Monitoring?

Automatically capture and process screenshots to extract expense information. When you take a screenshot of any payment screen, the app will:

1. Detect the screenshot instantly
2. Extract text using ML Kit OCR
3. Parse amount and merchant using Groq AI
4. Show a popup for category selection
5. Save the expense automatically

## ✅ Setup (One-Time)

### Step 1: Enable Storage Permission

1. Open the app
2. Go to **Settings** → **Automation**
3. Scroll to **Screenshot Monitoring** section
4. Tap **"Grant Permission"**
5. Allow storage/media access when prompted

### Step 2: Enable Screenshot Monitoring

1. In the same section, toggle **ON** the switch
2. You'll see "✓ Enabled" status
3. The service will start monitoring immediately

### Step 3: Enable Overlay Permission (if not already done)

1. Scroll to **Display Over Other Apps** section
2. Tap **"Open Settings"**
3. Find **Money Manager** in the list
4. Toggle **ON** "Display over other apps"
5. Return to the app

## 🚀 How to Use

### Taking Screenshots

1. Open any payment app (GPay, PhonePe, Paytm, Swiggy, Amazon, etc.)
2. Complete a transaction
3. Take a screenshot of the payment confirmation screen
4. **That's it!** The app will automatically:
   - Detect the screenshot
   - Extract the text
   - Parse the amount and merchant
   - Show a popup with the details

### Reviewing and Saving

1. When the popup appears, review the parsed information:
   - **Amount**: Automatically extracted
   - **Merchant**: Automatically identified
   - **Type**: Debit or Credit
2. Select the appropriate **category**
3. Tap **"Save Expense"**
4. Done! The expense is saved to your database

## 📱 Supported Apps

Works with screenshots from:

- **UPI Apps**: Google Pay, PhonePe, Paytm, BHIM
- **Food Delivery**: Swiggy, Zomato, Uber Eats
- **E-commerce**: Amazon, Flipkart, Myntra
- **Banking Apps**: SBI YONO, HDFC, ICICI, Axis
- **Any app** with payment confirmation screens

## 🎯 Best Practices

### For Best Results:

1. **Take clear screenshots** with good lighting
2. **Include the amount** prominently in the screenshot
3. **Capture payment confirmation** screens (not cart pages)
4. **Wait 1-2 seconds** between screenshots to avoid throttling

### What to Screenshot:

✅ Payment confirmation screens
✅ Transaction success messages
✅ UPI payment receipts
✅ Order confirmation pages with amounts

❌ Shopping carts (before payment)
❌ Product listings
❌ App home screens

## 🔧 Troubleshooting

### Popup Not Appearing?

1. **Check if monitoring is enabled**:
   - Go to Settings → Automation
   - Verify "Screenshot Monitoring" shows "✓ Enabled"

2. **Check overlay permission**:
   - Go to Settings → Apps → Money Manager
   - Verify "Display over other apps" is ON

3. **Check storage permission**:
   - Go to Settings → Apps → Money Manager → Permissions
   - Verify "Photos and media" or "Storage" is allowed

4. **Restart the service**:
   - Toggle OFF screenshot monitoring
   - Wait 2 seconds
   - Toggle it back ON

### Wrong Amount Detected?

- The AI parser is very accurate but may occasionally misread
- You can manually edit the amount in the popup before saving
- Report patterns of errors for improvement

### Service Not Starting?

1. Force close the app completely
2. Reopen the app
3. Go to Settings → Automation
4. Toggle screenshot monitoring OFF then ON
5. Take a test screenshot

## 🎨 Features

### Automatic Detection

- Monitors MediaStore for new screenshots
- Detects screenshots by filename patterns
- Processes only when enabled in settings

### Smart Parsing

- ML Kit extracts text with spatial ordering
- Groq AI identifies amounts, merchants, and types
- Handles multiple currency formats (₹, Rs, INR)
- Ignores phone numbers and transaction IDs

### User Control

- Enable/disable anytime from settings
- No background processing when disabled
- Minimal battery impact
- Respects privacy settings

## 📊 Performance

- **Detection Speed**: Instant (< 1 second)
- **OCR Processing**: 1-2 seconds
- **AI Parsing**: 2-3 seconds
- **Total Time**: 3-5 seconds from screenshot to popup

## 🔒 Privacy & Security

- **Local Processing**: OCR happens on your device
- **Secure API**: Groq AI parsing uses encrypted connection
- **No Storage**: Screenshots are not stored by the app
- **User Control**: Can be disabled anytime
- **Permission Based**: Only works with explicit permission

## 💡 Tips & Tricks

1. **Batch Processing**: Take multiple screenshots, they'll be processed in order
2. **Quick Capture**: Use volume button shortcuts for faster screenshots
3. **Review Later**: Popups can be dismissed and expenses added manually later
4. **Category Shortcuts**: Frequently used categories appear at the top

## 🆘 Need Help?

If you encounter issues:

1. Check this guide first
2. Verify all permissions are granted
3. Try restarting the app
4. Toggle monitoring OFF and ON
5. Check the test notification popup feature

## 🎉 Success!

You're all set! Now every time you take a screenshot of a payment, the app will automatically extract and save the expense. No more manual entry!

**Happy expense tracking! 📸💰**
