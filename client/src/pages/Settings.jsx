import React, { useState, useEffect, useRef } from "react";
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
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        await modifyCategory(editingCategory.id, categoryForm);
      } else {
        await addCategory(categoryForm);
      }
      closeCategoryModal();
    } catch (error) {
      console.error("Error saving category:", error);
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
            className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition text-sm"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
        <p className="text-sm text-tertiary mb-4">
          Drag to reorder, click to edit
        </p>
        <div className="space-y-2">
          {categories.map((category, index) => {
            const Icon = LucideIcons[category.icon] || Tag;
            return (
              <div
                key={category.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-move ${
                  draggedIndex === index
                    ? "border-primary bg-primary/10 opacity-50"
                    : "border-border hover:border-primary/50 bg-bg-secondary"
                }`}
              >
                <GripVertical size={20} className="text-tertiary" />
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: category.color + "20" }}
                >
                  <Icon size={20} style={{ color: category.color }} />
                </div>
                <span className="flex-1 font-medium">{category.name}</span>
                <button
                  onClick={() => openCategoryModal(category)}
                  className="p-2 hover:bg-bg-primary rounded-lg transition"
                >
                  <Edit2 size={16} className="text-tertiary" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-2 hover:bg-danger/10 rounded-lg transition"
                >
                  <Trash2 size={16} className="text-danger" />
                </button>
              </div>
            );
          })}
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

          {scanMessage && (
            <div className="mb-4 p-3 rounded-lg bg-primary/10 text-primary text-sm font-medium">
              {scanMessage}
            </div>
          )}

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-bg-secondary">
              <div>
                <p className="font-semibold text-sm">Read SMS Database</p>
                <p className="text-xs text-tertiary">
                  Scan past messages for expenses
                </p>
              </div>
              {smsGranted ? (
                <span className="text-xs bg-success/20 text-success px-3 py-1.5 rounded-full font-bold">
                  Active
                </span>
              ) : (
                <button
                  onClick={handleSMSRequest}
                  className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:opacity-90"
                >
                  Enable
                </button>
              )}
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg bg-bg-secondary">
              <div>
                <p className="font-semibold text-sm">Read Notifications</p>
                <p className="text-xs text-tertiary">
                  WhatsApp, GPay, Paytm support
                </p>
              </div>
              {notifPermissionGranted ? (
                <span className="text-xs bg-success/20 text-success px-3 py-1.5 rounded-full font-bold">
                  Active
                </span>
              ) : (
                <button
                  onClick={handleNotifRequest}
                  className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:opacity-90"
                >
                  Enable
                </button>
              )}
            </div>

            <button
              onClick={handleManualScan}
              disabled={scanning || !smsGranted}
              className="btn btn-secondary w-full flex items-center justify-center gap-2 mt-4"
            >
              {scanning ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <RefreshCw size={18} />
              )}
              {scanning ? "Scanning..." : "Scan Past SMS (30 Days)"}
            </button>
            {!smsGranted && (
              <p className="text-xs text-center text-danger mt-2">
                Enable SMS permission above to scan
              </p>
            )}

            {/* Test Overlay Button */}
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
                  if (!status.notificationAccess) {
                    setScanMessage(
                      "⚠️ Please enable notification access first"
                    );
                    return;
                  }
                  const result = await NotificationListenerPlugin.testOverlay();
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
              className="btn w-full flex items-center justify-center gap-2 mt-2"
              style={{
                background: "var(--gradient-secondary)",
                color: "white",
              }}
            >
              🧪 Test Notification Popup
            </button>
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
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full animate-slide-up shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingCategory ? "Edit Category" : "New Category"}
              </h2>
              <button
                onClick={closeCategoryModal}
                className="p-2 hover:bg-bg-secondary rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, name: e.target.value })
                  }
                  placeholder="e.g., Groceries"
                  className="w-full p-3 rounded-lg border-2 border-border bg-bg-secondary outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Icon</label>
                <div className="grid grid-cols-8 gap-2">
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
                        className={`p-3 rounded-lg border-2 transition ${
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Icon size={20} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Color
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {colorOptions.map((color) => {
                    const isSelected = categoryForm.color === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          setCategoryForm({ ...categoryForm, color })
                        }
                        className={`w-full h-12 rounded-lg border-2 transition ${
                          isSelected
                            ? "border-primary scale-110"
                            : "border-border hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {isSelected && (
                          <Check size={20} className="text-white mx-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={closeCategoryModal}
                  className="flex-1 btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCategory}
                  disabled={!categoryForm.name.trim()}
                  className="flex-1 btn btn-primary flex items-center justify-center gap-2"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Save size={18} />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ height: "20px" }} />
    </div>
  );
};

export default Settings;
