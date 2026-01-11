const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// Gemini OCR Parser Endpoint (No auth required for mobile app)
const geminiParser = require("./services/geminiParser");

app.post("/api/ocr/parse", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        error: "Invalid request",
        message: "Text field is required",
      });
    }

    if (!geminiParser.isAvailable()) {
      return res.status(503).json({
        error: "Service unavailable",
        message: "Gemini API not configured",
      });
    }

    const result = await geminiParser.parseExpenseFromText(text);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("OCR Parse Error:", error);
    res.status(500).json({
      error: "Parsing failed",
      message: error.message,
    });
  }
});

// API Routes Placeholder
const authenticateUser = require("./middleware/auth");

// Existing Middleware
app.use(cors());
app.use(express.json());

// Sync User Middleware (Upsert User to local DB on auth)
const syncUserToDb = async (req, res, next) => {
  if (!req.user) return next();

  try {
    const { id, email, phone, user_metadata } = req.user;
    const name = user_metadata?.full_name || user_metadata?.name || "";

    // Upsert user
    const dbUser = await prisma.user.upsert({
      where: { googleId: id }, // Using supabase ID as googleId or we should have a supabaseId field. Let's use googleId for now as the unique ID from Auth provider
      update: { email, phone, name },
      create: {
        googleId: id,
        email,
        phone,
        name,
      },
    });

    req.dbUser = dbUser;
    next();
  } catch (error) {
    console.error("User Sync Error:", error);
    // Don't block request, but log it. Or block?
    // If user doesn't exist in DB, foreign keys will fail.
    return res.status(500).json({ error: "Failed to sync user profile" });
  }
};

// Protected Routes
app.use("/api", authenticateUser, syncUserToDb);

app.get("/api/expenses", async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: req.dbUser.id },
      orderBy: { date: "desc" },
      include: { category: true },
    });
    res.json(expenses);
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/expenses/sync", async (req, res) => {
  const { messages } = req.body; // Expecting array of SMS strings or objects
  if (!messages || !Array.isArray(messages))
    return res.status(400).json({ error: "Invalid messages format" });

  console.log(
    `Processing ${messages.length} SMS messages for user ${req.dbUser.id}`
  );

  let addedCount = 0;

  // Simple Parser (Can be moved to utility)
  const parseSms = (body) => {
    // Regex for Amount: Matches Rs. 500, INR 500, 500.00
    const amountRegex = /(?:Rs\.?|INR)\s*([\d,]+(?:\.\d{2})?)/i;
    const match = body.match(amountRegex);
    if (!match) return null;

    const amount = parseFloat(match[1].replace(/,/g, ""));
    if (isNaN(amount)) return null;

    // Merchant/Description Heuristic
    // Look for "at" or "to" followed by Uppercase words?
    // Or just use the whole body truncated?
    // Let's search for "debited" and take text after 'to' or 'at'
    let description = "Expense (SMS)";
    if (
      body.toLowerCase().includes("debited") ||
      body.toLowerCase().includes("spent")
    ) {
      const splitTo = body.split(/ to | at /i);
      if (splitTo.length > 1) {
        // Take the first 3 words after 'to'
        description = splitTo[1].split(" ").slice(0, 3).join(" ");
      }
    }

    return {
      amount,
      description: description.substring(0, 50),
      date: new Date(),
    };
  };

  try {
    for (const msg of messages) {
      // Check if already processed? (Requires SMS ID or hash. Skipping for MVP)
      const parsed = parseSms(msg.body || msg); // Handle if msg is object { address, body } or string

      if (parsed) {
        await prisma.expense.create({
          data: {
            amount: parsed.amount,
            description: parsed.description,
            date: new Date(msg.date || parsed.date), // Use SMS date if available
            userId: req.dbUser.id,
            source: "SMS",
            rawSmsBody: typeof msg === "string" ? msg : msg.body,
          },
        });
        addedCount++;
      }
    }
    res.json({ status: "success", synced: addedCount });
  } catch (error) {
    console.error("Sync Error:", error);
    res.status(500).json({ error: "Failed to sync expenses" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
