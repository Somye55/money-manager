import React, { createContext, useContext, useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";

const ScreenshotContext = createContext();

export const useScreenshot = () => {
  const context = useContext(ScreenshotContext);
  if (!context) {
    throw new Error("useScreenshot must be used within ScreenshotProvider");
  }
  return context;
};

export const ScreenshotProvider = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState(null);

  const checkPermissions = async () => {
    if (!Capacitor.isNativePlatform()) {
      console.log("Screenshot listener only works on native platforms");
      return false;
    }

    try {
      const { ScreenshotListener } = await import(
        "../plugins/ScreenshotListener"
      );
      const result = await ScreenshotListener.checkPermissions();
      setHasPermission(result.granted);
      return result.granted;
    } catch (err) {
      console.error("Error checking screenshot permissions:", err);
      setError(err.message);
      return false;
    }
  };

  const requestPermissions = async () => {
    if (!Capacitor.isNativePlatform()) {
      return false;
    }

    try {
      const { ScreenshotListener } = await import(
        "../plugins/ScreenshotListener"
      );
      const result = await ScreenshotListener.requestPermissions();
      setHasPermission(result.granted);
      return result.granted;
    } catch (err) {
      console.error("Error requesting screenshot permissions:", err);
      setError(err.message);
      return false;
    }
  };

  const startListener = async () => {
    if (!Capacitor.isNativePlatform()) {
      console.log("Screenshot listener only works on native platforms");
      return false;
    }

    try {
      // Check permissions first
      const granted = await checkPermissions();
      if (!granted) {
        const requested = await requestPermissions();
        if (!requested) {
          setError("Screenshot permission denied");
          return false;
        }
      }

      const { ScreenshotListener } = await import(
        "../plugins/ScreenshotListener"
      );
      const result = await ScreenshotListener.startListener();

      if (result.success) {
        setIsListening(true);
        setError(null);
        console.log("Screenshot listener started successfully");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error starting screenshot listener:", err);
      setError(err.message);
      return false;
    }
  };

  const stopListener = async () => {
    if (!Capacitor.isNativePlatform()) {
      return false;
    }

    try {
      const { ScreenshotListener } = await import(
        "../plugins/ScreenshotListener"
      );
      const result = await ScreenshotListener.stopListener();

      if (result.success) {
        setIsListening(false);
        console.log("Screenshot listener stopped");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error stopping screenshot listener:", err);
      setError(err.message);
      return false;
    }
  };

  // Auto-start listener on mount if permission is granted
  useEffect(() => {
    const initListener = async () => {
      const granted = await checkPermissions();
      if (granted) {
        await startListener();
      }
    };

    initListener();

    // Cleanup on unmount
    return () => {
      if (isListening) {
        stopListener();
      }
    };
  }, []);

  const value = {
    isListening,
    hasPermission,
    error,
    startListener,
    stopListener,
    checkPermissions,
    requestPermissions,
  };

  return (
    <ScreenshotContext.Provider value={value}>
      {children}
    </ScreenshotContext.Provider>
  );
};
