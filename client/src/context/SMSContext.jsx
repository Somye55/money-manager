import React, { createContext, useContext, useState, useEffect } from 'react';
import smsService from '../lib/smsService';
import { parseSMSList, parseNotification } from '../lib/smsParser';
import { useData } from './DataContext';

const SMSContext = createContext();

export const useSMS = () => useContext(SMSContext);

export const SMSProvider = ({ children }) => {
  const { addExpense, categories } = useData();
  const [isSupported, setIsSupported] = useState(false);
  
  // Permissions state
  const [smsPermissionGranted, setSmsPermissionGranted] = useState(false);
  const [notifPermissionGranted, setNotifPermissionGranted] = useState(false);
  
  const [scanning, setScanning] = useState(false);
  const [extractedExpenses, setExtractedExpenses] = useState([]);
  const [lastScanTime, setLastScanTime] = useState(null);

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
      await smsService.startNotificationListener((data) => {
          console.log("Notification received:", data);
          const parsed = parseNotification(data);
          
          if (parsed && parsed.confidence > 40 && parsed.transactionType === 'expense') {
              // Add to extracted expenses list to be reviewed
              setExtractedExpenses(prev => {
                  // Avoid duplicates in short timeframe
                  const exists = prev.some(e => 
                      e.amount === parsed.amount && 
                      e.rawSMS === parsed.rawSMS
                  );
                  if (exists) return prev;
                  return [parsed, ...prev];
              });
          }
      });
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
        console.warn('SMS reading not supported on this device');
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
      const recentMessages = messages.filter(msg => {
        const msgDate = new Date(msg.date);
        return msgDate >= startDate && msgDate <= endDate;
      });

      const parsedExpenses = parseSMSList(recentMessages, {
        minConfidence: 40,
        filterDuplicates: true
      });

      // Merge with existing, avoiding duplicates
      setExtractedExpenses(prev => {
          const newExpenses = parsedExpenses.filter(pe => 
              !prev.some(existing => existing.rawSMS === pe.rawSMS)
          );
          return [...newExpenses, ...prev];
      });

      setLastScanTime(new Date());
      return parsedExpenses;
    } catch (error) {
      console.error('Error scanning SMS:', error);
      throw error;
    } finally {
      setScanning(false);
    }
  };

  // Import operations
  const importExpense = async (expenseData) => {
    try {
        const { confidence, rawSMS, suggestedCategory, ...cleanData } = expenseData;

        let categoryId = null;
        if (categories && categories.length > 0 && suggestedCategory) {
            let match = categories.find(c => c.name.toLowerCase() === suggestedCategory.toLowerCase());
            if (!match) match = categories.find(c => c.name === 'Other');
            if (match) categoryId = match.id;
        }

        const finalData = { ...cleanData, categoryId, source: expenseData.source || 'SMS' };
        const result = await addExpense(finalData);
        
        setExtractedExpenses(prev => prev.filter(e => e !== expenseData));
        return result;
    } catch (error) {
        console.error("Failed to import expense", error);
        throw error;
    }
  };

  const dismissExpense = (expenseToDismiss) => {
      setExtractedExpenses(prev => prev.filter(e => e !== expenseToDismiss));
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
    dismissExpense
  };

  return (
    <SMSContext.Provider value={value}>
      {children}
    </SMSContext.Provider>
  );
};
