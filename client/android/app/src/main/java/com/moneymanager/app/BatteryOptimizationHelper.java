package com.moneymanager.app;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import android.provider.Settings;
import android.util.Log;

public class BatteryOptimizationHelper {
    private static final String TAG = "BatteryOptimization";

    public static boolean isIgnoringBatteryOptimizations(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
            if (pm != null) {
                return pm.isIgnoringBatteryOptimizations(context.getPackageName());
            }
        }
        return true; // Assume true for older versions
    }

    @SuppressLint("BatteryLife")
    public static void requestIgnoreBatteryOptimizations(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!isIgnoringBatteryOptimizations(context)) {
                try {
                    Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                    intent.setData(Uri.parse("package:" + context.getPackageName()));
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    context.startActivity(intent);
                    Log.d(TAG, "Requested battery optimization exemption");
                } catch (Exception e) {
                    Log.e(TAG, "Error requesting battery optimization exemption: " + e.getMessage());
                    // Fallback to general battery optimization settings
                    try {
                        Intent intent = new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        context.startActivity(intent);
                        Log.d(TAG, "Opened general battery optimization settings");
                    } catch (Exception e2) {
                        Log.e(TAG, "Error opening battery optimization settings: " + e2.getMessage());
                    }
                }
            } else {
                Log.d(TAG, "App is already ignoring battery optimizations");
            }
        }
    }

    public static void checkAndRequestBatteryOptimization(Context context) {
        if (!isIgnoringBatteryOptimizations(context)) {
            Log.d(TAG, "App is subject to battery optimization - requesting exemption");
            requestIgnoreBatteryOptimizations(context);
        } else {
            Log.d(TAG, "App is exempt from battery optimization");
        }
    }
}