const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Update the user's savings streak based on daily budget adherence
 * @param {number} userId - The user's ID
 * @returns {Promise<Object>} Updated streak data
 */
async function updateStreak(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if user stayed under budget today
  const isUnderBudget = await checkUnderBudget(userId, today);

  const streak = await prisma.savingsStreak.findUnique({
    where: { userId },
  });

  if (!streak) {
    // Create initial streak
    return await prisma.savingsStreak.create({
      data: {
        userId,
        currentStreak: isUnderBudget ? 1 : 0,
        longestStreak: isUnderBudget ? 1 : 0,
        lastUpdated: today,
        streakStartDate: today,
      },
    });
  }

  const lastUpdate = new Date(streak.lastUpdated);
  lastUpdate.setHours(0, 0, 0, 0);

  // Check if this is a new day
  if (today.getTime() === lastUpdate.getTime()) {
    return streak; // Already updated today
  }

  if (isUnderBudget) {
    // Increment streak
    const newStreak = streak.currentStreak + 1;
    const newLongest = Math.max(newStreak, streak.longestStreak);

    // Check for milestone notifications (7, 30, 60, 90 days)
    if ([7, 30, 60, 90].includes(newStreak)) {
      await sendStreakMilestoneNotification(userId, newStreak);
    }

    return await prisma.savingsStreak.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastUpdated: today,
      },
    });
  } else {
    // Reset streak on overspending
    return await prisma.savingsStreak.update({
      where: { userId },
      data: {
        currentStreak: 0,
        lastUpdated: today,
        streakStartDate: today,
      },
    });
  }
}

/**
 * Check if user stayed under budget for all categories
 * @param {number} userId - The user's ID
 * @param {Date} date - The date to check
 * @returns {Promise<boolean>} True if under budget in all categories
 */
async function checkUnderBudget(userId, date) {
  const categories = await prisma.category.findMany({
    where: { userId, budget: { not: null } },
  });

  // If no categories with budgets, consider as under budget
  if (categories.length === 0) {
    return true;
  }

  for (const category of categories) {
    const spent = await prisma.expense.aggregate({
      where: {
        userId,
        categoryId: category.id,
        date: {
          gte: new Date(date.getFullYear(), date.getMonth(), 1),
          lte: date,
        },
      },
      _sum: { amount: true },
    });

    const spentAmount = spent._sum.amount || 0;
    if (spentAmount > category.budget) {
      return false; // Over budget in at least one category
    }
  }

  return true; // Under budget in all categories
}

/**
 * Send streak milestone notification
 * @param {number} userId - The user's ID
 * @param {number} streakDays - Number of consecutive days
 */
async function sendStreakMilestoneNotification(userId, streakDays) {
  const messages = {
    7: "🔥 7-day streak! You're on fire!",
    30: "🌟 30-day streak! Amazing consistency!",
    60: "💎 60-day streak! You're a savings champion!",
    90: "🏆 90-day streak! Legendary achievement!",
  };

  await prisma.savingsNotification.create({
    data: {
      userId,
      type: "STREAK",
      title: `${streakDays}-Day Streak Milestone!`,
      message:
        messages[streakDays] || `${streakDays} days of staying under budget!`,
      sentAt: new Date(),
    },
  });
}

/**
 * Get user's current streak data
 * @param {number} userId - The user's ID
 * @returns {Promise<Object|null>} Streak data or null if not found
 */
async function getStreak(userId) {
  return await prisma.savingsStreak.findUnique({
    where: { userId },
  });
}

module.exports = {
  updateStreak,
  checkUnderBudget,
  sendStreakMilestoneNotification,
  getStreak,
};
