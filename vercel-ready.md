Here is the step-by-step guide to deploying your Node.js backend on Vercel for free, followed by the answer regarding Oracle Cloud.

---

### Part 1: How to Deploy a Node.js Backend on Vercel (Free)

Vercel is primarily for frontend, but it supports "Serverless Functions." To make your standard Express/Node backend work, you have to "wrap" it so Vercel can handle it.

**Prerequisites:**
*   A GitHub, GitLab, or Bitbucket account.
*   Your Node.js code pushed to a repository.

#### Step 1: Prepare your Main Entry File
Vercel is serverless. It does not keep a server running 24/7. Instead, it wakes up your app when a request comes in.

1.  Open your main entry file (usually `index.js` or `server.js`).
2.  **Remove** (or comment out) the `app.listen(...)` part at the bottom.
3.  **Export** the express app instead.

**Example `index.js`:**
```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.get('/api/users', (req, res) => {
  // Your logic here
  res.json({ user: "test" });
});

// OLD WAY (Don't do this for Vercel production):
// app.listen(3000, () => console.log('Server ready'));

// NEW WAY (Do this):
module.exports = app;
```

#### Step 2: Create a `vercel.json` file
Create a file named `vercel.json` in the **root** folder of your backend project. This tells Vercel to treat your entire app as a serverless function.

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```
*Note: If your main file is named `server.js`, change `index.js` to `server.js` in the code above.*

#### Step 3: Deployment
1.  **Push your code** to GitHub.
2.  Go to [Vercel.com](https://vercel.com) and sign up (using GitHub is easiest).
3.  Click **"Add New..."** -> **"Project"**.
4.  Import your backend repository.
5.  **Environment Variables:** If you use a `.env` file (for DB passwords, etc.), open the "Environment Variables" tab during import and add them there (e.g., `MONGO_URI`, `JWT_SECRET`).
6.  Click **Deploy**.

#### Step 4: Get your URL
Once finished, Vercel will give you a domain like: `https://your-project-name.vercel.app`.
Use this URL in your React/Capacitor app as your backend endpoint.

**Important Limitation:** Vercel has a **10-second timeout limit** on the free tier. If your API takes longer than 10 seconds to respond (e.g., heavy file uploads or complex database math), the request will fail. For standard apps, it is perfectly fine.

---
