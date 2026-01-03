import { useState, useEffect, useRef } from "react";
import { useData } from "../../context/DataContext";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";

const BudgetSettings = () => {
  const { settings, modifySettings } = useData();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    currency: "INR",
    monthlyBudget: "",
  });
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        currency: settings.currency || "INR",
        monthlyBudget: settings.monthlyBudget
          ? settings.monthlyBudget.toString()
          : "",
      });
    }
  }, [settings]);

  const autoSave = async (updates) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await modifySettings(updates);
        toast({
          variant: "success",
          title: "Settings saved",
          description: "Your preferences have been updated",
        });
      } catch (error) {
        toast({
          variant: "error",
          title: "Save failed",
          description: "Failed to save settings",
        });
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
    };

    autoSave(updates);
  };

  const currencies = [
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  ];

  return (
    <div className="space-y-4">
      <div className="animate-slide-up card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Currency</h3>
        </div>
        <div className="p-6">
          <Select
            value={formData.currency}
            onValueChange={(value) => handleChange("currency", value)}
          >
            <SelectTrigger className="w-full border-2">
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
          <p className="text-xs text-muted-foreground mt-3">
            This currency will be used throughout the app for displaying amounts
          </p>
        </div>
      </div>

      <div
        className="animate-slide-up card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card"
        style={{ animationDelay: "0.05s" }}
      >
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Monthly Budget
          </h3>
        </div>
        <div className="p-6">
          <Input
            type="number"
            value={formData.monthlyBudget}
            onChange={(e) => handleChange("monthlyBudget", e.target.value)}
            placeholder="Enter monthly budget"
            className="border-2"
          />
          <p className="text-xs text-muted-foreground mt-3">
            Set your overall monthly spending limit. You'll receive alerts when
            approaching this limit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetSettings;
