import React, { useState, useEffect } from "react";
import { X, Check, Loader, Sparkles, TrendingDown } from "lucide-react";
import * as Icons from "lucide-react";
import { useData } from "../context/DataContext";

const CategorySelectionModal = ({ expense, isOpen, onClose, onConfirm }) => {
  const { categories, settings } = useData();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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
      setIsVisible(false);
      setTimeout(() => {
        onClose();
        setSelectedCategoryId(null);
      }, 300);
    } catch (error) {
      console.error("Error saving expense:", error);
      setSaving(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      setSelectedCategoryId(null);
      onClose();
    }, 300);
  };

  if (!isOpen || !expense) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{
        background: isVisible ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0)",
        backdropFilter: isVisible ? "blur(8px)" : "blur(0px)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onClick={handleDismiss}
    >
      <div
        className="w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl overflow-hidden relative"
        style={{
          transform: isVisible
            ? "translateY(0) scale(1)"
            : "translateY(100%) scale(0.95)",
          opacity: isVisible ? 1 : 0,
          transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          maxHeight: "90vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glassmorphism Background */}
        <div className="glass-card bg-card backdrop-blur-2xl">
          {/* Premium Header with Gradient */}
          <div className="relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-primary opacity-100"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            />
            <div className="absolute inset-0 shimmer" />

            <div className="relative p-6 pb-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                    <Sparkles
                      className="text-white"
                      size={24}
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      New Transaction
                    </h3>
                    <p className="text-sm text-white/80">Detected from SMS</p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-2.5 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm"
                  aria-label="Close"
                >
                  <X size={20} className="text-white" strokeWidth={2.5} />
                </button>
              </div>

              {/* Transaction Amount Card */}
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-white/70 mb-1">Merchant</p>
                    <h4 className="text-lg font-bold text-white truncate">
                      {expense.merchant || "Unknown Merchant"}
                    </h4>
                    <p className="text-xs text-white/60 mt-1">
                      {new Date(expense.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <TrendingDown size={18} className="text-white/70" />
                      <p className="text-xs text-white/70 font-medium">
                        Amount
                      </p>
                    </div>
                    <span className="text-3xl font-bold text-white">
                      {currencySymbol}
                      {expense.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: expense.amount % 1 === 0 ? 0 : 2,
                      })}
                    </span>
                  </div>
                </div>

                {expense.suggestedCategory && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-white/70" />
                      <p className="text-xs text-white/70">
                        Suggested:{" "}
                        <span className="font-semibold text-white">
                          {expense.suggestedCategory}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="p-6 max-h-[50vh] overflow-y-auto">
            <label className="block text-sm font-semibold text-foreground mb-4">
              Choose Category
            </label>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {categories.map((category) => {
                const IconComponent = Icons[category.icon] || Icons.Tag;
                const isSelected = selectedCategoryId === category.id;

                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategoryId(category.id)}
                    className="relative p-4 rounded-2xl transition-all duration-300 min-h-[44px]"
                    style={{
                      background: isSelected
                        ? `linear-gradient(135deg, ${category.color}15 0%, ${category.color}25 100%)`
                        : "var(--color-secondary)",
                      border: isSelected
                        ? `2px solid ${category.color}`
                        : "2px solid transparent",
                      transform: isSelected ? "scale(1.02)" : "scale(1)",
                      boxShadow: isSelected
                        ? `0 8px 24px ${category.color}30`
                        : "none",
                    }}
                    aria-label={`Select ${category.name} category`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2.5 rounded-xl transition-all"
                        style={{
                          backgroundColor: `${category.color}${
                            isSelected ? "30" : "20"
                          }`,
                        }}
                      >
                        <IconComponent
                          size={20}
                          style={{ color: category.color }}
                          strokeWidth={2.5}
                        />
                      </div>
                      <span
                        className="text-sm font-semibold flex-1 text-left"
                        style={{
                          color: isSelected
                            ? category.color
                            : "var(--color-foreground)",
                        }}
                      >
                        {category.name}
                      </span>
                      {isSelected && (
                        <div
                          className="p-1 rounded-full"
                          style={{ backgroundColor: category.color }}
                        >
                          <Check
                            size={14}
                            className="text-white"
                            strokeWidth={3}
                          />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDismiss}
                className="flex-1 py-4 px-6 rounded-2xl border-2 border-border text-sm font-semibold hover:bg-secondary transition-all duration-300 text-foreground min-h-[44px]"
                disabled={saving}
                aria-label="Dismiss transaction"
              >
                Dismiss
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedCategoryId || saving}
                className="flex-1 py-4 px-6 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden min-h-[44px]"
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
                  transform:
                    selectedCategoryId && !saving ? "scale(1)" : "scale(0.98)",
                }}
                aria-label="Save expense"
              >
                {selectedCategoryId && !saving && (
                  <div className="absolute inset-0 shimmer" />
                )}
                {saving ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check size={18} strokeWidth={2.5} />
                    <span>Save Expense</span>
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
