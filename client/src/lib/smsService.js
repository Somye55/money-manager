import { SmsReader } from '@solimanware/capacitor-sms-reader';
import { Capacitor } from '@capacitor/core';

/**
 * SMS Service for reading and managing SMS notifications
 */
class SMSService {
  constructor() {
    this.isSupported = Capacitor.getPlatform() === 'android';
    this.listeners = [];
  }

  /**
   * Check if SMS reading is supported on this platform
   */
  isAvailable() {
    return this.isSupported;
  }

  /**
   * Request SMS permission from the user
   */
  async requestPermission() {
    if (!this.isSupported) {
      throw new Error('SMS reading is only supported on Android');
    }

    try {
      const result = await SmsReader.requestPermission();
      return result.granted || false;
    } catch (error) {
      console.error('Error requesting SMS permission:', error);
      throw error;
    }
  }

  /**
   * Check if SMS permission is already granted
   */
  async checkPermission() {
    if (!this.isSupported) {
      return false;
    }

    try {
      const result = await SmsReader.checkPermission();
      return result.granted || false;
    } catch (error) {
      console.error('Error checking SMS permission:', error);
      return false;
    }
  }

  /**
   * Get all SMS messages
   * @param {Object} options - Filter options
   * @returns {Promise<Array>} Array of SMS messages
   */
  async getAllSMS(options = {}) {
    if (!this.isSupported) {
      throw new Error('SMS reading is only supported on Android');
    }

    try {
      const hasPermission = await this.checkPermission();
      if (!hasPermission) {
        throw new Error('SMS permission not granted');
      }

      const result = await SmsReader.getMessages({
        maxCount: options.maxCount || 100,
        ...options
      });

      return result.messages || [];
    } catch (error) {
      console.error('Error getting SMS messages:', error);
      throw error;
    }
  }

  /**
   * Get SMS messages from a specific date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date (default: now)
   */
  async getSMSByDateRange(startDate, endDate = new Date()) {
    const allSMS = await this.getAllSMS();
    
    return allSMS.filter(sms => {
      const smsDate = new Date(sms.date);
      return smsDate >= startDate && smsDate <= endDate;
    });
  }

  /**
   * Get SMS messages from specific senders
   * @param {Array<string>} senders - Array of sender addresses/numbers
   */
  async getSMSFromSenders(senders) {
    const allSMS = await this.getAllSMS();
    
    return allSMS.filter(sms => {
      return senders.some(sender => 
        sms.address && sms.address.toLowerCase().includes(sender.toLowerCase())
      );
    });
  }

  /**
   * Search SMS messages by keyword
   * @param {string} keyword - Keyword to search for
   */
  async searchSMS(keyword) {
    const allSMS = await this.getAllSMS();
    
    return allSMS.filter(sms => 
      sms.body && sms.body.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  /**
   * Start listening for incoming SMS (if supported by the plugin)
   */
  async startListening(callback) {
    if (!this.isSupported) {
      return;
    }

    try {
      const hasPermission = await this.checkPermission();
      if (!hasPermission) {
        throw new Error('SMS permission not granted');
      }

      // Store callback for later use
      this.listeners.push(callback);

      // Note: The current plugin version may not support real-time listening
      // This is a placeholder for future implementation
      console.log('SMS listening started');
    } catch (error) {
      console.error('Error starting SMS listener:', error);
      throw error;
    }
  }

  /**
   * Stop listening for incoming SMS
   */
  stopListening() {
    this.listeners = [];
    console.log('SMS listening stopped');
  }

  /**
   * Get financial SMS from banks and payment apps
   */
  async getFinancialSMS(options = {}) {
    const commonFinancialSenders = [
      'bank', 'hdfc', 'icici', 'sbi', 'axis', 'kotak', 'paytm', 'phonepe', 
      'googlepay', 'gpay', 'upi', 'amazon', 'flipkart', 'swiggy', 'zomato',
      'ola', 'uber', 'credit', 'debit', 'wallet', 'payment'
    ];

    const allSMS = await this.getAllSMS({
      maxCount: options.maxCount || 500
    });

    return allSMS.filter(sms => {
      if (!sms.body) return false;
      
      const body = sms.body.toLowerCase();
      const address = (sms.address || '').toLowerCase();
      
      // Check if SMS is from a financial sender
      const isFinancialSender = commonFinancialSenders.some(sender => 
        address.includes(sender) || body.includes(sender)
      );

      // Check if SMS contains financial keywords
      const hasFinancialKeywords = /(?:debited|credited|spent|paid|received|balance|rs\.?|inr|₹|\d+(?:\.\d{2})?)/i.test(body);

      return isFinancialSender || hasFinancialKeywords;
    });
  }
}

export default new SMSService();
