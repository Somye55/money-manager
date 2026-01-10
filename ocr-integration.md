

### The Architecture

1.  **Trigger:** A background listener detects when a new file is added to the "Screenshots" folder.
2.  **Action:** The app wakes up, grabs the latest image, and passes it to an OCR (Optical Character Recognition) engine.
3.  **Output:** You get raw text (e.g., "Paid to Zomato ₹450"), parse it, and show your popup.

---

### Step 1: The "Listener" (Crucial)

**Do not use the new Android 14 `ScreenCaptureCallback`.**
*Why?* That API only detects screenshots taken of *your own app*. It will not fire when the user takes a screenshot of Google Pay.

**Instead, use a `ContentObserver` on the MediaStore.**
You need to watch the system's image database for changes.

**The Permissions You Need:**
*   **Android 13+:** `READ_MEDIA_IMAGES`
*   **Android 10-12:** `READ_EXTERNAL_STORAGE`

**The Implementation Strategy:**
Since modern Android kills background services aggressively, you have two options.
*   **Option A (Battery Efficient):** Use `WorkManager` with a `ContentUriTrigger`. This wakes your app up efficiently when the image database changes.
*   **Option B (Instant):** Use a **Foreground Service** with a `ContentObserver`. This is better if you want that "instant" bubble to pop up within milliseconds.

**Code Concept (ContentObserver):**
```kotlin
// This monitors the external storage for changes (new photos)
val contentObserver = object : ContentObserver(Handler(Looper.getMainLooper())) {
    override fun onChange(selfChange: Boolean, uri: Uri?) {
        super.onChange(selfChange, uri)
        // 1. Check if the change is a "New Image"
        // 2. Query MediaStore to get the latest image path
        // 3. Check if path contains "Screenshots" (Ignore camera photos)
        val latestImage = getLatestScreenshot()
        if (latestImage != null) {
            processImageWithMLKit(latestImage)
        }
    }
}

// Register this in your Service
contentResolver.registerContentObserver(
    MediaStore.Images.Media.EXTERNAL_CONTENT_URI, 
    true, 
    contentObserver
)
```

### Step 2: The "Reader" (OCR)

Use **Google ML Kit (Text Recognition V2)**. It is free, runs entirely on-device (no server costs, privacy-compliant), and is very fast.

**Dependency:**
```gradle
implementation 'com.google.android.gms:play-services-mlkit-text-recognition:19.0.0'
```

**How to extract data:**
```kotlin
fun processImageWithMLKit(imageUri: Uri) {
    val image = InputImage.fromFilePath(context, imageUri)
    val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)

    recognizer.process(image)
        .addOnSuccessListener { visionText ->
            // visionText.text contains the raw string from the screenshot
            // Example: "Payment Successful\n₹ 1,200\nPaid to Starbucks"
            parseAndShowPopup(visionText.text)
        }
}
```

### Step 3: Handling Android 14 "Partial Access" (The Gotcha)

Android 14 introduced a "Select Photos" permission option.
*   **The Problem:** If the user chooses "Select Photos" (Partial Access) instead of "Allow All", your app **cannot read the new screenshot** automatically because the user hasn't "selected" it yet. The `ContentObserver` might fire, but you will get a permission error when trying to read the file.
*   **The Fix:**
    1.  Check if you have `READ_MEDIA_IMAGES` full access.
    2.  If you only have *Partial Access*, you cannot auto-read.
    3.  **Workaround:** When you detect a change but can't read the file, trigger a notification: *"New screenshot detected. Tap to parse."*
    4.  When they tap it, launch the **Photo Picker** or your app so they can grant permission for that specific image.

### Summary of the Flow

1.  **User** pays on GPay.
2.  **User** takes a screenshot.
3.  **Android System** saves the file to `/Pictures/Screenshots/`.
4.  **Your App** (Foreground Service) sees the `MediaStore` update.
5.  **Your App** checks: *Is this a screenshot?* (Path contains "Screenshot").
6.  **Your App** reads the bitmap and feeds it to **ML Kit**.
7.  **ML Kit** returns text: "Paid ₹500 to Uber".
8.  **Your App** runs Regex to extract `500` and `Uber`.
9.  **Your App** displays the "Categorize this Expense" popup over GPay.

