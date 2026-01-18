# ☁️ Cloud OCR Solution (Professional Grade)

## Alternative: Use Cloud-Based OCR APIs

If the on-device OCR continues to have issues, you can use professional cloud OCR services.

## Option 1: Google Cloud Vision API (Recommended)

### Why Google Cloud Vision?

- ✅ **99%+ accuracy** for financial documents
- ✅ Handles receipts, invoices, payment screenshots perfectly
- ✅ Detects currency symbols reliably
- ✅ Fast (200-400ms including network)
- ✅ Free tier: 1,000 requests/month
- ✅ Easy integration with existing Google services

### Pricing

- Free: First 1,000 requests/month
- After: $1.50 per 1,000 requests
- For 100 users doing 10 OCR/day = 30,000/month = $45/month

### Implementation

#### Step 1: Enable Cloud Vision API

1. Go to: https://console.cloud.google.com/
2. Enable "Cloud Vision API"
3. Create API key or use service account

#### Step 2: Add to Server (Recommended Approach)

**Why server-side?**

- Keeps API key secure
- Can cache results
- Can add rate limiting
- Easier to switch OCR providers

Edit `server/package.json`:

```json
{
  "dependencies": {
    "@google-cloud/vision": "^4.0.0"
  }
}
```

Install:

```bash
cd server
npm install @google-cloud/vision
```

#### Step 3: Create Vision OCR Service

Create `server/src/services/visionOCR.js`:

```javascript
const vision = require("@google-cloud/vision");

class VisionOCRService {
  constructor() {
    // Option A: Use API key
    this.client = new vision.ImageAnnotatorClient({
      apiKey: process.env.GOOGLE_CLOUD_API_KEY,
    });

    // Option B: Use service account (more secure)
    // this.client = new vision.ImageAnnotatorClient({
    //   keyFilename: './google-cloud-key.json'
    // });
  }

  async extractTextFromImage(imageBase64) {
    try {
      const request = {
        image: {
          content: imageBase64,
        },
        features: [
          {
            type: "TEXT_DETECTION",
            maxResults: 1,
          },
        ],
      };

      const [result] = await this.client.annotateImage(request);
      const detections = result.textAnnotations;

      if (!detections || detections.length === 0) {
        return { text: "", confidence: 0 };
      }

      // First annotation contains full text
      const fullText = detections[0].description;
      const confidence = detections[0].confidence || 0.95;

      console.log(
        "✅ Cloud Vision extracted text:",
        fullText.substring(0, 100)
      );
      console.log(`   Confidence: ${(confidence * 100).toFixed(1)}%`);

      return {
        text: fullText,
        confidence: confidence,
      };
    } catch (error) {
      console.error("❌ Cloud Vision error:", error.message);
      throw error;
    }
  }

  async extractTextFromUrl(imageUrl) {
    try {
      const [result] = await this.client.textDetection(imageUrl);
      const detections = result.textAnnotations;

      if (!detections || detections.length === 0) {
        return { text: "", confidence: 0 };
      }

      return {
        text: detections[0].description,
        confidence: detections[0].confidence || 0.95,
      };
    } catch (error) {
      console.error("❌ Cloud Vision error:", error.message);
      throw error;
    }
  }
}

module.exports = new VisionOCRService();
```

#### Step 4: Add OCR Endpoint

Edit `server/src/index.js`:

```javascript
const visionOCR = require("./services/visionOCR");
const groqParser = require("./services/groqParser");

// New endpoint: OCR from image
app.post("/api/ocr/extract", async (req, res) => {
  try {
    const { image } = req.body; // Base64 encoded image

    if (!image) {
      return res.status(400).json({ error: "Image required" });
    }

    // Extract text using Cloud Vision
    const { text, confidence } = await visionOCR.extractTextFromImage(image);

    if (!text) {
      return res.status(400).json({ error: "No text found in image" });
    }

    // Parse with Groq
    const parsed = await groqParser.parseExpenseFromText(text);

    res.json({
      success: true,
      data: {
        ...parsed,
        rawText: text,
        ocrConfidence: confidence,
      },
    });
  } catch (error) {
    console.error("OCR Extract Error:", error);
    res.status(500).json({ error: error.message });
  }
});
```

