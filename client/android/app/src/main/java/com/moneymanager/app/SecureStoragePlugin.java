package com.moneymanager.app;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.nio.charset.StandardCharsets;
import java.security.KeyStore;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

@CapacitorPlugin(name = "SecureStorage")
public class SecureStoragePlugin extends Plugin {
    private static final String TAG = "SecureStoragePlugin";
    private static final String KEY_ALIAS = "moneymanager_secure_storage_key";
    private static final String PREFS_NAME = "secure_storage_prefs";
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 128;

    @PluginMethod
    public void set(PluginCall call) {
        String key = call.getString("key");
        String value = call.getString("value");

        if (key == null || key.isEmpty()) {
            call.reject("Key is required");
            return;
        }

        if (value == null) {
            call.reject("Value is required");
            return;
        }

        try {
            String encryptedValue = encrypt(value);
            saveToPreferences(key, encryptedValue);

            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
            Log.d(TAG, "Successfully stored encrypted value for key: " + key);
        } catch (Exception e) {
            Log.e(TAG, "Error storing value: " + e.getMessage(), e);
            call.reject("Failed to store value: " + e.getMessage());
        }
    }

    @PluginMethod
    public void get(PluginCall call) {
        String key = call.getString("key");

        if (key == null || key.isEmpty()) {
            call.reject("Key is required");
            return;
        }

        try {
            String encryptedValue = getFromPreferences(key);
            
            if (encryptedValue == null) {
                JSObject ret = new JSObject();
                ret.put("value", (String) null);
                call.resolve(ret);
                return;
            }

            String decryptedValue = decrypt(encryptedValue);

            JSObject ret = new JSObject();
            ret.put("value", decryptedValue);
            call.resolve(ret);
            Log.d(TAG, "Successfully retrieved and decrypted value for key: " + key);
        } catch (Exception e) {
            Log.e(TAG, "Error retrieving value: " + e.getMessage(), e);
            call.reject("Failed to retrieve value: " + e.getMessage());
        }
    }

    @PluginMethod
    public void remove(PluginCall call) {
        String key = call.getString("key");

        if (key == null || key.isEmpty()) {
            call.reject("Key is required");
            return;
        }

        try {
            removeFromPreferences(key);

            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
            Log.d(TAG, "Successfully removed key: " + key);
        } catch (Exception e) {
            Log.e(TAG, "Error removing value: " + e.getMessage(), e);
            call.reject("Failed to remove value: " + e.getMessage());
        }
    }

    @PluginMethod
    public void setPlainPreference(PluginCall call) {
        String key = call.getString("key");
        String value = call.getString("value");

        if (key == null || key.isEmpty()) {
            call.reject("Key is required");
            return;
        }

        if (value == null) {
            call.reject("Value is required");
            return;
        }

        try {
            // Write to plain SharedPreferences (not encrypted)
            // This is used for settings that need to be read by Android services
            SharedPreferences prefs = getContext().getSharedPreferences("moneymanager_settings", Context.MODE_PRIVATE);
            
            // Try to parse as boolean
            if (value.equalsIgnoreCase("true") || value.equalsIgnoreCase("false")) {
                prefs.edit().putBoolean(key, Boolean.parseBoolean(value)).apply();
            } else {
                prefs.edit().putString(key, value).apply();
            }

            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
            Log.d(TAG, "Successfully stored plain preference for key: " + key);
        } catch (Exception e) {
            Log.e(TAG, "Error storing plain preference: " + e.getMessage(), e);
            call.reject("Failed to store plain preference: " + e.getMessage());
        }
    }

    private String encrypt(String plaintext) throws Exception {
        // Ensure encryption key exists
        ensureKeyExists();

        // Get the secret key from Android Keystore
        KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
        keyStore.load(null);
        SecretKey secretKey = (SecretKey) keyStore.getKey(KEY_ALIAS, null);

        // Initialize cipher for encryption
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);

        // Get the IV generated by the cipher
        byte[] iv = cipher.getIV();

        // Encrypt the plaintext
        byte[] ciphertext = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));

        // Combine IV and ciphertext: [IV (12 bytes)][Ciphertext]
        byte[] combined = new byte[iv.length + ciphertext.length];
        System.arraycopy(iv, 0, combined, 0, iv.length);
        System.arraycopy(ciphertext, 0, combined, iv.length, ciphertext.length);

        // Return Base64 encoded result
        return Base64.encodeToString(combined, Base64.NO_WRAP);
    }

    private String decrypt(String encryptedData) throws Exception {
        // Decode Base64
        byte[] combined = Base64.decode(encryptedData, Base64.NO_WRAP);

        // Extract IV and ciphertext
        byte[] iv = new byte[GCM_IV_LENGTH];
        byte[] ciphertext = new byte[combined.length - GCM_IV_LENGTH];
        System.arraycopy(combined, 0, iv, 0, GCM_IV_LENGTH);
        System.arraycopy(combined, GCM_IV_LENGTH, ciphertext, 0, ciphertext.length);

        // Get the secret key from Android Keystore
        KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
        keyStore.load(null);
        SecretKey secretKey = (SecretKey) keyStore.getKey(KEY_ALIAS, null);

        // Initialize cipher for decryption
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
        cipher.init(Cipher.DECRYPT_MODE, secretKey, spec);

        // Decrypt the ciphertext
        byte[] plaintext = cipher.doFinal(ciphertext);

        return new String(plaintext, StandardCharsets.UTF_8);
    }

    private void ensureKeyExists() throws Exception {
        KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
        keyStore.load(null);

        // Check if key already exists
        if (keyStore.containsAlias(KEY_ALIAS)) {
            Log.d(TAG, "Encryption key already exists");
            return;
        }

        // Generate new key
        Log.d(TAG, "Generating new encryption key");
        KeyGenerator keyGenerator = KeyGenerator.getInstance(
            KeyProperties.KEY_ALGORITHM_AES,
            "AndroidKeyStore"
        );

        KeyGenParameterSpec.Builder builder = new KeyGenParameterSpec.Builder(
            KEY_ALIAS,
            KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT
        )
        .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
        .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
        .setKeySize(256)
        .setUserAuthenticationRequired(false);

        // For Android M and above, set random IV requirement
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            builder.setRandomizedEncryptionRequired(true);
        }

        keyGenerator.init(builder.build());
        keyGenerator.generateKey();
        Log.d(TAG, "Encryption key generated successfully");
    }

    private void saveToPreferences(String key, String value) {
        SharedPreferences prefs = getContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().putString(key, value).apply();
    }

    private String getFromPreferences(String key) {
        SharedPreferences prefs = getContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        return prefs.getString(key, null);
    }

    private void removeFromPreferences(String key) {
        SharedPreferences prefs = getContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().remove(key).apply();
    }
}
