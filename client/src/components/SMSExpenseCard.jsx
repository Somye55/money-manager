import React from "react";
import { Check, X, MessageSquare, Calendar, Loader2 } from "lucide-react";
import { useData } from "../context/DataContext";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";

const SMSExpenseCard = ({ expense, onImport, onDismiss, isImporting }) => {
  const { categories, settings } = useData();

  // Format currency
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

  // Find suggested category color/icon
  const suggestedCategory = categories.find(
    (c) =>
      c.name.toLowerCase() === (expense.suggestedCategory || "").toLowerCase()
  );
  const color = suggestedCategory ? suggestedCategory.color : "#6366f1";

  return (
    <Card
      className={cn(
        "overflow-hidden border-l-4 transition-all duration-200",
        "hover:shadow-lg bg-card"
      )}
      style={{ borderLeftColor: color }}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
              <MessageSquare
                size={16}
                className="text-primary"
                strokeWidth={2.5}
              />
            </div>
            <span className="text-xs font-bold text-primary px-2.5 py-1 bg-primary/10 rounded-full">
              New Transaction Detected
            </span>
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
            <Calendar size={12} strokeWidth={2.5} />
            {new Date(expense.date).toLocaleDateString()}
          </span>
        </div>

        {/* Main content */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-foreground truncate text-base mb-1">
              {expense.merchant || "Unknown Merchant"}
            </h4>
            <p className="text-sm text-muted-foreground truncate font-medium">
              {expense.suggestedCategory || "Uncategorized"}
            </p>
          </div>
          <div className="text-right ml-4">
            <span className="block font-extrabold text-xl text-destructive">
              {currencySymbol}
              {expense.amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Raw SMS Preview */}
        <div className="bg-muted/50 p-3.5 rounded-xl text-xs text-muted-foreground mb-4 line-clamp-2 border border-border/50">
          "{expense.rawSMS}"
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onDismiss(expense)}
            disabled={isImporting}
            className={cn(
              "flex-1 py-3 px-4 rounded-xl text-sm font-semibold",
              "border-2 border-border bg-background",
              "hover:bg-muted hover:border-muted-foreground/20 transition-all duration-200",
              "flex items-center justify-center gap-2",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "active:scale-[0.98]"
            )}
          >
            <X size={16} className="text-muted-foreground" strokeWidth={2.5} />
            Dismiss
          </button>
          <button
            onClick={() => onImport(expense)}
            disabled={isImporting}
            className={cn(
              "flex-1 py-3 px-4 rounded-xl text-sm font-semibold",
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90 transition-all duration-200",
              "shadow-md hover:shadow-lg flex items-center justify-center gap-2",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "active:scale-[0.98]"
            )}
          >
            {isImporting ? (
              <Loader2 size={16} className="animate-spin" strokeWidth={2.5} />
            ) : (
              <Check size={16} strokeWidth={2.5} />
            )}
            Add Expense
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SMSExpenseCard;
