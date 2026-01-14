
To scale to **Millions of users for $0**, you must run the extraction **Offline on the User's Phone**.

**Google ML Kit** has a specific library called **Entity Extraction** that works completely offline.

*   **Cost:** $0.00 (Forever).
*   **Limits:** Infinite.
*   **Speed:** Instant (No network call).
*   **Privacy:** Data never leaves the phone.

#### How to implement ML Kit Entity Extraction for Money

1.  **Add Dependency (`build.gradle`):**
    ```groovy
    implementation 'com.google.mlkit:entity-extraction:16.0.0-beta5'
    ```

2.  **Java Code (Replaces Gemini Logic):**

```java
EntityExtractor entityExtractor = EntityExtraction.getClient(
        new EntityExtractorOptions.Builder(EntityExtractorOptions.ENGLISH)
        .build());

public void parseWithLocalML(String text, OCRCallback callback) {
    // Download model if needed (happens once)
    entityExtractor.downloadModelIfNeeded().addOnSuccessListener(unused -> {
        
        EntityExtractionParams params = new EntityExtractionParams.Builder(text)
                .setEntityTypesFilter(new HashSet<>(Arrays.asList(
                        Entity.TYPE_MONEY, 
                        Entity.TYPE_DATE_TIME)))
                .build();

        entityExtractor.annotate(params).addOnSuccessListener(annotations -> {
            ExpenseData data = new ExpenseData();
            data.merchant = "Unknown (Edit Manually)"; // ML Kit isn't great at Merchants
            
            // Loop through found entities
            for (EntityAnnotation annotation : annotations) {
                List<Entity> entities = annotation.getEntities();
                for (Entity entity : entities) {
                    if (entity instanceof MoneyEntity) {
                        MoneyEntity money = (MoneyEntity) entity;
                        data.amount = money.getUnnormalizedCurrency().getAmount();
                    }
                }
            }
            
            // Simple logic for Type (Debit/Credit)
            String lowerText = text.toLowerCase();
            if (lowerText.contains("credited") || lowerText.contains("received")) {
                data.type = "credit";
            } else {
                data.type = "debit";
            }

            callback.onSuccess(data);
        });
    });
}
```
