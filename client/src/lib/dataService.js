import { supabase } from "./supabase";

// ============= USER OPERATIONS =============

/**
 * Get or create user profile
 */
export const getOrCreateUser = async (authUser) => {
  if (!authUser) return null;

  try {
    console.log("🔄 Getting or creating user for:", authUser.email);
    console.log("🔄 Auth user ID:", authUser.id);

    // Check if user exists by googleId first, then by email
    let existingUser = null;
    let fetchError = null;

    // Try to find by googleId first
    const { data: userByGoogleId, error: googleIdError } = await supabase
      .from("User")
      .select("*")
      .eq("googleId", authUser.id)
      .single();

    if (googleIdError && googleIdError.code !== "PGRST116") {
      console.error("Error fetching user by googleId:", googleIdError);
    } else if (userByGoogleId) {
      existingUser = userByGoogleId;
      console.log("✅ User found by googleId:", existingUser.email);
    }

    // If not found by googleId, try by email
    if (!existingUser) {
      const { data: userByEmail, error: emailError } = await supabase
        .from("User")
        .select("*")
        .eq("email", authUser.email)
        .single();

      if (emailError && emailError.code !== "PGRST116") {
        console.error("Error fetching user by email:", emailError);
        fetchError = emailError;
      } else if (userByEmail) {
        existingUser = userByEmail;
        console.log("✅ User found by email:", existingUser.email);

        // Update the googleId if it's missing
        if (!existingUser.googleId) {
          console.log("🔄 Updating user with googleId");
          const { data: updatedUser, error: updateError } = await supabase
            .from("User")
            .update({
              googleId: authUser.id,
              updatedAt: new Date().toISOString(),
            })
            .eq("id", existingUser.id)
            .select()
            .single();

          if (updateError) {
            console.error("❌ Error updating user googleId:", updateError);
          } else {
            existingUser = updatedUser;
            console.log("✅ User googleId updated");
          }
        }
      }
    }

    if (fetchError && !existingUser) {
      throw fetchError;
    }

    if (existingUser) {
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (createError) {
      console.error("❌ Error creating user:", createError);
      console.error("❌ Create error details:", {
        code: createError.code,
        message: createError.message,
        details: createError.details,
        hint: createError.hint,
      });
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
    selectedApps: ["com.whatsapp", "com.google.android.apps.messaging"],
  };

  const { data, error } = await supabase
    .from("UserSettings")
    .insert([defaultSettings])
    .select()
    .single();

  if (error) {
    console.error("Error creating default settings:", error);
    throw error; // Throw error to prevent infinite recursion
  }

  return data;
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
    console.log("No settings found, creating defaults for user:", userId);
    try {
      const newSettings = await initializeDefaultSettings(userId);
      return newSettings;
    } catch (err) {
      console.error("Failed to create default settings:", err);
      // Return default settings object without saving to prevent infinite loop
      return {
        userId,
        currency: "INR",
        monthlyBudget: null,
        enableNotifications: true,
        theme: "system",
        selectedApps: ["com.whatsapp", "com.google.android.apps.messaging"],
      };
    }
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

    // Check current user session
    const {
      data: { user: currentUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("❌ Auth error:", authError);
      throw new Error("Authentication error: " + authError.message);
    }

    if (!currentUser) {
      console.error("❌ No authenticated user");
      throw new Error("User not authenticated");
    }

    // Verify the user exists in our database
    const { data: dbUser, error: dbUserError } = await supabase
      .from("User")
      .select("id, email, googleId")
      .eq("id", category.userId)
      .single();

    if (dbUserError) {
      console.error("❌ Database user lookup error:", dbUserError);
      throw new Error("User not found in database");
    }

    console.log("🔄 Database user:", dbUser);

    // Verify the authenticated user matches the database user
    if (dbUser.googleId !== currentUser.id) {
      console.error("❌ User ID mismatch:", {
        dbUserGoogleId: dbUser.googleId,
        currentUserId: currentUser.id,
      });
      throw new Error("User authentication mismatch");
    }

    // Sanitize and validate data
    const sanitizedCategory = {
      ...category,
      name: category.name.trim(),
      icon: category.icon || "Tag",
      color: category.color || "#6366f1",
      order: category.order || 0,
      budget:
        category.budget && category.budget > 0
          ? parseFloat(category.budget)
          : null,
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

      if (error.code === "42501") {
        throw new Error("Permission denied. Please check your authentication.");
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
    if (sanitizedUpdates.budget !== undefined) {
      sanitizedUpdates.budget =
        sanitizedUpdates.budget && sanitizedUpdates.budget > 0
          ? parseFloat(sanitizedUpdates.budget)
          : null;
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

    // Ensure timestamps are set
    const now = new Date().toISOString();

    // Set defaults for optional fields
    const expenseWithDefaults = {
      source: "MANUAL",
      type: "debit",
      ...expense,
      createdAt: now,
      updatedAt: now,
    };

    console.log(
      "🔄 Expense with timestamps and defaults:",
      expenseWithDefaults
    );

    const { data, error } = await supabase
      .from("Expense")
      .insert([expenseWithDefaults])
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
 * Get category spending with budget comparison
 */
export const getCategoryBudgetAnalysis = async (userId) => {
  const [categories, expenses] = await Promise.all([
    getCategories(userId),
    getCurrentMonthExpenses(userId),
  ]);

  const categoryAnalysis = {};

  // Initialize with all categories
  categories.forEach((category) => {
    categoryAnalysis[category.id] = {
      id: category.id,
      name: category.name,
      color: category.color,
      icon: category.icon,
      budget: category.budget,
      spent: 0,
      count: 0,
      remaining: category.budget || 0,
      percentUsed: 0,
      isOverBudget: false,
    };
  });

  // Add spending data
  expenses.forEach((expense) => {
    const categoryId = expense.categoryId;
    if (categoryAnalysis[categoryId]) {
      const amount = parseFloat(expense.amount);
      categoryAnalysis[categoryId].spent += amount;
      categoryAnalysis[categoryId].count += 1;
    }
  });

  // Calculate budget metrics
  Object.values(categoryAnalysis).forEach((category) => {
    if (category.budget && category.budget > 0) {
      category.remaining = Math.max(0, category.budget - category.spent);
      category.percentUsed = Math.min(
        100,
        (category.spent / category.budget) * 100
      );
      category.isOverBudget = category.spent > category.budget;
    }
  });

  return categoryAnalysis;
};

/**
 * Get total spending for current month
 */
export const getTotalSpending = async (userId) => {
  const expenses = await getCurrentMonthExpenses(userId);
  return expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
};
