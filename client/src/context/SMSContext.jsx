import React, { createContext, useContext, useState, useEffect } from 'react';
import smsService from '../lib/smsService';
import { parseSMSList } from '../lib/smsParser';
import { useData } from './DataContext';

const SMSContext = createContext();

export const useSMS = () => useContext(SMSContext);

export const SMSProvider = ({ children }) => {
  const { addExpense } = useData();
  const [isSupported, setIsSupported] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [extractedExpenses, setExtractedExpenses] = useState([]);
  const [lastScanTime, setLastScanTime] = useState(null);

  // Check support and initial permission status
  useEffect(() => {
    const checkSupport = async () => {
      const supported = smsService.isAvailable();
      setIsSupported(supported);

      if (supported) {
        const hasPermission = await smsService.checkPermission();
        setPermissionGranted(hasPermission);
      }
    };

    checkSupport();
  }, []);

  // Request permission
  const requestPermission = async () => {
    if (!isSupported) return false;

    try {
      const granted = await smsService.requestPermission();
      setPermissionGranted(granted);
      return granted;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  };

  // Scan for financial SMS
  const scanSMS = async (daysLookback = 30) => {
    if (!isSupported || !permissionGranted) {
      if (!permissionGranted) {
        const granted = await requestPermission();
        if (!granted) return [];
      } else {
        return [];
      }
    }

    setScanning(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysLookback);

      // Get financial SMS
      const messages = await smsService.getFinancialSMS({
        maxCount: 500 // Limit to avoid performance issues
      });

      // Filter by date manually as the plugin might return all
      const recentMessages = messages.filter(msg => {
        const msgDate = new Date(msg.date);
        return msgDate >= startDate && msgDate <= endDate;
      });

      // Parse messages to get expenses
      const parsedExpenses = parseSMSList(recentMessages, {
        minConfidence: 40,
        filterDuplicates: true
      });

      setExtractedExpenses(parsedExpenses);
      setLastScanTime(new Date());
      return parsedExpenses;
    } catch (error) {
      console.error('Error scanning SMS:', error);
      throw error;
    } finally {
      setScanning(false);
    }
  };

  // Import a single expense
  const importExpense = async (expenseData) => {
    try {
        // Ensure category is an object if the DataContext expects it
        // OR map the suggestedCategory string to an actual existing category ID/object
        // For now, we pass it as is, but in a real app we'd match with existing categories
        
        // Remove helper fields not needed for storage
        const { confidence, rawSMS, suggestedCategory, ...cleanData } = expenseData;

        // Use the suggested category name directly or fallback to "Uncategorized"
        // Ideally, we should look up the category ID from DataContext here if needed
        // For this implementation, we assume addExpense handles text categories or creates them
        
        // Let's attach the category name so DataContext can handle it
        const finalData = {
            ...cleanData,
            categoryName: suggestedCategory 
        };

        const result = await addExpense(finalData);
        
        // Remove from extracted list
        setExtractedExpenses(prev => prev.filter(e => e !== expenseData));
        
        return result;
    } catch (error) {
        console.error("Failed to import expense", error);
        throw error;
    }
  };

  // Import multiple expenses
  const importAllExpenses = async (expensesList) => {
    const results = [];
    for (const expense of expensesList) {
      try {
        const result = await importExpense(expense);
        results.push(result);
      } catch (error) {
        console.error('Error importing expense:', expense, error);
      }
    }
    return results;
  };

  // Dismiss an expense (remove from list without importing)
  const dismissExpense = (expenseToDismiss) => {
      setExtractedExpenses(prev => prev.filter(e => e !== expenseToDismiss));
  };

  const value = {
    isSupported,
    permissionGranted,
    scanning,
    extractedExpenses,
    lastScanTime,
    requestPermission,
    scanSMS,
    importExpense,
    importAllExpenses,
    dismissExpense
  };

  return (
    <SMSContext.Provider value={value}>
      {children}
    </SMSContext.Provider>
  );
};
