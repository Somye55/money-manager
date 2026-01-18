package com.moneymanager.app;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Rect;
import android.net.Uri;
import android.util.Log;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.Text;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.TextRecognizer;
import com.google.mlkit.vision.text.latin.TextRecognizerOptions;
import org.json.JSONObject;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
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
                // IMPROVED: Extract text blocks in proper order (top-to-bottom, left-to-right)
                String extractedText = extractTextFromBlocks(visionText);

                Log.d(TAG, "========================================");
                Log.d(TAG, "📸 OCR EXTRACTED TEXT (ORDERED BLOCKS):");
                Log.d(TAG, extractedText);
                Log.d(TAG, "========================================");

                if (extractedText == null || extractedText.trim().isEmpty()) {
                    Log.e(TAG, "❌ No text found in image");
                    callback.onFailure("No text found in image");
                    return;
                }

                // Enhance text with currency symbol detection
                String enhancedText = enhanceTextWithCurrencySymbols(extractedText);
                
                if (!enhancedText.equals(extractedText)) {
                    Log.d(TAG, "========================================");
                    Log.d(TAG, "✨ ENHANCED TEXT (with currency symbols):");
                    Log.d(TAG, enhancedText);
                    Log.d(TAG, "========================================");
                }

                // Send text to Groq server for parsing
                parseWithGroqServer(enhancedText, callback);
            })
            .addOnFailureListener(e -> {
                Log.e(TAG, "❌ OCR failed: " + e.getMessage());
                callback.onFailure("OCR processing failed: " + e.getMessage());
            });
    }

    /**
     * Extract text from ML Kit vision text blocks in proper reading order
     * This ensures text at the top of the image is read first
     * Fixes issue where amounts at the top were being missed
     */
    private String extractTextFromBlocks(com.google.mlkit.vision.text.Text visionText) {
        StringBuilder orderedText = new StringBuilder();
        
        // Get all text blocks (returns unmodifiable list, so we need to copy it)
        List<Text.TextBlock> originalBlocks = visionText.getTextBlocks();
        
        if (originalBlocks.isEmpty()) {
            // Fallback to simple getText()
            return visionText.getText();
        }
        
        // Create a mutable copy of the list so we can sort it
        List<Text.TextBlock> blocks = new java.util.ArrayList<>(originalBlocks);
        
        // Sort blocks by Y position (top to bottom), then X position (left to right)
        Collections.sort(blocks, (block1, block2) -> {
            Rect box1 = block1.getBoundingBox();
            Rect box2 = block2.getBoundingBox();
            
            if (box1 == null || box2 == null) return 0;
            
            // Compare Y positions (with tolerance for same line)
            int yDiff = box1.top - box2.top;
            if (Math.abs(yDiff) > 20) { // 20px tolerance for same line
                return yDiff;
            }
            
            // Same line, compare X positions
            return box1.left - box2.left;
        });
        
        // Build text from sorted blocks
        for (Text.TextBlock block : blocks) {
            String blockText = block.getText();
            if (blockText != null && !blockText.trim().isEmpty()) {
                orderedText.append(blockText).append("\n");
            }
        }
        
        String result = orderedText.toString().trim();
        Log.d(TAG, "✅ Extracted " + blocks.size() + " text blocks in reading order");
        
        return result;
    }

    /**
     * Enhance OCR text by adding currency symbols where they're likely missing
     * ML Kit sometimes misses ₹ symbol, so we add it back based on context
     * This significantly improves AI parser accuracy
     */
    private String enhanceTextWithCurrencySymbols(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }
        
        Log.d(TAG, "🔧 Enhancing text with currency symbols...");
        
        // Pattern 1: E-commerce/Food delivery action buttons
        // "Add item 245" -> "Add item ₹245"
        // "Buy now 1299" -> "Buy now ₹1299"
        text = text.replaceAll("(?i)(Add item|Add to cart|Add|Buy now|Order now|Item)\\s+(\\d+)", "$1 ₹$2");
        
        // Pattern 2: Payment keywords followed by numbers
        // "Total 245" -> "Total ₹245"
        // "Pay 500" -> "Pay ₹500"
        text = text.replaceAll("(?i)(Total|Price|Amount|Pay|Paid|Sent|Subtotal|Grand Total)\\s*:?\\s*(\\d+)", "$1 ₹$2");
        
        // Pattern 3: Numbers after "Rs" or "Rs." (with or without space)
        // "Rs245" -> "₹245"
        // "Rs. 245" -> "₹245"
        text = text.replaceAll("(?i)Rs\\.?\\s*(\\d+)", "₹$1");
        
        // Pattern 4: "INR" prefix
        // "INR 500" -> "₹500"
        text = text.replaceAll("(?i)INR\\s*(\\d+)", "₹$1");
        
        // Pattern 5: Standalone numbers on their own line (common in UPI apps)
        // Line with just "245" or "245.00" -> "₹245" or "₹245.00"
        // But only if it's 2-6 digits (to avoid transaction IDs)
        text = text.replaceAll("(?m)^\\s*(\\d{2,6}(?:\\.\\d{2})?)\\s*$", "₹$1");
        
        // Pattern 6: Numbers at end of lines after keywords
        // "Total\n245" -> "Total\n₹245"
        text = text.replaceAll("(?m)(Total|Price|Amount|Pay|Subtotal)\\s*\\n\\s*(\\d+)", "$1\n₹$2");
        
        // Pattern 7: Debited/Credited patterns
        // "Debited 500" -> "Debited ₹500"
        text = text.replaceAll("(?i)(Debited|Credited|Received|Refund)\\s+(\\d+)", "$1 ₹$2");
        
        return text;
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
     * Enhanced to handle food delivery and e-commerce scenarios
     * Version 2.0 - Improved reliability
     */
    private double extractAmountRobust(String rawText) {
        if (rawText == null || rawText.isEmpty()) {
            return 0.0;
        }
        
        Log.d(TAG, "🧠 Using robust smart parser v2.0...");
        
        // STEP 1: PRE-PROCESSING (Crucial - fixes phone number bug)
        // Remove Indian Phone Numbers - Matches +91 XXXXX XXXXX or 98765 43210
        String textWithoutPhones = rawText.replaceAll("(?i)(\\+91|0)?[\\-\\s]?[6-9]\\d{4}[\\-\\s]?\\d{5}", " ");
        Log.d(TAG, "✓ Removed phone numbers");
        
        // Remove Transaction IDs (Long numbers, usually 12+ digits)
        textWithoutPhones = textWithoutPhones.replaceAll("\\b\\d{12,}\\b", " ");
        Log.d(TAG, "✓ Removed transaction IDs");
        
        // Remove Dates (2020-2030) to prevent them being seen as amounts
        textWithoutPhones = textWithoutPhones.replaceAll("\\b202[0-9]\\b", " ");
        
        // Remove Account numbers (usually with A/c or Account)
        textWithoutPhones = textWithoutPhones.replaceAll("(?i)A/c\\s*\\d+", " ");
        textWithoutPhones = textWithoutPhones.replaceAll("(?i)Account\\s*\\d+", " ");
        
        // STEP 2: SPLIT BY LINES
        String[] lines = textWithoutPhones.split("\\n");
        
        // STEP 3: LOOK FOR CURRENCY SYMBOL (Highest Confidence - 95%)
        // Matches ₹ 100 or Rs. 100 or Rs 100 or INR 100
        // IMPROVED: Find ALL currency amounts and pick the largest one (handles "₹1 +Add item ₹245" correctly)
        Pattern currencyPattern = Pattern.compile("(?i)(?:₹|Rs\\.?|INR)\\s*([\\d,]+\\.?\\d{0,2})");
        
        double maxAmount = 0.0;
        for (String line : lines) {
            Matcher m = currencyPattern.matcher(line);
            while (m.find()) {
                double val = parseDoubleSafe(m.group(1));
                if (val > 0 && val < 1000000 && val > maxAmount) {
                    maxAmount = val;
                }
            }
        }
        
        if (maxAmount > 0) {
            Log.d(TAG, "✅ Found amount with currency symbol: ₹" + maxAmount + " (95% confidence)");
            return maxAmount;
        }
        
        // STEP 4: LOOK FOR E-COMMERCE/FOOD DELIVERY PATTERNS (High Confidence - 90%)
        // "Add item 245", "Add to cart 500", "Buy now 1299", "Order now 399"
        Pattern ecommercePattern = Pattern.compile("(?i)(?:Add item|Add to cart|Add|Buy now|Order now|Pay now)\\s*(?:₹|Rs\\.?)?\\s*([\\d,]+\\.?\\d{0,2})");
        for (String line : lines) {
            Matcher m = ecommercePattern.matcher(line);
            if (m.find()) {
                double val = parseDoubleSafe(m.group(1));
                if (val > 0 && val < 1000000) {
                    Log.d(TAG, "✅ Found amount in e-commerce pattern: ₹" + val + " (90% confidence)");
                    return val;
                }
            }
        }
        
        // STEP 5: LOOK FOR PAYMENT KEYWORDS (High Confidence - 85%)
        // "Paid 500", "Total 500", "Amount 500", "Sent 500"
        Pattern keywordPattern = Pattern.compile("(?i)(?:Paid|Sent|Total|Amount|Price|Subtotal|Grand Total|Pay|Debited|Credited)\\s*[:\\-]?\\s*(?:₹|Rs\\.?)?\\s*([\\d,]+\\.?\\d{0,2})");
        for (String line : lines) {
            Matcher m = keywordPattern.matcher(line);
            if (m.find()) {
                double val = parseDoubleSafe(m.group(1));
                if (val > 0 && val < 1000000) {
                    Log.d(TAG, "✅ Found amount with keyword: ₹" + val + " (85% confidence)");
                    return val;
                }
            }
        }
        
        // STEP 6: LOOK FOR "STANDALONE" NUMBERS (Medium Confidence - 70%)
        // UPI apps (GPay/PhonePe) usually put the amount on its own line, e.g., "1" or "500.00"
        // Also common in food delivery apps
        for (String line : lines) {
            String trimmed = line.trim();
            // Regex: Matches a number, optionally with commas and decimals
            // Excludes lines with letters (like "Bank of Baroda 2247")
            if (trimmed.matches("^[\\d,]+(\\.\\d{1,2})?$")) {
                double val = parseDoubleSafe(trimmed);
                // For UPI and food delivery, even '1' is valid
                // But filter out very large numbers (likely transaction IDs)
                if (val > 0 && val < 1000000) {
                    Log.d(TAG, "✅ Found standalone amount: ₹" + val + " (70% confidence)");
                    return val;
                }
            }
        }
        
        // STEP 7: LAST RESORT - Look for ANY number that looks like a price (Low Confidence - 50%)
        // Find all numbers in the text and pick the most likely one
        Pattern anyNumberPattern = Pattern.compile("\\b(\\d{1,6}(?:\\.\\d{2})?)\\b");
        double bestGuess = 0.0;
        
        for (String line : lines) {
            Matcher m = anyNumberPattern.matcher(line);
            while (m.find()) {
                double val = parseDoubleSafe(m.group(1));
                // Prefer numbers in typical price range (10-100000)
                if (val >= 10 && val <= 100000 && val > bestGuess) {
                    bestGuess = val;
                }
            }
        }
        
        if (bestGuess > 0) {
            Log.d(TAG, "⚠️ Best guess amount: ₹" + bestGuess + " (50% confidence - uncertain)");
            return bestGuess;
        }
        
        Log.d(TAG, "❌ No amount found by smart parser");
        return 0.0;
    }
    
    /**
     * ROBUST MERCHANT EXTRACTION v2.0
     * Handles multi-line names and various formats
     * Improved to handle food delivery and e-commerce scenarios
     */
    private String extractMerchantRobust(String rawText) {
        if (rawText == null || rawText.isEmpty()) {
            return "Unknown Merchant";
        }
        
        Log.d(TAG, "🧠 Extracting merchant with smart parser v2.0...");
        
        String[] lines = rawText.split("\\n");
        
        // Strategy 1: Look for "To" or "Paid to" (UPI apps)
        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim();
            String lowerLine = line.toLowerCase();
            
            if (lowerLine.startsWith("to") || lowerLine.startsWith("paid to") || lowerLine.contains("paid to")) {
                // If the line is just "To:", the name is on the NEXT line
                String cleanLine = line.replaceAll("(?i)(paid )?to[:\\s]*", "").trim();
                
                // Remove phone numbers from the name
                cleanLine = cleanLine.replaceAll("(?i)(\\+91|0)?[\\-\\s]?[6-9]\\d{4}[\\-\\s]?\\d{5}", "").trim();
                
                if (!cleanLine.isEmpty() && !cleanLine.contains("...") && cleanLine.length() > 2) {
                    Log.d(TAG, "✅ Found merchant after 'To': " + cleanLine);
                    return cleanLine;
                } else if (i + 1 < lines.length) {
                    String nextLine = lines[i + 1].trim();
                    // Remove phone numbers
                    nextLine = nextLine.replaceAll("(?i)(\\+91|0)?[\\-\\s]?[6-9]\\d{4}[\\-\\s]?\\d{5}", "").trim();
                    if (!nextLine.isEmpty() && nextLine.length() > 2) {
                        Log.d(TAG, "✅ Found merchant on next line: " + nextLine);
                        return nextLine;
                    }
                }
            }
        }
        
        // Strategy 2: Look for "Received from" (Credit transactions)
        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim();
            String lowerLine = line.toLowerCase();
            
            if (lowerLine.startsWith("received from") || lowerLine.contains("received from")) {
                String cleanLine = line.replaceAll("(?i)received from[:\\s]*", "").trim();
                cleanLine = cleanLine.replaceAll("(?i)(\\+91|0)?[\\-\\s]?[6-9]\\d{4}[\\-\\s]?\\d{5}", "").trim();
                
                if (!cleanLine.isEmpty() && cleanLine.length() > 2) {
                    Log.d(TAG, "✅ Found merchant after 'Received from': " + cleanLine);
                    return cleanLine;
                } else if (i + 1 < lines.length) {
                    String nextLine = lines[i + 1].trim();
                    nextLine = nextLine.replaceAll("(?i)(\\+91|0)?[\\-\\s]?[6-9]\\d{4}[\\-\\s]?\\d{5}", "").trim();
                    if (!nextLine.isEmpty() && nextLine.length() > 2) {
                        Log.d(TAG, "✅ Found merchant on next line: " + nextLine);
                        return nextLine;
                    }
                }
            }
        }
        
        // Strategy 3: Look for food items or product names (Food delivery/E-commerce)
        // Common patterns: "Chicken Biryani", "iPhone 15", "Nike Shoes"
        // Usually appears before "Add item" or price
        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim();
            String lowerLine = line.toLowerCase();
            
            // If next line has "Add item" or price, current line might be product name
            if (i + 1 < lines.length) {
                String nextLine = lines[i + 1].toLowerCase();
                if (nextLine.contains("add item") || nextLine.contains("add to cart") || 
                    nextLine.contains("buy now") || nextLine.matches(".*₹.*\\d+.*")) {
                    // Current line is likely the product/merchant name
                    if (line.length() >= 3 && line.length() <= 50 && 
                        !line.matches(".*\\d{10,}.*") && // Not a transaction ID
                        !line.matches(".*202[0-9].*")) { // Not a date
                        Log.d(TAG, "✅ Found merchant/product name: " + line);
                        return line;
                    }
                }
            }
        }
        
        // Strategy 4: Heuristic for GPay/PhonePe (Name is often in caps, 2nd or 3rd line)
        for (String line : lines) {
            String trimmed = line.trim();
            // Check if line is all uppercase letters (common for names in banking)
            if (trimmed.matches("[A-Z ]{3,}") && 
                !trimmed.contains("BANK") && 
                !trimmed.contains("UPI") &&
                !trimmed.contains("GOOGLE") &&
                !trimmed.contains("PHONEPE") &&
                !trimmed.contains("PAYTM") &&
                !trimmed.contains("PAY")) {
                Log.d(TAG, "✅ Found merchant by caps heuristic: " + trimmed);
                return trimmed;
            }
        }
        
        // Strategy 5: Look for brand names (Common merchants)
        String[] commonMerchants = {
            "Swiggy", "Zomato", "Uber", "Ola", "Amazon", "Flipkart", 
            "Myntra", "BigBasket", "Dunzo", "Blinkit", "Zepto",
            "Starbucks", "McDonald", "KFC", "Domino", "Pizza Hut"
        };
        
        for (String line : lines) {
            for (String merchant : commonMerchants) {
                if (line.toLowerCase().contains(merchant.toLowerCase())) {
                    Log.d(TAG, "✅ Found known merchant: " + merchant);
                    return merchant;
                }
            }
        }
        
        // Strategy 6: First meaningful line (at least 3 chars, not a number)
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.length() >= 3 && 
                !trimmed.matches("^\\d+$") && // Not just numbers
                !trimmed.matches(".*\\d{10,}.*") && // Not transaction ID
                !trimmed.toLowerCase().contains("payment") &&
                !trimmed.toLowerCase().contains("success")) {
                Log.d(TAG, "✅ Using first meaningful line as merchant: " + trimmed);
                return trimmed;
            }
        }
        
        Log.d(TAG, "⚠️ No merchant found, using default");
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
