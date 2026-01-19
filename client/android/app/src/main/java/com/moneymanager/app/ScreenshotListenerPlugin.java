package com.moneymanager.app;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;
import androidx.core.content.ContextCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;

@CapacitorPlugin(
    name = "ScreenshotListener",
    permissions = {
        @Permission(strings = {Manifest.permission.READ_MEDIA_IMAGES}, alias = "readMediaImages"),
        @Permission(strings = {Manifest.permission.READ_EXTERNAL_STORAGE}, alias = "readExternalStorage")
    }
)
public class ScreenshotListenerPlugin extends Plugin {
    private static final String TAG = "ScreenshotListenerPlugin";

    @PluginMethod
    public void startListener(PluginCall call) {
        Log.d(TAG, "startListener called");
        
        try {
            Intent intent = new Intent(getContext(), ScreenshotListenerService.class);
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                getContext().startForegroundService(intent);
            } else {
                getContext().startService(intent);
            }
            
            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("message", "Screenshot listener started");
            call.resolve(ret);
        } catch (Exception e) {
            Log.e(TAG, "Error starting listener: " + e.getMessage());
            call.reject("Failed to start screenshot listener: " + e.getMessage());
        }
    }

    @PluginMethod
    public void stopListener(PluginCall call) {
        Log.d(TAG, "stopListener called");
        
        try {
            Intent intent = new Intent(getContext(), ScreenshotListenerService.class);
            getContext().stopService(intent);
            
            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("message", "Screenshot listener stopped");
            call.resolve(ret);
        } catch (Exception e) {
            Log.e(TAG, "Error stopping listener: " + e.getMessage());
            call.reject("Failed to stop screenshot listener: " + e.getMessage());
        }
    }

    @PluginMethod
    public void checkPermissions(PluginCall call) {
        Log.d(TAG, "checkPermissions called");
        
        JSObject ret = new JSObject();
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            boolean hasPermission = ContextCompat.checkSelfPermission(
                getContext(), 
                Manifest.permission.READ_MEDIA_IMAGES
            ) == PackageManager.PERMISSION_GRANTED;
            
            ret.put("granted", hasPermission);
            ret.put("permission", "READ_MEDIA_IMAGES");
        } else {
            boolean hasPermission = ContextCompat.checkSelfPermission(
                getContext(), 
                Manifest.permission.READ_EXTERNAL_STORAGE
            ) == PackageManager.PERMISSION_GRANTED;
            
            ret.put("granted", hasPermission);
            ret.put("permission", "READ_EXTERNAL_STORAGE");
        }
        
        call.resolve(ret);
    }

    @PluginMethod
    public void requestPermissions(PluginCall call) {
        Log.d(TAG, "requestPermissions called");
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.READ_MEDIA_IMAGES)
                    != PackageManager.PERMISSION_GRANTED) {
                requestPermissionForAlias("readMediaImages", call, "permissionCallback");
            } else {
                JSObject ret = new JSObject();
                ret.put("granted", true);
                call.resolve(ret);
            }
        } else {
            if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.READ_EXTERNAL_STORAGE)
                    != PackageManager.PERMISSION_GRANTED) {
                requestPermissionForAlias("readExternalStorage", call, "permissionCallback");
            } else {
                JSObject ret = new JSObject();
                ret.put("granted", true);
                call.resolve(ret);
            }
        }
    }
    
    @PluginMethod
    public void setScreenshotMonitoring(PluginCall call) {
        Log.d(TAG, "setScreenshotMonitoring called");
        
        boolean enabled = call.getBoolean("enabled", false);
        
        try {
            android.content.SharedPreferences prefs = getContext().getSharedPreferences("app_settings", android.content.Context.MODE_PRIVATE);
            prefs.edit().putBoolean("screenshot_monitoring_enabled", enabled).apply();
            
            Log.d(TAG, "Screenshot monitoring set to: " + enabled);
            
            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("enabled", enabled);
            call.resolve(ret);
        } catch (Exception e) {
            Log.e(TAG, "Error setting screenshot monitoring: " + e.getMessage());
            call.reject("Failed to set screenshot monitoring: " + e.getMessage());
        }
    }
    
    @PluginMethod
    public void getScreenshotMonitoring(PluginCall call) {
        Log.d(TAG, "getScreenshotMonitoring called");
        
        try {
            android.content.SharedPreferences prefs = getContext().getSharedPreferences("app_settings", android.content.Context.MODE_PRIVATE);
            boolean enabled = prefs.getBoolean("screenshot_monitoring_enabled", false);
            
            JSObject ret = new JSObject();
            ret.put("enabled", enabled);
            call.resolve(ret);
        } catch (Exception e) {
            Log.e(TAG, "Error getting screenshot monitoring: " + e.getMessage());
            call.reject("Failed to get screenshot monitoring: " + e.getMessage());
        }
    }
}
