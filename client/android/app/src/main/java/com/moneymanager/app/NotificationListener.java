package com.moneymanager.app;

import android.app.Notification;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Log;
import android.widget.Toast;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

public class NotificationListener extends NotificationListenerService {
    private static final String TAG = "NotificationListener";
    public static final String NOTIFICATION_BROADCAST = "com.moneymanager.app.NOTIFICATION_RECEIVED";
    private static boolean isConnected = false;

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "=== NotificationListener service CREATED ===");
    }
    
    public static boolean isServiceConnected() {
        return isConnected;
    }

    @Override
    public void onListenerConnected() {
        super.onListenerConnected();
        isConnected = true;
        Log.d(TAG, "=== NotificationListener CONNECTED - Service is now active! ===");
        
        // Show a toast to confirm service is running
        try {
            Toast.makeText(this, "Money Manager: Notification monitoring active", Toast.LENGTH_SHORT).show();
        } catch (Exception e) {
            Log.w(TAG, "Could not show toast: " + e.getMessage());
        }
    }

    @Override
    public void onListenerDisconnected() {
        super.onListenerDisconnected();
        isConnected = false;
        Log.d(TAG, "=== NotificationListener DISCONNECTED ===");
        
        // Try to rebind
        requestRebind(null);
    }

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        Log.d(TAG, ">>> onNotificationPosted() called <<<");
        
        if (sbn == null) {
            Log.d(TAG, "Received null notification");
            return;
        }

        String packageName = sbn.getPackageName();
        Log.d(TAG, "Package name: " + packageName);
        
        // Skip our own notifications
        if (packageName.equals(getPackageName())) {
            Log.d(TAG, "Skipping our own notification");
            return;
        }

        Notification notification = sbn.getNotification();
        if (notification == null) {
            Log.d(TAG, "Notification is null from: " + packageName);
            return;
        }
        
        if (notification.extras == null) {
            Log.d(TAG, "Notification extras is null from: " + packageName);
            return;
        }

        Bundle extras = notification.extras;
        
        String title = "";
        String text = "";
        String bigText = "";

        try {
            CharSequence titleCs = extras.getCharSequence(Notification.EXTRA_TITLE);
            CharSequence textCs = extras.getCharSequence(Notification.EXTRA_TEXT);
            CharSequence bigTextCs = extras.getCharSequence(Notification.EXTRA_BIG_TEXT);
            
            title = titleCs != null ? titleCs.toString() : "";
            text = textCs != null ? textCs.toString() : "";
            bigText = bigTextCs != null ? bigTextCs.toString() : "";
            
            Log.d(TAG, "Extracted - Title: '" + title + "', Text: '" + text + "', BigText: '" + bigText + "'");
        } catch (Exception e) {
            Log.e(TAG, "Error extracting notification text: " + e.getMessage(), e);
        }
        
        String fullText = bigText.isEmpty() ? text : bigText;
        
        // LOG ALL NOTIFICATIONS for debugging
        Log.d(TAG, "========================================");
        Log.d(TAG, "NEW NOTIFICATION RECEIVED");
        Log.d(TAG, "Package: " + packageName);
        Log.d(TAG, "Title: " + title);
        Log.d(TAG, "Text: " + text);
        Log.d(TAG, "BigText: " + bigText);
        Log.d(TAG, "FullText: " + fullText);
        
        boolean isFinApp = isFinancialApp(packageName);
        boolean isFinContent = isFinancialNotification(title, fullText);
        
        Log.d(TAG, "Is Financial App: " + isFinApp);
        Log.d(TAG, "Is Financial Content: " + isFinContent);
        Log.d(TAG, "========================================");

        // Show popup for ALL notifications
        Log.d(TAG, ">>> NOTIFICATION DETECTED - Attempting to show overlay...");

        try {
            showOverlayPopup(title, fullText, packageName);
            Log.d(TAG, "showOverlayPopup() completed");
        } catch (Exception e) {
            Log.e(TAG, "Exception in showOverlayPopup: " + e.getMessage(), e);
        }

        // Broadcast notification to the app
        try {
            broadcastNotification(packageName, title, fullText);
            Log.d(TAG, "broadcastNotification() completed");
        } catch (Exception e) {
            Log.e(TAG, "Exception in broadcastNotification: " + e.getMessage(), e);
        }
    }

    private void showOverlayPopup(String title, String text, String packageName) {
        // Check if overlay permission is granted
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            boolean canDraw = Settings.canDrawOverlays(this);
            Log.d(TAG, "Overlay permission granted: " + canDraw);
            if (!canDraw) {
                Log.e(TAG, "!!! OVERLAY PERMISSION NOT GRANTED - Cannot show popup !!!");
                return;
            }
        }
        
        try {
            Log.d(TAG, "Starting OverlayService...");
            Intent intent = new Intent(this, OverlayService.class);
            intent.putExtra("title", title != null ? title : "Notification");
            intent.putExtra("text", text != null ? text : "");
            intent.putExtra("package", packageName != null ? packageName : "");
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(intent);
            } else {
                startService(intent);
            }
            Log.d(TAG, "OverlayService started successfully");
        } catch (Exception e) {
            Log.e(TAG, "!!! ERROR starting OverlayService: " + e.getMessage(), e);
        }
    }

    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
        // Handle notification removal if needed
    }

    private boolean isFinancialApp(String packageName) {
        if (packageName == null) return false;
        String pkg = packageName.toLowerCase();
        
        boolean isFinancial = pkg.contains("paytm") ||
               pkg.contains("phonepe") ||
               pkg.contains("googlepay") ||
               pkg.contains("gpay") ||
               pkg.contains("tez") ||
               pkg.contains("whatsapp") ||
               pkg.contains("bank") ||
               pkg.contains("upi") ||
               pkg.contains("amazonpay") ||
               pkg.contains("bhim") ||
               pkg.contains("cred") ||
               pkg.contains("mobikwik") ||
               pkg.contains("freecharge") ||
               pkg.contains("sbi") ||
               pkg.contains("hdfc") ||
               pkg.contains("icici") ||
               pkg.contains("axis") ||
               pkg.contains("kotak");
        
        return isFinancial;
    }

    private boolean isFinancialNotification(String title, String text) {
        if (title == null) title = "";
        if (text == null) text = "";
        
        String combined = (title + " " + text).toLowerCase();
        
        // Check for common financial keywords
        return combined.contains("debited") ||
               combined.contains("credited") ||
               combined.contains("paid") ||
               combined.contains("received") ||
               combined.contains("sent") ||
               combined.contains("payment") ||
               combined.contains("transaction") ||
               combined.contains("balance") ||
               combined.contains("rs.") ||
               combined.contains("rs ") ||
               combined.contains("inr") ||
               combined.contains("₹") ||
               combined.contains("rupee") ||
               combined.matches(".*\\d+\\.\\d{2}.*");
    }
    
    private void broadcastNotification(String packageName, String title, String text) {
        try {
            Intent intent = new Intent(NOTIFICATION_BROADCAST);
            intent.putExtra("package", packageName);
            intent.putExtra("title", title);
            intent.putExtra("text", text);
            intent.putExtra("timestamp", System.currentTimeMillis());
            
            LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
            Log.d(TAG, "Broadcast sent successfully");
        } catch (Exception e) {
            Log.e(TAG, "Error broadcasting notification: " + e.getMessage(), e);
        }
    }
}
