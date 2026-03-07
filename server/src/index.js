const express = require("express");
const cors = require("cors");
const prisma = require("./lib/prisma");
const { initializeAchievements } = require('./services/achievementService');

// Initialize achievements on startup (run once)
initializeAchievements().catch(console.error);

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// Groq OCR Parser Endpoint (No auth required for mobile app)
const groqParser = require("./services/groqParser");

app.post("/api/ocr/parse", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        error: "Invalid request",
        message: "Text field is required",
      });
    }

    if (!groqParser.isAvailable()) {
      return res.status(503).json({
        error: "Service unavailable",
        message: "Groq API not configured",
      });
    }

    const result = await groqParser.parseExpenseFromText(text);

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

// Helper function to calculate savings from data
function calculateSavingsFromData(categories, expenses) {
  // Initialize category breakdown map
  const categoryMap = new Map();

  // Initialize all categories with budgets
  categories.forEach((category) => {
    categoryMap.set(category.id, {
      categoryId: category.id,
      categoryName: category.name,
      categoryIcon: category.icon || "Wallet",
      categoryColor: category.color || "#6366f1",
      budgetAmount: parseFloat(category.budget),
      spentAmount: 0,
      savedAmount: 0,
      savingsPercentage: 0,
    });
  });

  // Aggregate expenses by category
  expenses.forEach((expense) => {
    if (expense.categoryId && categoryMap.has(expense.categoryId)) {
      const categoryData = categoryMap.get(expense.categoryId);
      categoryData.spentAmount += parseFloat(expense.amount);
    }
  });

  // Calculate savings for each category
  let totalSavings = 0;
  const categoryBreakdown = [];

  categoryMap.forEach((categoryData) => {
    // Calculate savings as (budget - spent)
    const savedAmount = categoryData.budgetAmount - categoryData.spentAmount;
    categoryData.savedAmount = savedAmount;

    // Calculate savings percentage
    if (categoryData.budgetAmount > 0) {
      categoryData.savingsPercentage =
        (savedAmount / categoryData.budgetAmount) * 100;
    }

    // Add to total savings (including negative values for overspending)
    totalSavings += savedAmount;

    categoryBreakdown.push(categoryData);
  });

  return {
    totalSavings: parseFloat(totalSavings.toFixed(2)),
    categoryBreakdown,
  };
}

// Savings Calculation Endpoint
app.get("/api/savings/calculate", async (req, res) => {
  try {
    const { interval = "month", startDate, endDate } = req.query;
    const userId = req.dbUser.id;

    // Validate interval
    const validIntervals = ["day", "week", "month", "quarter", "year"];
    if (!validIntervals.includes(interval)) {
      return res.status(400).json({
        error: "Invalid interval",
        message: "Interval must be one of: day, week, month, quarter, year",
      });
    }

    // Calculate date range based on interval if not provided
    let queryStartDate, queryEndDate;
    if (startDate && endDate) {
      queryStartDate = new Date(startDate);
      queryEndDate = new Date(endDate);
    } else {
      // Default to current period based on interval
      const now = new Date();
      queryEndDate = now;

      switch (interval) {
        case "day":
          queryStartDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          queryStartDate = new Date(now);
          queryStartDate.setDate(now.getDate() - now.getDay());
          queryStartDate.setHours(0, 0, 0, 0);
          break;
        case "month":
          queryStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "quarter":
          const quarter = Math.floor(now.getMonth() / 3);
          queryStartDate = new Date(now.getFullYear(), quarter * 3, 1);
          break;
        case "year":
          queryStartDate = new Date(now.getFullYear(), 0, 1);
          break;
      }
    }

    // Validate date range
    if (queryStartDate > queryEndDate) {
      return res.status(400).json({
        error: "Invalid date range",
        message: "Start date must be before end date",
      });
    }

    // Fetch categories with budgets for the user
    const categories = await prisma.category.findMany({
      where: {
        userId,
        budget: { not: null },
      },
    });

    // Fetch expenses within the date range
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        date: {
          gte: queryStartDate,
          lte: queryEndDate,
        },
      },
      include: {
        category: true,
      },
    });

    // Calculate savings
    const savingsData = calculateSavingsFromData(categories, expenses);

    res.json(savingsData);
  } catch (error) {
    console.error("Savings Calculation Error:", error);
    res.status(500).json({
      error: "Failed to calculate savings",
      message: error.message,
    });
  }
});

