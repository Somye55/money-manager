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
        
        super.onCreate(savedInstanceState);
        
        Log.d(TAG, "Plugins registered: SettingsHelper, NotificationListenerPlugin");

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
                Log.d(TAG, "Enabled listeners: " + enabledListeners);
                Log.d(TAG, "My listener: " + myListener);
            }

            Log.d(TAG, "Notification listener enabled: " + isEnabled);

            if (!isEnabled) {
                Log.d(TAG, "Notification listener not enabled, opening settings...");
                // Open notification listener settings
                Intent intent = new Intent(android.provider.Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);

                // Also show a toast to guide the user
                android.widget.Toast.makeText(this,
                    "Please enable 'Money Manager' in Notification Access settings",
                    android.widget.Toast.LENGTH_LONG).show();
            } else {
                if (!NotificationListener.isServiceConnected()) {
                    Log.d(TAG, "Service enabled but not connected, opening settings to toggle permission");
                    Intent intent = new Intent(android.provider.Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                    android.widget.Toast.makeText(this,
                        "Please disable and re-enable 'Money Manager' in Notification Access settings to connect the service",
                        android.widget.Toast.LENGTH_LONG).show();
                } else {
                    Log.d(TAG, "Notification listener is enabled and connected");
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Error checking notification listener: " + e.getMessage(), e);
        }
    }
}
