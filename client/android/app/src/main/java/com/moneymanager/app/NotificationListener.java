package com.moneymanager.app;

import android.app.Notification;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Log;
import android.widget.Toast;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import org.json.JSONArray;

public class NotificationListener extends NotificationListenerService {
    private static final String TAG = "NotificationListener";
    public static final String NOTIFICATION_BROADCAST = "com.moneymanager.app.NOTIFICATION_RECEIVED";
    private static boolean isConnected = false;
    private static NotificationListener instance = null;
    private Handler reconnectionHandler;
    private BroadcastReceiver reconnectionReceiver;

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
        reconnectionHandler = new Handler(Looper.getMainLooper());
        Log.d(TAG, "=== NotificationListener service CREATED ===");
        Log.d(TAG, "Service instance created: " + instance.hashCode());

        // Register broadcast receiver for reconnection attempts
        setupReconnectionReceiver();

        // Check if permission is granted
        boolean hasPermission = checkNotificationListenerPermission();
        Log.d(TAG, "Permission check on create: " + hasPermission);

        // Start proactive connection monitoring
        startConnectionMonitoring();
    }

    private void setupReconnectionReceiver() {
        reconnectionReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if ("com.moneymanager.app.RECONNECT_LISTENER".equals(intent.getAction())) {
                    Log.d(TAG, "Received reconnection request");
                    attemptReconnection();
                }
            }
        };

        IntentFilter filter = new IntentFilter("com.moneymanager.app.RECONNECT_LISTENER");
        registerReceiver(reconnectionReceiver, filter);
        Log.d(TAG, "Reconnection receiver registered");
    }

    private void startConnectionMonitoring() {
        // Periodically check and maintain connection
        Runnable connectionMonitor = new Runnable() {
            @Override
            public void run() {
                if (!isConnected) {
                    Log.d(TAG, "Connection monitor: Service not connected, attempting reconnection");
                    attemptReconnection();
                }
                // Schedule next check
                reconnectionHandler.postDelayed(this, 30000); // Check every 30 seconds
            }
        };
        
        // Start monitoring after initial delay
        reconnectionHandler.postDelayed(connectionMonitor, 10000); // Start after 10 seconds
    }

    private void attemptReconnection() {
        try {
            Log.d(TAG, "Attempting reconnection...");
            
            // Check permission first
            if (!checkNotificationListenerPermission()) {
                Log.w(TAG, "Cannot reconnect - permission not granted");
                return;
            }

            // Try to request rebind
            requestRebind(null);
            Log.d(TAG, "Rebind requested during reconnection attempt");

            // Also try to refresh the service binding
            reconnectionHandler.postDelayed(() -> {
                try {
                    if (!isConnected) {
                        Log.d(TAG, "Still not connected after rebind, trying service refresh");
                        // Force a service state refresh by accessing active notifications
                        StatusBarNotification[] notifications = getActiveNotifications();
                        Log.d(TAG, "Service refresh attempt completed, notifications: " + 
                              (notifications != null ? notifications.length : "null"));
                    }
                } catch (Exception e) {
                    Log.w(TAG, "Error during service refresh: " + e.getMessage());
                }
            }, 3000);

        } catch (Exception e) {
            Log.e(TAG, "Error during reconnection attempt: " + e.getMessage(), e);
        }
    }

    private boolean checkNotificationListenerPermission() {
        try {
            String enabledListeners = android.provider.Settings.Secure.getString(
                getContentResolver(), "enabled_notification_listeners");
            if (enabledListeners != null) {
                String myListener = getPackageName() + "/" + NotificationListener.class.getName();
                boolean hasPermission = enabledListeners.contains(myListener);
                Log.d(TAG, "Enabled listeners: " + enabledListeners);
                Log.d(TAG, "My listener string: " + myListener);
                Log.d(TAG, "Has permission: " + hasPermission);
                return hasPermission;
            } else {
                Log.d(TAG, "No enabled listeners found");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error checking permission: " + e.getMessage(), e);
        }
        return false;
    }
    
    public static boolean isServiceConnected() {
        return isConnected;
    }

    public static boolean isServiceCreated() {
        return instance != null;
    }

    @Override
    public void onListenerConnected() {
        super.onListenerConnected();
        isConnected = true;
        Log.d(TAG, "=== NotificationListener CONNECTED - Service is now active! ===");
        Log.d(TAG, "Connected at: " + System.currentTimeMillis());
        Log.d(TAG, "Service hash: " + this.hashCode());

        // Show a toast to confirm service is running
        try {
            Toast.makeText(this, "Money Manager: Notification monitoring active", Toast.LENGTH_SHORT).show();
        } catch (Exception e) {
            Log.w(TAG, "Could not show toast: " + e.getMessage());
        }

        // Proactively maintain connection
        maintainConnection();

        // Log current active notifications to verify we can access them
        try {
            StatusBarNotification[] activeNotifications = getActiveNotifications();
            Log.d(TAG, "Active notifications count: " + (activeNotifications != null ? activeNotifications.length : 0));
        } catch (Exception e) {
            Log.e(TAG, "Error getting active notifications: " + e.getMessage(), e);
        }
    }

    private void maintainConnection() {
        try {
            // Request rebind to ensure stable connection
            requestRebind(null);
            Log.d(TAG, "Rebind requested on connect for stability");

            // Schedule periodic connection maintenance
            reconnectionHandler.postDelayed(() -> {
                if (isConnected) {
                    try {
                        // Perform a light operation to keep the service active
                        StatusBarNotification[] notifications = getActiveNotifications();
                        Log.d(TAG, "Connection maintenance check - notifications: " + 
                              (notifications != null ? notifications.length : "null"));
                        
                        // Schedule next maintenance
                        maintainConnection();
                    } catch (Exception e) {
                        Log.w(TAG, "Error during connection maintenance: " + e.getMessage());
                    }
                }
            }, 60000); // Every minute when connected

        } catch (Exception e) {
            Log.w(TAG, "Could not maintain connection: " + e.getMessage());
        }
    }

    @Override
    public void onListenerDisconnected() {
        super.onListenerDisconnected();
        isConnected = false;
        Log.d(TAG, "=== NotificationListener DISCONNECTED ===");
        Log.d(TAG, "Disconnected at: " + System.currentTimeMillis());
        Log.d(TAG, "Service hash: " + this.hashCode());

        // Check if permission is still granted
        boolean stillHasPermission = checkNotificationListenerPermission();
        Log.d(TAG, "Permission still granted after disconnect: " + stillHasPermission);

        // Immediate reconnection attempt
        attemptReconnection();

        // Also schedule multiple reconnection attempts with increasing delays
        scheduleReconnectionAttempts();
    }

    private void scheduleReconnectionAttempts() {
        // Multiple reconnection attempts with exponential backoff
        int[] delays = {2000, 5000, 10000, 20000, 30000}; // 2s, 5s, 10s, 20s, 30s
        
        for (int i = 0; i < delays.length; i++) {
            final int attempt = i + 1;
            reconnectionHandler.postDelayed(() -> {
                if (!isConnected) {
                    Log.d(TAG, "Scheduled reconnection attempt " + attempt);
                    attemptReconnection();
                }
            }, delays[i]);
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "NotificationListener service destroyed");
        
        // Clean up
        if (reconnectionReceiver != null) {
            try {
                unregisterReceiver(reconnectionReceiver);
            } catch (Exception e) {
                Log.w(TAG, "Error unregistering reconnection receiver: " + e.getMessage());
            }
        }
        
        if (reconnectionHandler != null) {
            reconnectionHandler.removeCallbacksAndMessages(null);
        }
        
        instance = null;
        isConnected = false;
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

        // Check if app is selected for listening
        if (!isAppSelected(packageName)) {
            Log.d(TAG, "Skipping notification from unselected app: " + packageName);
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

        // Only show popup for notifications matching the specific SMS format
        if (matchesSMSFormat(fullText)) {
            Log.d(TAG, ">>> SMS FORMAT MATCHED - Attempting to show overlay...");

            try {
                showOverlayPopup(title, fullText, packageName);
                Log.d(TAG, "showOverlayPopup() completed");
            } catch (Exception e) {
                Log.e(TAG, "Exception in showOverlayPopup: " + e.getMessage(), e);
            }
        } else {
            Log.d(TAG, "Skipping popup for non-matching notification");
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

    private boolean matchesSMSFormat(String text) {
        if (text == null) return false;
        // Check for Rs. amount and timestamp format
        return text.matches(".*Rs\\.\\d+\\.\\d{2}.*") &&
               text.matches(".*\\(\\d{4}:\\d{2}:\\d{2} \\d{2}:\\d{2}:\\d{2}\\).*");
    }

    private boolean isAppSelected(String packageName) {
        try {
            String selectedAppsJson = getSharedPreferences("MoneyManager", MODE_PRIVATE)
                    .getString("selectedApps", null);
            if (selectedAppsJson == null) {
                // Default apps if not set
                selectedAppsJson = "[\"com.whatsapp\", \"com.google.android.apps.messaging\"]";
            }
            JSONArray selectedApps = new JSONArray(selectedAppsJson);
            for (int i = 0; i < selectedApps.length(); i++) {
                if (selectedApps.getString(i).equals(packageName)) {
                    return true;
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Error checking selected apps: " + e.getMessage());
        }
        return false;
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
