import { supabase } from "./supabase";

// ============= USER OPERATIONS =============

/**
 * Get or create user profile
 */
export const getOrCreateUser = async (authUser) => {
  if (!authUser) return null;

  try {
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("User")
      .select("*")
      .eq("email", authUser.email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching user:", fetchError);
      throw fetchError;
    }

    if (existingUser) {
      console.log("✅ User found:", existingUser.email);
      return existingUser;
    }

    console.log("🔄 Creating new user for:", authUser.email);

    // Create new user
    const { data: newUser, error: createError } = await supabase
      .from("User")
      .insert([
        {
          email: authUser.email,
          name:
            authUser.user_metadata?.full_name ||
            authUser.user_metadata?.name ||
            authUser.email.split("@")[0],
          googleId: authUser.id,
        },
      ])
      .select()
      .single();

    if (createError) {
      console.error("❌ Error creating user:", createError);
      throw createError;
    }

    console.log("✅ User created successfully:", newUser.email);

    // Initialize default categories and settings for new user
    if (newUser) {
      try {
        await Promise.all([
          initializeDefaultCategories(newUser.id),
          initializeDefaultSettings(newUser.id),
        ]);
        console.log("✅ Default data initialized for user");
      } catch (initError) {
        console.error("⚠️ Error initializing default data:", initError);
        // Don't throw here, user is created successfully
      }
    }

    return newUser;
  } catch (error) {
    console.error("❌ Error in getOrCreateUser:", error);
    throw error;
  }
};

// ============= SETTINGS OPERATIONS =============

/**
 * Initialize default settings for a new user
 */
const initializeDefaultSettings = async (userId) => {
  const defaultSettings = {
    userId,
    currency: "INR",
    monthlyBudget: null,
    enableNotifications: true,
    theme: "system",
  };

  const { error } = await supabase
    .from("UserSettings")
    .insert([defaultSettings]);

  if (error) {
    console.error("Error creating default settings:", error);
  }
};

/**
 * Get user settings
 */
export const getUserSettings = async (userId) => {
  const { data, error } = await supabase
    .from("UserSettings")
    .select("*")
    .eq("userId", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows returned
    console.error("Error fetching settings:", error);
    throw error;
  }

  // If no settings exist, create default
  if (!data) {
    await initializeDefaultSettings(userId);
    return getUserSettings(userId);
  }

  return data;
};

/**
 * Update user settings
 */
export const updateUserSettings = async (userId, settings) => {
  const { data, error } = await supabase
    .from("UserSettings")
    .update(settings)
    .eq("userId", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating settings:", error);
    throw error;
  }

  return data;
};

// ============= CATEGORY OPERATIONS =============

/**
 * Initialize default categories for a new user
 */
const initializeDefaultCategories = async (userId) => {
  const defaultCategories = [
    { name: "Food", icon: "Coffee", color: "#f59e0b", userId, order: 0 },
    { name: "Transport", icon: "Car", color: "#3b82f6", userId, order: 1 },
    {
      name: "Shopping",
      icon: "ShoppingBag",
      color: "#ec4899",
      userId,
      order: 2,
    },
    { name: "Bills", icon: "Home", color: "#8b5cf6", userId, order: 3 },
    { name: "Entertainment", icon: "Film", color: "#10b981", userId, order: 4 },
    { name: "Health", icon: "Heart", color: "#ef4444", userId, order: 5 },
    { name: "Education", icon: "BookOpen", color: "#f97316", userId, order: 6 },
    {
      name: "Other",
      icon: "MoreHorizontal",
      color: "#6366f1",
      userId,
      order: 7,
    },
  ];

  const { error } = await supabase.from("Category").insert(defaultCategories);

  if (error) {
    console.error("Error creating default categories:", error);
  }
};

/**
 * Get all categories for a user
 */
export const getCategories = async (userId) => {
  const { data, error } = await supabase
    .from("Category")
    .select("*")
    .eq("userId", userId)
    .order("order", { ascending: true })
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }

  return data || [];
};

/**
 * Create a new category
 */
