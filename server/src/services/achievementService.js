const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Achievement Service
 *
 * Handles milestone tracking, badge awards, and achievement notifications.
 * Implements Requirements 7.1, 7.2, 7.3, 7.5 from the Savings Celebration System spec.
 *
 * Features:
 * - Milestone threshold tracking (₹500, ₹1000, ₹5000, ₹10000, ₹50000, ₹100000)
 * - Duplicate badge prevention
 * - Achievement notification sending
 * - Category-specific achievement tracking
 */

// Milestone thresholds in INR (Requirement 7.2)
const MILESTONE_THRESHOLDS = [500, 1000, 5000, 10000, 50000, 100000];

// Achievement definitions
const ACHIEVEMENT_DEFINITIONS = {
  MILESTONE_500: {
    name: "First Steps",
    description: "Saved your first ₹500",
    type: "MILESTONE",
    threshold: 500,
    icon: "Footprints",
    color: "#10b981",
  },
  MILESTONE_1000: {
    name: "Getting Started",
    description: "Saved ₹1,000",
    type: "MILESTONE",
    threshold: 1000,
    icon: "TrendingUp",
    color: "#3b82f6",
  },
  MILESTONE_5000: {
    name: "Savings Champion",
    description: "Saved ₹5,000",
    type: "MILESTONE",
    threshold: 5000,
    icon: "Award",
    color: "#8b5cf6",
  },
  MILESTONE_10000: {
    name: "Five Figure Club",
    description: "Saved ₹10,000",
    type: "MILESTONE",
    threshold: 10000,
    icon: "Star",
    color: "#f59e0b",
  },
  MILESTONE_50000: {
    name: "Savings Master",
    description: "Saved ₹50,000",
    type: "MILESTONE",
    threshold: 50000,
    icon: "Crown",
    color: "#ef4444",
  },
  MILESTONE_100000: {
    name: "Savings Legend",
    description: "Saved ₹100,000",
    type: "MILESTONE",
    threshold: 100000,
    icon: "Trophy",
    color: "#ec4899",
  },
};

/**
 * Initialize achievement definitions in the database
 * Should be called once during application setup
 */
async function initializeAchievements() {
  try {
    for (const [key, achievement] of Object.entries(ACHIEVEMENT_DEFINITIONS)) {
      await prisma.achievement.upsert({
        where: { name: achievement.name },
        update: achievement,
        create: achievement,
      });
    }
    console.log("✅ Achievement definitions initialized");
  } catch (error) {
    console.error("❌ Error initializing achievements:", error);
    throw error;
  }
}

/**
 * Calculate total savings for a user
 * @param {number} userId - The user's ID
 * @returns {Promise<number>} Total savings amount
 */
async function calculateTotalSavings(userId) {
  // Get all categories with budgets
  const categories = await prisma.category.findMany({
    where: {
      userId,
      budget: { not: null },
    },
    include: {
      expenses: {
        where: {
          userId,
        },
      },
    },
  });

  let totalSavings = 0;

  for (const category of categories) {
    const budget = parseFloat(category.budget);
    const spent = category.expenses.reduce(
      (sum, expense) => sum + parseFloat(expense.amount),
      0,
    );
    const saved = budget - spent;

    // Only count positive savings
    if (saved > 0) {
      totalSavings += saved;
    }
  }

  return totalSavings;
}

/**
 * Check and award milestone achievements
 * Requirement 7.1: Award badges when users reach predefined savings thresholds
 * Requirement 7.2: Define milestones at specific thresholds
 *
 * @param {number} userId - The user's ID
 * @returns {Promise<Array>} Array of newly awarded achievements
 */
