package com.moneymanager.app;

import android.content.Context;
import android.graphics.Bitmap;
import android.net.Uri;
import android.util.Log;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.TextRecognizer;
import com.google.mlkit.vision.text.latin.TextRecognizerOptions;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class OCRProcessor {
    private static final String TAG = "OCRProcessor";
    private final Context context;
    private final TextRecognizer recognizer;
    private final ExecutorService executorService;
    
    // Production Gemini API configuration
    private static final String GEMINI_API_KEY = BuildConfig.GEMINI_API_KEY;
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/	gemini-2.5-flash-lite:generateContent";

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

                // Use Gemini API only (no local fallback)
                parseWithGemini(extractedText, new GeminiCallback() {
                    @Override
                    public void onSuccess(ExpenseData expenseData) {
                        Log.d(TAG, "✅ Gemini parsing successful");
                        expenseData.rawText = extractedText;
                        callback.onSuccess(expenseData);
                    }

                    @Override
                    public void onFailure(String error) {
                        Log.e(TAG, "❌ Gemini parsing failed: " + error);
                        callback.onFailure("Could not parse expense: " + error);
                    }
                });
            })
            .addOnFailureListener(e -> {
                Log.e(TAG, "OCR failed: " + e.getMessage());
                callback.onFailure("OCR processing failed: " + e.getMessage());
            });
    }

    private interface GeminiCallback {
        void onSuccess(ExpenseData expenseData);
        void onFailure(String error);
    }

    private void parseWithGemini(String text, GeminiCallback callback) {
        Log.d(TAG, "🤖 Calling Gemini API directly...");
        
        executorService.execute(() -> {
            HttpURLConnection conn = null;
            try {
                // Construct Gemini API URL with API key
                URL url = new URL(GEMINI_API_URL + "?key=" + GEMINI_API_KEY);
                Log.d(TAG, "Connecting to Gemini API...");
                
                conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);
                conn.setConnectTimeout(15000); // 15 second timeout for API call
                conn.setReadTimeout(15000);

                // Create Gemini API request payload
                String prompt = createGeminiPrompt(text);
                JSONObject payload = createGeminiPayload(prompt);

                // Send request
                OutputStream os = conn.getOutputStream();
                os.write(payload.toString().getBytes(StandardCharsets.UTF_8));
                os.close();
                
                Log.d(TAG, "Request sent, waiting for Gemini response...");

                int responseCode = conn.getResponseCode();
                Log.d(TAG, "Response code: " + responseCode);
                
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    Scanner scanner = new Scanner(conn.getInputStream(), StandardCharsets.UTF_8.name());
                    String response = scanner.useDelimiter("\\A").next();
                    scanner.close();
                    
                    Log.d(TAG, "Gemini response received");

                    // Parse Gemini API response
                    ExpenseData expenseData = parseGeminiResponse(response);
                    
                    if (expenseData != null) {
                        Log.d(TAG, "✅ Gemini parsed - Amount: " + expenseData.amount + 
                              ", Merchant: " + expenseData.merchant + 
                              ", Type: " + expenseData.type);
                        callback.onSuccess(expenseData);
                    } else {
                        Log.e(TAG, "Failed to parse Gemini response");
                        callback.onFailure("Failed to parse expense data");
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
                    Log.e(TAG, "Gemini API error " + responseCode + ": " + errorBody);
                    callback.onFailure("API error: " + responseCode);
                }
                
            } catch (java.net.SocketTimeoutException e) {
                Log.e(TAG, "❌ Connection timeout: Gemini API took too long to respond");
                callback.onFailure("Connection timeout");
            } catch (Exception e) {
                Log.e(TAG, "❌ Gemini API call failed: " + e.getClass().getSimpleName() + ": " + e.getMessage());
                e.printStackTrace();
                callback.onFailure(e.getMessage());
            } finally {
                if (conn != null) {
                    conn.disconnect();
                }
            }
        });
    }

