package com.moneymanager.app;

import android.content.Context;
import android.graphics.Bitmap;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Log;
import com.google.android.gms.tasks.Task;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.Text;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.TextRecognizer;
import com.google.mlkit.vision.text.latin.TextRecognizerOptions;
import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class OCRProcessor {
    private static final String TAG = "OCRProcessor";
    private final Context context;
    private final TextRecognizer recognizer;

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
                Log.d(TAG, "OCR extracted text: " + extractedText);
                
                if (extractedText == null || extractedText.trim().isEmpty()) {
                    callback.onFailure("No text found in image");
                    return;
                }

                ExpenseData expenseData = parseExpenseData(extractedText);
                
                if (expenseData.amount > 0) {
                    callback.onSuccess(expenseData);
                } else {
                    callback.onFailure("Could not extract expense amount from screenshot");
                }
            })
            .addOnFailureListener(e -> {
                Log.e(TAG, "OCR failed: " + e.getMessage());
                callback.onFailure("OCR processing failed: " + e.getMessage());
            });
    }

    private ExpenseData parseExpenseData(String text) {
        ExpenseData data = new ExpenseData();
        data.rawText = text;

        // Parse amount
        data.amount = parseAmount(text);
        
        // Parse merchant
        data.merchant = parseMerchant(text);
        
        // Parse transaction type
        data.type = parseType(text);
        
        // Use current timestamp
        data.timestamp = System.currentTimeMillis();

        Log.d(TAG, "Parsed expense - Amount: " + data.amount + ", Merchant: " + data.merchant + ", Type: " + data.type);
        
        return data;
    }

    private double parseAmount(String text) {
        if (text == null) return 0.0;
        
        // Clean up text - remove extra spaces and normalize
        String cleanText = text.replaceAll("\\s+", " ");
        
        // Multiple patterns for Indian payment apps
        String[] patterns = {
            // Rupee symbol patterns (most common)
            "₹\\s*([0-9,]+\\.?[0-9]*)",           // ₹1,200.50 or ₹1200
            "Rs\\.?\\s*([0-9,]+\\.?[0-9]*)",      // Rs.1200 or Rs 1200
            "INR\\s*([0-9,]+\\.?[0-9]*)",         // INR 1200
            
            // Payment success patterns
            "(?:paid|sent|transferred)\\s*₹?\\s*Rs\\.?\\s*([0-9,]+\\.?[0-9]*)",
            "(?:amount|total)\\s*:?\\s*₹?\\s*Rs\\.?\\s*([0-9,]+\\.?[0-9]*)",
            
            // Debit/Credit patterns
            "(?:debited|credited)\\s*(?:with|by)?\\s*₹?\\s*Rs\\.?\\s*([0-9,]+\\.?[0-9]*)",
            
            // Generic number with currency
            "([0-9,]+\\.?[0-9]*)\\s*(?:rupees|rs|inr)",
            
            // Google Pay specific - amount before "To" or "From"
            "([0-9,]+\\.?[0-9]*)\\s*(?:To|From)",
            
            // Pattern for amounts in filenames or at start
            "^\\s*([0-9,]+\\.?[0-9]*)\\s*[-–]",   // Amount at start followed by dash
            
            // Standalone numbers (look for decimal amounts first)
            "\\b([0-9]{1,6}\\.[0-9]{2})\\b",      // 1200.50 (with exactly 2 decimals)
            "\\b([0-9]{1,6}\\.[0-9]{1})\\b",      // 1200.5 (with 1 decimal)
            "\\b([1-9][0-9]{0,5})\\b",            // 1 to 999999 (whole numbers only, avoid 0)
        };
        
        for (String patternStr : patterns) {
            Pattern pattern = Pattern.compile(patternStr, Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(cleanText);
            while (matcher.find()) {
                try {
                    String amountStr = matcher.group(1).replace(",", "").trim();
                    double amount = Double.parseDouble(amountStr);
                    // Filter out unrealistic amounts and common false positives
                    if (amount > 0 && amount < 1000000) {
                        // Skip if it looks like a phone number (10 digits)
                        if (amountStr.length() == 10 && !amountStr.contains(".")) {
                            continue;
                        }
                        // Skip if it looks like a transaction ID (very long number)
                        if (amountStr.length() > 8 && !amountStr.contains(".")) {
                            continue;
                        }
                        Log.d(TAG, "Amount parsed: " + amount + " using pattern: " + patternStr);
                        return amount;
                    }
                } catch (NumberFormatException e) {
                    Log.w(TAG, "Error parsing amount: " + e.getMessage());
                }
            }
        }
        
        Log.w(TAG, "Could not parse amount from text");
        return 0.0;
    }

    private String parseMerchant(String text) {
        if (text == null) return "Unknown";
        
        String lowerText = text.toLowerCase();
        
        // Common payment app patterns
        String[] patterns = {
            "(?:paid to|sent to|transferred to)\\s+([A-Za-z0-9\\s&.-]+?)(?:\\s|$|\\n)",
            "(?:merchant|payee|recipient)\\s*:?\\s*([A-Za-z0-9\\s&.-]+?)(?:\\s|$|\\n)",
            "(?:at|@)\\s+([A-Za-z0-9\\s&.-]+?)(?:\\s|$|\\n)",
        };
        
        for (String patternStr : patterns) {
            Pattern pattern = Pattern.compile(patternStr, Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(text);
            if (matcher.find()) {
                String merchant = matcher.group(1).trim();
                if (!merchant.isEmpty() && merchant.length() > 2) {
                    Log.d(TAG, "Merchant parsed: " + merchant);
                    return merchant;
                }
            }
        }
        
        // Check for common merchant names
        String[] knownMerchants = {
            "zomato", "swiggy", "uber", "ola", "amazon", "flipkart", 
            "myntra", "bigbasket", "dunzo", "grofers", "blinkit",
            "starbucks", "mcdonald", "domino", "pizza hut", "kfc",
            "bookmyshow", "paytm", "phonepe", "gpay", "google pay"
        };
        
        for (String merchant : knownMerchants) {
            if (lowerText.contains(merchant)) {
                Log.d(TAG, "Known merchant found: " + merchant);
                return capitalizeWords(merchant);
            }
        }
        
        return "Payment";
    }

    private String parseType(String text) {
        if (text == null) return "debit";
        
        String lowerText = text.toLowerCase();
        
        // Check for credit indicators
        if (lowerText.contains("credited") || 
            lowerText.contains("received") || 
            lowerText.contains("refund") ||
            lowerText.contains("cashback")) {
            return "credit";
        }
        
        // Check for debit indicators
        if (lowerText.contains("debited") || 
            lowerText.contains("paid") || 
            lowerText.contains("sent") ||
            lowerText.contains("transferred") ||
            lowerText.contains("payment successful")) {
            return "debit";
        }
        
        return "debit"; // Default to debit
    }

    private String capitalizeWords(String str) {
        if (str == null || str.isEmpty()) return str;
        
        String[] words = str.split("\\s+");
        StringBuilder result = new StringBuilder();
        
        for (String word : words) {
            if (!word.isEmpty()) {
                result.append(Character.toUpperCase(word.charAt(0)))
                      .append(word.substring(1).toLowerCase())
                      .append(" ");
            }
        }
        
        return result.toString().trim();
    }

    public void close() {
        if (recognizer != null) {
            recognizer.close();
        }
    }
}