#### Step 5: Update Android to Send Image

Modify `OCRProcessor.java`:

```java
private void processWithCloudVision(Bitmap bitmap, OCRCallback callback) {
    Log.d(TAG, "☁️ Using Cloud Vision API...");

    executorService.execute(() -> {
        try {
            // Convert bitmap to base64
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            bitmap.compress(Bitmap.CompressFormat.JPEG, 90, baos);
            byte[] imageBytes = baos.toByteArray();
            String base64Image = Base64.encodeToString(imageBytes, Base64.NO_WRAP);

            // Send to server
            URL url = new URL(SERVER_URL + "/api/ocr/extract");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);
            conn.setConnectTimeout(15000);
            conn.setReadTimeout(15000);

            // Create request
            JSONObject payload = new JSONObject();
            payload.put("image", base64Image);

            // Send request
            OutputStream os = conn.getOutputStream();
            os.write(payload.toString().getBytes(StandardCharsets.UTF_8));
            os.close();

            int responseCode = conn.getResponseCode();

            if (responseCode == HttpURLConnection.HTTP_OK) {
                Scanner scanner = new Scanner(conn.getInputStream(), StandardCharsets.UTF_8.name());
                String response = scanner.useDelimiter("\\A").next();
                scanner.close();

                JSONObject jsonResponse = new JSONObject(response);

                if (jsonResponse.optBoolean("success", false)) {
                    JSONObject data = jsonResponse.getJSONObject("data");

                    ExpenseData expenseData = new ExpenseData();
                    expenseData.amount = data.optDouble("amount", 0.0);
                    expenseData.merchant = data.optString("merchant", "Unknown");
                    expenseData.type = data.optString("type", "debit");
                    expenseData.rawText = data.optString("rawText", "");
                    expenseData.timestamp = System.currentTimeMillis();

                    Log.d(TAG, "✅ Cloud Vision + Groq parsed successfully");
                    callback.onSuccess(expenseData);
                } else {
                    callback.onFailure("Cloud OCR failed");
                }
            } else {
                Log.e(TAG, "❌ Server error: " + responseCode);
                callback.onFailure("Server error: " + responseCode);
            }

            conn.disconnect();

        } catch (Exception e) {
            Log.e(TAG, "❌ Cloud Vision error: " + e.getMessage());
            callback.onFailure("Cloud OCR failed: " + e.getMessage());
        }
    });
}
```

Add import:

```java
import android.util.Base64;
import java.io.ByteArrayOutputStream;
```

## Option 2: Azure Computer Vision

Similar to Google Cloud Vision but from Microsoft.

### Pricing

- Free: 5,000 requests/month
- After: $1.00 per 1,000 requests

### Implementation

```javascript
const {
  ComputerVisionClient,
} = require("@azure/cognitiveservices-computervision");
const { ApiKeyCredentials } = require("@azure/ms-rest-js");

class AzureOCRService {
  constructor() {
    const key = process.env.AZURE_VISION_KEY;
    const endpoint = process.env.AZURE_VISION_ENDPOINT;

    this.client = new ComputerVisionClient(
      new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": key } }),
      endpoint
    );
  }

  async extractText(imageBuffer) {
    const result = await this.client.recognizePrintedTextInStream(
      true,
      imageBuffer
    );

    let text = "";
    for (const region of result.regions) {
      for (const line of region.lines) {
        for (const word of line.words) {
          text += word.text + " ";
        }
        text += "\n";
      }
    }

    return text.trim();
  }
}
```

## Option 3: AWS Textract

Best for receipts and invoices.

### Pricing

- Free: 1,000 pages/month for first 3 months
- After: $1.50 per 1,000 pages