async function checkAndAwardMilestones(userId) {
  try {
    const totalSavings = await calculateTotalSavings(userId);
    const newAchievements = [];

    // Get all milestone achievements from database
    const milestoneAchievements = await prisma.achievement.findMany({
      where: { type: "MILESTONE" },
      orderBy: { threshold: "asc" },
    });

    // Get user's existing achievements
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    });

    const earnedAchievementIds = new Set(
      userAchievements.map((ua) => ua.achievementId),
    );

    // Check each milestone threshold
    for (const achievement of milestoneAchievements) {
      const threshold = parseFloat(achievement.threshold);

      // Award if threshold reached and not already earned (duplicate prevention)
      if (
        totalSavings >= threshold &&
        !earnedAchievementIds.has(achievement.id)
      ) {
        // Award the badge
        const userAchievement = await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
          },
          include: {
            achievement: true,
          },
        });

        newAchievements.push(userAchievement);

        // Send achievement notification (Requirement 7.5)
        await sendAchievementNotification(
          userId,
          achievement.name,
          achievement.description,
          threshold,
        );

        console.log(
          `🏆 Achievement awarded: ${achievement.name} to user ${userId}`,
        );
      }
    }

    return newAchievements;
  } catch (error) {
    console.error("❌ Error checking and awarding milestones:", error);
    throw error;
  }
}

/**
 * Calculate savings for a specific category
 * @param {number} userId - The user's ID
 * @param {number} categoryId - The category's ID
 * @param {Date} startDate - Start date for calculation (optional)
 * @param {Date} endDate - End date for calculation (optional)
 * @returns {Promise<number>} Category savings amount
 */
async function calculateCategorySavings(
  userId,
  categoryId,
  startDate = null,
  endDate = null,
) {
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId,
      budget: { not: null },
    },
  });

  if (!category) {
    return 0;
  }

  const whereClause = {
    userId,
    categoryId,
  };

  // Add date filters if provided
  if (startDate || endDate) {
    whereClause.date = {};
    if (startDate) whereClause.date.gte = startDate;
    if (endDate) whereClause.date.lte = endDate;
  }

  const expenses = await prisma.expense.aggregate({
    where: whereClause,
    _sum: { amount: true },
  });

  const budget = parseFloat(category.budget);
  const spent = parseFloat(expenses._sum.amount || 0);
  const saved = budget - spent;

  return saved > 0 ? saved : 0;
}

/**
 * Check and award category-specific achievements
 * Requirement 7.3: Award category-specific badges for consistent savings
 *
 * @param {number} userId - The user's ID
 * @param {number} categoryId - The category's ID
 * @param {number} consecutiveMonths - Number of consecutive months with savings (default: 3)
 * @returns {Promise<Object|null>} Newly awarded achievement or null
 */
async function checkAndAwardCategoryAchievement(
  userId,
  categoryId,
  consecutiveMonths = 3,
) {
  try {
    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId },
    });

    if (!category) {
      return null;
    }

    // Check if user has saved in this category for consecutive months
    let hasConsecutiveSavings = true;
    const today = new Date();

    for (let i = 0; i < consecutiveMonths; i++) {
      const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = new Date(
        today.getFullYear(),
        today.getMonth() - i + 1,
        0,
      );

      const savings = await calculateCategorySavings(
        userId,
        categoryId,
        monthStart,
        monthEnd,
      );

      if (savings <= 0) {
        hasConsecutiveSavings = false;
        break;
      }
    }

    if (!hasConsecutiveSavings) {
      return null;
    }

    // Create or get category-specific achievement
    const achievementName = `${category.name} Savings Master`;
    const achievementDescription = `Saved consistently in ${category.name} for ${consecutiveMonths} months`;

    let achievement = await prisma.achievement.findUnique({
      where: { name: achievementName },
    });

    if (!achievement) {
      achievement = await prisma.achievement.create({
        data: {
          name: achievementName,
          description: achievementDescription,
          type: "CATEGORY",
          threshold: 0, // Not applicable for category achievements
          icon: category.icon || "Target",
          color: category.color || "#6366f1",
        },
      });
    }

    // Check if user already has this achievement (duplicate prevention)
    const existingUserAchievement = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId: achievement.id,
        },
      },
    });

    if (existingUserAchievement) {
      return null; // Already earned
    }

    // Award the category achievement
    const userAchievement = await prisma.userAchievement.create({
      data: {
        userId,
        achievementId: achievement.id,
      },
      include: {
        achievement: true,
      },
    });

    // Send achievement notification
    await sendAchievementNotification(
      userId,
      achievement.name,
      achievement.description,
      null,
    );

    console.log(
      `🎯 Category achievement awarded: ${achievement.name} to user ${userId}`,
    );

    return userAchievement;
  } catch (error) {
    console.error("❌ Error checking category achievement:", error);
    throw error;
  }
}

