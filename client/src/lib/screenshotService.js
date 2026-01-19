import { registerPlugin } from "@capacitor/core";

const ScreenshotListener = registerPlugin("ScreenshotListener");

class ScreenshotService {
  async isAvailable() {
    try {
      // Check if plugin is available (Android only)
      return !!ScreenshotListener;
    } catch (error) {
      console.log("Screenshot service not available:", error);
      return false;
    }
  }

  async checkPermissions() {
    try {
      const result = await ScreenshotListener.checkPermissions();
      return result.granted;
    } catch (error) {
      console.error("Error checking screenshot permissions:", error);
      return false;
    }
  }

  async requestPermissions() {
    try {
      const result = await ScreenshotListener.requestPermissions();
      return result.granted;
    } catch (error) {
      console.error("Error requesting screenshot permissions:", error);
      return false;
    }
  }

  async startListener() {
    try {
      const result = await ScreenshotListener.startListener();
      console.log("Screenshot listener started:", result);
      return result.success;
    } catch (error) {
      console.error("Error starting screenshot listener:", error);
      return false;
    }
  }

  async stopListener() {
    try {
      const result = await ScreenshotListener.stopListener();
      console.log("Screenshot listener stopped:", result);
      return result.success;
    } catch (error) {
      console.error("Error stopping screenshot listener:", error);
      return false;
    }
  }

  async setScreenshotMonitoring(enabled) {
    try {
      const result = await ScreenshotListener.setScreenshotMonitoring({
        enabled,
      });
      console.log("Screenshot monitoring set to:", enabled);
      return result.success;
    } catch (error) {
      console.error("Error setting screenshot monitoring:", error);
      return false;
    }
  }

  async getScreenshotMonitoring() {
    try {
      const result = await ScreenshotListener.getScreenshotMonitoring();
      return result.enabled;
    } catch (error) {
      console.error("Error getting screenshot monitoring:", error);
      return false;
    }
  }
}

export default new ScreenshotService();
