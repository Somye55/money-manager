package com.moneymanager.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.provider.Settings;
import android.util.Log;
import androidx.core.app.NotificationCompat;

public class BackgroundService extends Service {
    private static final String TAG = "BackgroundService";
    private static final String CHANNEL_ID = "background_service_channel";
    private static final int FOREGROUND_ID = 1001;
    private static final long CHECK_INTERVAL = 15000; // 15 seconds - more frequent checks
    private static final long REBIND_DELAY = 5000; // 5 seconds delay for rebind attempts

    private Handler handler;
    private Runnable connectionChecker;
    private int rebindAttempts = 0;
    private static final int MAX_REBIND_ATTEMPTS = 5;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
        Log.d(TAG, "=== BackgroundService CREATED ===");

        // Initialize handler for periodic checks
        handler = new Handler(Looper.getMainLooper());
        connectionChecker = new Runnable() {
            @Override
            public void run() {
                checkAndMaintainNotificationListener();
                handler.postDelayed(this, CHECK_INTERVAL);
            }
        };
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Background Service",
                    NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Keeps the app running in background");
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    private Notification createForegroundNotification() {
        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Money Manager")
                .setContentText("Monitoring financial notifications")
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .build();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "=== BackgroundService onStartCommand called ===");

        // Start as foreground service
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                startForeground(FOREGROUND_ID, createForegroundNotification());
                Log.d(TAG, "Started as foreground service");
            } catch (Exception e) {
                Log.e(TAG, "Error starting foreground: " + e.getMessage());
            }
        }

        // Start periodic connection checking
        handler.postDelayed(connectionChecker, CHECK_INTERVAL);
        Log.d(TAG, "Started periodic notification listener connection checking");

        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "BackgroundService destroyed");

        // Stop periodic checking
        if (handler != null && connectionChecker != null) {
            handler.removeCallbacks(connectionChecker);
        }
    }

    private void checkAndMaintainNotificationListener() {
        try {
            boolean isConnected = NotificationListener.isServiceConnected();
            boolean isCreated = NotificationListener.isServiceCreated();
            Log.d(TAG, "Notification listener connected: " + isConnected + ", created: " + isCreated);

            if (!isConnected) {
                Log.d(TAG, "Notification listener not connected - checking permission and attempting to enable");

                // Check if permission is granted
                boolean hasPermission = isNotificationListenerEnabled();
                Log.d(TAG, "Notification listener permission granted: " + hasPermission);

                if (!hasPermission) {
                    Log.d(TAG, "Permission not granted, opening notification listener settings...");
                    openNotificationListenerSettings();
                    rebindAttempts = 0; // Reset attempts when permission issue
                } else {
                    if (!isCreated) {
                        Log.d(TAG, "Service not even created - Android hasn't bound it yet");
                        // Try to force rebind the service
                        forceRebindNotificationListener();
                    } else {
                        Log.d(TAG, "Service created but not connected - Android may have unbound it");
                        // Try to reconnect the existing service
                        attemptServiceReconnection();
                    }
                }
            } else {
                // Service is connected, reset rebind attempts
                rebindAttempts = 0;
                Log.d(TAG, "Notification listener is healthy and connected");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error checking notification listener status: " + e.getMessage(), e);
        }
    }

    private void forceRebindNotificationListener() {
        if (rebindAttempts >= MAX_REBIND_ATTEMPTS) {
            Log.w(TAG, "Max rebind attempts reached, will retry after longer delay");
            // Reset attempts after a longer delay
            handler.postDelayed(() -> rebindAttempts = 0, 60000); // 1 minute
            return;
        }

        rebindAttempts++;
        Log.d(TAG, "Attempting to signal notification listener to reconnect (attempt " + rebindAttempts + ")");

        try {
            // Signal the existing service to attempt reconnection
            // NotificationListenerService should NEVER be manually started/stopped
            // It's automatically bound by Android when permission is granted
            Intent reconnectIntent = new Intent("com.moneymanager.app.RECONNECT_LISTENER");
            sendBroadcast(reconnectIntent);
            Log.d(TAG, "Sent reconnection broadcast to notification listener");

        } catch (Exception e) {
            Log.e(TAG, "Error in force rebind: " + e.getMessage(), e);
        }
    }

    private void attemptServiceReconnection() {
        Log.d(TAG, "Attempting to reconnect existing notification listener service");
        
        try {
            // Signal the existing service to attempt reconnection
            Intent reconnectIntent = new Intent("com.moneymanager.app.RECONNECT_LISTENER");
            sendBroadcast(reconnectIntent);
            Log.d(TAG, "Sent reconnection broadcast to notification listener");
        } catch (Exception e) {
            Log.e(TAG, "Error sending reconnection broadcast: " + e.getMessage());
        }
    }


    private boolean isNotificationListenerEnabled() {
        try {
            String enabledListeners = android.provider.Settings.Secure.getString(
                getContentResolver(), "enabled_notification_listeners");
            if (enabledListeners != null) {
                String myListener = getPackageName() + "/" + NotificationListener.class.getName();
                return enabledListeners.contains(myListener);
            }
        } catch (Exception e) {
            Log.e(TAG, "Error checking notification listener permission: " + e.getMessage(), e);
        }
        return false;
    }

    private void openNotificationListenerSettings() {
        try {
            Intent intent = new Intent(android.provider.Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
            Log.d(TAG, "Opened notification listener settings");
        } catch (Exception e) {
            Log.e(TAG, "Error opening notification listener settings: " + e.getMessage(), e);
        }
    }
}