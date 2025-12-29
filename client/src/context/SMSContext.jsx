import React, { createContext, useContext, useState, useEffect } from "react";
import smsService from "../lib/smsService";
import { parseSMSList, parseNotification } from "../lib/smsParser";
import { useData } from "./DataContext";
import { getUserSettings } from "../lib/dataService";

const SMSContext = createContext();

export const useSMS = () => useContext(SMSContext);

export const SMSProvider = ({ children }) => {
  const { addExpense, categories, user, settings } = useData();
  const [isSupported, setIsSupported] = useState(false);

  // Permissions state
  const [smsPermissionGranted, setSmsPermissionGranted] = useState(false);
  const [notifPermissionGranted, setNotifPermissionGranted] = useState(false);

  const [scanning, setScanning] = useState(false);
  const [extractedExpenses, setExtractedExpenses] = useState([]);
  const [lastScanTime, setLastScanTime] = useState(null);

  // Popup state for immediate categorization
  const [pendingExpense, setPendingExpense] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Initialization
  useEffect(() => {
    const init = async () => {
      const supported = smsService.isAvailable();
      setIsSupported(supported);

      if (supported) {
        // Check SMS permission
        const hasSMS = await smsService.checkSMSPermission();
        setSmsPermissionGranted(hasSMS);

        // Check Notification permission
        const hasNotif = await smsService.checkNotificationPermission();
        setNotifPermissionGranted(hasNotif);

        // Start listening if we have permission
        if (hasNotif) {
          startLiveListener();
        }
      }
    };
    init();

    // Cleanup listener on unmount
    return () => {
      smsService.stopNotificationListener();
    };
  }, []);

  // Real-time listener
  const startLiveListener = async () => {
    try {
      // Set selected apps from user settings
      if (settings?.selectedApps) {
        await smsService.setSelectedApps(settings.selectedApps);
      }

      await smsService.startNotificationListener(
        (data) => {
          console.log("Notification received in SMSContext:", data);

          // Parse the notification
          const parsed = parseNotification(data);
          console.log("Parsed notification:", parsed);

          if (parsed && parsed.confidence > 40) {
            // Check for duplicates
            setExtractedExpenses((prev) => {
              const exists = prev.some(
                (e) => e.amount === parsed.amount && e.rawSMS === parsed.rawSMS
              );

              if (!exists) {
                // Show popup immediately for categorization
                setPendingExpense(parsed);
                setShowCategoryModal(true);

                // Also add to extracted expenses list as backup
                return [parsed, ...prev];
              }

              return prev;
            });
          }
        },
        (data) => {
          console.log("Expense saved from overlay:", data);
          handleExpenseSavedFromOverlay(data);
        }
      );

      console.log("Live notification listener started successfully");
    } catch (error) {
      console.error("Error starting live listener:", error);
    }
  };

  // Permission Requests
  const requestSMSPermission = async () => {
    if (!isSupported) return false;
    const granted = await smsService.requestSMSPermission();
    setSmsPermissionGranted(granted);
    return granted;
  };

  const requestNotificationPermission = async () => {
    if (!isSupported) return;
    await smsService.requestNotificationPermission();
    // The user returns from settings, we need to check again manually or via resume event
    // For now we just set a timeout to check
    setTimeout(async () => {
      const granted = await smsService.checkNotificationPermission();
      setNotifPermissionGranted(granted);
      if (granted) startLiveListener();
    }, 1000);
  };

  // Scan Historical SMS
  const scanSMS = async (daysLookback = 30) => {
    if (!isSupported) {
      console.warn("SMS reading not supported on this device");
      return [];
    }

    if (!smsPermissionGranted) {
      const granted = await requestSMSPermission();
      if (!granted) return [];
    }

    setScanning(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysLookback);

      const messages = await smsService.getFinancialSMS({ maxCount: 500 });

      // Filter by date
      const recentMessages = messages.filter((msg) => {
        const msgDate = new Date(msg.date);
        return msgDate >= startDate && msgDate <= endDate;
      });

      const parsedExpenses = parseSMSList(recentMessages, {
        minConfidence: 40,
        filterDuplicates: true,
      });

      // Merge with existing, avoiding duplicates
      setExtractedExpenses((prev) => {
        const newExpenses = parsedExpenses.filter(
          (pe) => !prev.some((existing) => existing.rawSMS === pe.rawSMS)
        );
        return [...newExpenses, ...prev];
      });

      setLastScanTime(new Date());
      return parsedExpenses;
    } catch (error) {
      console.error("Error scanning SMS:", error);
      throw error;
    } finally {
      setScanning(false);
    }
  };

  // Import operations
  const importExpense = async (expenseData) => {
    try {
      const { confidence, rawSMS, suggestedCategory, ...cleanData } =
        expenseData;

      let categoryId = null;
      if (categories && categories.length > 0 && suggestedCategory) {
        let match = categories.find(
          (c) => c.name.toLowerCase() === suggestedCategory.toLowerCase()
        );
        if (!match) match = categories.find((c) => c.name === "Other");
        if (match) categoryId = match.id;
      }

      const finalData = {
        ...cleanData,
        categoryId,
        source: expenseData.source || "SMS",
      };
      const result = await addExpense(finalData);

      setExtractedExpenses((prev) => prev.filter((e) => e !== expenseData));
      return result;
    } catch (error) {
      console.error("Failed to import expense", error);
      throw error;
    }
  };

  const dismissExpense = (expenseToDismiss) => {
    setExtractedExpenses((prev) => prev.filter((e) => e !== expenseToDismiss));
  };

  // Handle category selection from popup
  const handleCategoryConfirm = async (expense, categoryId) => {
    try {
      const {
        confidence,
        rawSMS,
        suggestedCategory,
        transactionType,
        merchant,
        smsDate,
        ...cleanData
      } = expense;

      const finalData = {
        ...cleanData,
        categoryId,
        source: expense.source || "NOTIFICATION",
        type: transactionType === "income" ? "credit" : "debit",
        notes: rawSMS,
        smsTimestamp: smsDate,
      };

      await addExpense(finalData);

      // Remove from extracted expenses list
      setExtractedExpenses((prev) => prev.filter((e) => e !== expense));

      // Close modal
      setShowCategoryModal(false);
      setPendingExpense(null);
    } catch (error) {
      console.error("Failed to save expense from notification:", error);
      throw error;
    }
  };

  const handleCategoryModalClose = () => {
    setShowCategoryModal(false);
    setPendingExpense(null);
  };

  const handleExpenseSavedFromOverlay = async (data) => {
    try {
      console.log("Handling expense saved from overlay:", data);

      // Use the parsed data from Android
      const amount = data.amount || 0;
      const type = data.type || "debit";
      const transactionTimestamp =
        data.transactionTimestamp || data.notificationTimestamp || Date.now();

      // Map overlay category to database category
      const overlayCategory = data.category;
      let categoryId = null;
      if (categories && categories.length > 0) {
        // Try to find exact match
        let match = categories.find(
          (c) => c.name.toLowerCase() === overlayCategory.toLowerCase()
        );
        if (!match) {
          // Try partial matches
          match = categories.find(
            (c) =>
              overlayCategory.toLowerCase().includes(c.name.toLowerCase()) ||
              c.name.toLowerCase().includes(overlayCategory.toLowerCase())
          );
        }
        if (!match) match = categories.find((c) => c.name === "Other");
        if (match) categoryId = match.id;
      }

      const finalData = {
        amount,
        categoryId,
        source: "NOTIFICATION_OVERLAY",
        type,
        notes: data.text,
        smsTimestamp: transactionTimestamp,
        description: data.title || "Transaction",
      };

      await addExpense(finalData);
      console.log("Expense saved from overlay successfully");
    } catch (error) {
      console.error("Error saving expense from overlay:", error);
    }
  };

  const value = {
    isSupported,
    permissionGranted: smsPermissionGranted, // Legacy naming, refers to SMS
    notifPermissionGranted,
    scanning,
    extractedExpenses,
    lastScanTime,
    requestSMSPermission, // Renamed for clarity but exposed
    requestPermission: requestSMSPermission, // Alias for backward compatibility
    requestNotificationPermission,
    scanSMS,
    importExpense,
    dismissExpense,
    // Popup state
    pendingExpense,
    showCategoryModal,
    handleCategoryConfirm,
    handleCategoryModalClose,
  };

  return <SMSContext.Provider value={value}>{children}</SMSContext.Provider>;
};
