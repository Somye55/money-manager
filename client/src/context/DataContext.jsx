import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  getOrCreateUser,
  getCategories,
  getExpenses,
  getUserSettings,
  updateUserSettings,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryOrders,
  createExpense,
  updateExpense,
  deleteExpense,
  getCurrentMonthExpenses,
  getSpendingByCategory,
  getTotalSpending,
} from "../lib/dataService";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { user: authUser } = useAuth();

  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize user data when auth user changes
  useEffect(() => {
    const initializeUserData = async () => {
      console.log(
        "🔄 DataContext: Auth user changed:",
        authUser?.email || "no user"
      );

      if (!authUser) {
        console.log("🔄 DataContext: No auth user, clearing data");
        setUser(null);
        setCategories([]);
        setExpenses([]);
        setSettings(null);
        setLoading(false);
        return;
      }

      try {
        console.log(
          "🔄 DataContext: Initializing user data for:",
          authUser.email
        );
        setLoading(true);
        setError(null);

        // Get or create user profile
        const userData = await getOrCreateUser(authUser);
        console.log(
          "🔄 DataContext: User data retrieved:",
          userData?.email || "no user data"
        );
        setUser(userData);

        if (userData) {
          console.log(
            "🔄 DataContext: Loading user data (categories, expenses, settings)"
          );
          // Load all user data in parallel
          const [categoriesData, expensesData, settingsData] =
            await Promise.all([
              getCategories(userData.id),
              getCurrentMonthExpenses(userData.id),
              getUserSettings(userData.id),
            ]);

          console.log("🔄 DataContext: Data loaded:", {
            categories: categoriesData?.length || 0,
            expenses: expensesData?.length || 0,
            settings: settingsData ? "loaded" : "none",
          });

          setCategories(categoriesData);
          setExpenses(expensesData);
          setSettings(settingsData);
        }
      } catch (err) {
        console.error("❌ DataContext: Error initializing user data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeUserData();
  }, [authUser]);

  // Category operations
  const addCategory = async (categoryData) => {
    if (!user) {
      console.error("❌ No user found when trying to add category");
      return;
    }

    console.log("🔄 Adding category with data:", categoryData);
    console.log("🔄 User ID:", user.id);

    try {
      const newCategory = await createCategory({
        ...categoryData,
        userId: user.id,
      });
      console.log("✅ Category created successfully:", newCategory);
      setCategories([...categories, newCategory]);
      return newCategory;
    } catch (error) {
      console.error("❌ Error in addCategory context:", error);
      throw error;
    }
  };

  const modifyCategory = async (id, updates) => {
    const updated = await updateCategory(id, updates);
    setCategories(categories.map((cat) => (cat.id === id ? updated : cat)));
    return updated;
  };

  const removeCategory = async (id) => {
    await deleteCategory(id);
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const reorderCategories = async (reorderedCategories) => {
    setCategories(reorderedCategories);
    await updateCategoryOrders(reorderedCategories);
  };

  // Expense operations
  const addExpense = async (expenseData) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const newExpense = await createExpense({
        ...expenseData,
        userId: user.id,
        source: expenseData.source || "MANUAL",
      });
      setExpenses([newExpense, ...expenses]);
      console.log("✅ Expense added successfully to context");
      return newExpense;
    } catch (error) {
      console.error("❌ Failed to add expense:", error);
      throw error;
    }
  };

  const modifyExpense = async (id, updates) => {
    const updated = await updateExpense(id, updates);
    setExpenses(expenses.map((exp) => (exp.id === id ? updated : exp)));
    return updated;
  };

  const removeExpense = async (id) => {
    await deleteExpense(id);
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  const refreshExpenses = async (filters) => {
    if (!user) return;

    const data = filters
      ? await getExpenses(user.id, filters)
      : await getCurrentMonthExpenses(user.id);
    setExpenses(data);
  };

  // Settings operations
  const modifySettings = async (updates) => {
    if (!user) return;

    const updated = await updateUserSettings(user.id, updates);
    setSettings(updated);
    return updated;
  };

  // Analytics
  const getAnalytics = async () => {
    if (!user) return null;

    const [categorySpending, totalSpending] = await Promise.all([
      getSpendingByCategory(user.id),
      getTotalSpending(user.id),
    ]);

    return {
      categorySpending,
      totalSpending,
    };
  };

  const value = {
    user,
    categories,
    expenses,
    settings,
    loading,
    error,

    // Category methods
    addCategory,
    modifyCategory,
    removeCategory,
    reorderCategories,

    // Expense methods
    addExpense,
    modifyExpense,
    removeExpense,
    refreshExpenses,

    // Settings methods
    modifySettings,

    // Analytics
    getAnalytics,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
