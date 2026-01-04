import React, { useState, useEffect } from "react";
import { Check, Loader, Sparkles, ChevronDown } from "lucide-react";
import * as Icons from "lucide-react";
import { useData } from "../context/DataContext";
import { useToast } from "./ui/use-toast";

const CategorySelectionModal = ({ expense, isOpen, onClose, onConfirm }) => {
  const { categories, settings } = useData();
  const { toast } = useToast();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Get currency symbol
  const currencySymbol =
    settings?.currency === "USD"
      ? "$"
      : settings?.currency === "EUR"
      ? "€"
      : settings?.currency === "GBP"
      ? "£"
      : settings?.currency === "JPY"
      ? "¥"
      : "₹";

  // Trigger animation when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!selectedCategoryId) return;

    setSaving(true);
    try {
      await onConfirm(expense, selectedCategoryId);

      // Show success toast
      const selectedCategory = categories.find(
        (cat) => cat.id === selectedCategoryId
      );
      toast({
        title: "Expense Saved!",
        description: `${currencySymbol}${expense.amount.toFixed(2)} saved to ${
          selectedCategory?.name || "category"
        }`,
        duration: 3000,
      });

      // Close immediately after successful save
      setIsVisible(false);
      setDropdownOpen(false);
      setTimeout(() => {
        onClose();
        setSelectedCategoryId(null);
        setSaving(false);
      }, 300);
    } catch (error) {
      console.error("Error saving expense:", error);
      toast({
        title: "Error",
        description: "Failed to save expense. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      setSaving(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setDropdownOpen(false);
    setTimeout(() => {
      setSelectedCategoryId(null);
      onClose();
    }, 300);
  };

  if (!isOpen || !expense) return null;

  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId
  );
  const SelectedIcon = selectedCategory
    ? Icons[selectedCategory.icon] || Icons.Tag
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: isVisible ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0)",
        backdropFilter: isVisible ? "blur(8px)" : "blur(0px)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onClick={handleDismiss}
    >
      <div
        className="w-full max-w-md mx-4 rounded-3xl overflow-visible relative"
        style={{
          transform: isVisible
            ? "translateY(0) scale(1)"
            : "translateY(20px) scale(0.95)",
          opacity: isVisible ? 1 : 0,
          transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Glassmorphism Card */}
        <div className="glass-card bg-card backdrop-blur-2xl">
          {/* Compact Header with Gradient - No Close Button */}
          <div className="relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-primary opacity-100"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            />
            <div className="absolute inset-0 shimmer" />

            <div className="relative p-4">
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm flex-shrink-0">
                    <Sparkles
                      className="text-white"
                      size={20}
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      New Transaction
                    </h3>
                    <p className="text-xs text-white/80">Detected from SMS</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Content */}
          <div className="p-4 space-y-4">
            {/* Transaction Info - Compact */}
            <div className="bg-secondary/50 rounded-xl p-3 border border-border/50">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Merchant
                  </p>
                  <h4 className="text-sm font-bold text-foreground truncate">
                    {expense.merchant ||
                      expense.description ||
                      "Unknown Merchant"}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(expense.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-muted-foreground mb-0.5">Amount</p>
                  <span className="text-2xl font-bold text-foreground">
                    {currencySymbol}
                    {expense.amount.toLocaleString("en-IN", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: expense.amount % 1 === 0 ? 0 : 2,
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Category Dropdown - Compact */}
            <div className="relative">
              <label className="block text-xs font-semibold text-foreground mb-2">
                Choose Category
              </label>

              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full p-3 rounded-xl border-2 border-border bg-secondary/50 hover:bg-secondary transition-all flex items-center justify-between gap-2 min-h-[44px]"
                style={{
                  borderColor: selectedCategory
                    ? selectedCategory.color
                    : "var(--color-border)",
                  background: selectedCategory
                    ? `linear-gradient(135deg, ${selectedCategory.color}10 0%, ${selectedCategory.color}20 100%)`
                    : "var(--color-secondary)",
                }}
                aria-label="Select category"
              >
                {selectedCategory ? (
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: `${selectedCategory.color}25` }}
                    >
                      <SelectedIcon
                        size={18}
                        style={{ color: selectedCategory.color }}
                        strokeWidth={2.5}
                      />
                    </div>
                    <span
                      className="text-sm font-semibold truncate"
                      style={{ color: selectedCategory.color }}
                    >
                      {selectedCategory.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Select a category...
                  </span>
                )}
                <ChevronDown
                  size={18}
                  className="text-muted-foreground flex-shrink-0 transition-transform"
                  style={{
                    transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-border rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
                  {categories.map((category) => {
                    const IconComponent = Icons[category.icon] || Icons.Tag;
                    const isSelected = selectedCategoryId === category.id;

                    return (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategoryId(category.id);
                          setDropdownOpen(false);
                        }}
                        className="w-full p-3 hover:bg-secondary transition-all flex items-center gap-2.5 border-b border-border last:border-b-0 min-h-[44px]"
                        style={{
                          background: isSelected
                            ? `linear-gradient(135deg, ${category.color}10 0%, ${category.color}15 100%)`
                            : "transparent",
                        }}
                        aria-label={`Select ${category.name} category`}
                      >
                        <div
                          className="p-2 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <IconComponent
                            size={18}
                            style={{ color: category.color }}
                            strokeWidth={2.5}
                          />
                        </div>
                        <span className="text-sm font-semibold flex-1 text-left text-foreground">
                          {category.name}
                        </span>
                        {isSelected && (
                          <div
                            className="p-1 rounded-full flex-shrink-0"
                            style={{ backgroundColor: category.color }}
                          >
                            <Check
                              size={12}
                              className="text-white"
                              strokeWidth={3}
                            />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Action Buttons - Compact */}
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={handleDismiss}
                className="flex-1 py-3 px-4 rounded-xl border-2 border-border text-sm font-semibold hover:bg-secondary transition-all duration-300 text-foreground min-h-[44px]"
                disabled={saving}
                aria-label="Dismiss transaction"
              >
                Dismiss
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedCategoryId || saving}
                className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden min-h-[44px]"
                style={{
                  background:
                    selectedCategoryId && !saving
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "var(--color-muted)",
                  color:
                    selectedCategoryId && !saving
                      ? "white"
                      : "var(--color-muted-foreground)",
                  cursor:
                    selectedCategoryId && !saving ? "pointer" : "not-allowed",
                  boxShadow:
                    selectedCategoryId && !saving
                      ? "0 8px 24px rgba(99, 102, 241, 0.4)"
                      : "none",
                }}
                aria-label="Save expense"
              >
                {selectedCategoryId && !saving && (
                  <div className="absolute inset-0 shimmer" />
                )}
                {saving ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} strokeWidth={2.5} />
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySelectionModal;
