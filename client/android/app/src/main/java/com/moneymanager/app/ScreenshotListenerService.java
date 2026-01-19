package com.moneymanager.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.ContentResolver;
import android.content.Intent;
import android.database.ContentObserver;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.provider.MediaStore;
import android.provider.Settings;
import android.util.Log;
import android.widget.Toast;
import androidx.core.app.NotificationCompat;

public class ScreenshotListenerService extends Service {
    private static final String TAG = "ScreenshotListener";
    private static final String CHANNEL_ID = "screenshot_listener_channel";
    private static final String PROCESSING_CHANNEL_ID = "expense_processing_channel";
    private static final int FOREGROUND_ID = 1003;
    private static final int PROCESSING_NOTIFICATION_ID = 2001;

    private ContentObserver screenshotObserver;
    private OCRProcessor ocrProcessor;
    private Handler mainHandler;
    private long lastProcessedTime = 0;
    private static final long MIN_PROCESS_INTERVAL = 2000; // 2 seconds between processing
    private NotificationManager notificationManager;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "=== ScreenshotListenerService CREATED ===");
        Log.d(TAG, "Service will monitor screenshots when enabled in settings");
        
        mainHandler = new Handler(Looper.getMainLooper());
        ocrProcessor = new OCRProcessor(this);
        notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        
        createNotificationChannel();
        createProcessingNotificationChannel();
        startForeground(FOREGROUND_ID, createForegroundNotification());
        
        registerScreenshotObserver();
        
        Log.d(TAG, "✅ Screenshot listener ready and monitoring MediaStore");
    }
    
    private void createProcessingNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    PROCESSING_CHANNEL_ID,
                    "Expense Processing",
                    NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Shows real-time status when processing expenses");
            channel.setSound(null, null); // Silent
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Screenshot Listener",
                    NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Monitors screenshots for expense detection");
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    private Notification createForegroundNotification() {
        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Money Manager")
                .setContentText("Monitoring screenshots for expenses")
                .setSmallIcon(android.R.drawable.ic_menu_camera)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .build();
    }

    private void registerScreenshotObserver() {
        try {
            screenshotObserver = new ContentObserver(mainHandler) {
                @Override
                public void onChange(boolean selfChange, Uri uri) {
                    super.onChange(selfChange, uri);
                    Log.d(TAG, "MediaStore change detected: " + uri);
                    
                    // Throttle processing to avoid multiple triggers
                    long currentTime = System.currentTimeMillis();
                    if (currentTime - lastProcessedTime < MIN_PROCESS_INTERVAL) {
                        Log.d(TAG, "Skipping - too soon after last process");
                        return;
                    }
                    
                    mainHandler.postDelayed(() -> checkForNewScreenshot(uri), 500);
                }
            };

            ContentResolver contentResolver = getContentResolver();
            contentResolver.registerContentObserver(
                    MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                    true,
                    screenshotObserver
            );
            
            Log.d(TAG, "Screenshot observer registered successfully");
        } catch (Exception e) {
            Log.e(TAG, "Error registering screenshot observer: " + e.getMessage());
        }
    }

    private void checkForNewScreenshot(Uri uri) {
        try {
            // Check if screenshot monitoring is enabled in settings
            if (!isScreenshotMonitoringEnabled()) {
                Log.d(TAG, "Screenshot monitoring is disabled in settings");
                return;
            }
            
            // Check if we have permission
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                if (checkSelfPermission(android.Manifest.permission.READ_MEDIA_IMAGES) 
                        != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                    Log.w(TAG, "No READ_MEDIA_IMAGES permission");
                    return;
                }
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (checkSelfPermission(android.Manifest.permission.READ_EXTERNAL_STORAGE) 
                        != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                    Log.w(TAG, "No READ_EXTERNAL_STORAGE permission");
                    return;
                }
            }

            Uri latestImageUri = getLatestScreenshot();
            
            if (latestImageUri != null) {
                Log.d(TAG, "New screenshot detected: " + latestImageUri);
                lastProcessedTime = System.currentTimeMillis();
                processScreenshot(latestImageUri);
            }
        } catch (Exception e) {
            Log.e(TAG, "Error checking for screenshot: " + e.getMessage());
        }
    }
    
    private boolean isScreenshotMonitoringEnabled() {
        try {
            android.content.SharedPreferences prefs = getSharedPreferences("app_settings", MODE_PRIVATE);
            boolean enabled = prefs.getBoolean("screenshot_monitoring_enabled", false);
            Log.d(TAG, "📸 Screenshot monitoring enabled in settings: " + enabled);
            if (!enabled) {
                Log.d(TAG, "⚠️ Screenshot monitoring is DISABLED - enable it in Settings → Automation");
            }
            return enabled;
        } catch (Exception e) {
            Log.e(TAG, "Error checking screenshot monitoring setting: " + e.getMessage());
            return false;
        }
    }

    private Uri getLatestScreenshot() {
        Uri latestUri = null;
        
        try {
            String[] projection = {
                MediaStore.Images.Media._ID,
                MediaStore.Images.Media.DATA,
                MediaStore.Images.Media.DATE_ADDED,
                MediaStore.Images.Media.DISPLAY_NAME
            };

            String selection = MediaStore.Images.Media.DATE_ADDED + " > ?";
            String[] selectionArgs = {String.valueOf((System.currentTimeMillis() / 1000) - 10)}; // Last 10 seconds

            String sortOrder = MediaStore.Images.Media.DATE_ADDED + " DESC";

            Cursor cursor = getContentResolver().query(
                    MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                    projection,
                    selection,
                    selectionArgs,
                    sortOrder
            );

            if (cursor != null && cursor.moveToFirst()) {
                int idColumn = cursor.getColumnIndexOrThrow(MediaStore.Images.Media._ID);
                int dataColumn = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
                int nameColumn = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DISPLAY_NAME);

                do {
                    String path = cursor.getString(dataColumn);
                    String name = cursor.getString(nameColumn);
                    
                    // Check if it's a screenshot
                    if (isScreenshot(path, name)) {
                        long id = cursor.getLong(idColumn);
                        latestUri = Uri.withAppendedPath(
                                MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                                String.valueOf(id)
                        );
                        Log.d(TAG, "Found screenshot: " + path);
                        break;
                    }
                } while (cursor.moveToNext());

                cursor.close();
            }
        } catch (Exception e) {
            Log.e(TAG, "Error querying for screenshots: " + e.getMessage());
        }

        return latestUri;
    }

    private boolean isScreenshot(String path, String name) {
        if (path == null && name == null) return false;
        
        String lowerPath = path != null ? path.toLowerCase() : "";
        String lowerName = name != null ? name.toLowerCase() : "";
        
        // Check common screenshot patterns
        return lowerPath.contains("screenshot") || 
               lowerPath.contains("screen_shot") ||
               lowerPath.contains("screencap") ||
               lowerName.contains("screenshot") ||
               lowerName.contains("screen_shot") ||
               lowerName.startsWith("screenshot_") ||
               lowerName.startsWith("screen-");
    }

    private void processScreenshot(Uri imageUri) {
        Log.d(TAG, "Processing screenshot with OCR...");
        
        // Show processing notification
        showProcessingNotification("📸 Detected screenshot", "Extracting text...", 0);
        
        ocrProcessor.processImage(imageUri, new OCRProcessor.OCRCallback() {
            @Override
            public void onSuccess(OCRProcessor.ExpenseData expenseData) {
                Log.d(TAG, "OCR Success - Amount: " + expenseData.amount + ", Merchant: " + expenseData.merchant);
                
                // Update notification
                updateProcessingNotification("✅ Expense extracted", 
                    "Amount: ₹" + expenseData.amount + " • " + expenseData.merchant, 100);
                
                // Check if overlay permission is granted
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    if (!Settings.canDrawOverlays(ScreenshotListenerService.this)) {
                        Log.w(TAG, "No overlay permission, cannot show popup");
                        showErrorNotification("⚠️ Permission needed", 
                            "Enable 'Display over other apps' to see expense popup");
                        return;
                    }
                }
                
                // Dismiss processing notification after a short delay
                mainHandler.postDelayed(() -> dismissProcessingNotification(), 1000);
                
                // Show overlay with parsed expense data
                showExpenseOverlay(expenseData);
            }

            @Override
            public void onFailure(String error) {
                Log.w(TAG, "OCR failed: " + error);
                showErrorNotification("❌ Processing failed", 
                    "Could not extract expense from screenshot");
            }
        });
    }
    
    private void showProcessingNotification(String title, String message, int progress) {
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, PROCESSING_CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_menu_camera)
                .setContentTitle(title)
                .setContentText(message)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setOngoing(true)
                .setAutoCancel(false);
        
        if (progress > 0 && progress < 100) {
            builder.setProgress(100, progress, false);
        } else if (progress == 0) {
            builder.setProgress(100, 0, true); // Indeterminate
        }
        
        if (notificationManager != null) {
            notificationManager.notify(PROCESSING_NOTIFICATION_ID, builder.build());
        }
    }
    
    private void updateProcessingNotification(String title, String message, int progress) {
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, PROCESSING_CHANNEL_ID)
                .setSmallIcon(android.R.drawable.stat_notify_sync)
                .setContentTitle(title)
                .setContentText(message)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setOngoing(false)
                .setAutoCancel(true);
        
        if (progress > 0 && progress <= 100) {
            builder.setProgress(100, progress, false);
        }
        
        if (notificationManager != null) {
            notificationManager.notify(PROCESSING_NOTIFICATION_ID, builder.build());
        }
    }
    
    private void showErrorNotification(String title, String message) {
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, PROCESSING_CHANNEL_ID)
                .setSmallIcon(android.R.drawable.stat_notify_error)
                .setContentTitle(title)
                .setContentText(message)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setOngoing(false)
                .setAutoCancel(true);
        
        if (notificationManager != null) {
            notificationManager.notify(PROCESSING_NOTIFICATION_ID, builder.build());
        }
        
        // Auto-dismiss after 3 seconds
        mainHandler.postDelayed(() -> dismissProcessingNotification(), 3000);
    }
    
    private void dismissProcessingNotification() {
        if (notificationManager != null) {
            notificationManager.cancel(PROCESSING_NOTIFICATION_ID);
        }
    }
    
    private void showProcessingToast(final String message) {
        mainHandler.post(() -> {
            Toast.makeText(ScreenshotListenerService.this, message, Toast.LENGTH_SHORT).show();
        });
    }

    private void showExpenseOverlay(OCRProcessor.ExpenseData expenseData) {
        try {
            Intent intent = new Intent(this, OverlayService.class);
            intent.putExtra("source", "screenshot");
            intent.putExtra("title", expenseData.merchant);
            intent.putExtra("amount", expenseData.amount);
            intent.putExtra("type", expenseData.type);
            intent.putExtra("timestamp", expenseData.timestamp);
            intent.putExtra("rawText", expenseData.rawText);
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(intent);
            } else {
                startService(intent);
            }
            
            Log.d(TAG, "Overlay service started for screenshot expense");
        } catch (Exception e) {
            Log.e(TAG, "Error starting overlay service: " + e.getMessage());
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "ScreenshotListenerService started");
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "ScreenshotListenerService destroyed");
        
        if (screenshotObserver != null) {
            try {
                getContentResolver().unregisterContentObserver(screenshotObserver);
            } catch (Exception e) {
                Log.e(TAG, "Error unregistering observer: " + e.getMessage());
            }
        }
        
        if (ocrProcessor != null) {
            ocrProcessor.close();
        }
    }
}
