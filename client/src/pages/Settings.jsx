import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useTheme } from "next-themes";
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
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Modal } from "../design-system";
import { ThemeToggle } from "../components/ui/theme-toggle";

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
  const { theme, setTheme } = useTheme();
  const {
    isSupported,
    permissionGranted: smsGranted,
    notifPermissionGranted,
    requestSMSPermission,
    requestNotificationPermission,
    scanSMS,
    scanning,
  } = useSMS();
  const [serviceConnected, setServiceConnected] = useState(false);

  const [formData, setFormData] = useState({
    currency: "INR",
    monthlyBudget: "",
    theme: "system",
  });
  const [selectedApps, setSelectedApps] = useState([]);

  const [saveStatus, setSaveStatus] = useState("");
  const [scanMessage, setScanMessage] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    icon: "Tag",
    color: "#6366f1",
    budget: "",
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
      setSelectedApps(
        settings.selectedApps || [
          "com.whatsapp",
          "com.google.android.apps.messaging",
        ]
      );

      // Sync theme with next-themes
      if (settings.theme && settings.theme !== theme) {
        setTheme(settings.theme);
      }
    }
  }, [settings, theme, setTheme]);

  // Check notification service connection
  useEffect(() => {
    const checkConnection = async () => {
      if (isSupported && notifPermissionGranted) {
        try {
          const smsService = (await import("../lib/smsService")).default;
          const connected = await smsService.isNotificationServiceConnected();
          setServiceConnected(connected);
        } catch (error) {
          console.error("Error checking service connection:", error);
        }
      }
    };
    checkConnection();
  }, [isSupported, notifPermissionGranted]);

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
          setTheme(updates.theme);
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
        budget: category.budget ? category.budget.toString() : "",
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: "",
        icon: "Tag",
        color: "#6366f1",
        budget: "",
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

    // Validate budget if provided
    if (categoryForm.budget && categoryForm.budget.trim()) {
      const budgetValue = parseFloat(categoryForm.budget);
      if (isNaN(budgetValue) || budgetValue < 0) {
        errors.budget = "Budget must be a valid positive number";
      } else if (budgetValue > 999999.99) {
        errors.budget = "Budget cannot exceed 999,999.99";
      }
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

  const handleAppSelectionChange = async (apps) => {
    setSelectedApps(apps);
    try {
      await modifySettings({ selectedApps: apps });
      // Also update the Android side
      const smsService = (await import("../lib/smsService")).default;
      await smsService.setSelectedApps(apps);
    } catch (error) {
      console.error("Error updating selected apps:", error);
    }
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

  const availableApps = [
    { package: "com.whatsapp", name: "WhatsApp", icon: "MessageCircle" },
    {
      package: "com.google.android.apps.messaging",
      name: "Messages",
      icon: "MessageSquare",
    },
    { package: "org.telegram.messenger", name: "Telegram", icon: "Send" },
    {
      package: "com.google.android.apps.nbu.paisa.user",
      name: "Google Pay",
      icon: "CreditCard",
    },
    { package: "com.phonepe.app", name: "PhonePe", icon: "Smartphone" },
    { package: "net.one97.paytm", name: "Paytm", icon: "Wallet" },
    { package: "com.freecharge.android", name: "Freecharge", icon: "Zap" },
    {
      package: "com.amazon.mShop.android.shopping",
      name: "Amazon",
      icon: "ShoppingBag",
    },
    { package: "com.sbi.lotus", name: "SBI YONO", icon: "Banknote" },
    { package: "com.axis.mobile", name: "Axis Mobile", icon: "Banknote" },
    { package: "com.hdfcbank.mobileapp", name: "HDFC Bank", icon: "Banknote" },
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
    <div className="p-4 pb-24 space-y-4 animate-fade-in max-w-2xl mx-auto">
      {/* Header with Save Status */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <SettingsIcon className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-xs text-muted-foreground">
              Manage your preferences
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle size="md" />
          {saveStatus && (
            <div className="flex items-center gap-2 text-sm">
              {saveStatus === "saving" && (
                <>
                  <Loader size={16} className="animate-spin text-indigo-600" />
                  <span className="text-muted-foreground">Saving...</span>
                </>
              )}
              {saveStatus === "saved" && (
                <>
                  <Check size={16} className="text-emerald-600" />
                  <span className="text-emerald-600">Saved</span>
                </>
              )}
              {saveStatus === "error" && (
                <>
                  <X size={16} className="text-destructive" />
                  <span className="text-destructive">Error</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Profile Section */}
      <Card className="animate-slide-up">
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-indigo-600" />
            <CardTitle className="text-base">Profile</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              {authUser?.user_metadata?.name?.charAt(0)?.toUpperCase() || "T"}
            </div>
            <div>
              <h4 className="text-base font-bold">
                {authUser?.user_metadata?.name || "Thamuz"}
              </h4>
              <p className="text-xs text-muted-foreground">{authUser?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Management */}
      <Card className="animate-slide-up" style={{ animationDelay: "0.05s" }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag size={18} className="text-indigo-600" />
              <CardTitle className="text-base">Categories</CardTitle>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={() => openCategoryModal()}
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600"
              aria-label="Add new category"
            >
              <Plus size={16} aria-hidden="true" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Success Message */}
          {categorySuccessMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 text-emerald-600 text-sm font-medium animate-slide-up">
              {categorySuccessMessage}
            </div>
          )}
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground">
              Drag to reorder categories
            </p>
            <p className="text-xs text-muted-foreground">
              {categories.length} categories
            </p>
          </div>
          <div className="space-y-2">
            {categories.length === 0 && !dataLoading ? (
              <div className="text-center py-6">
                <div className="p-4 rounded-xl bg-secondary border-2 border-dashed border-border">
                  <Tag
                    size={28}
                    className="mx-auto mb-2 text-muted-foreground"
                  />
                  <p className="text-muted-foreground text-sm mb-1">
                    No categories yet
                  </p>
                  <p className="text-xs text-muted-foreground">
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
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all cursor-move ${
                      draggedIndex === index
                        ? "border-indigo-600 bg-indigo-50 opacity-50 scale-105"
                        : "border-border hover:border-indigo-500/50 bg-secondary hover:shadow-md"
                    }`}
                  >
                    <GripVertical
                      size={18}
                      className="text-muted-foreground flex-shrink-0"
                    />
                    <div
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: category.color + "20" }}
                    >
                      <Icon size={20} style={{ color: category.color }} />
                    </div>
                    <span className="flex-1 font-semibold text-sm">
                      {category.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openCategoryModal(category)}
                      title="Edit category"
                      className="h-8 w-8 min-h-[44px] min-w-[44px]"
                      aria-label={`Edit ${category.name} category`}
                    >
                      <Edit2
                        size={16}
                        className="text-indigo-600"
                        aria-hidden="true"
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(category.id)}
                      title="Delete category"
                      className="h-8 w-8 min-h-[44px] min-w-[44px]"
                      aria-label={`Delete ${category.name} category`}
                    >
                      <Trash2
                        size={16}
                        className="text-destructive"
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

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
                      serviceConnected ? (
                        <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full font-bold">
                          ✓ Connected
                        </span>
                      ) : (
                        <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded-full font-bold">
                          ⚠ Enabled but not connected
                        </span>
                      )
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

            {/* App Selection */}
            <div className="border-2 border-border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">Select Apps to Monitor</p>
                  </div>
                  <p className="text-xs text-tertiary mb-2">
                    Choose which apps to listen for SMS notifications from
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {availableApps.map((app) => {
                  const Icon = LucideIcons[app.icon] || Smartphone;
                  const isSelected = selectedApps.includes(app.package);
                  return (
                    <button
                      key={app.package}
                      onClick={() => {
                        const newSelected = isSelected
                          ? selectedApps.filter((p) => p !== app.package)
                          : [...selectedApps, app.package];
                        handleAppSelectionChange(newSelected);
                      }}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50 bg-bg-secondary"
                      }`}
                    >
                      <Icon
                        size={20}
                        className={
                          isSelected ? "text-primary" : "text-tertiary"
                        }
                      />
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? "text-primary" : "text-tertiary"
                        }`}
                      >
                        {app.name}
                      </span>
                      {isSelected && (
                        <Check size={16} className="text-primary ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>
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
      <Card className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign size={18} className="text-indigo-600" />
            <CardTitle className="text-base">Currency</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Select
            value={formData.currency}
            onValueChange={(value) => handleChange("currency", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((curr) => (
                <SelectItem key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.name} ({curr.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Budget */}
      <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign size={18} className="text-indigo-600" />
            <CardTitle className="text-base">Monthly Budget</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Input
            type="number"
            value={formData.monthlyBudget}
            onChange={(e) => handleChange("monthlyBudget", e.target.value)}
            placeholder="Enter monthly budget"
          />
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card className="animate-slide-up" style={{ animationDelay: "0.25s" }}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette size={18} className="text-indigo-600" />
            <CardTitle className="text-base">Theme</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Select
            value={formData.theme}
            onValueChange={(value) => handleChange("theme", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">☀️ Light</SelectItem>
              <SelectItem value="dark">🌙 Dark</SelectItem>
              <SelectItem value="system">💻 System</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-2">
            Current:{" "}
            {theme === "system"
              ? "System (auto)"
              : theme === "dark"
              ? "Dark"
              : "Light"}
          </p>
        </CardContent>
      </Card>

      {/* Database Test */}
      <Card className="animate-slide-up" style={{ animationDelay: "0.28s" }}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
              <Check size={16} className="text-white" />
            </div>
            <CardTitle>Database Status</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
              <p className="text-sm">Connection</p>
              <span className="text-xs bg-emerald-500/20 text-emerald-600 px-2 py-1 rounded-full font-bold">
                ✓ Connected
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
              <p className="text-sm">User Profile</p>
              <span className="text-xs bg-emerald-500/20 text-emerald-600 px-2 py-1 rounded-full font-bold">
                ✓ {user ? "Loaded" : "Loading..."}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
              <p className="text-sm">Categories</p>
              <span className="text-xs bg-emerald-500/20 text-emerald-600 px-2 py-1 rounded-full font-bold">
                ✓ {categories.length} loaded
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Button
        variant="destructive"
        className="w-full animate-slide-up bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
        style={{ animationDelay: "0.3s" }}
        onClick={handleSignOut}
        aria-label="Sign out of your account"
      >
        <LogOut size={18} aria-hidden="true" /> Sign Out
      </Button>

      {/* Category Modal */}
      <Modal
        isOpen={showCategoryModal}
        onClose={closeCategoryModal}
        size="md"
        closeOnBackdrop={!savingCategory}
        closeOnEscape={!savingCategory}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600">
                <IconComponent size={24} style={{ color: "white" }} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {editingCategory ? "Edit Category" : "Create Category"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {editingCategory
                    ? "Update your category details"
                    : "Add a new category to organize your expenses"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeCategoryModal}
              aria-label="Close modal"
            >
              <X size={22} aria-hidden="true" />
            </Button>
          </div>

          <div className="space-y-5">
            {/* Preview */}
            <Card className="border-2">
              <CardHeader>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Preview
                </p>
              </CardHeader>
              <CardContent>
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
                    <h4 className="font-semibold">
                      {categoryForm.name || "Category Name"}
                    </h4>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Name Input */}
            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold text-sm">
                <FileText size={16} className="text-indigo-600" />
                Category Name
                <span className="text-destructive">*</span>
              </label>
              <Input
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
                error={categoryFormErrors.name}
                maxLength={30}
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-muted-foreground">
                  {categoryForm.name.length}/30 characters
                </span>
                <span className="text-xs text-muted-foreground">
                  Press Ctrl+Enter to save
                </span>
              </div>
            </div>

            {/* Budget Input */}
            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold text-sm">
                <DollarSign size={16} className="text-indigo-600" />
                Monthly Budget (Optional)
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="999999.99"
                value={categoryForm.budget}
                onChange={(e) => {
                  setCategoryForm({
                    ...categoryForm,
                    budget: e.target.value,
                  });
                  // Clear errors on change
                  if (categoryFormErrors.budget) {
                    setCategoryFormErrors({
                      ...categoryFormErrors,
                      budget: null,
                    });
                  }
                }}
                placeholder="0.00"
                error={categoryFormErrors.budget}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Set a monthly spending limit for this category
              </p>
            </div>

            {/* Icon Selection */}
            <div>
              <label className="flex items-center gap-2 mb-3 font-semibold text-sm">
                <Tag size={16} className="text-indigo-600" />
                Choose Icon
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 p-2 max-h-48 overflow-y-auto rounded-lg border bg-secondary">
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
                      className={`w-full aspect-square min-h-[3rem] p-2 rounded-lg border-2 transition-all flex items-center justify-center ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-transparent bg-card hover:border-indigo-300"
                      }`}
                      title={iconName}
                    >
                      <Icon size={22} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="flex items-center gap-2 mb-3 font-semibold text-sm">
                <Palette size={16} className="text-indigo-600" />
                Choose Color
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
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
                        backgroundColor: color,
                        transform: isSelected ? "scale(1.05)" : "scale(1)",
                        boxShadow: isSelected
                          ? "0 8px 16px rgba(0, 0, 0, 0.2)"
                          : "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                      className={`w-full aspect-[2.5/1] min-h-[3.5rem] rounded-xl border-2 transition-all flex items-center justify-center ${
                        isSelected ? "border-indigo-600" : "border-border"
                      }`}
                      title={color}
                    >
                      {isSelected && (
                        <Check
                          size={24}
                          style={{
                            color: "white",
                            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
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
              <div className="p-3 rounded-lg text-sm bg-red-500/10 border border-red-500/30 text-red-600">
                {categoryFormErrors.general}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={closeCategoryModal}
                disabled={savingCategory}
                aria-label="Cancel category changes"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="flex-1"
                onClick={handleSaveCategory}
                disabled={!categoryForm.name.trim() || savingCategory}
                loading={savingCategory}
                aria-label={
                  savingCategory
                    ? editingCategory
                      ? "Updating category"
                      : "Creating category"
                    : editingCategory
                    ? "Update category"
                    : "Create category"
                }
              >
                {!savingCategory && <Save size={20} aria-hidden="true" />}
                {savingCategory
                  ? editingCategory
                    ? "Updating..."
                    : "Creating..."
                  : editingCategory
                  ? "Update"
                  : "Create"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <div style={{ height: "20px" }} />
    </div>
  );
};

export default Settings;
