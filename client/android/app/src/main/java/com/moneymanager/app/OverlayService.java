package com.moneymanager.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.provider.Settings;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;
import androidx.core.app.NotificationCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

public class OverlayService extends Service {
    private static final String TAG = "OverlayService";
    private static final String CHANNEL_ID = "overlay_service_channel";
    private static final int FOREGROUND_ID = 1002;

    private static boolean isOverlayShowing = false;

    private WindowManager windowManager;
    private View overlayView;
    private Handler mainHandler;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        mainHandler = new Handler(Looper.getMainLooper());
        createNotificationChannel();
        Log.d(TAG, "=== OverlayService CREATED ===");
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Overlay Service",
                    NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Shows financial notification overlays");
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    private Notification createForegroundNotification() {
        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Money Manager")
                .setContentText("Displaying notification popup")
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .build();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "=== OverlayService onStartCommand called ===");
        
        // Start as foreground service for Android 8+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                startForeground(FOREGROUND_ID, createForegroundNotification());
                Log.d(TAG, "Started as foreground service");
            } catch (Exception e) {
                Log.e(TAG, "Error starting foreground: " + e.getMessage());
            }
        }
        
        if (intent != null) {
            String title = intent.getStringExtra("title");
            String text = intent.getStringExtra("text");
            String packageName = intent.getStringExtra("package");
            
            Log.d(TAG, "Received intent - Title: " + title + ", Text: " + text);
            
            // Run on main thread
            mainHandler.post(() -> showOverlay(title, text, packageName));
        } else {
            Log.d(TAG, "Intent is null");
        }
        
        return START_NOT_STICKY;
    }

    private void showOverlay(String title, String text, String packageName) {
        Log.d(TAG, "=== showOverlay called ===");

        // Prevent multiple overlays
        if (isOverlayShowing) {
            Log.d(TAG, "Overlay already showing, skipping");
            return;
        }

        // Double check overlay permission
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(this)) {
                Log.e(TAG, "!!! Cannot draw overlays - permission denied !!!");
                stopSelf();
                return;
            }
        }

        try {
            // Remove existing overlay first
            if (overlayView != null && windowManager != null) {
                try {
                    windowManager.removeView(overlayView);
                } catch (Exception e) {
                    Log.w(TAG, "Could not remove existing overlay: " + e.getMessage());
                }
                overlayView = null;
            }
            
            windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
            if (windowManager == null) {
                Log.e(TAG, "WindowManager is null!");
                stopSelf();
                return;
            }

            int layoutType;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                layoutType = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
            } else {
                layoutType = WindowManager.LayoutParams.TYPE_PHONE;
            }

            WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                    WindowManager.LayoutParams.MATCH_PARENT,
                    WindowManager.LayoutParams.WRAP_CONTENT,
                    layoutType,
                    WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
                    WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL |
                    WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                    WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON,
                    PixelFormat.TRANSLUCENT
            );

            params.gravity = Gravity.TOP | Gravity.CENTER_HORIZONTAL;
            params.y = 100;

            // Try to use layout file, fallback to programmatic view
            try {
                LayoutInflater inflater = (LayoutInflater) getSystemService(Context.LAYOUT_INFLATER_SERVICE);
                overlayView = inflater.inflate(R.layout.overlay_notification, null);

                TextView titleView = overlayView.findViewById(R.id.overlay_title);
                TextView textView = overlayView.findViewById(R.id.overlay_text);
                TextView appView = overlayView.findViewById(R.id.overlay_app);
                View closeButton = overlayView.findViewById(R.id.overlay_close);
                Spinner categorySpinner = overlayView.findViewById(R.id.category_spinner);
                Button dismissButton = overlayView.findViewById(R.id.btn_dismiss);
                Button saveButton = overlayView.findViewById(R.id.btn_save);

                if (titleView != null) titleView.setText(title != null ? title : "Notification");
                if (textView != null) textView.setText(text != null ? text : "");
                if (appView != null) appView.setText(getAppName(packageName));

                // Setup category spinner
                if (categorySpinner != null) {
                    String[] categories = {"Food & Dining", "Transportation", "Shopping", "Entertainment", "Bills & Utilities", "Healthcare", "Other"};
                    ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item, categories);
                    adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                    categorySpinner.setAdapter(adapter);
                }

                // Setup buttons
                if (closeButton != null) closeButton.setOnClickListener(v -> removeOverlay());
                if (dismissButton != null) dismissButton.setOnClickListener(v -> removeOverlay());
                if (saveButton != null) {
                    saveButton.setOnClickListener(v -> {
                        if (categorySpinner != null) {
                            String selectedCategory = (String) categorySpinner.getSelectedItem();
                            saveExpense(title, text, packageName, selectedCategory);
                        }
                        removeOverlay();
                    });
                }
                
                Log.d(TAG, "Using layout file for overlay");
            } catch (Exception e) {
                Log.w(TAG, "Could not inflate layout, using programmatic view: " + e.getMessage());
                overlayView = createProgrammaticOverlay(title, text, packageName);
            }

            windowManager.addView(overlayView, params);
            Log.d(TAG, ">>> OVERLAY VIEW ADDED SUCCESSFULLY <<<");
            isOverlayShowing = true;

            // No auto-dismiss, user controls
            
        } catch (Exception e) {
            Log.e(TAG, "!!! ERROR showing overlay: " + e.getMessage(), e);
            stopSelf();
        }
    }

    private View createProgrammaticOverlay(String title, String text, String packageName) {
        // Create a simple overlay programmatically as fallback
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setBackgroundColor(Color.WHITE);
        layout.setPadding(32, 32, 32, 32);

        TextView appLabel = new TextView(this);
        appLabel.setText(getAppName(packageName));
        appLabel.setTextColor(Color.GRAY);
        appLabel.setTextSize(12);
        layout.addView(appLabel);

        TextView titleView = new TextView(this);
        titleView.setText(title != null ? title : "Notification");
        titleView.setTextColor(Color.BLACK);
        titleView.setTextSize(16);
        titleView.setPadding(0, 8, 0, 4);
        layout.addView(titleView);

        TextView textView = new TextView(this);
        textView.setText(text != null ? text : "");
        textView.setTextColor(Color.DKGRAY);
        textView.setTextSize(14);
        layout.addView(textView);

        TextView closeBtn = new TextView(this);
        closeBtn.setText("TAP TO CLOSE");
        closeBtn.setTextColor(Color.BLUE);
        closeBtn.setTextSize(12);
        closeBtn.setPadding(0, 16, 0, 0);
        closeBtn.setOnClickListener(v -> removeOverlay());
        layout.addView(closeBtn);

        layout.setOnClickListener(v -> removeOverlay());

        return layout;
    }

    private void removeOverlay() {
        Log.d(TAG, "removeOverlay called");
        try {
            if (overlayView != null && windowManager != null) {
                windowManager.removeView(overlayView);
                overlayView = null;
                Log.d(TAG, "Overlay removed successfully");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error removing overlay: " + e.getMessage());
        }
        isOverlayShowing = false;
        stopSelf();
    }

    private void saveExpense(String title, String text, String packageName, String category) {
        Log.d(TAG, "saveExpense called - Category: " + category);
        try {
            Intent intent = new Intent("com.moneymanager.app.EXPENSE_SAVED");
            intent.putExtra("title", title);
            intent.putExtra("text", text);
            intent.putExtra("package", packageName);
            intent.putExtra("category", category);
            intent.putExtra("timestamp", System.currentTimeMillis());

            LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
            Log.d(TAG, "Expense save broadcast sent");

            Toast.makeText(this, "Expense saved in " + category, Toast.LENGTH_SHORT).show();
        } catch (Exception e) {
            Log.e(TAG, "Error broadcasting expense save: " + e.getMessage(), e);
        }
    }

    private String getAppName(String packageName) {
        if (packageName == null) return "App";
        String pkg = packageName.toLowerCase();
        if (pkg.contains("paytm")) return "Paytm";
        if (pkg.contains("phonepe")) return "PhonePe";
        if (pkg.contains("googlepay") || pkg.contains("gpay") || pkg.contains("tez")) return "Google Pay";
        if (pkg.contains("whatsapp")) return "WhatsApp";
        if (pkg.contains("amazonpay")) return "Amazon Pay";
        if (pkg.contains("bhim")) return "BHIM";
        if (pkg.contains("cred")) return "CRED";
        if (pkg.contains("sbi")) return "SBI";
        if (pkg.contains("hdfc")) return "HDFC";
        if (pkg.contains("icici")) return "ICICI";
        return "Banking App";
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "OverlayService destroyed");
        if (overlayView != null && windowManager != null) {
            try {
                windowManager.removeView(overlayView);
            } catch (Exception e) {
                // Ignore
            }
        }
        isOverlayShowing = false;
    }
}
