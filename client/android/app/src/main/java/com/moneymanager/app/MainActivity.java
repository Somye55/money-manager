package com.moneymanager.app;

import android.Manifest;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "MainActivity";
    private static final String TEST_CHANNEL_ID = "test_notifications";
    private static final int NOTIFICATION_PERMISSION_REQUEST_CODE = 1001;
    private Handler serviceMonitorHandler;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(SettingsHelper.class);
        registerPlugin(NotificationListenerPlugin.class);
        registerPlugin(ScreenshotListenerPlugin.class);
        
        super.onCreate(savedInstanceState);
        
        Log.d(TAG, "Plugins registered: SettingsHelper, NotificationListenerPlugin, ScreenshotListenerPlugin");

        serviceMonitorHandler = new Handler(Looper.getMainLooper());

        // Create notification channel for test notifications
        createTestNotificationChannel();

        // Request notification permission for Android 13+
        requestNotificationPermission();

        // Check and request battery optimization exemption
        BatteryOptimizationHelper.checkAndRequestBatteryOptimization(this);

        // Start background service to keep app alive
        startBackgroundService();

        // Check and ensure notification listener service is enabled
        ensureNotificationListenerEnabled();

        // Start proactive service monitoring
        startServiceMonitoring();

        // Handle shared images (from GPay, PhonePe, etc.)
        handleSharedImage(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        
        // Handle shared images when app is already running
        handleSharedImage(intent);
    }

    private void handleSharedImage(Intent intent) {
        if (intent == null) return;

        String action = intent.getAction();
        String type = intent.getType();

        Log.d(TAG, "Intent received - Action: " + action + ", Type: " + type);

        if (Intent.ACTION_SEND.equals(action) && type != null && type.startsWith("image/")) {
            android.net.Uri imageUri = intent.getParcelableExtra(Intent.EXTRA_STREAM);
            if (imageUri != null) {
                Log.d(TAG, "Shared image received: " + imageUri);
                processSharedImage(imageUri);
            }
        } else if (Intent.ACTION_SEND_MULTIPLE.equals(action) && type != null && type.startsWith("image/")) {
            java.util.ArrayList<android.net.Uri> imageUris = intent.getParcelableArrayListExtra(Intent.EXTRA_STREAM);
            if (imageUris != null && !imageUris.isEmpty()) {
                Log.d(TAG, "Multiple shared images received: " + imageUris.size());
                // Process the first image
                processSharedImage(imageUris.get(0));
            }
        }
    }

    private void processSharedImage(android.net.Uri imageUri) {
        Log.d(TAG, "Processing shared image with OCR...");
        Log.d(TAG, "Image URI: " + imageUri.toString());

        // Use OCRProcessor to extract expense data
        OCRProcessor ocrProcessor = new OCRProcessor(this);
        
        ocrProcessor.processImage(imageUri, new OCRProcessor.OCRCallback() {
            @Override
            public void onSuccess(OCRProcessor.ExpenseData expenseData) {
                Log.d(TAG, "✅ OCR Success - Amount: " + expenseData.amount + ", Merchant: " + expenseData.merchant);
                
                // Navigate to QuickExpense page with OCR data
                navigateToQuickExpense(expenseData, "success", null);
            }

            @Override
            public void onFailure(String error) {
                Log.e(TAG, "❌ OCR failed for shared image: " + error);
                
                // Navigate to QuickExpense page with error
                navigateToQuickExpense(null, "error", error);
            }
        });
    }

    private void navigateToQuickExpense(OCRProcessor.ExpenseData expenseData, String status, String error) {
        try {
            // Build JavaScript to set sessionStorage (survives page reload) and navigate
            StringBuilder jsCode = new StringBuilder();
            
            // Create OCR data object (use var to allow redeclaration)
            jsCode.append("var ocrData = {");
            jsCode.append("  status: '").append(status).append("'");
            
            if ("success".equals(status) && expenseData != null) {
                jsCode.append(",  data: {");
                jsCode.append("    amount: ").append(expenseData.amount).append(",");
                jsCode.append("    merchant: '").append(escapeJavaScript(expenseData.merchant)).append("',");
                jsCode.append("    type: '").append(expenseData.type).append("'");
                jsCode.append("  }");
            } else if ("error".equals(status)) {
                jsCode.append(",  error: '").append(escapeJavaScript(error)).append("'");
            }
            
            jsCode.append("};");
            
            // Store in sessionStorage (survives page reload)
            jsCode.append("sessionStorage.setItem('ocrData', JSON.stringify(ocrData));");
            jsCode.append("console.log('📱 OCR data stored in sessionStorage:', ocrData);");
            
            // Navigate using window.location (works with BrowserRouter)
            jsCode.append("window.location.href = '/quick-expense';");
            
            String finalJs = jsCode.toString();
            Log.d(TAG, "Navigating to QuickExpense with JS");
            Log.d(TAG, "OCR Data - Amount: " + (expenseData != null ? expenseData.amount : "N/A") + 
                      ", Merchant: " + (expenseData != null ? expenseData.merchant : "N/A"));
            
            // Wait a bit for the app to be fully in foreground, then execute JavaScript
            runOnUiThread(() -> {
                new Handler(Looper.getMainLooper()).postDelayed(() -> {
                    if (bridge != null && bridge.getWebView() != null) {
                        bridge.getWebView().evaluateJavascript(finalJs, null);
                        Log.d(TAG, "✅ Navigation JavaScript executed");
                    } else {
                        Log.e(TAG, "❌ Bridge or WebView is null");
                    }
                }, 500); // Wait 500ms for app to be ready
            });
            
        } catch (Exception e) {
            Log.e(TAG, "Error navigating to QuickExpense: " + e.getMessage(), e);
        }
    }

    private String escapeJavaScript(String str) {
        if (str == null) return "";
        return str.replace("\\", "\\\\")
                  .replace("'", "\\'")
                  .replace("\"", "\\\"")
                  .replace("\n", "\\n")
                  .replace("\r", "\\r");
    }

    private double extractAmountFromUri(android.net.Uri uri) {
        try {
            String uriString = uri.toString();
            Log.d(TAG, "Extracting amount from URI: " + uriString);
            
            // Google Pay format: "1767896187 - 1.00 To Nisha Sharma on Google Pay.png"
            // Pattern: number - amount To/to
            java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("[-_\\s]([0-9]+\\.?[0-9]*)\\s*(?:To|to|TO)\\s", java.util.regex.Pattern.CASE_INSENSITIVE);
            java.util.regex.Matcher matcher = pattern.matcher(uriString);
            
            if (matcher.find()) {
                String amountStr = matcher.group(1);
                double amount = Double.parseDouble(amountStr);
                if (amount > 0 && amount < 1000000) {
                    Log.d(TAG, "Amount extracted from URI: " + amount);
                    return amount;
                }
            }
            
            // Try another pattern: just look for decimal numbers in filename
            pattern = java.util.regex.Pattern.compile("([0-9]+\\.[0-9]{2})");
            matcher = pattern.matcher(uriString);
            
            if (matcher.find()) {
                String amountStr = matcher.group(1);
                double amount = Double.parseDouble(amountStr);
                if (amount > 0 && amount < 1000000) {
                    Log.d(TAG, "Amount extracted from URI (decimal): " + amount);
                    return amount;
                }
            }
        } catch (Exception e) {
            Log.w(TAG, "Error extracting amount from URI: " + e.getMessage());
        }
        
        return 0.0;
    }

    private void createTestNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                TEST_CHANNEL_ID,
                "Test Notifications",
                NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("Channel for testing notification capture");
            
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
                Log.d(TAG, "Test notification channel created");
            }
        }
    }

    private void requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) 
                != PackageManager.PERMISSION_GRANTED) {
                Log.d(TAG, "Requesting POST_NOTIFICATIONS permission");
                ActivityCompat.requestPermissions(this, 
                    new String[]{Manifest.permission.POST_NOTIFICATIONS}, 
                    NOTIFICATION_PERMISSION_REQUEST_CODE);
            } else {
                Log.d(TAG, "POST_NOTIFICATIONS permission already granted");
            }
        } else {
            Log.d(TAG, "Android version < 13, POST_NOTIFICATIONS not required");
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        
        if (requestCode == NOTIFICATION_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Log.d(TAG, "Notification permission granted");
            } else {
                Log.d(TAG, "Notification permission denied");
            }
        }
    }

    public void sendTestNotification() {
        try {
            NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            if (notificationManager == null) {
                Log.e(TAG, "NotificationManager is null");
                return;
            }

            // Create a notification that matches the SMS format
            String testTitle = "Test Bank SMS";
            String testText = "Your account has been debited by Rs.250.50 at Test Merchant (2025:01:04 15:30:45)";
            
            NotificationCompat.Builder builder = new NotificationCompat.Builder(this, TEST_CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle(testTitle)
                .setContentText(testText)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(testText))
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true);

            notificationManager.notify(12345, builder.build());
            Log.d(TAG, "Test notification sent successfully");
            
        } catch (Exception e) {
            Log.e(TAG, "Error sending test notification: " + e.getMessage(), e);
        }
    }

    private void startServiceMonitoring() {
        // Monitor and restart services if needed
        Runnable serviceMonitor = new Runnable() {
            @Override
            public void run() {
                // Ensure background service is running
                ensureBackgroundServiceRunning();
                
                // Schedule next check
                serviceMonitorHandler.postDelayed(this, 60000); // Check every minute
            }
        };
        
        // Start monitoring after initial delay
        serviceMonitorHandler.postDelayed(serviceMonitor, 30000); // Start after 30 seconds
    }

    private void ensureBackgroundServiceRunning() {
        try {
            // Always try to start the background service
            // If it's already running, this will be ignored
            Intent intent = new Intent(this, BackgroundService.class);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(intent);
            } else {
                startService(intent);
            }
            Log.d(TAG, "Background service start requested (monitoring)");
        } catch (Exception e) {
            Log.e(TAG, "Error ensuring background service: " + e.getMessage());
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        // Restart services when app comes to foreground
        startBackgroundService();
        
        // Check notification listener status
        checkNotificationListenerStatus();
    }

    private void checkNotificationListenerStatus() {
        serviceMonitorHandler.postDelayed(() -> {
            boolean isConnected = NotificationListener.isServiceConnected();
            boolean isCreated = NotificationListener.isServiceCreated();
            Log.d(TAG, "App resumed - Listener connected: " + isConnected + ", created: " + isCreated);
            
            if (!isConnected && isCreated) {
                // Service exists but not connected, try to help it reconnect
                Intent reconnectIntent = new Intent("com.moneymanager.app.RECONNECT_LISTENER");
                sendBroadcast(reconnectIntent);
                Log.d(TAG, "Sent reconnection broadcast from MainActivity");
            }
        }, 2000); // Check after 2 seconds
    }

    private void startBackgroundService() {
        Intent intent = new Intent(this, BackgroundService.class);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(intent);
        } else {
            startService(intent);
        }
    }

    private void ensureNotificationListenerEnabled() {
        try {
            // Check if notification listener is enabled
            String enabledListeners = android.provider.Settings.Secure.getString(
                getContentResolver(), "enabled_notification_listeners");

            boolean isEnabled = false;
            if (enabledListeners != null) {
                String myListener = getPackageName() + "/" + NotificationListener.class.getName();
                isEnabled = enabledListeners.contains(myListener);
                Log.d(TAG, "My listener: " + myListener);
            }

            Log.d(TAG, "Notification listener enabled: " + isEnabled);

            if (isEnabled) {
                // Permission is granted, check connection status
                boolean isConnected = NotificationListener.isServiceConnected();
                boolean isCreated = NotificationListener.isServiceCreated();
                
                Log.d(TAG, "Service connected: " + isConnected + ", created: " + isCreated);
                
                // Only log the status, don't open settings automatically
                // The user can manually enable it from the app's settings page if needed
                if (!isConnected || !isCreated) {
                    Log.d(TAG, "Service not connected - will attempt reconnection in background");
                } else {
                    Log.d(TAG, "Notification listener is enabled and connected");
                }
            } else {
                Log.d(TAG, "Notification listener not enabled - user should enable it from app settings");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error checking notification listener: " + e.getMessage(), e);
        }
    }
}