// Notification Endpoints

// Create a new notification
app.post("/api/savings/notifications", async (req, res) => {
  try {
    const userId = req.dbUser.id;
    const { type, title, message, data } = req.body;

    // Validate required fields
    if (!type || !title || !message) {
      return res.status(400).json({
        error: "Invalid request",
        message: "type, title, and message are required",
      });
    }

    // Validate notification type
    const validTypes = [
      "DAILY_SUMMARY",
      "WEEKLY_SUMMARY",
      "MILESTONE",
      "STREAK",
      "CHALLENGE_COMPLETE",
      "CHALLENGE_FAILED",
      "BUDGET_WARNING_75",
      "BUDGET_WARNING_90",
      "BUDGET_EXCEEDED",
      "JAR_GOAL_REACHED",
    ];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: "Invalid notification type",
        message: `Type must be one of: ${validTypes.join(", ")}`,
      });
    }

    // Check user notification preferences
    const userSettings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    // If notifications are disabled, don't create the notification
    if (userSettings && !userSettings.enableNotifications) {
      return res.status(200).json({
        success: false,
        message: "Notifications are disabled for this user",
      });
    }

    // Create the notification
    const notification = await prisma.savingsNotification.create({
      data: {
        userId,
        type,
        title,
        message,
        data: data || null,
        sentAt: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error("Notification Creation Error:", error);
    res.status(500).json({
      error: "Failed to create notification",
      message: error.message,
    });
  }
});

// Get notifications for the authenticated user
app.get("/api/savings/notifications", async (req, res) => {
  try {
    const userId = req.dbUser.id;
    const { isRead, type, limit = 50, offset = 0 } = req.query;

    // Build where clause
    const where = { userId };

    // Filter by read status if provided
    if (isRead !== undefined) {
      where.isRead = isRead === "true";
    }

    // Filter by type if provided
    if (type) {
      where.type = type;
    }

    // Fetch notifications
    const notifications = await prisma.savingsNotification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    // Get total count for pagination
    const totalCount = await prisma.savingsNotification.count({ where });

    res.json({
      success: true,
      data: notifications,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + notifications.length < totalCount,
      },
    });
  } catch (error) {
    console.error("Notification Fetch Error:", error);
    res.status(500).json({
      error: "Failed to fetch notifications",
      message: error.message,
    });
  }
});

// Mark notification as read
app.patch("/api/savings/notifications/:id/read", async (req, res) => {
  try {
    const userId = req.dbUser.id;
    const notificationId = parseInt(req.params.id);

    // Verify notification belongs to user
    const notification = await prisma.savingsNotification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      return res.status(404).json({
        error: "Notification not found",
        message: "Notification does not exist or does not belong to this user",
      });
    }

    // Update notification
    const updatedNotification = await prisma.savingsNotification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    res.json({
      success: true,
      data: updatedNotification,
    });
  } catch (error) {
    console.error("Notification Update Error:", error);
    res.status(500).json({
      error: "Failed to update notification",
      message: error.message,
    });
  }
});

// Mark all notifications as read
app.patch("/api/savings/notifications/read-all", async (req, res) => {
  try {
    const userId = req.dbUser.id;

    // Update all unread notifications for the user
    const result = await prisma.savingsNotification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    res.json({
      success: true,
      message: `Marked ${result.count} notifications as read`,
      count: result.count,
    });
  } catch (error) {
    console.error("Notification Update Error:", error);
    res.status(500).json({
      error: "Failed to update notifications",
      message: error.message,
    });
  }
});

// Achievement Endpoints

