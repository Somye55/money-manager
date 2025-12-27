import { SMSInboxReader } from "capacitor-sms-inbox";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";

/**
 * Service for reading SMS and System Notifications
 */
class SMSService {
  constructor() {
    this.isSupported = Capacitor.getPlatform() === "android";
    this.listenerHandle = null;
  }

  isAvailable() {
    return this.isSupported;
  }

  // ============================================
  // SMS Database Operations (For history)
  // ============================================

  async requestSMSPermission() {
    if (!this.isSupported) return false;
    try {
      const result = await SMSInboxReader.requestPermissions();
      console.log("SMS Permission result:", result);
      return result.sms === "granted";
    } catch (error) {
      console.error("Error requesting SMS permission:", error);
      throw new Error(error.message || "Failed to request SMS permission");
    }
  }

  async checkSMSPermission() {
    if (!this.isSupported) return false;
    try {
      const result = await SMSInboxReader.checkPermissions();
      return result.sms === "granted";
    } catch (error) {
      console.error("Error checking SMS permission:", error);
      return false;
    }
  }

  async getFinancialSMS(options = {}) {
    if (!this.isSupported) return [];

    const commonFinancialSenders = [
      "bank",
      "hdfc",
      "icici",
      "sbi",
      "axis",
      "kotak",
      "paytm",
      "phonepe",
      "googlepay",
      "gpay",
      "upi",
      "amazon",
      "flipkart",
      "swiggy",
      "zomato",
      "ola",
      "uber",
      "credit",
      "debit",
      "wallet",
      "payment",
    ];

    try {
      const result = await SMSInboxReader.getSMSList({
        filter: {
          maxCount: options.maxCount || 500,
        },
      });

      return (result.smsList || []).filter((sms) => {
        if (!sms.body) return false;

        const body = sms.body.toLowerCase();
        const address = (sms.address || "").toLowerCase();

        const isFinancialSender = commonFinancialSenders.some(
          (sender) => address.includes(sender) || body.includes(sender)
        );

        const hasFinancialKeywords =
          /(?:debited|credited|spent|paid|received|balance|rs\.?|inr|₹|\d+(?:\.\d{2})?)/i.test(
            body
          );

        return isFinancialSender || hasFinancialKeywords;
      });
    } catch (error) {
      console.error("Error getting SMS messages:", error);
      return [];
    }
  }

  // ============================================
  // Notification Listener (For WhatsApp, GPay, etc.)
  // ============================================

  /**
   * Check if the app has access to System Notifications (Notification Listener)
   */
  async checkNotificationPermission() {
    if (!this.isSupported) return false;

    try {
      const NotificationListenerPlugin = (await import("./notificationPlugin"))
        .default;

      const result = await NotificationListenerPlugin.checkPermission();
      return result.granted || false;
    } catch (error) {
      console.error("Error checking notification permission:", error);
      return false;
    }
  }

  /**
   * Check if overlay permission is granted
   */
  async checkOverlayPermission() {
    if (!this.isSupported) return false;

    try {
      const NotificationListenerPlugin = (await import("./notificationPlugin"))
        .default;

      const result = await NotificationListenerPlugin.checkOverlayPermission();
      return result.granted || false;
    } catch (error) {
      console.error("Error checking overlay permission:", error);
      return false;
    }
  }

  /**
   * Opens the Android settings pages for notification access
   */
  async requestNotificationPermission() {
    if (!this.isSupported) {
      throw new Error("Notification listener is only available on Android");
    }

    try {
      console.log("Available plugins:", Object.keys(Capacitor.Plugins));
      const SettingsHelper = Capacitor.Plugins.SettingsHelper;
      console.log("SettingsHelper:", SettingsHelper);

      if (!SettingsHelper) {
        throw new Error("SettingsHelper plugin not found");
      }

      // Open notification listener settings
      console.log("Opening notification settings...");
      await SettingsHelper.openNotificationSettings();
      console.log("Settings opened successfully");

      throw new Error(
        "✓ Settings opened! Please enable 'MoneyManager' in the notification access list, then return to the app"
      );
    } catch (error) {
      if (error.message && error.message.includes("MoneyManager")) {
        throw error;
      }
      console.error("Error opening notification settings:", error);
      throw new Error(
        "⚠️ Could not open settings automatically. Please manually go to:\nSettings → Apps → Special app access → Notification access → Enable MoneyManager"
      );
    }
  }

  /**
   * Start listening for real-time notifications
   */
  async startNotificationListener(callback, expenseCallback) {
    if (!this.isSupported) return;

    try {
      const NotificationListenerPlugin = (await import("./notificationPlugin"))
        .default;

      // Register event listener for notifications
      await NotificationListenerPlugin.addListener(
        "notificationReceived",
        (data) => {
          console.log("Notification event received:", data);
          if (callback) {
            callback(data);
          }
        }
      );

      // Register event listener for expense saved from overlay
      if (expenseCallback) {
        await NotificationListenerPlugin.addListener("expenseSaved", (data) => {
          console.log("Expense saved event received:", data);
          expenseCallback(data);
        });
      }

      // Start listening
      const result = await NotificationListenerPlugin.startListening();
      console.log("Started notification listener:", result);

      this.listenerHandle = NotificationListenerPlugin;
    } catch (error) {
      console.error("Error starting notification listener:", error);
    }
  }

  async stopNotificationListener() {
    if (this.listenerHandle) {
      try {
        await this.listenerHandle.stopListening();
        await this.listenerHandle.removeAllListeners();
        this.listenerHandle = null;
      } catch (error) {
        console.error("Error stopping notification listener:", error);
      }
    }
  }
}

export default new SMSService();
