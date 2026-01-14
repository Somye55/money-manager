Here is the step-by-step guide to integrating **Groq** into a React app.

Since your use case is **parsing receipt text**, I have tailored this code to specifically handle **Text-to-JSON** conversion using the best free model available: **Llama 3.3 70B Versatile**.

### ⚠️ Critical Security Warning
In a React app, your code runs in the user's browser. **Do not embed your API Key directly in the code for a production app.** Anyone can right-click -> "Inspect Element" and steal your key.
*   **For Development/Testing:** It is okay to use the method below.
*   **For Production:** You should call a backend server (Node.js/Next.js) which then calls Groq.

---

### Step 1: Get Your Groq API Key
1.  Go to [console.groq.com](https://console.groq.com).
2.  Login and create a new API Key.
3.  Copy the key (starts with `gsk_`).

### Step 2: Install the Groq SDK
Open your React project terminal and run:

```bash
npm install groq-sdk
```

### Step 3: Create the Parser Component
Create a new file `GroqParser.jsx`. This component will take text (simulating OCR output) and convert it into clean JSON.

```jsx
import React, { useState } from 'react';
import Groq from 'groq-sdk';

const GroqParser = () => {
  const [inputText, setInputText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Initialize Groq
  // NOTE: dangerouslyAllowBrowser is required for client-side React
  // In production, move this logic to a backend API to hide the key.
  const groq = new Groq({
    apiKey: "gsk_YOUR_API_KEY_HERE", // 🔴 REPLACE WITH YOUR KEY
    dangerouslyAllowBrowser: true 
  });

  const handleParse = async () => {
    if (!inputText) return;
    
    setLoading(true);
    setError('');
    setParsedData(null);

    try {
      // 2. Call the API
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are an expert financial parser. 
            Extract the following fields from the text: amount (number), merchant (string), type (debit/credit), category (string).
            
            RULES:
            1. If the text is NOT a transaction, return merchant: "INVALID".
            2. Ignore phone numbers and dates when looking for amount.
            3. Return JSON only.`
          },
          {
            role: "user",
            content: inputText,
          },
        ],
        // 3. Select the Model
        // "llama-3.3-70b-versatile" is the smartest free model for JSON parsing
        model: "llama-3.3-70b-versatile",
        
        // 4. Force JSON Mode (Crucial for your app)
        response_format: { type: "json_object" }, 
        
        temperature: 0.1, // Low temperature = more consistent results
      });

      // 5. Parse the result
      const jsonResponse = JSON.parse(completion.choices[0]?.message?.content || "{}");
      setParsedData(jsonResponse);

    } catch (err) {
      console.error(err);
      setError("Failed to parse text. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🧾 AI Receipt Parser</h2>
      
      <textarea
        rows="6"
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        placeholder="Paste OCR text here (e.g., 'Paid 500 to Starbucks...')"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <button 
        onClick={handleParse} 
        disabled={loading}
        style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        {loading ? 'Parsing...' : 'Extract Data'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {parsedData && (
        <div style={{ marginTop: '20px', background: '#f4f4f4', padding: '15px', borderRadius: '5px' }}>
          <h3>✅ Extracted Data:</h3>
          <pre>{JSON.stringify(parsedData, null, 2)}</pre>
          
          {/* Example of using the data programmatically */}
          <div style={{ marginTop: '10px', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
            <p><strong>Merchant:</strong> {parsedData.merchant}</p>
            <p><strong>Amount:</strong> ₹{parsedData.amount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroqParser;
```

### Step 4: Using Environment Variables (Better Security)
Even for local testing, don't hardcode the key string. Use a `.env` file.

1.  Create a file named `.env` in your project root.
2.  Add your key:
    ```
    REACT_APP_GROQ_API_KEY=gsk_xyz123...
    ```
    *(Note: If using Vite, name it `VITE_GROQ_API_KEY`)*
3.  Update the code:
    ```javascript
    const groq = new Groq({
      apiKey: process.env.REACT_APP_GROQ_API_KEY, 
      // Or import.meta.env.VITE_GROQ_API_KEY for Vite
      dangerouslyAllowBrowser: true 
    });
    ```

### Which Model is "Best"?
For your specific specific use case (Expense Parsing):

1.  **`llama-3.3-70b-versatile` (Recommended):**
    *   **Why:** It is large enough to understand context (e.g., ignoring phone numbers, understanding "Sent to" vs "Received from"). It follows JSON schemas perfectly.
    *   **Speed:** Fast (~0.5s - 1s).

2.  **`llama-3.1-8b-instant`:**
    *   **Why:** It is blazing fast (<0.3s).
    *   **Risk:** It might make mistakes on messy OCR text or fail to format JSON correctly 5% of the time. Use this only if speed is more important than 100% accuracy.

### Production Deployment (The Right Way)
When you deploy this app for real users:
1.  **Do not** use the code above directly.
2.  Create a simple API route (e.g., in Next.js `pages/api/parse.js` or a separate Node/Express server).
3.  Move the `const groq = new Groq(...)` logic there.
4.  Your React app should `fetch('/api/parse')`.
5.  This keeps your API key on the server, safe from hackers.