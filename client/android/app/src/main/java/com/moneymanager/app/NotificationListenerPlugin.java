package com.moneymanager.app;

import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.text.TextUtils;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "NotificationListenerPlugin")
public class NotificationListenerPlugin extends Plugin {
    private BroadcastReceiver notificationReceiver;
    private BroadcastReceiver expenseSavedReceiver;
    private boolean isListening = false;

    @PluginMethod
    public void checkPermission(PluginCall call) {
        boolean hasPermission = isNotificationServiceEnabled();
        JSObject ret = new JSObject();
        ret.put("granted", hasPermission);
        call.resolve(ret);
    }
    
    @PluginMethod
    public void startListening(PluginCall call) {
        if (isListening) {
            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("message", "Already listening");
            call.resolve(ret);
            return;
        }
        
        try {
            notificationReceiver = new BroadcastReceiver() {
                @Override
                public void onReceive(Context context, Intent intent) {
                    String packageName = intent.getStringExtra("package");
                    String title = intent.getStringExtra("title");
                    String text = intent.getStringExtra("text");
                    long timestamp = intent.getLongExtra("timestamp", System.currentTimeMillis());

                    JSObject notification = new JSObject();
                    notification.put("package", packageName);
                    notification.put("title", title);
                    notification.put("text", text);
                    notification.put("timestamp", timestamp);

                    notifyListeners("notificationReceived", notification);
                }
            };

            expenseSavedReceiver = new BroadcastReceiver() {
                @Override
                public void onReceive(Context context, Intent intent) {
                    android.util.Log.d("NotificationListenerPlugin", "=== EXPENSE_SAVED broadcast received ===");
                    
                    String packageName = intent.getStringExtra("package");
                    String title = intent.getStringExtra("title");
                    String text = intent.getStringExtra("text");
                    String category = intent.getStringExtra("category");
                    double amount = intent.getDoubleExtra("amount", 0.0);
                    String type = intent.getStringExtra("type");
                    long transactionTimestamp = intent.getLongExtra("transactionTimestamp", System.currentTimeMillis());
                    long notificationTimestamp = intent.getLongExtra("notificationTimestamp", System.currentTimeMillis());

                    android.util.Log.d("NotificationListenerPlugin", "Expense data: amount=" + amount + ", category=" + category + ", type=" + type);

                    JSObject expenseData = new JSObject();
                    expenseData.put("package", packageName);
                    expenseData.put("title", title);
                    expenseData.put("text", text);
                    expenseData.put("category", category);
                    expenseData.put("amount", amount);
                    expenseData.put("type", type);
                    expenseData.put("transactionTimestamp", transactionTimestamp);
                    expenseData.put("notificationTimestamp", notificationTimestamp);

                    android.util.Log.d("NotificationListenerPlugin", "Notifying listeners with expenseSaved event");
                    notifyListeners("expenseSaved", expenseData);
                }
            };

            IntentFilter filter = new IntentFilter(NotificationListener.NOTIFICATION_BROADCAST);
            LocalBroadcastManager.getInstance(getContext()).registerReceiver(notificationReceiver, filter);

            IntentFilter expenseFilter = new IntentFilter("com.moneymanager.app.EXPENSE_SAVED");
            LocalBroadcastManager.getInstance(getContext()).registerReceiver(expenseSavedReceiver, expenseFilter);

            isListening = true;
            
            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("message", "Started listening for notifications");
            call.resolve(ret);
        } catch (Exception e) {
            JSObject ret = new JSObject();
            ret.put("success", false);
            ret.put("error", e.getMessage());
            call.resolve(ret);
        }
    }
    