/**
 * Send achievement notification
 * Requirement 7.5: Implement achievement notification sending
 *
 * @param {number} userId - The user's ID
 * @param {string} achievementName - Name of the achievement
 * @param {string} achievementDescription - Description of the achievement
 * @param {number|null} threshold - Milestone threshold (if applicable)
 */
async function sendAchievementNotification(
  userId,
  achievementName,
  achievementDescription,
  threshold = null,
) {
  try {
    const title = `🏆 Achievement Unlocked!`;
    let message = `${achievementName}: ${achievementDescription}`;

    if (threshold) {
      const formattedAmount = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(threshold);
      message = `Congratulations! You've saved ${formattedAmount}!`;
    }

    await prisma.savingsNotification.create({
      data: {
        userId,
        type: "MILESTONE",
        title,
        message,
        data: {
          achievementName,
          achievementDescription,
          threshold,
        },
        sentAt: new Date(),
      },
    });

    console.log(`📬 Achievement notification sent to user ${userId}`);
  } catch (error) {
    console.error("❌ Error sending achievement notification:", error);
    // Don't throw - notification failures shouldn't break achievement awards
  }
}

/**
 * Get all achievements for a user
 * @param {number} userId - The user's ID
 * @returns {Promise<Array>} Array of user achievements with details
 */
async function getUserAchievements(userId) {
  try {
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: {
        earnedAt: "desc",
      },
    });

    return userAchievements;
  } catch (error) {
    console.error("❌ Error fetching user achievements:", error);
    throw error;
  }
}

/**
 * Get progress toward next milestone
 * Requirement 7.7: Track progress toward the next milestone
 *
 * @param {number} userId - The user's ID
 * @returns {Promise<Object>} Progress information
 */
async function getNextMilestoneProgress(userId) {
  try {
    const totalSavings = await calculateTotalSavings(userId);

    // Get earned milestone achievements
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: {
          where: { type: "MILESTONE" },
        },
      },
    });

    const earnedThresholds = userAchievements
      .map((ua) => parseFloat(ua.achievement.threshold))
      .filter((t) => !isNaN(t));

    // Find next milestone
    const nextThreshold = MILESTONE_THRESHOLDS.find(
      (threshold) => threshold > totalSavings,
    );

    if (!nextThreshold) {
      return {
        currentSavings: totalSavings,
        nextMilestone: null,
        progress: 100,
        message: "You've reached all milestones! Amazing work!",
      };
    }

    const progress = (totalSavings / nextThreshold) * 100;
    const remaining = nextThreshold - totalSavings;

    return {
      currentSavings: totalSavings,
      nextMilestone: nextThreshold,
      progress: Math.min(progress, 100),
      remaining,
      message: `₹${remaining.toFixed(2)} away from your next milestone!`,
    };
  } catch (error) {
    console.error("❌ Error calculating milestone progress:", error);
    throw error;
  }
}

/**
 * Get all available achievements (for display purposes)
 * @returns {Promise<Array>} Array of all achievement definitions
 */
async function getAllAchievements() {
  try {
    return await prisma.achievement.findMany({
      orderBy: [{ type: "asc" }, { threshold: "asc" }],
    });
  } catch (error) {
    console.error("❌ Error fetching all achievements:", error);
    throw error;
  }
}

module.exports = {
  initializeAchievements,
  calculateTotalSavings,
  calculateCategorySavings,
  checkAndAwardMilestones,
  checkAndAwardCategoryAchievement,
  sendAchievementNotification,
  getUserAchievements,
  getNextMilestoneProgress,
  getAllAchievements,
  MILESTONE_THRESHOLDS,
  ACHIEVEMENT_DEFINITIONS,
};
