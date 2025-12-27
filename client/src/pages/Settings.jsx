import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useTheme } from "../lib/theme-provider";
import { useSMS } from "../context/SMSContext";
import {
  Settings as SettingsIcon,
  User,
  Palette,
  DollarSign,
  LogOut,
  Loader2,
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
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Settings = () => {
  const { user: authUser, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const {
    settings,
    modifySettings,
    categories,
    addCategory,
    modifyCategory,
    removeCategory,
    reorderCategories,
    loading: dataLoading,
  } = useData();
  const {
    isSupported,
    permissionGranted: smsGranted,
    requestSMSPermission,
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
  const [savingCategory, setSavingCategory] = useState(false);

  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        currency: settings.currency || "INR",
        monthlyBudget: settings.monthlyBudget?.toString() || "",
        theme: settings.theme || "system",
      });
    }
  }, [settings]);

  const autoSave = async (updates) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setSaveStatus("saving");
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await modifySettings(updates);
        if (updates.theme) setTheme(updates.theme);
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
    autoSave({
      currency: newFormData.currency,
      monthlyBudget: newFormData.monthlyBudget
        ? parseFloat(newFormData.monthlyBudget)
        : null,
      theme: newFormData.theme,
    });
  };

  const handleDragStart = (index) => setDraggedIndex(index);
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
  const handleDragEnd = () => setDraggedIndex(null);

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
      setCategoryForm({ name: "", icon: "Tag", color: "#6366f1" });
    }
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name.trim()) return;
    setSavingCategory(true);
    try {
      const categoryData = { ...categoryForm, name: categoryForm.name.trim() };
      if (editingCategory) {
        await modifyCategory(editingCategory.id, categoryData);
      } else {
        const maxOrder = Math.max(...categories.map((c) => c.order || 0), -1);
        categoryData.order = maxOrder + 1;
        await addCategory(categoryData);
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Delete this category?")) {
      try {
        await removeCategory(id);
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleSMSRequest = async () => {
    try {
      const granted = await requestSMSPermission();
      setScanMessage(
        granted ? "✓ SMS Permission granted!" : "⚠️ SMS Permission denied"
      );
    } catch (e) {
      setScanMessage(`❌ Error: ${e.message}`);
    }
    setTimeout(() => setScanMessage(""), 5000);
  };

  const handleManualScan = async () => {
    try {
      const results = await scanSMS(30);
      setScanMessage(`✓ Found ${results.length} expenses`);
    } catch (err) {
      setScanMessage("❌ Scan failed");
    }
    setTimeout(() => setScanMessage(""), 3000);
  };

  const currencies = [
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  ];

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  const iconOptions = [
    "Tag",
    "Coffee",
    "Car",
    "ShoppingBag",
    "Home",
    "Film",
    "Heart",
    "Utensils",
    "Plane",
    "Smartphone",
    "Shirt",
    "Gift",
    "Music",
    "Dumbbell",
    "Pizza",
    "Bus",
    "Fuel",
    "ShoppingCart",
    "Briefcase",
    "GraduationCap",
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
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const IconComponent = LucideIcons[categoryForm.icon] || Tag;

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-icon">
          <SettingsIcon />
        </div>
        <div className="page-header-content">
          <h1 className="page-header-title">Settings</h1>
          <p className="page-header-subtitle">Manage your preferences</p>
        </div>
        {saveStatus && (
          <div className="flex items-center gap-2 text-sm">
            {saveStatus === "saving" && (
              <Loader2 size={16} className="animate-spin text-primary" />
            )}
            {saveStatus === "saved" && (
              <Check size={16} className="text-emerald-500" />
            )}
            {saveStatus === "error" && (
              <X size={16} className="text-destructive" />
            )}
            <span
              className={cn(
                saveStatus === "saving" && "text-muted-foreground",
                saveStatus === "saved" && "text-emerald-500",
                saveStatus === "error" && "text-destructive"
              )}
            >
              {saveStatus === "saving"
                ? "Saving..."
                : saveStatus === "saved"
                ? "Saved"
                : "Error"}
            </span>
          </div>
        )}
      </div>

      <div className="stack">
        {/* Profile */}
        <Card className="slide-up">
          <CardContent className="card-body">
            <div className="section-title mb-4">
              <User size={18} />
              <span>Profile</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0">
                {authUser?.user_metadata?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate">
                  {authUser?.user_metadata?.name || "User"}
                </h4>
                <p className="text-sm text-muted-foreground truncate">
                  {authUser?.email}
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={signOut}
                className="flex-shrink-0"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Theme */}
        <Card className="slide-up delay-1">
          <CardContent className="card-body">
            <div className="section-title mb-4">
              <Palette size={18} />
              <span>Theme</span>
            </div>
            <div className="grid-3">
              {themes.map((t) => {
                const Icon = t.icon;
                const isActive = formData.theme === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => handleChange("theme", t.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all min-h-[80px] touch-manipulation",
                      isActive
                        ? "border-primary bg-primary/10"
                        : "border-border active:border-primary/50"
                    )}
                  >
                    <Icon
                      size={24}
                      className={
                        isActive ? "text-primary" : "text-muted-foreground"
                      }
                    />
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isActive ? "text-primary" : "text-foreground"
                      )}
                    >
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Currency & Budget */}
        <Card className="slide-up delay-2">
          <CardContent className="card-body stack-sm">
            <div className="section-title mb-2">
              <DollarSign size={18} />
              <span>Currency & Budget</span>
            </div>
            <div className="form-group">
              <label className="form-label">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
                className="form-input form-select"
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Monthly Budget</label>
              <input
                type="number"
                inputMode="decimal"
                value={formData.monthlyBudget}
                onChange={(e) => handleChange("monthlyBudget", e.target.value)}
                placeholder="Enter monthly budget"
                className="form-input"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card className="slide-up delay-3">
          <CardContent className="card-body">
            <div className="section-header">
              <div className="section-title">
                <Tag size={18} />
                <span>Categories</span>
              </div>
              <Button size="sm" onClick={() => openCategoryModal()}>
                <Plus size={16} />
                Add
              </Button>
            </div>
            <div className="stack-sm">
              {categories.length === 0 ? (
                <div className="empty-state" style={{ padding: "2rem 1rem" }}>
                  <Tag
                    className="empty-state-icon"
                    style={{ width: 32, height: 32 }}
                  />
                  <p className="text-muted-foreground">No categories yet</p>
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
                      className={cn(
                        "list-item cursor-move",
                        draggedIndex === index &&
                          "border-primary bg-primary/10 opacity-50"
                      )}
                    >
                      <GripVertical
                        size={18}
                        className="text-muted-foreground flex-shrink-0"
                      />
                      <div
                        className="icon-badge-sm flex-shrink-0"
                        style={{ backgroundColor: category.color + "20" }}
                      >
                        <Icon size={16} style={{ color: category.color }} />
                      </div>
                      <span className="list-item-title flex-1">
                        {category.name}
                      </span>
                      <button
                        onClick={() => openCategoryModal(category)}
                        className="btn-icon-sm btn-ghost"
                      >
                        <Edit2 size={16} className="text-primary" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="btn-icon-sm btn-ghost"
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* SMS Automation */}
        {isSupported && (
          <Card className="slide-up delay-4">
            <CardContent className="card-body">
              <div className="section-title mb-4">
                <Smartphone size={18} />
                <span>SMS Automation</span>
              </div>
              {scanMessage && (
                <div className="mb-4 p-3 rounded-xl bg-primary/10 text-primary text-sm font-medium">
                  {scanMessage}
                </div>
              )}
              <div className="list-item">
                <div className="list-item-content">
                  <p className="list-item-title">SMS Permission</p>
                  <p className="list-item-subtitle">
                    {smsGranted
                      ? "Enabled - Can scan SMS for expenses"
                      : "Disabled - Enable to scan SMS"}
                  </p>
                </div>
                {smsGranted ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleManualScan}
                    disabled={scanning}
                  >
                    {scanning ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <RefreshCw size={16} />
                    )}
                    {scanning ? "Scanning..." : "Scan"}
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleSMSRequest}>
                    Enable
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <Card
            className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl scale-in"
            style={{ maxHeight: "90vh" }}
          >
            <CardContent className="card-body overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-3">
                  {editingCategory ? "Edit Category" : "New Category"}
                </h2>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="btn-icon-sm btn-ghost"
                >
                  <X size={20} className="text-muted-foreground" />
                </button>
              </div>

              <div className="stack">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, name: e.target.value })
                    }
                    placeholder="Category name"
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Icon</label>
                  <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto p-2 rounded-xl border border-border">
                    {iconOptions.map((iconName) => {
                      const Icon = LucideIcons[iconName] || Tag;
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() =>
                            setCategoryForm({ ...categoryForm, icon: iconName })
                          }
                          className={cn(
                            "p-2 rounded-lg transition-all min-h-[44px] touch-manipulation",
                            categoryForm.icon === iconName
                              ? "bg-primary/20 ring-2 ring-primary"
                              : "active:bg-muted"
                          )}
                        >
                          <Icon
                            size={20}
                            style={{ color: categoryForm.color }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          setCategoryForm({ ...categoryForm, color })
                        }
                        className={cn(
                          "w-10 h-10 rounded-full transition-all touch-manipulation",
                          categoryForm.color === color &&
                            "ring-2 ring-offset-2 ring-primary"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid-2 pt-2">
                  <Button
                    variant="outline"
                    className="btn-full"
                    onClick={() => setShowCategoryModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="btn-full"
                    onClick={handleSaveCategory}
                    disabled={savingCategory || !categoryForm.name.trim()}
                  >
                    {savingCategory ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    {savingCategory ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Settings;
