/**
 * Notification Service
 *
 * Handles all notification-related functionality using Capacitor's LocalNotifications plugin.
 * Implements Requirements 4.1-4.7 from the Savings Celebration System spec.
 *
 * Features:
 * - Permission management
 * - Daily and weekly summary notifications
 * - Milestone achievement notifications
 * - Streak achievement notifications
 * - User preference checking
 * - System permission respect
 */

import {
  LocalNotifications,
  ScheduleOptions,
} from "@capacitor/local-notifications";
import api from "../lib/api";

export interface NotificationPreferences {
  enableNotifications: boolean;
  dailySummaryEnabled?: boolean;
  weeklySummaryEnabled?: boolean;
  milestoneNotificationsEnabled?: boolean;
  streakNotificationsEnabled?: boolean;
}

export class NotificationService {
  /**
   * Request notification permissions from the system
   * Requirement 4.6: Respect system-level notification permissions
   *
   * @returns {Promise<boolean>} True if permissions granted, false otherwise
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      const result = await LocalNotifications.requestPermissions();
      console.log("📱 NotificationService: Permission result:", result);
      return result.display === "granted";
    } catch (error) {
      console.error(
        "❌ NotificationService: Error requesting permissions:",
        error,
      );
      return false;
    }
  }

  /**
   * Check if notification permissions are granted
   *
   * @returns {Promise<boolean>} True if permissions granted, false otherwise
   */
  static async checkPermissions(): Promise<boolean> {
    try {
      const result = await LocalNotifications.checkPermissions();
      return result.display === "granted";
    } catch (error) {
      console.error(
        "❌ NotificationService: Error checking permissions:",
        error,
      );
      return false;
    }
  }

  /**
   * Get user notification preferences from settings
   * Requirement 4.5: Allow users to configure notification frequency
   * Requirement 4.7: Respect user notification preferences
   *
   * @returns {Promise<NotificationPreferences>} User notification preferences
   */
  static async getUserPreferences(): Promise<NotificationPreferences> {
    try {
      const response = await api.get("/user/settings");
      const settings = response.data;

      return {
        enableNotifications: settings.enableNotifications ?? true,
        dailySummaryEnabled: settings.dailySummaryEnabled ?? true,
        weeklySummaryEnabled: settings.weeklySummaryEnabled ?? true,
        milestoneNotificationsEnabled:
          settings.milestoneNotificationsEnabled ?? true,
        streakNotificationsEnabled: settings.streakNotificationsEnabled ?? true,
      };
    } catch (error) {
      console.error(
        "❌ NotificationService: Error fetching user preferences:",
        error,
      );
      // Return default preferences if API call fails
      return {
        enableNotifications: true,
        dailySummaryEnabled: true,
        weeklySummaryEnabled: true,
        milestoneNotificationsEnabled: true,
        streakNotificationsEnabled: true,
      };
    }
  }

  /**
   * Check if notifications should be sent based on user preferences and system permissions
   * Requirement 4.7: Do not send notifications when disabled by user
   *
   * @param {string} notificationType - Type of notification to check
   * @returns {Promise<boolean>} True if notification should be sent, false otherwise
   */
  static async shouldSendNotification(
    notificationType?: string,
  ): Promise<boolean> {
    // Check system permissions first
    const hasPermission = await this.checkPermissions();
    if (!hasPermission) {
      console.log("📱 NotificationService: System permissions not granted");
      return false;
    }

    // Check user preferences
    const preferences = await this.getUserPreferences();
    if (!preferences.enableNotifications) {
      console.log("📱 NotificationService: Notifications disabled by user");
      return false;
    }

    // Check specific notification type preferences
    if (notificationType) {
      switch (notificationType) {
        case "daily":
          return preferences.dailySummaryEnabled ?? true;
        case "weekly":
          return preferences.weeklySummaryEnabled ?? true;
        case "milestone":
          return preferences.milestoneNotificationsEnabled ?? true;
        case "streak":
          return preferences.streakNotificationsEnabled ?? true;
        default:
          return true;
      }
    }

    return true;
  }