// Get achievements for the authenticated user
app.get("/api/savings/achievements", async (req, res) => {
  try {
    const userId = req.dbUser.id;
    const { type } = req.query;

    // Build where clause for user achievements
    const where = { userId };

    // Fetch user's earned achievements with full achievement details
    const userAchievementsQuery = {
      where,
      include: {
        achievement: true,
      },
      orderBy: { earnedAt: "desc" },
    };

    // Filter by achievement type if provided
    if (type) {
      const validTypes = ["MILESTONE", "STREAK", "CHALLENGE", "CATEGORY"];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          error: "Invalid achievement type",
          message: `Type must be one of: ${validTypes.join(", ")}`,
        });
      }
      userAchievementsQuery.where.achievement = { type };
    }

    const userAchievements = await prisma.userAchievement.findMany(
      userAchievementsQuery,
    );

    // Calculate progress toward next milestone
    // Get all milestone achievements ordered by threshold
    const milestoneAchievements = await prisma.achievement.findMany({
      where: { type: "MILESTONE" },
      orderBy: { threshold: "asc" },
    });

    // Calculate total savings for the user
    const categories = await prisma.category.findMany({
      where: {
        userId,
        budget: { not: null },
      },
    });

    const expenses = await prisma.expense.findMany({
      where: { userId },
    });

    const savingsData = calculateSavingsFromData(categories, expenses);
    const totalSavings = Math.max(0, savingsData.totalSavings); // Only count positive savings

    // Find next milestone
    let nextMilestone = null;
    let progressToNext = 0;

    for (const milestone of milestoneAchievements) {
      const hasEarned = userAchievements.some(
        (ua) => ua.achievementId === milestone.id,
      );
      if (!hasEarned) {
        nextMilestone = milestone;
        progressToNext = (totalSavings / parseFloat(milestone.threshold)) * 100;
        break;
      }
    }

    // Format response
    const earnedAchievements = userAchievements.map((ua) => ({
      id: ua.id,
      achievementId: ua.achievementId,
      name: ua.achievement.name,
      description: ua.achievement.description,
      type: ua.achievement.type,
      threshold: parseFloat(ua.achievement.threshold),
      icon: ua.achievement.icon,
      color: ua.achievement.color,
      earnedAt: ua.earnedAt,
    }));

    res.json({
      success: true,
      data: {
        earned: earnedAchievements,
        totalEarned: earnedAchievements.length,
        totalSavings,
        nextMilestone: nextMilestone
          ? {
              id: nextMilestone.id,
              name: nextMilestone.name,
              description: nextMilestone.description,
              threshold: parseFloat(nextMilestone.threshold),
              icon: nextMilestone.icon,
              color: nextMilestone.color,
              progress: Math.min(100, progressToNext),
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Achievement Fetch Error:", error);
    res.status(500).json({
      error: "Failed to fetch achievements",
      message: error.message,
    });
  }
});

// Streak Endpoints

// Get streak data for the authenticated user
app.get("/api/savings/streaks", async (req, res) => {
  try {
    const userId = req.dbUser.id;

    // Fetch or create streak record for the user
    let streak = await prisma.savingsStreak.findUnique({
      where: { userId },
    });

    // If no streak exists, create one
    if (!streak) {
      streak = await prisma.savingsStreak.create({
        data: {
          userId,
          currentStreak: 0,
          longestStreak: 0,
          lastUpdated: new Date(),
          streakStartDate: new Date(),
        },
      });
    }

    // Calculate days until next milestone
    const currentStreak = streak.currentStreak;
    const milestones = [7, 30, 60, 90];
    let nextMilestone = null;
    let daysToNextMilestone = 0;

    for (const milestone of milestones) {
      if (currentStreak < milestone) {
        nextMilestone = milestone;
        daysToNextMilestone = milestone - currentStreak;
        break;
      }
    }

    // Get streak-related achievements
    const streakAchievements = await prisma.userAchievement.findMany({
      where: {
        userId,
        achievement: {
          type: "STREAK",
        },
      },
      include: {
        achievement: true,
      },
      orderBy: { earnedAt: "desc" },
    });

    res.json({
      success: true,
      data: {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastUpdated: streak.lastUpdated,
        streakStartDate: streak.streakStartDate,
        nextMilestone: nextMilestone
          ? {
              days: nextMilestone,
              daysRemaining: daysToNextMilestone,
              progress: (currentStreak / nextMilestone) * 100,
            }
          : null,
        achievements: streakAchievements.map((sa) => ({
          id: sa.id,
          name: sa.achievement.name,
          description: sa.achievement.description,
          threshold: parseFloat(sa.achievement.threshold),
          icon: sa.achievement.icon,
          color: sa.achievement.color,
          earnedAt: sa.earnedAt,
        })),
      },
    });
  } catch (error) {
    console.error("Streak Fetch Error:", error);
    res.status(500).json({
      error: "Failed to fetch streak data",
      message: error.message,
    });
  }
});

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
    `Processing ${messages.length} SMS messages for user ${req.dbUser.id}`,
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

// For local development, uncomment the following:
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// Export for Vercel serverless deployment
module.exports = app;
