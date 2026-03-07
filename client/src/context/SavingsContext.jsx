import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import api from "../lib/api";

const SavingsContext = createContext();

export const useSavings = () => useContext(SavingsContext);

/**
 * Helper function to calculate date range for a given time interval
 * @param {string} interval - One of: 'day', 'week', 'month', 'quarter', 'year'
 * @returns {{ startDate: string, endDate: string }} ISO date strings
 */
export const getDateRangeForInterval = (interval) => {
  const now = new Date();
  const endDate = now.toISOString().split("T")[0]; // Today in YYYY-MM-DD format
  let startDate;

  switch (interval) {
    case "day":
      startDate = endDate; // Same day
      break;

    case "week":
      // Start of current week (Sunday)
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      startDate = weekStart.toISOString().split("T")[0];
      break;

    case "month":
      // Start of current month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      break;

    case "quarter":
      // Start of current quarter
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1)
        .toISOString()
        .split("T")[0];
      break;

    case "year":
      // Start of current year
      startDate = new Date(now.getFullYear(), 0, 1).toISOString().split("T")[0];
      break;

    default:
      // Default to current month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
  }

  return { startDate, endDate };
};

export const SavingsProvider = ({ children }) => {
  const { user: authUser } = useAuth();

  // State management
  const [savings, setSavings] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [streaks, setStreaks] = useState(null);
  const [jars, setJars] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [autoSaveRules, setAutoSaveRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cache key for localStorage
  const CACHE_KEY = "savings_cache";
  const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

  /**
   * Calculate savings for a given time interval
   * Implements caching for performance (Requirement 2.2: < 500ms)
   * @param {string} interval - Time interval: 'day', 'week', 'month', 'quarter', 'year'
   * @returns {Promise<Object>} Savings metrics
   */
  const calculateSavings = async (interval = "month") => {
    if (!authUser) {
      console.log("⚠️ SavingsContext: No authenticated user");
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      // Check cache first for performance
      const cached = getCachedSavings(interval);
      if (cached) {
        console.log("✅ SavingsContext: Using cached savings data");
        setSavings(cached);
        setLoading(false);
        return cached;
      }

      // Calculate date range for the interval
      const { startDate, endDate } = getDateRangeForInterval(interval);

      console.log(
        `🔄 SavingsContext: Calculating savings for ${interval} (${startDate} to ${endDate})`,
      );

      // Call API endpoint
      const response = await api.get("/savings/calculate", {
        params: {
          interval,
          startDate,
          endDate,
        },
      });

      const savingsData = response.data;
      console.log("✅ SavingsContext: Savings calculated:", savingsData);

      // Cache the result
      cacheSavings(interval, savingsData);

      // Update state
      setSavings(savingsData);
      return savingsData;
    } catch (err) {
      console.error(
        "❌ SavingsContext: Error calculating savings:",
        err.response?.data || err.message || err,
      );

      // Try to use cached data as fallback
      const cached = getCachedSavings(interval, true); // Ignore expiry
      if (cached) {
        console.log("⚠️ SavingsContext: Using stale cached data as fallback");
        setSavings(cached);
        setError("Using offline data. Please check your connection.");
        return cached;
      }

      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to calculate savings",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get cached savings data from localStorage
   * @param {string} interval - Time interval
   * @param {boolean} ignoreExpiry - Whether to ignore cache expiry
   * @returns {Object|null} Cached savings data or null
   */
  const getCachedSavings = (interval, ignoreExpiry = false) => {
    try {
      const cacheStr = localStorage.getItem(CACHE_KEY);
      if (!cacheStr) return null;

      const cache = JSON.parse(cacheStr);
      const cacheKey = `${interval}_${authUser?.id}`;

      if (!cache[cacheKey]) return null;

      const { data, timestamp } = cache[cacheKey];
      const age = Date.now() - timestamp;

      // Check if cache is still valid
      if (!ignoreExpiry && age > CACHE_EXPIRY_MS) {
        console.log("⚠️ SavingsContext: Cache expired");
        return null;
      }

      return data;
    } catch (err) {
      console.error("❌ SavingsContext: Error reading cache:", err);
      return null;
    }
  };

  /**
   * Cache savings data to localStorage
   * @param {string} interval - Time interval
   * @param {Object} data - Savings data to cache
   */
  const cacheSavings = (interval, data) => {
    try {
      const cacheStr = localStorage.getItem(CACHE_KEY) || "{}";
      const cache = JSON.parse(cacheStr);
      const cacheKey = `${interval}_${authUser?.id}`;

      cache[cacheKey] = {
        data,
        timestamp: Date.now(),
      };

      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      console.log("✅ SavingsContext: Savings data cached");
    } catch (err) {
      console.error("❌ SavingsContext: Error caching data:", err);
    }
  };

  /**
   * Clear cached savings data
   */
  const clearCache = () => {
    try {
      localStorage.removeItem(CACHE_KEY);
      console.log("✅ SavingsContext: Cache cleared");
    } catch (err) {
      console.error("❌ SavingsContext: Error clearing cache:", err);
    }
  };

  /**
   * Fetch achievements for the current user
   */
  const fetchAchievements = async () => {
    if (!authUser) return;

    try {
      const response = await api.get("/savings/achievements");
      setAchievements(response.data);
      return response.data;
    } catch (err) {
      console.error(
        "❌ SavingsContext: Error fetching achievements:",
        err.response?.data || err.message || err,
      );
      return [];
    }
  };

  /**
   * Fetch streak data for the current user
   */
  const fetchStreaks = async () => {
    if (!authUser) return;

    try {
      const response = await api.get("/savings/streaks");
      setStreaks(response.data);
      return response.data;
    } catch (err) {
      console.error(
        "❌ SavingsContext: Error fetching streaks:",
        err.response?.data || err.message || err,
      );
      return null;
    }
  };

  /**
   * Fetch virtual jars for the current user
   */
  const fetchJars = async () => {
    if (!authUser) return;

    try {
      const response = await api.get("/savings/jars");
      setJars(response.data);
      return response.data;
    } catch (err) {
      console.error("❌ SavingsContext: Error fetching jars:", err);
      return [];
    }
  };

  /**
   * Fetch challenges for the current user
   */
  const fetchChallenges = async () => {
    if (!authUser) return;

    try {
      const response = await api.get("/savings/challenges");
      setChallenges(response.data);
      return response.data;
    } catch (err) {
      console.error("❌ SavingsContext: Error fetching challenges:", err);
      return [];
    }
  };

  /**
   * Fetch auto-save rules for the current user
   */
  const fetchAutoSaveRules = async () => {
    if (!authUser) return;

    try {
      const response = await api.get("/savings/auto-save-rules");
      setAutoSaveRules(response.data);
      return response.data;
    } catch (err) {
      console.error("❌ SavingsContext: Error fetching auto-save rules:", err);
      return [];
    }
  };

  /**
   * Create a new virtual jar
   */
  const createJar = async (jarData) => {
    if (!authUser) {
      throw new Error("User not authenticated");
    }

    try {
      const response = await api.post("/savings/jars", jarData);
      const newJar = response.data;
      setJars([...jars, newJar]);
      return newJar;
    } catch (err) {
      console.error("❌ SavingsContext: Error creating jar:", err);
      throw err;
    }
  };

  /**
   * Allocate funds to a virtual jar
   */
  const allocateToJar = async (jarId, amount) => {
    if (!authUser) {
      throw new Error("User not authenticated");
    }

    try {
      const response = await api.post(`/savings/jars/${jarId}/allocate`, {
        amount,
      });
      const updatedJar = response.data;

      // Update jars in state
      setJars(jars.map((jar) => (jar.id === jarId ? updatedJar : jar)));

      // Clear savings cache since allocation affects savings
      clearCache();

      return updatedJar;
    } catch (err) {
      console.error("❌ SavingsContext: Error allocating to jar:", err);
      throw err;
    }
  };

  /**
   * Create a new savings challenge
   */
  const createChallenge = async (challengeData) => {
    if (!authUser) {
      throw new Error("User not authenticated");
    }

    try {
      const response = await api.post("/savings/challenges", challengeData);
      const newChallenge = response.data;
      setChallenges([...challenges, newChallenge]);
      return newChallenge;
    } catch (err) {
      console.error("❌ SavingsContext: Error creating challenge:", err);
      throw err;
    }
  };

  /**
   * Add a new auto-save rule
   */
  const addAutoSaveRule = async (ruleData) => {
    if (!authUser) {
      throw new Error("User not authenticated");
    }

    try {
      const response = await api.post("/savings/auto-save-rules", ruleData);
      const newRule = response.data;
      setAutoSaveRules([...autoSaveRules, newRule]);
      return newRule;
    } catch (err) {
      console.error("❌ SavingsContext: Error adding auto-save rule:", err);
      throw err;
    }
  };

  /**
   * Export savings data
   */
  const exportSavingsData = async (format, dateRange) => {
    if (!authUser) {
      throw new Error("User not authenticated");
    }

    try {
      const response = await api.get("/savings/export", {
        params: {
          format,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
        responseType: "blob",
      });

      return response.data;
    } catch (err) {
      console.error("❌ SavingsContext: Error exporting data:", err);
      throw err;
    }
  };

  // Clear cache when user changes or logs out
  useEffect(() => {
    if (!authUser) {
      // Clear all state when user logs out
      setSavings(null);
      setAchievements([]);
      setStreaks(null);
      setJars([]);
      setChallenges([]);
      setAutoSaveRules([]);
      clearCache();
    }
  }, [authUser]);

  // Listen for expense/budget changes to invalidate cache
  useEffect(() => {
    const handleDataChange = () => {
      console.log("🔄 SavingsContext: Data changed, clearing cache");
      clearCache();
    };

    window.addEventListener("refreshExpenses", handleDataChange);
    window.addEventListener("budgetUpdated", handleDataChange);

    return () => {
      window.removeEventListener("refreshExpenses", handleDataChange);
      window.removeEventListener("budgetUpdated", handleDataChange);
    };
  }, []);

  const value = {
    // State
    savings,
    achievements,
    streaks,
    jars,
    challenges,
    autoSaveRules,
    loading,
    error,

    // Actions
    calculateSavings,
    fetchAchievements,
    fetchStreaks,
    fetchJars,
    fetchChallenges,
    fetchAutoSaveRules,
    createJar,
    allocateToJar,
    createChallenge,
    addAutoSaveRule,
    exportSavingsData,
    clearCache,
  };

  return (
    <SavingsContext.Provider value={value}>{children}</SavingsContext.Provider>
  );
};