private String createGeminiPrompt(String ocrText) {
    return "You are an intelligent financial data parser. You will receive OCR text from either a digital payment screenshot (Google Pay, PhonePe, Paytm) OR a physical receipt (Cafe, Hotel, Shop).\n\n" +
           "Your task: Extract structured data into JSON.\n\n" +
           "CRITICAL RULES FOR AMOUNT DETECTION:\n" +
           "1. IGNORE Phone Numbers: Never pick a number starting with +91 or a 10-digit number like '9758134039' as the amount.\n" +
           "2. IGNORE Transaction IDs: Never pick long strings of numbers (12+ digits).\n" +
           "3. IF SCREENSHOT (UPI/GPay/PhonePe): The amount is often a standalone number (e.g., '1', '150') appearing EARLY in the text. It might be on its own line. It usually lacks the '₹' symbol in OCR. \n" +
           "4. IF PHYSICAL RECEIPT: Look for keywords 'Total', 'Grand Total', 'Net Amount' at the BOTTOM. The amount is usually the largest number associated with these words.\n\n" +
           "CRITICAL RULES FOR TRANSACTION TYPE:\n" +
           "1. 'Received from', 'Credited to' -> CREDIT\n" +
           "2. 'Paid to', 'Sent to', 'Bill Total', 'Purchase' -> DEBIT\n" +
           "3. If unclear, default to DEBIT.\n\n" +
           "OCR Text to Parse:\n" +
           "\"\"\"\n" +
           ocrText + "\n" +
           "\"\"\"\n\n" +
           "Respond ONLY with this JSON structure (no markdown, no other text):\n" +
           "{\n" +
           "  \"amount\": <number>,\n" +
           "  \"merchant\": \"<string_name_of_person_or_shop>\",\n" +
           "  \"type\": \"<debit|credit>\",\n" +
           "  \"category\": \"<food|shopping|travel|bills|transfer|other>\",\n" +
           "  \"confidence\": <number_0_to_100>\n" +
           "}";
}

    private JSONObject createGeminiPayload(String prompt) throws Exception {
        JSONObject payload = new JSONObject();
        
        // Create contents array
        JSONArray contents = new JSONArray();
        JSONObject content = new JSONObject();
        
        JSONArray parts = new JSONArray();
        JSONObject part = new JSONObject();
        part.put("text", prompt);
        parts.put(part);
        
        content.put("parts", parts);
        contents.put(content);
        
        payload.put("contents", contents);
        
        // Add generation config for better JSON responses
        JSONObject generationConfig = new JSONObject();
        generationConfig.put("temperature", 0.1);
        generationConfig.put("topK", 1);
        generationConfig.put("topP", 1);
        generationConfig.put("maxOutputTokens", 256);
        payload.put("generationConfig", generationConfig);
        
        return payload;
    }

    private ExpenseData parseGeminiResponse(String response) {
        try {
            JSONObject jsonResponse = new JSONObject(response);
            
            // Navigate through Gemini API response structure
            JSONArray candidates = jsonResponse.getJSONArray("candidates");
            if (candidates.length() == 0) {
                Log.e(TAG, "No candidates in Gemini response");
                return null;
            }
            
            JSONObject candidate = candidates.getJSONObject(0);
            JSONObject content = candidate.getJSONObject("content");
            JSONArray parts = content.getJSONArray("parts");
            
            if (parts.length() == 0) {
                Log.e(TAG, "No parts in Gemini response");
                return null;
            }
            
            String text = parts.getJSONObject(0).getString("text");
            Log.d(TAG, "Gemini generated text: " + text);
            
            // Clean up response - remove markdown code blocks if present
            String cleanText = text.trim();
            if (cleanText.startsWith("```json")) {
                cleanText = cleanText.replace("```json", "").replace("```", "").trim();
            } else if (cleanText.startsWith("```")) {
                cleanText = cleanText.replace("```", "").trim();
            }
            
            // Parse the expense data JSON
            JSONObject expenseJson = new JSONObject(cleanText);
            
            ExpenseData expenseData = new ExpenseData();
            expenseData.amount = expenseJson.optDouble("amount", 0.0);
            expenseData.merchant = expenseJson.optString("merchant", "Unknown");
            expenseData.type = expenseJson.optString("type", "debit");
            expenseData.timestamp = System.currentTimeMillis();
            
            // Validate the data
            if (expenseData.amount <= 0) {
                Log.w(TAG, "Warning: Amount is 0 or negative");
            }
            
            return expenseData;
            
        } catch (Exception e) {
            Log.e(TAG, "Error parsing Gemini response: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
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