  /**
   * Schedule daily summary notification
   * Requirement 4.1: Send daily summary notification showing total savings for the day
   *
   * @param {number} totalSavings - Total savings amount for the day
   * @returns {Promise<void>}
   */
  static async scheduleDailySummary(totalSavings: number): Promise<void> {
    try {
      // Check if we should send this notification
      const shouldSend = await this.shouldSendNotification("daily");
      if (!shouldSend) {
        console.log(
          "📱 NotificationService: Daily summary notification skipped (disabled)",
        );
        return;
      }

      // Format the savings amount
      const formattedAmount = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(totalSavings);

      // Create notification
      const notification: ScheduleOptions = {
        notifications: [
          {
            id: Date.now(),
            title: "🎉 Daily Savings Summary",
            body:
              totalSavings > 0
                ? `Great job! You saved ${formattedAmount} today!`
                : `Keep going! Tomorrow is a new opportunity to save.`,
            schedule: {
              at: new Date(Date.now() + 1000), // Send immediately (1 second delay)
            },
            sound: undefined,
            attachments: undefined,
            actionTypeId: "",
            extra: {
              type: "daily_summary",
              amount: totalSavings,
            },
          },
        ],
      };

      await LocalNotifications.schedule(notification);
      console.log(
        "✅ NotificationService: Daily summary notification scheduled",
      );
    } catch (error) {
      console.error(
        "❌ NotificationService: Error scheduling daily summary:",
        error,
      );
    }
  }

  /**
   * Schedule weekly summary notification
   * Requirement 4.2: Send weekly summary notification showing total savings for the week
   *
   * @param {number} totalSavings - Total savings amount for the week
   * @param {number} comparisonAmount - Comparison with previous week (optional)
   * @returns {Promise<void>}
   */
  static async scheduleWeeklySummary(
    totalSavings: number,
    comparisonAmount?: number,
  ): Promise<void> {
    try {
      // Check if we should send this notification
      const shouldSend = await this.shouldSendNotification("weekly");
      if (!shouldSend) {
        console.log(
          "📱 NotificationService: Weekly summary notification skipped (disabled)",
        );
        return;
      }

      // Format the savings amount
      const formattedAmount = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(totalSavings);

      let body = `You saved ${formattedAmount} this week!`;

      // Add comparison if available
      if (comparisonAmount !== undefined && comparisonAmount !== 0) {
        const formattedComparison = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(Math.abs(comparisonAmount));

        if (comparisonAmount > 0) {
          body += ` That's ${formattedComparison} more than last week! 🚀`;
        } else {
          body += ` Keep pushing to beat last week's ${formattedComparison}!`;
        }
      }

      // Create notification
      const notification: ScheduleOptions = {
        notifications: [
          {
            id: Date.now(),
            title: "📊 Weekly Savings Report",
            body,
            schedule: {
              at: new Date(Date.now() + 1000), // Send immediately (1 second delay)
            },
            sound: undefined,
            attachments: undefined,
            actionTypeId: "",
            extra: {
              type: "weekly_summary",
              amount: totalSavings,
              comparison: comparisonAmount,
            },
          },
        ],
      };

      await LocalNotifications.schedule(notification);
      console.log(
        "✅ NotificationService: Weekly summary notification scheduled",
      );
    } catch (error) {
      console.error(
        "❌ NotificationService: Error scheduling weekly summary:",
        error,
      );
    }
  }

