import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";
import { useSMS } from "../context/SMSContext";
import {
  Settings as SettingsIcon,
  User,
  Palette,
  DollarSign,
  LogOut,
  Loader,
  Check,
  Smartphone,
  RefreshCw,
  Tag,
  Plus,
  Trash2,
  Edit2,
  GripVertical,
  X,
  Save,
  FileText,
} from "lucide-react";
import * as LucideIcons from "lucide-react";

const Settings = () => {
  const { user: authUser, signOut } = useAuth();
  const {
    user,
    settings,
    modifySettings,
    categories,
    addCategory,
    modifyCategory,
    removeCategory,
    reorderCategories,
    loading: dataLoading,
  } = useData();
  const { setSpecificTheme } = useTheme();
  const {
    isSupported,
    permissionGranted: smsGranted,
    notifPermissionGranted,
    requestSMSPermission,
    requestNotificationPermission,
    scanSMS,
    scanning,
  } = useSMS();

  const [formData, setFormData] = useState({
    currency: "INR",
    monthlyBudget: "",
    theme: "system",
  });

  const [saveStatus, setSaveStatus] = useState("");
  const [scanMessage, setScanMessage] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    icon: "Tag",
    color: "#6366f1",
  });
  const [categoryFormErrors, setCategoryFormErrors] = useState({});
  const [savingCategory, setSavingCategory] = useState(false);
  const [categorySuccessMessage, setCategorySuccessMessage] = useState("");

  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        currency: settings.currency || "INR",
        monthlyBudget: settings.monthlyBudget
          ? settings.monthlyBudget.toString()
          : "",
        theme: settings.theme || "system",
      });
    }
  }, [settings]);

  // Auto-save function with debounce
  const autoSave = async (updates) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSaveStatus("saving");

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await modifySettings(updates);
        if (updates.theme) {
          setSpecificTheme(updates.theme);
        }
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus(""), 2000);
      } catch (error) {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus(""), 3000);
      }
    }, 800);
  };

  const handleChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    const updates = {
      currency: newFormData.currency,
      monthlyBudget: newFormData.monthlyBudget
        ? parseFloat(newFormData.monthlyBudget)
        : null,
      theme: newFormData.theme,
    };

    autoSave(updates);
  };

  // Category Management
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newCategories = [...categories];
    const draggedItem = newCategories[draggedIndex];
    newCategories.splice(draggedIndex, 1);
    newCategories.splice(index, 0, draggedItem);

    reorderCategories(newCategories);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const openCategoryModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        icon: category.icon || "Tag",
        color: category.color || "#6366f1",
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: "",
        icon: "Tag",
        color: "#6366f1",
      });
    }
    setCategoryFormErrors({});
    setSavingCategory(false);
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategory(null);
    setCategoryFormErrors({});
    setSavingCategory(false);
  };

  const validateCategoryForm = () => {
    const errors = {};

    if (!categoryForm.name.trim()) {
      errors.name = "Category name is required";
    } else if (categoryForm.name.trim().length < 2) {
      errors.name = "Category name must be at least 2 characters";
    } else if (categoryForm.name.trim().length > 30) {
      errors.name = "Category name must be less than 30 characters";
    }

    // Check for duplicate names (excluding current category if editing)
    const existingCategory = categories.find(
      (cat) =>
        cat.name.toLowerCase() === categoryForm.name.trim().toLowerCase() &&
        (!editingCategory || cat.id !== editingCategory.id)
    );

    if (existingCategory) {
      errors.name = "A category with this name already exists";
    }

    setCategoryFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveCategory = async () => {
    if (!validateCategoryForm()) {
      return;
    }

    setSavingCategory(true);
    setCategoryFormErrors({});

    try {
      const categoryData = {
        ...categoryForm,
        name: categoryForm.name.trim(),
      };

      console.log("🔄 Attempting to save category:", categoryData);
      console.log("🔄 Current user:", user);
      console.log("🔄 Auth user:", authUser);

      if (editingCategory) {
        await modifyCategory(editingCategory.id, categoryData);
        setCategorySuccessMessage(
          `✓ "${categoryData.name}" updated successfully!`
        );
      } else {
        // Set order for new category
        const maxOrder = Math.max(...categories.map((c) => c.order || 0), -1);
        categoryData.order = maxOrder + 1;
        console.log("🔄 Final category data with order:", categoryData);
        await addCategory(categoryData);
        setCategorySuccessMessage(
          `✓ "${categoryData.name}" created successfully!`
        );
      }

      closeCategoryModal();

      // Clear success message after 3 seconds
      setTimeout(() => setCategorySuccessMessage(""), 3000);
    } catch (error) {
      console.error("❌ Error saving category in UI:", error);
      setCategoryFormErrors({
        general: error.message || "Failed to save category. Please try again.",
      });
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (
      window.confirm(
        "Delete this category? Expenses will become uncategorized."
      )
    ) {
      try {
        await removeCategory(id);
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  // Permission Handlers
  const handleSMSRequest = async () => {
    try {
      const granted = await requestSMSPermission();
      if (granted) {
        setScanMessage("✓ SMS Permission granted!");
      } else {
        setScanMessage("⚠️ SMS Permission denied. Check app settings.");
      }
    } catch (e) {
      setScanMessage(
        `❌ Error: ${e.message || "Failed to request permission"}`
      );
    }
    setTimeout(() => setScanMessage(""), 5000);
  };

  const handleNotifRequest = async () => {
    try {
      await requestNotificationPermission();
      setScanMessage("✓ Opening settings. Please enable notification access.");
    } catch (e) {
      setScanMessage(`⚠️ ${e.message || "Please grant required permissions"}`);
    }
    setTimeout(() => setScanMessage(""), 7000);
  };

  const handleManualScan = async () => {
    try {
      const results = await scanSMS(30);
      setScanMessage(`✓ Scan complete! Found ${results.length} expenses.`);
    } catch (err) {
      setScanMessage("❌ Scan failed.");
    }
    setTimeout(() => setScanMessage(""), 3000);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {}
  };

  const currencies = [
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  ];

  const themes = [
    { value: "light", label: "Light", icon: "☀️" },
    { value: "dark", label: "Dark", icon: "🌙" },
    { value: "system", label: "System", icon: "💻" },
  ];

  const iconOptions = [
    "Tag",
    "Coffee",
    "Car",
    "ShoppingBag",
    "Home",
    "Film",
    "Heart",
    "BookOpen",
    "Utensils",
    "Plane",
    "Smartphone",
    "Shirt",
    "Zap",
    "Gift",
    "Music",
    "Dumbbell",
    "Pizza",
    "Bus",
    "Train",
    "Bike",
    "Fuel",
    "ShoppingCart",
    "Briefcase",
    "GraduationCap",
    "Stethoscope",
    "Pill",
    "Gamepad2",
    "Tv",
    "Headphones",
    "Camera",
    "Palette",
    "Scissors",
  ];

  const colorOptions = [
    "#f59e0b",
    "#3b82f6",
    "#ec4899",
    "#8b5cf6",
    "#10b981",
    "#ef4444",
    "#f97316",
    "#6366f1",
    "#14b8a6",
    "#f43f5e",
    "#06b6d4",
    "#a855f7",
  ];

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const IconComponent = LucideIcons[categoryForm.icon] || Tag;

  return (
    <div className="p-4 space-y-6 animate-fade-in max-w-2xl mx-auto">
      {/* Header with Save Status */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-xl"
            style={{ background: "var(--gradient-primary)" }}
          >
            <SettingsIcon className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-tertiary">Manage your preferences</p>
          </div>
        </div>
        {saveStatus && (
          <div className="flex items-center gap-2 text-sm">
            {saveStatus === "saving" && (
              <>
                <Loader size={16} className="animate-spin text-primary" />
                <span className="text-tertiary">Saving...</span>
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <Check size={16} className="text-success" />
                <span className="text-success">Saved</span>
              </>
            )}
            {saveStatus === "error" && (
              <>
                <X size={16} className="text-danger" />
                <span className="text-danger">Error</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div className="card p-6 animate-slide-up">
        <div className="flex items-center gap-2 mb-4">
          <User size={20} className="text-primary" />
          <h3 className="font-bold text-lg">Profile</h3>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
            style={{ background: "var(--gradient-primary)" }}
          >
            {authUser?.user_metadata?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-semibold text-lg">
              {authUser?.user_metadata?.name || "User"}
            </p>
            <p className="text-sm text-tertiary">{authUser?.email}</p>
          </div>
        </div>
      </div>

      {/* Categories Management */}
      <div
        className="card p-6 animate-slide-up"
        style={{ animationDelay: "0.05s" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Tag size={20} className="text-primary" />
            <h3 className="font-bold text-lg">Categories</h3>
          </div>
          <button
            onClick={() => openCategoryModal()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-105 active:scale-95"
            style={{ background: "var(--gradient-primary)" }}
            title="Create a new category"
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>

        {/* Success Message */}
        {categorySuccessMessage && (
          <div className="mb-4 p-3 rounded-lg bg-success/10 text-success text-sm font-medium animate-slide-up">
            {categorySuccessMessage}
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-tertiary">Drag to reorder categories</p>
          <p className="text-xs text-tertiary">
            {categories.length} categories
          </p>
        </div>
        <div className="space-y-2">
          {categories.length === 0 && !dataLoading ? (
            <div className="text-center py-8">
              <div className="p-4 rounded-lg bg-bg-secondary border-2 border-dashed border-border">
                <Tag size={32} className="mx-auto mb-2 text-tertiary" />
                <p className="text-tertiary mb-2">No categories yet</p>
                <p className="text-xs text-tertiary">
                  Create your first category to get started
                </p>
              </div>
            </div>
          ) : (
            categories.map((category, index) => {
              const Icon = LucideIcons[category.icon] || Tag;
              return (
                <div
                  key={category.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-move ${
                    draggedIndex === index
                      ? "border-primary bg-primary/10 opacity-50 scale-105"
                      : "border-border hover:border-primary/50 bg-bg-secondary hover:shadow-md"
                  }`}
                >
                  <GripVertical
                    size={20}
                    className="text-tertiary flex-shrink-0"
                  />
                  <div
                    className="p-2.5 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: category.color + "20" }}
                  >
                    <Icon size={22} style={{ color: category.color }} />
                  </div>
                  <span className="flex-1 font-semibold text-base">
                    {category.name}
                  </span>
                  <button
                    onClick={() => openCategoryModal(category)}
                    className="p-2 hover:bg-primary/10 rounded-lg transition flex-shrink-0"
                    title="Edit category"
                  >
                    <Edit2 size={18} className="text-primary" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 hover:bg-danger/10 rounded-lg transition flex-shrink-0"
                    title="Delete category"
                  >
                    <Trash2 size={18} className="text-danger" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Automation Section */}
      {isSupported && (
        <div
          className="card p-6 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Smartphone size={20} className="text-primary" />
            <h3 className="font-bold text-lg">Expense Automation</h3>
          </div>

          <p className="text-sm text-tertiary mb-4">
            Enable permissions to automatically track expenses from SMS and
            notifications
          </p>

          {scanMessage && (
            <div className="mb-4 p-3 rounded-lg bg-primary/10 text-primary text-sm font-medium">
              {scanMessage}
            </div>
          )}

          <div className="space-y-4">
            {/* SMS Permission */}
            <div className="border-2 border-border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">Read SMS Database</p>
                    {smsGranted ? (
                      <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full font-bold">
                        ✓ Enabled
                      </span>
                    ) : (
                      <span className="text-xs bg-danger/20 text-danger px-2 py-1 rounded-full font-bold">
                        ✗ Disabled
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-tertiary mb-2">
                    Scan past SMS messages for bank transactions
                  </p>
                  {!smsGranted && (
                    <div className="text-xs bg-bg-secondary p-2 rounded">
                      <p className="font-semibold mb-1">How to enable:</p>
                      <ol className="list-decimal list-inside space-y-1 text-tertiary">
                        <li>Tap "Enable" button below</li>
                        <li>Allow SMS permission when prompted</li>
                        <li>Return to app to start scanning</li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>
              {smsGranted ? (
                <button
                  onClick={handleManualScan}
                  disabled={scanning}
                  className="btn btn-secondary w-full flex items-center justify-center gap-2"
                >
                  {scanning ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={18} />
                      Scan Past SMS (30 Days)
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleSMSRequest}
                  className="btn btn-primary w-full"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  Enable SMS Permission
                </button>
              )}
            </div>

            {/* Notification Permission */}
            <div className="border-2 border-border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">Read Notifications</p>
                    {notifPermissionGranted ? (
                      <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full font-bold">
                        ✓ Enabled
                      </span>
                    ) : (
                      <span className="text-xs bg-danger/20 text-danger px-2 py-1 rounded-full font-bold">
                        ✗ Disabled
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-tertiary mb-2">
                    Real-time tracking from WhatsApp, GPay, Paytm, PhonePe
                  </p>
                  {!notifPermissionGranted && (
                    <div className="text-xs bg-bg-secondary p-2 rounded">
                      <p className="font-semibold mb-1">How to enable:</p>
                      <ol className="list-decimal list-inside space-y-1 text-tertiary">
                        <li>Tap "Enable" button below</li>
                        <li>Find "Money Manager" in the list</li>
                        <li>Toggle ON notification access</li>
                        <li>Return to app</li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>
              {notifPermissionGranted ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleNotifRequest}
                    className="btn btn-secondary flex-1"
                  >
                    Manage Settings
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const NotificationListenerPlugin = (
                          await import("../lib/notificationPlugin")
                        ).default;
                        const status =
                          await NotificationListenerPlugin.getPermissionStatus();
                        if (!status.overlayPermission) {
                          setScanMessage(
                            "⚠️ Please enable 'Display over other apps' permission first"
                          );
                          await NotificationListenerPlugin.requestOverlayPermission();
                          return;
                        }
                        const result =
                          await NotificationListenerPlugin.testOverlay();
                        if (result.success) {
                          setScanMessage(
                            "✓ Test popup triggered! Check your screen."
                          );
                        } else {
                          setScanMessage(
                            "❌ Failed: " + (result.error || "Unknown error")
                          );
                        }
                      } catch (e) {
                        setScanMessage("❌ Error: " + e.message);
                      }
                      setTimeout(() => setScanMessage(""), 5000);
                    }}
                    className="btn flex-1"
                    style={{
                      background: "var(--gradient-secondary)",
                      color: "white",
                    }}
                  >
                    Test Popup
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleNotifRequest}
                  className="btn btn-primary w-full"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  Enable Notification Access
                </button>
              )}
            </div>

            {/* Display Over Other Apps Permission */}
            <div className="border-2 border-border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">Display Over Other Apps</p>
                  </div>
                  <p className="text-xs text-tertiary mb-2">
                    Show expense popups when transactions are detected
                  </p>
                  <div className="text-xs bg-bg-secondary p-2 rounded">
                    <p className="font-semibold mb-1">How to enable:</p>
                    <ol className="list-decimal list-inside space-y-1 text-tertiary">
                      <li>Go to Settings → Apps → Money Manager</li>
                      <li>
                        Find "Display over other apps" or "Draw over other apps"
                      </li>
                      <li>Toggle ON the permission</li>
                      <li>Return to app and test</li>
                    </ol>
                  </div>
                </div>
              </div>
              <button
                onClick={async () => {
                  try {
                    const NotificationListenerPlugin = (
                      await import("../lib/notificationPlugin")
                    ).default;
                    await NotificationListenerPlugin.requestOverlayPermission();
                    setScanMessage("Opening overlay permission settings...");
                  } catch (e) {
                    setScanMessage("❌ Error: " + e.message);
                  }
                  setTimeout(() => setScanMessage(""), 3000);
                }}
                className="btn btn-primary w-full"
                style={{ background: "var(--gradient-primary)" }}
              >
                Open Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Currency */}
      <div
        className="card p-6 animate-slide-up"
        style={{ animationDelay: "0.15s" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={20} className="text-primary" />
          <h3 className="font-bold text-lg">Currency</h3>
        </div>
        <select
          value={formData.currency}
          onChange={(e) => handleChange("currency", e.target.value)}
          className="w-full p-3 rounded-lg border-2 border-border bg-bg-secondary outline-none focus:border-primary transition"
        >
          {currencies.map((curr) => (
            <option key={curr.code} value={curr.code}>
              {curr.symbol} {curr.name} ({curr.code})
            </option>
          ))}
        </select>
      </div>

      {/* Budget */}
      <div
        className="card p-6 animate-slide-up"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={20} className="text-primary" />
          <h3 className="font-bold text-lg">Monthly Budget</h3>
        </div>
        <input
          type="number"
          value={formData.monthlyBudget}
          onChange={(e) => handleChange("monthlyBudget", e.target.value)}
          placeholder="Enter monthly budget"
          className="w-full p-3 rounded-lg border-2 border-border bg-bg-secondary outline-none focus:border-primary transition"
        />
      </div>

      {/* Theme */}
      <div
        className="card p-6 animate-slide-up"
        style={{ animationDelay: "0.25s" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Palette size={20} className="text-primary" />
          <h3 className="font-bold text-lg">Appearance</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((themeOption) => {
            const isSelected = formData.theme === themeOption.value;
            return (
              <button
                key={themeOption.value}
                type="button"
                onClick={() => handleChange("theme", themeOption.value)}
                className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
                <div className="text-2xl mb-1">{themeOption.icon}</div>
                <div
                  className={`text-sm font-semibold ${
                    isSelected ? "text-primary" : "text-text-secondary"
                  }`}
                >
                  {themeOption.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Database Test */}
      <div
        className="card p-6 animate-slide-up"
        style={{ animationDelay: "0.28s" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div
            className="p-2 rounded-lg"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Check size={16} className="text-white" />
          </div>
          <h3 className="font-bold text-lg">Database Status</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-bg-secondary">
            <span className="text-sm font-medium">Connection</span>
            <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full font-bold">
              ✓ Connected
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-bg-secondary">
            <span className="text-sm font-medium">User Profile</span>
            <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full font-bold">
              ✓ {user ? "Loaded" : "Loading..."}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-bg-secondary">
            <span className="text-sm font-medium">Categories</span>
            <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full font-bold">
              ✓ {categories.length} loaded
            </span>
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="btn btn-block flex items-center justify-center gap-2 animate-slide-up"
        style={{
          animationDelay: "0.3s",
          background: "var(--gradient-danger)",
          border: "none",
          color: "white",
        }}
      >
        <LogOut size={18} /> Sign Out
      </button>

      {/* Category Modal */}
      {showCategoryModal &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center p-4 animate-fade-in"
            style={{
              zIndex: 9999,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(4px)",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget && !savingCategory) {
                closeCategoryModal();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape" && !savingCategory) {
                closeCategoryModal();
              }
              if (e.key === "Enter" && e.ctrlKey && categoryForm.name.trim()) {
                handleSaveCategory();
              }
            }}
          >
            <div
              className="rounded-2xl p-4 sm:p-6 w-full animate-slide-up shadow-2xl"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                maxWidth: "32rem",
                maxHeight: "90vh",
                overflowY: "auto",
                margin: "0 1rem",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2.5 rounded-xl"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <IconComponent size={24} style={{ color: "white" }} />
                  </div>
                  <div>
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {editingCategory ? "Edit Category" : "Create Category"}
                    </h2>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {editingCategory
                        ? "Update your category details"
                        : "Add a new category to organize your expenses"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeCategoryModal}
                  className="p-2 rounded-lg transition"
                  style={{
                    backgroundColor: "transparent",
                    color: "var(--text-primary)",
                  }}
                  title="Close"
                >
                  <X size={22} />
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                {/* Preview */}
                <div
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "2px solid var(--border)",
                  }}
                >
                  <p
                    className="text-xs font-semibold mb-2 uppercase tracking-wide"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Preview
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: categoryForm.color + "20" }}
                    >
                      <IconComponent
                        size={32}
                        style={{ color: categoryForm.color }}
                      />
                    </div>
                    <div>
                      <p
                        className="font-bold text-xl"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {categoryForm.name || "Category Name"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label
                    className="flex items-center gap-2 mb-2 font-semibold text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <FileText size={16} style={{ color: "var(--primary)" }} />
                    Category Name
                    <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => {
                      setCategoryForm({
                        ...categoryForm,
                        name: e.target.value,
                      });
                      // Clear errors on change
                      if (categoryFormErrors.name) {
                        setCategoryFormErrors({
                          ...categoryFormErrors,
                          name: null,
                        });
                      }
                    }}
                    placeholder="e.g., Groceries, Transport, Entertainment"
                    className="w-full p-3 rounded-lg outline-none transition text-base"
                    style={{
                      border: `2px solid ${
                        categoryFormErrors.name
                          ? "var(--danger)"
                          : "var(--border)"
                      }`,
                      backgroundColor: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                    }}
                    autoFocus
                    maxLength={30}
                  />
                  {categoryFormErrors.name && (
                    <p
                      className="text-sm mt-1"
                      style={{ color: "var(--danger)" }}
                    >
                      {categoryFormErrors.name}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-1">
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {categoryForm.name.length}/30 characters
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Press Ctrl+Enter to save
                    </p>
                  </div>
                </div>

                {/* Icon Selection */}
                <div>
                  <label
                    className="flex items-center gap-2 mb-3 font-semibold text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <Tag size={16} style={{ color: "var(--primary)" }} />
                    Choose Icon
                  </label>
                  <div
                    className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-2 max-h-48 overflow-y-auto rounded-lg border"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: "var(--border)",
                    }}
                  >
                    {iconOptions.map((iconName) => {
                      const Icon = LucideIcons[iconName] || Tag;
                      const isSelected = categoryForm.icon === iconName;
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() =>
                            setCategoryForm({ ...categoryForm, icon: iconName })
                          }
                          style={{
                            width: "100%",
                            minHeight: "3rem",
                            padding: "0.5rem",
                            borderRadius: "0.5rem",
                            border: isSelected
                              ? "2px solid var(--primary)"
                              : "2px solid transparent",
                            backgroundColor: isSelected
                              ? "rgba(99, 102, 241, 0.15)"
                              : "var(--bg-card)",
                            color: "var(--text-primary)",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          title={iconName}
                        >
                          <Icon size={22} style={{ flexShrink: 0 }} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <label
                    className="flex items-center gap-2 mb-3 font-semibold text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <Palette size={16} style={{ color: "var(--primary)" }} />
                    Choose Color
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {colorOptions.map((color) => {
                      const isSelected = categoryForm.color === color;
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() =>
                            setCategoryForm({ ...categoryForm, color })
                          }
                          style={{
                            width: "100%",
                            height: "3.5rem",
                            borderRadius: "0.75rem",
                            backgroundColor: color,
                            border: isSelected
                              ? "3px solid var(--primary)"
                              : "2px solid var(--border)",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            transform: isSelected ? "scale(1.05)" : "scale(1)",
                            boxShadow: isSelected
                              ? "0 8px 16px rgba(0, 0, 0, 0.2)"
                              : "0 2px 4px rgba(0, 0, 0, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          title={color}
                        >
                          {isSelected && (
                            <Check
                              size={24}
                              style={{
                                color: "white",
                                filter:
                                  "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                              }}
                              strokeWidth={3}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Error Message */}
                {categoryFormErrors.general && (
                  <div
                    className="p-3 rounded-lg text-sm"
                    style={{
                      backgroundColor:
                        "var(--danger-bg, rgba(239, 68, 68, 0.1))",
                      color: "var(--danger)",
                      border: "1px solid var(--danger)",
                    }}
                  >
                    {categoryFormErrors.general}
                  </div>
                )}

                {/* Action Buttons */}
                <div
                  style={{
                    paddingTop: "1.5rem",
                    display: "flex",
                    gap: "0.75rem",
                  }}
                >
                  <button
                    onClick={closeCategoryModal}
                    disabled={savingCategory}
                    style={{
                      flex: 1,
                      padding: "0.875rem 1rem",
                      borderRadius: "0.75rem",
                      fontSize: "1rem",
                      fontWeight: 600,
                      backgroundColor: "var(--bg-secondary)",
                      border: "2px solid var(--border)",
                      color: savingCategory
                        ? "var(--text-tertiary)"
                        : "var(--text-primary)",
                      cursor: savingCategory ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCategory}
                    disabled={!categoryForm.name.trim() || savingCategory}
                    style={{
                      flex: 1,
                      padding: "0.875rem 1rem",
                      borderRadius: "0.75rem",
                      fontSize: "1rem",
                      fontWeight: 600,
                      background:
                        !categoryForm.name.trim() || savingCategory
                          ? "var(--border)"
                          : "var(--gradient-primary)",
                      color: "white",
                      border: "none",
                      cursor:
                        !categoryForm.name.trim() || savingCategory
                          ? "not-allowed"
                          : "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {savingCategory ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        {editingCategory ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        {editingCategory ? "Update" : "Create"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.getElementById("modal-root") || document.body
        )}

      <div style={{ height: "20px" }} />
    </div>
  );
};

export default Settings;
