package com.moneymanager.app;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "MainActivity";
    private Handler serviceMonitorHandler;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(SettingsHelper.class);
        registerPlugin(NotificationListenerPlugin.class);

        serviceMonitorHandler = new Handler(Looper.getMainLooper());

        // Check and request battery optimization exemption
        BatteryOptimizationHelper.checkAndRequestBatteryOptimization(this);

        // Start background service to keep app alive
        startBackgroundService();

        // Check and ensure notification listener service is enabled
        ensureNotificationListenerEnabled();

        // Start proactive service monitoring
        startServiceMonitoring();
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
                Log.d(TAG, "Notification listener is enabled, service should connect automatically");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error checking notification listener: " + e.getMessage(), e);
        }
    }
}
