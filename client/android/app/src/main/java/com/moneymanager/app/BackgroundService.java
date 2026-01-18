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
    private static final long CHECK_INTERVAL = 300000; // 5 minutes - battery efficient
    private static final long INITIAL_CHECK_DELAY = 10000; // 10 seconds initial delay
    private static final long REBIND_DELAY = 30000; // 30 seconds between rebind attempts

    private Handler handler;
    private Runnable connectionChecker;
    private int rebindAttempts = 0;
    private static final int MAX_REBIND_ATTEMPTS = 3;
    private boolean wasConnectedBefore = false;
    private Notification foregroundNotification;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
        
        // Create notification once
        foregroundNotification = createForegroundNotification();
        
        Log.d(TAG, "BackgroundService created");

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
        // Start as foreground service with pre-created notification
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                startForeground(FOREGROUND_ID, foregroundNotification);
            } catch (Exception e) {
                Log.e(TAG, "Error starting foreground: " + e.getMessage());
            }
        }

        // Start periodic connection checking with initial delay
        handler.removeCallbacks(connectionChecker); // Remove any existing callbacks
        handler.postDelayed(connectionChecker, INITIAL_CHECK_DELAY);

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

            if (isConnected) {
                // Service is healthy
                if (!wasConnectedBefore) {
                    Log.i(TAG, "Notification listener connected successfully");
                    wasConnectedBefore = true;
                }
                rebindAttempts = 0;
                return;
            }

            // Only log when state changes or on errors
            if (wasConnectedBefore) {
                Log.w(TAG, "Notification listener disconnected - attempting recovery");
                wasConnectedBefore = false;
            }

            // Check if permission is granted
            boolean hasPermission = isNotificationListenerEnabled();

            if (!hasPermission) {
                if (rebindAttempts == 0) {
                    Log.w(TAG, "Notification listener permission not granted");
                }
                rebindAttempts = 0; // Reset attempts when permission issue
                return;
            }

            // Permission granted but service not connected
            if (!isCreated) {
                // Service hasn't been created by Android yet
                if (rebindAttempts < MAX_REBIND_ATTEMPTS) {
                    rebindAttempts++;
                    if (rebindAttempts == 1) {
                        Log.i(TAG, "Waiting for Android to bind notification listener...");
                    }
                    // Schedule a retry with exponential backoff
                    handler.postDelayed(() -> checkAndMaintainNotificationListener(), 
                        REBIND_DELAY * rebindAttempts);
                } else if (rebindAttempts == MAX_REBIND_ATTEMPTS) {
                    Log.w(TAG, "Notification listener not binding - may need manual toggle in settings");
                    rebindAttempts++; // Increment to avoid repeated logging
                }
            } else {
                // Service created but not connected - try reconnection
                attemptServiceReconnection();
            }
        } catch (Exception e) {
            Log.e(TAG, "Error checking notification listener: " + e.getMessage());
        }
    }

    private void attemptServiceReconnection() {
        try {
            // Signal the existing service to attempt reconnection
            Intent reconnectIntent = new Intent("com.moneymanager.app.RECONNECT_LISTENER");
            sendBroadcast(reconnectIntent);
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
            Log.e(TAG, "Error checking notification listener permission: " + e.getMessage());
        }
        return false;
    }
}