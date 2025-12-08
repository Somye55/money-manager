import { SMSInboxReader } from "capacitor-sms-inbox";
import { Capacitor } from "@capacitor/core";
// import { NotificationListener } from 'capacitor-notification-listener'; // Plugin not available

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
    // Notification listener requires a separate plugin that's not currently installed
    // This would require: npm install capacitor-notification-listener
    // And additional Android configuration
    return false;
  }

  /**
   * Opens the Android 'Notification Access' settings page
   */
  async requestNotificationPermission() {
    if (!this.isSupported) {
      throw new Error("Notification listener is only available on Android");
    }

    // Since the plugin isn't installed, we'll provide a helpful error message
    throw new Error(
      "Notification listener feature requires additional setup. This feature is coming soon!"
    );
  }

  /**
   * Start listening for real-time notifications
   */
  async startNotificationListener(callback) {
    if (!this.isSupported) return;

    // Notification listener plugin not implemented
    console.warn("Notification listener not implemented");
  }

  async stopNotificationListener() {
    if (this.listenerHandle) {
      await this.listenerHandle.remove();
      this.listenerHandle = null;
    }
  }
}

export default new SMSService();