    @PluginMethod
    public void stopListening(PluginCall call) {
        if (notificationReceiver != null) {
            try {
                LocalBroadcastManager.getInstance(getContext()).unregisterReceiver(notificationReceiver);
                notificationReceiver = null;
            } catch (Exception e) {
                // Ignore
            }
        }
        if (expenseSavedReceiver != null) {
            try {
                LocalBroadcastManager.getInstance(getContext()).unregisterReceiver(expenseSavedReceiver);
                expenseSavedReceiver = null;
            } catch (Exception e) {
                // Ignore
            }
        }
        isListening = false;
        
        JSObject ret = new JSObject();
        ret.put("success", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        // Check if overlay permission is granted
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(getContext())) {
                // Request overlay permission first
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + getContext().getPackageName()));
                getActivity().startActivityForResult(intent, 1234);
            }
        }

        // Open notification listener settings
        Intent intent = new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);
        getActivity().startActivity(intent);

        JSObject ret = new JSObject();
        ret.put("opened", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void checkOverlayPermission(PluginCall call) {
        boolean hasPermission = true;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            hasPermission = Settings.canDrawOverlays(getContext());
        }
        JSObject ret = new JSObject();
        ret.put("granted", hasPermission);
        call.resolve(ret);
    }

    @PluginMethod
    public void requestOverlayPermission(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:" + getContext().getPackageName()));
            getActivity().startActivity(intent);
        }
        JSObject ret = new JSObject();
        ret.put("opened", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void testOverlay(PluginCall call) {
        // Test method to manually trigger an overlay popup
        try {
            Intent intent = new Intent(getContext(), OverlayService.class);
            intent.putExtra("title", "Test Notification");
            intent.putExtra("text", "This is a test popup! If you see this, the overlay is working correctly.");
            intent.putExtra("package", "com.test.app");
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                getContext().startForegroundService(intent);
            } else {
                getContext().startService(intent);
            }
            
            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("message", "Test overlay triggered");
            call.resolve(ret);
        } catch (Exception e) {
            JSObject ret = new JSObject();
            ret.put("success", false);
            ret.put("error", e.getMessage());
            call.resolve(ret);
        }
    }

    @PluginMethod
    public void setSelectedApps(PluginCall call) {
        JSArray appsArray = call.getArray("apps");
        if (appsArray != null) {
            try {
                String appsJson = appsArray.toString();
                getContext().getSharedPreferences("MoneyManager", Context.MODE_PRIVATE)
                    .edit()
                    .putString("selectedApps", appsJson)
                    .apply();
                JSObject ret = new JSObject();
                ret.put("success", true);
                call.resolve(ret);
            } catch (Exception e) {
                JSObject ret = new JSObject();
                ret.put("success", false);
                ret.put("error", e.getMessage());
                call.resolve(ret);
            }
        } else {
            JSObject ret = new JSObject();
            ret.put("success", false);
            ret.put("error", "No apps array provided");
            call.resolve(ret);
        }
    }

    @PluginMethod
    public void isServiceConnected(PluginCall call) {
        boolean connected = NotificationListener.isServiceConnected();
        JSObject ret = new JSObject();
        ret.put("connected", connected);
        call.resolve(ret);
    }

    @PluginMethod
    public void getPermissionStatus(PluginCall call) {
        boolean notificationAccess = isNotificationServiceEnabled();
        boolean overlayPermission = true;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            overlayPermission = Settings.canDrawOverlays(getContext());
        }

        JSObject ret = new JSObject();
        ret.put("notificationAccess", notificationAccess);
        ret.put("overlayPermission", overlayPermission);
        ret.put("allGranted", notificationAccess && overlayPermission);
        call.resolve(ret);
    }

    private boolean isNotificationServiceEnabled() {
        String pkgName = getContext().getPackageName();
        final String flat = Settings.Secure.getString(getContext().getContentResolver(),
                "enabled_notification_listeners");
        if (!TextUtils.isEmpty(flat)) {
            final String[] names = flat.split(":");
            for (String name : names) {
                final ComponentName cn = ComponentName.unflattenFromString(name);
                if (cn != null) {
                    if (TextUtils.equals(pkgName, cn.getPackageName())) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    @Override
    protected void handleOnDestroy() {
        if (notificationReceiver != null) {
            try {
                LocalBroadcastManager.getInstance(getContext()).unregisterReceiver(notificationReceiver);
            } catch (Exception e) {
                // Ignore
            }
        }
        if (expenseSavedReceiver != null) {
            try {
                LocalBroadcastManager.getInstance(getContext()).unregisterReceiver(expenseSavedReceiver);
            } catch (Exception e) {
                // Ignore
            }
        }
        super.handleOnDestroy();
    }
}
