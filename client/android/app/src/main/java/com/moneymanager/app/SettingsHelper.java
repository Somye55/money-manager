package com.moneymanager.app;

import android.content.Intent;
import android.provider.Settings;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "SettingsHelper")
public class SettingsHelper extends Plugin {

    public SettingsHelper() {
        super();
        android.util.Log.d("SettingsHelper", "SettingsHelper plugin instantiated");
    }

    @Override
    public void load() {
        super.load();
        android.util.Log.d("SettingsHelper", "SettingsHelper plugin loaded");
    }

    @PluginMethod
    public void sendTestNotification(PluginCall call) {
        try {
            MainActivity activity = (MainActivity) getActivity();
            if (activity != null) {
                activity.sendTestNotification();
                
                JSObject ret = new JSObject();
                ret.put("success", true);
                ret.put("message", "Test notification sent");
                call.resolve(ret);
            } else {
                call.reject("Activity not available");
            }
        } catch (Exception e) {
            call.reject("Failed to send test notification: " + e.getMessage());
        }
    }

    @PluginMethod
    public void openNotificationSettings(PluginCall call) {
        try {
            Intent intent = new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);
            getActivity().startActivity(intent);
            
            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to open notification settings", e);
        }
    }

    @PluginMethod
    public void openOverlaySettings(PluginCall call) {
        try {
            Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
            getActivity().startActivity(intent);
            
            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to open overlay settings", e);
        }
    }
}
