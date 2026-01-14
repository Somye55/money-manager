package com.moneymanager.app;

import android.content.Context;
import android.graphics.Bitmap;
import android.net.Uri;
import android.util.Log;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.TextRecognizer;
import com.google.mlkit.vision.text.latin.TextRecognizerOptions;
import org.json.JSONObject;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class OCRProcessor {
    private static final String TAG = "OCRProcessor";
    private final Context context;
    private final TextRecognizer recognizer;
    private final ExecutorService executorService;
    
    // Server URL for Groq AI parsing
    private static final String SERVER_URL = BuildConfig.SERVER_URL;

    public interface OCRCallback {
        void onSuccess(ExpenseData expenseData);
        void onFailure(String error);
    }

    public static class ExpenseData {
        public double amount;
        public String merchant;
        public String type; // "debit" or "credit"
        public long timestamp;
        public String rawText;

        public ExpenseData() {
            this.amount = 0.0;
            this.merchant = "Unknown";
            this.type = "debit";
            this.timestamp = System.currentTimeMillis();
            this.rawText = "";
        }
    }

    public OCRProcessor(Context context) {
        this.context = context;
        this.recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS);
        this.executorService = Executors.newSingleThreadExecutor();
        
        Log.d(TAG, "🚀 OCRProcessor initialized with Groq AI parsing");
        Log.d(TAG, "Server URL: " + SERVER_URL);
    }

    public void processImage(Uri imageUri, OCRCallback callback) {
        try {
            InputImage image = InputImage.fromFilePath(context, imageUri);
            processInputImage(image, callback);
        } catch (IOException e) {
            Log.e(TAG, "Error loading image: " + e.getMessage());
            callback.onFailure("Failed to load image: " + e.getMessage());
        }
    }

    public void processImage(Bitmap bitmap, OCRCallback callback) {
        try {
            InputImage image = InputImage.fromBitmap(bitmap, 0);
            processInputImage(image, callback);
        } catch (Exception e) {
            Log.e(TAG, "Error processing bitmap: " + e.getMessage());
            callback.onFailure("Failed to process image: " + e.getMessage());
        }
    }
    

    private void processInputImage(InputImage image, OCRCallback callback) {
        recognizer.process(image)
            .addOnSuccessListener(visionText -> {
                String extractedText = visionText.getText();

                Log.d(TAG, "========================================");
                Log.d(TAG, "OCR EXTRACTED TEXT:");
                Log.d(TAG, extractedText);
                Log.d(TAG, "========================================");

                if (extractedText == null || extractedText.trim().isEmpty()) {
                    callback.onFailure("No text found in image");
                    return;
                }

                // Send text to Groq server for parsing
                parseWithGroqServer(extractedText, callback);
            })
            .addOnFailureListener(e -> {
                Log.e(TAG, "OCR failed: " + e.getMessage());
                callback.onFailure("OCR processing failed: " + e.getMessage());
            });
    }

    /**
     * Parse extracted text using Groq AI server
     * Sends text to Express server which calls Groq API
     */
    private void parseWithGroqServer(String text, OCRCallback callback) {
        Log.d(TAG, "🤖 Calling Groq server for AI parsing...");
        
        executorService.execute(() -> {
            HttpURLConnection conn = null;
            try {
                // Construct server URL
                URL url = new URL(SERVER_URL + "/api/ocr/parse");
                Log.d(TAG, "Connecting to: " + url);
                
                conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);
                conn.setConnectTimeout(10000); // 10 second timeout
                conn.setReadTimeout(10000);

                // Create request payload
                JSONObject payload = new JSONObject();
                payload.put("text", text);

                // Send request
                OutputStream os = conn.getOutputStream();
                os.write(payload.toString().getBytes(StandardCharsets.UTF_8));
                os.close();
                
                Log.d(TAG, "Request sent, waiting for Groq response...");

                int responseCode = conn.getResponseCode();
                Log.d(TAG, "Response code: " + responseCode);
                
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    Scanner scanner = new Scanner(conn.getInputStream(), StandardCharsets.UTF_8.name());
                    String response = scanner.useDelimiter("\\A").next();
                    scanner.close();
                    
                    Log.d(TAG, "✅ Groq server response received");

                    // Parse server response
                    ExpenseData expenseData = parseGroqServerResponse(response, text);
                    
                    if (expenseData != null) {
                        Log.d(TAG, "✅ Groq parsed - Amount: " + expenseData.amount + 
                              ", Merchant: " + expenseData.merchant + 
                              ", Type: " + expenseData.type);
                        callback.onSuccess(expenseData);
                    } else {
                        Log.e(TAG, "Failed to parse Groq response");
                        // Fallback to local parsing
                        ExpenseData fallbackData = parseWithLocalFallback(text);
                        callback.onSuccess(fallbackData);
                    }
                } else {
                    // Try to read error response
                    String errorBody = "";
                    try {
                        Scanner scanner = new Scanner(conn.getErrorStream(), StandardCharsets.UTF_8.name());
                        errorBody = scanner.useDelimiter("\\A").next();
                        scanner.close();
                    } catch (Exception e) {
                        // Ignore
                    }
                    Log.e(TAG, "❌ Server error " + responseCode + ": " + errorBody);
                    
                    // Fallback to local parsing
                    Log.d(TAG, "Falling back to local parsing...");
                    ExpenseData fallbackData = parseWithLocalFallback(text);
                    callback.onSuccess(fallbackData);
                }
                
            } catch (java.net.SocketTimeoutException e) {
                Log.e(TAG, "❌ Connection timeout: Server took too long to respond");
                // Fallback to local parsing
                ExpenseData fallbackData = parseWithLocalFallback(text);
                callback.onSuccess(fallbackData);
            } catch (Exception e) {
                Log.e(TAG, "❌ Server call failed: " + e.getClass().getSimpleName() + ": " + e.getMessage());
                e.printStackTrace();
                // Fallback to local parsing
                ExpenseData fallbackData = parseWithLocalFallback(text);
                callback.onSuccess(fallbackData);
            } finally {
                if (conn != null) {
                    conn.disconnect();
                }
            }
        });
    }

    /**
     * Parse Groq server response
     */
    private ExpenseData parseGroqServerResponse(String response, String originalText) {
        try {
            JSONObject jsonResponse = new JSONObject(response);
            
            if (!jsonResponse.optBoolean("success", false)) {
                Log.e(TAG, "Server returned success=false");
                return null;
            }
            
            JSONObject data = jsonResponse.getJSONObject("data");
            
            ExpenseData expenseData = new ExpenseData();
            expenseData.amount = data.optDouble("amount", 0.0);
            expenseData.merchant = data.optString("merchant", "Unknown");
            expenseData.type = data.optString("type", "debit");
            expenseData.rawText = originalText;
            expenseData.timestamp = System.currentTimeMillis();
            
            // Validate the data
            if (expenseData.amount <= 0) {
                Log.w(TAG, "Warning: Amount is 0 or negative");
            }
            
            return expenseData;
            
        } catch (Exception e) {
            Log.e(TAG, "Error parsing server response: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Local fallback parser when server is unavailable
     * Uses simple regex-based parsing
     */
    private ExpenseData parseWithLocalFallback(String text) {
        Log.d(TAG, "🔧 Using local fallback parser");
        
        ExpenseData data = new ExpenseData();
        data.rawText = text;
        data.amount = extractAmountRobust(text);
        data.merchant = extractMerchantRobust(text);
        data.type = determineTransactionType(text);
        
        Log.d(TAG, "✅ Local fallback - Amount: " + data.amount + 
              ", Merchant: " + data.merchant + 
              ", Type: " + data.type);
        
        return data;
    }
    
    /**
     * ROBUST SMART PARSER - Handles phone number splits and standalone amounts
     * Based on heuristic approach from robust-ocr.md
     */
    private double extractAmountRobust(String rawText) {
        if (rawText == null || rawText.isEmpty()) {
            return 0.0;
        }
        
        Log.d(TAG, "🧠 Using robust smart parser...");
        
        // STEP 1: PRE-PROCESSING (Crucial - fixes phone number bug)
        // Remove Indian Phone Numbers - Matches +91 XXXXX XXXXX or 98765 43210
        String textWithoutPhones = rawText.replaceAll("(?i)(\\+91|0)?[\\-\\s]?[6-9]\\d{4}[\\-\\s]?\\d{5}", " ");
        Log.d(TAG, "Removed phone numbers from text");
        
        // Remove Transaction IDs (Long numbers, usually 12+ digits)
        textWithoutPhones = textWithoutPhones.replaceAll("\\b\\d{12,}\\b", " ");
        
        // Remove Dates (2020-2030) to prevent them being seen as amounts
        textWithoutPhones = textWithoutPhones.replaceAll("\\b202[0-9]\\b", " ");
        
        // STEP 2: SPLIT BY LINES
        String[] lines = textWithoutPhones.split("\\n");
        
        // STEP 3: LOOK FOR CURRENCY SYMBOL (Highest Confidence)
        // Matches ₹ 100 or Rs. 100 or Rs 100
        Pattern currencyPattern = Pattern.compile("(?i)(?:₹|Rs\\.?|INR)\\s*([\\d,]+\\.?\\d{0,2})");
        
        for (String line : lines) {
            Matcher m = currencyPattern.matcher(line);
            if (m.find()) {
                double val = parseDoubleSafe(m.group(1));
                if (val > 0) {
                    Log.d(TAG, "Found amount with currency symbol: " + val);
                    return val;
                }
            }
        }
        
        // STEP 4: LOOK FOR "STANDALONE" NUMBERS (The UPI Logic)
        // UPI apps (GPay/PhonePe) usually put the amount on its own line, e.g., "1" or "500.00"
        for (String line : lines) {
            String trimmed = line.trim();
            // Regex: Matches a number, optionally with commas and decimals
            // Excludes lines with letters (like "Bank of Baroda 2247")
            if (trimmed.matches("^[\\d,]+(\\.\\d{1,2})?$")) {
                double val = parseDoubleSafe(trimmed);
                // For UPI, even '1' is valid
                if (val > 0) {
                    Log.d(TAG, "Found standalone amount: " + val);
                    return val;
                }
            }
        }
        
        // STEP 5: FALLBACK - LOOK FOR KEYWORDS
        // "Paid 500", "Total 500"
        Pattern keywordPattern = Pattern.compile("(?i)(?:Paid|Sent|Total|Amount)\\s*[:\\-]?\\s*([\\d,]+\\.?\\d{0,2})");
        for (String line : lines) {
            Matcher m = keywordPattern.matcher(line);
            if (m.find()) {
                double val = parseDoubleSafe(m.group(1));
                if (val > 0) {
                    Log.d(TAG, "Found amount with keyword: " + val);
                    return val;
                }
            }
        }
        
        Log.d(TAG, "No amount found by smart parser");
        return 0.0;
    }
    
    /**
     * ROBUST MERCHANT EXTRACTION
     * Handles multi-line names and various formats
     */
    private String extractMerchantRobust(String rawText) {
        if (rawText == null || rawText.isEmpty()) {
            return "Unknown Merchant";
        }
        
        Log.d(TAG, "🧠 Extracting merchant with smart parser...");
        
        String[] lines = rawText.split("\\n");
        
        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim();
            String lowerLine = line.toLowerCase();
            
            // Strategy 1: Look for "To" or "Paid to"
            if (lowerLine.startsWith("to") || lowerLine.startsWith("paid to")) {
                // If the line is just "To:", the name is on the NEXT line
                String cleanLine = line.replaceAll("(?i)(paid )?to[:\\s]*", "").trim();
                
                // Remove phone numbers from the name
                cleanLine = cleanLine.replaceAll("(?i)(\\+91|0)?[\\-\\s]?[6-9]\\d{4}[\\-\\s]?\\d{5}", "").trim();
                
                if (!cleanLine.isEmpty() && !cleanLine.contains("...") && cleanLine.length() > 2) {
                    Log.d(TAG, "Found merchant after 'To': " + cleanLine);
                    return cleanLine;
                } else if (i + 1 < lines.length) {
                    String nextLine = lines[i + 1].trim();
                    // Remove phone numbers
                    nextLine = nextLine.replaceAll("(?i)(\\+91|0)?[\\-\\s]?[6-9]\\d{4}[\\-\\s]?\\d{5}", "").trim();
                    if (!nextLine.isEmpty()) {
                        Log.d(TAG, "Found merchant on next line: " + nextLine);
                        return nextLine;
                    }
                }
            }
            
            // Strategy 2: Look for "Received from"
            if (lowerLine.startsWith("received from")) {
                String cleanLine = line.replaceAll("(?i)received from[:\\s]*", "").trim();
                cleanLine = cleanLine.replaceAll("(?i)(\\+91|0)?[\\-\\s]?[6-9]\\d{4}[\\-\\s]?\\d{5}", "").trim();
                
                if (!cleanLine.isEmpty() && cleanLine.length() > 2) {
                    Log.d(TAG, "Found merchant after 'Received from': " + cleanLine);
                    return cleanLine;
                } else if (i + 1 < lines.length) {
                    String nextLine = lines[i + 1].trim();
                    nextLine = nextLine.replaceAll("(?i)(\\+91|0)?[\\-\\s]?[6-9]\\d{4}[\\-\\s]?\\d{5}", "").trim();
                    if (!nextLine.isEmpty()) {
                        Log.d(TAG, "Found merchant on next line: " + nextLine);
                        return nextLine;
                    }
                }
            }
        }
        
        // Strategy 3: Heuristic for GPay (Name is often in caps, 2nd or 3rd line)
        for (String line : lines) {
            String trimmed = line.trim();
            // Check if line is all uppercase letters (common for names in banking)
            if (trimmed.matches("[A-Z ]{3,}") && 
                !trimmed.contains("BANK") && 
                !trimmed.contains("UPI") &&
                !trimmed.contains("GOOGLE") &&
                !trimmed.contains("PAY")) {
                Log.d(TAG, "Found merchant by caps heuristic: " + trimmed);
                return trimmed;
            }
        }
        
        Log.d(TAG, "No merchant found, using default");
        return "Unknown Merchant";
    }
    
    /**
     * Helper to parse double safely, handling commas
     */
    private double parseDoubleSafe(String value) {
        try {
            return Double.parseDouble(value.replace(",", ""));
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }
    
    private String determineTransactionType(String text) {
        String lowerText = text.toLowerCase();
        
        // Credit indicators
        if (lowerText.contains("credited") || 
            lowerText.contains("received") ||
            lowerText.contains("refund") ||
            lowerText.contains("cashback")) {
            return "credit";
        }
        
        // Debit indicators (default)
        if (lowerText.contains("debited") ||
            lowerText.contains("paid") ||
            lowerText.contains("sent") ||
            lowerText.contains("payment successful")) {
            return "debit";
        }
        
        // Default to debit
        return "debit";
    }

    public void close() {
        if (recognizer != null) {
            recognizer.close();
        }
        if (executorService != null) {
            executorService.shutdown();
        }
    }
}