### Implementation

```javascript
const AWS = require("aws-sdk");

class TextractService {
  constructor() {
    this.textract = new AWS.Textract({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });
  }

  async extractText(imageBuffer) {
    const params = {
      Document: {
        Bytes: imageBuffer,
      },
    };

    const result = await this.textract.detectDocumentText(params).promise();

    let text = "";
    for (const block of result.Blocks) {
      if (block.BlockType === "LINE") {
        text += block.Text + "\n";
      }
    }

    return text.trim();
  }
}
```

## Comparison

| Service               | Accuracy | Speed     | Free Tier      | Cost After | Best For    |
| --------------------- | -------- | --------- | -------------- | ---------- | ----------- |
| Google Cloud Vision   | 99%      | Fast      | 1,000/mo       | $1.50/1k   | General OCR |
| Azure Computer Vision | 98%      | Fast      | 5,000/mo       | $1.00/1k   | High volume |
| AWS Textract          | 99%      | Medium    | 1,000/mo (3mo) | $1.50/1k   | Receipts    |
| ML Kit (On-device)    | 85%      | Very Fast | Unlimited      | Free       | Privacy     |
| Tesseract (On-device) | 95%      | Medium    | Unlimited      | Free       | Offline     |

## Recommendation

### For Your Use Case (Payment Screenshots):

**Best Option: Google Cloud Vision**

- Highest accuracy for financial documents
- Good free tier
- Easy integration
- Already using Google services

**Implementation Strategy:**

1. ✅ Use improved ML Kit (already done) as primary
2. ✅ Add Cloud Vision as fallback when ML Kit confidence is low
3. ✅ Keep Groq for parsing (it's working well)

### Hybrid Approach (Best of All Worlds)

```java
public void processImage(Bitmap bitmap, OCRCallback callback) {
    // Try ML Kit first (fast, free, offline)
    processWithMLKit(bitmap, new OCRCallback() {
        @Override
        public void onSuccess(ExpenseData data) {
            // Check if result looks good
            if (data.amount > 0 && !data.merchant.equals("Unknown")) {
                callback.onSuccess(data);
            } else {
                // Fallback to Cloud Vision
                Log.d(TAG, "ML Kit result uncertain, trying Cloud Vision...");
                processWithCloudVision(bitmap, callback);
            }
        }

        @Override
        public void onFailure(String error) {
            // Fallback to Cloud Vision
            Log.d(TAG, "ML Kit failed, trying Cloud Vision...");
            processWithCloudVision(bitmap, callback);
        }
    });
}
```

## Setup Instructions

### 1. Get Google Cloud API Key

```bash
# Go to Google Cloud Console
https://console.cloud.google.com/

# Enable Cloud Vision API
# Create API key
# Copy key to .env
```

### 2. Add to Server

```bash
cd server
npm install @google-cloud/vision
```

Edit `server/.env`:

```
GOOGLE_CLOUD_API_KEY=your_api_key_here
```

### 3. Test

```bash
# Start server
npm start

# Test endpoint
curl -X POST http://localhost:3000/api/ocr/extract \
  -H "Content-Type: application/json" \
  -d '{"image": "base64_encoded_image_here"}'
```

### 4. Update Android

Add Base64 import and implement `processWithCloudVision()` method.

## Cost Estimation

### Scenario: 100 active users

- 10 OCR requests per user per day
- 30 days per month
- Total: 100 × 10 × 30 = 30,000 requests/month

**Costs:**

- Google Cloud Vision: $43.50/month (after 1,000 free)
- Azure: $25/month (after 5,000 free)
- ML Kit: $0 (unlimited)

**Recommendation:** Start with ML Kit improvements, add Cloud Vision only if needed.

---

**Next Steps:**

1. Test improved ML Kit (already implemented)
2. If accuracy is still < 90%, add Cloud Vision
3. Monitor costs and accuracy
4. Optimize based on results