  /**
   * Send milestone achievement notification
   * Requirement 4.3: Send celebration notification within 5 minutes when user achieves a milestone
   *
   * @param {number} milestoneAmount - The milestone amount achieved
   * @param {string} milestoneName - Name/description of the milestone
   * @returns {Promise<void>}
   */
  static async sendMilestoneNotification(
    milestoneAmount: number,
    milestoneName?: string,
  ): Promise<void> {
    try {
      // Check if we should send this notification
      const shouldSend = await this.shouldSendNotification("milestone");
      if (!shouldSend) {
        console.log(
          "📱 NotificationService: Milestone notification skipped (disabled)",
        );
        return;
      }

      // Format the milestone amount
      const formattedAmount = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(milestoneAmount);

      const title = milestoneName || "🏆 Milestone Achieved!";
      const body = `Congratulations! You've saved ${formattedAmount}! Keep up the amazing work! 🎊`;

      // Create notification (send within 5 minutes as per requirement)
      const notification: ScheduleOptions = {
        notifications: [
          {
            id: Date.now(),
            title,
            body,
            schedule: {
              at: new Date(Date.now() + 1000), // Send immediately (1 second delay)
            },
            sound: undefined,
            attachments: undefined,
            actionTypeId: "",
            extra: {
              type: "milestone",
              amount: milestoneAmount,
              name: milestoneName,
            },
          },
        ],
      };

      await LocalNotifications.schedule(notification);
      console.log("✅ NotificationService: Milestone notification sent");
    } catch (error) {
      console.error(
        "❌ NotificationService: Error sending milestone notification:",
        error,
      );
    }
  }

  /**
   * Send streak achievement notification
   * Requirement 4.4: Send streak achievement notification when user completes a savings streak
   *
   * @param {number} streakDays - Number of consecutive days in the streak
   * @returns {Promise<void>}
   */
  static async sendStreakNotification(streakDays: number): Promise<void> {
    try {
      // Check if we should send this notification
      const shouldSend = await this.shouldSendNotification("streak");
      if (!shouldSend) {
        console.log(
          "📱 NotificationService: Streak notification skipped (disabled)",
        );
        return;
      }

      // Create motivational message based on streak length
      let title = "🔥 Streak Achievement!";
      let body = `Amazing! You're on a ${streakDays}-day savings streak!`;

      // Special messages for milestone streaks
      if (streakDays === 7) {
        title = "🔥 One Week Streak!";
        body = `Incredible! You've maintained your savings streak for a full week! Keep it going! 💪`;
      } else if (streakDays === 30) {
        title = "🔥 One Month Streak!";
        body = `Outstanding! 30 days of consistent savings! You're building amazing habits! 🌟`;
      } else if (streakDays === 60) {
        title = "🔥 Two Month Streak!";
        body = `Phenomenal! 60 days of savings discipline! You're a savings champion! 🏆`;
      } else if (streakDays === 90) {
        title = "🔥 Three Month Streak!";
        body = `Legendary! 90 days of unwavering commitment! You're an inspiration! 👑`;
      } else if (streakDays % 100 === 0) {
        title = `🔥 ${streakDays}-Day Streak!`;
        body = `Unbelievable! ${streakDays} consecutive days of savings! You're unstoppable! 🚀`;
      }

      // Create notification
      const notification: ScheduleOptions = {
        notifications: [
          {
            id: Date.now(),
            title,
            body,
            schedule: {
              at: new Date(Date.now() + 1000), // Send immediately (1 second delay)
            },
            sound: undefined,
            attachments: undefined,
            actionTypeId: "",
            extra: {
              type: "streak",
              days: streakDays,
            },
          },
        ],
      };

      await LocalNotifications.schedule(notification);
      console.log("✅ NotificationService: Streak notification sent");
    } catch (error) {
      console.error(
        "❌ NotificationService: Error sending streak notification:",
        error,
      );
    }
  }

  /**
   * Cancel all pending notifications
   *
   * @returns {Promise<void>}
   */
  static async cancelAllNotifications(): Promise<void> {
    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel(pending);
        console.log("✅ NotificationService: All notifications cancelled");
      }
    } catch (error) {
      console.error(
        "❌ NotificationService: Error cancelling notifications:",
        error,
      );
    }
  }

  /**
   * Get all pending notifications
   *
   * @returns {Promise<any[]>} Array of pending notifications
   */
  static async getPendingNotifications(): Promise<any[]> {
    try {
      const pending = await LocalNotifications.getPending();
      return pending.notifications;
    } catch (error) {
      console.error(
        "❌ NotificationService: Error getting pending notifications:",
        error,
      );
      return [];
    }
  }
}

export default NotificationService;