export const createCategory = async (category) => {
  try {
    console.log("🔄 createCategory called with:", category);

    // Validate required fields
    if (!category.name || !category.userId) {
      console.error("❌ Missing required fields:", {
        name: category.name,
        userId: category.userId,
      });
      throw new Error("Category name and user ID are required");
    }

    // Sanitize and validate data
    const sanitizedCategory = {
      ...category,
      name: category.name.trim(),
      icon: category.icon || "Tag",
      color: category.color || "#6366f1",
      order: category.order || 0,
    };

    console.log("🔄 Sanitized category data:", sanitizedCategory);

    // Check for duplicate names for this user
    console.log("🔄 Checking for duplicate names...");
    const { data: existingCategories, error: duplicateError } = await supabase
      .from("Category")
      .select("name")
      .eq("userId", category.userId)
      .ilike("name", sanitizedCategory.name);

    if (duplicateError) {
      console.error("❌ Error checking duplicates:", duplicateError);
      throw new Error("Failed to check for duplicate categories");
    }

    console.log("🔄 Existing categories check result:", existingCategories);

    if (existingCategories && existingCategories.length > 0) {
      throw new Error("A category with this name already exists");
    }

    console.log("🔄 Inserting category into database...");

    // Check current user session
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    console.log("🔄 Current Supabase user:", currentUser);

    const { data, error } = await supabase
      .from("Category")
      .insert([sanitizedCategory])
      .select()
      .single();

    if (error) {
      console.error("❌ Database error creating category:", error);
      console.error("❌ Error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      // Handle specific database errors
      if (error.code === "23505") {
        throw new Error("A category with this name already exists");
      }

      throw new Error(error.message || "Failed to create category");
    }

    console.log("✅ Category created successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Error in createCategory:", error);
    throw error;
  }
};

/**
 * Update a category
 */
export const updateCategory = async (id, updates) => {
  try {
    if (!id) {
      throw new Error("Category ID is required");
    }

    // Sanitize updates
    const sanitizedUpdates = { ...updates };
    if (sanitizedUpdates.name) {
      sanitizedUpdates.name = sanitizedUpdates.name.trim();
    }

    // If updating name, check for duplicates
    if (sanitizedUpdates.name) {
      const { data: category } = await supabase
        .from("Category")
        .select("userId")
        .eq("id", id)
        .single();

      if (category) {
        const { data: existingCategories } = await supabase
          .from("Category")
          .select("id, name")
          .eq("userId", category.userId)
          .ilike("name", sanitizedUpdates.name)
          .neq("id", id);

        if (existingCategories && existingCategories.length > 0) {
          throw new Error("A category with this name already exists");
        }
      }
    }

    const { data, error } = await supabase
      .from("Category")
      .update(sanitizedUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating category:", error);

      // Handle specific database errors
      if (error.code === "23505") {
        throw new Error("A category with this name already exists");
      }

      throw new Error(error.message || "Failed to update category");
    }

    console.log("✅ Category updated successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Error in updateCategory:", error);
    throw error;
  }
};

/**
 * Delete a category
 */
export const deleteCategory = async (id) => {
  const { error } = await supabase.from("Category").delete().eq("id", id);

  if (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

/**
 * Batch update category orders
 */
export const updateCategoryOrders = async (categories) => {
  const updates = categories.map((cat, index) => ({
    id: cat.id,
    order: index,
  }));

  // Update each category's order
  const promises = updates.map(({ id, order }) =>
    supabase.from("Category").update({ order }).eq("id", id)
  );

  const results = await Promise.all(promises);

  const errors = results.filter((r) => r.error);
  if (errors.length > 0) {
    console.error("Error updating category orders:", errors);
    throw errors[0].error;
  }
};

// ============= EXPENSE OPERATIONS =============

/**
 * Get all expenses for a user
 */
export const getExpenses = async (userId, filters = {}) => {
  let query = supabase
    .from("Expense")
    .select(
      `
      *,
      category:Category(*)
    `
    )
    .eq("userId", userId)
    .order("date", { ascending: false });

  // Apply filters
  if (filters.categoryId) {
    query = query.eq("categoryId", filters.categoryId);
  }

  if (filters.startDate) {
    query = query.gte("date", filters.startDate);
  }

  if (filters.endDate) {
    query = query.lte("date", filters.endDate);
  }

  if (filters.source) {
    query = query.eq("source", filters.source);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }

  return data || [];
};

/**
 * Get expenses for current month
 */
export const getCurrentMonthExpenses = async (userId) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  return getExpenses(userId, {
    startDate: startOfMonth.toISOString(),
    endDate: endOfMonth.toISOString(),
  });
};

/**
 * Create a new expense
 */
export const createExpense = async (expense) => {
  try {
    console.log("🔄 Creating expense:", expense);

    const { data, error } = await supabase
      .from("Expense")
      .insert([expense])
      .select(
        `
        *,
        category:Category(*)
      `
      )
      .single();

    if (error) {
      console.error("❌ Error creating expense:", error);
      throw error;
    }

    console.log("✅ Expense created successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Error in createExpense:", error);
    throw error;
  }
};

/**
 * Update an expense
 */
export const updateExpense = async (id, updates) => {
  const { data, error } = await supabase
    .from("Expense")
    .update(updates)
    .eq("id", id)
    .select(
      `
      *,
      category:Category(*)
    `
    )
    .single();

  if (error) {
    console.error("Error updating expense:", error);
    throw error;
  }

  return data;
};

/**
 * Delete an expense
 */
export const deleteExpense = async (id) => {
  const { error } = await supabase.from("Expense").delete().eq("id", id);

  if (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};

// ============= ANALYTICS =============

/**
 * Get spending by category for the current month
 */
export const getSpendingByCategory = async (userId) => {
  const expenses = await getCurrentMonthExpenses(userId);

  const categoryTotals = {};

  expenses.forEach((expense) => {
    const categoryName = expense.category?.name || "Uncategorized";
    const amount = parseFloat(expense.amount);

    if (!categoryTotals[categoryName]) {
      categoryTotals[categoryName] = {
        total: 0,
        count: 0,
        color: expense.category?.color || "#6366f1",
      };
    }

    categoryTotals[categoryName].total += amount;
    categoryTotals[categoryName].count += 1;
  });

  return categoryTotals;
};

/**
 * Get total spending for current month
 */
export const getTotalSpending = async (userId) => {
  const expenses = await getCurrentMonthExpenses(userId);
  return expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
};
