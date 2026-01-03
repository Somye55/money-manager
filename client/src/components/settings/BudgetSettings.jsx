import { useState, useEffect, useRef } from "react";
import { useData } from "../../context/DataContext";
import { DollarSign, Check, Loader, X } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const BudgetSettings = () => {
  const { settings, modifySettings } = useData();
  const [formData, setFormData] = useState({
    currency: "INR",
    monthlyBudget: "",
  });
  const [saveStatus, setSaveStatus] = useState("");
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

    setSaveStatus("saving");

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await modifySettings(updates);
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
      {saveStatus && (
        <div className="flex items-center gap-2 text-sm justify-end">
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

      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="text-base">Currency</CardTitle>
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
          <p className="text-xs text-muted-foreground mt-3">
            This currency will be used throughout the app for displaying amounts
          </p>
        </CardContent>
      </Card>

      <Card className="animate-slide-up" style={{ animationDelay: "0.05s" }}>
        <CardHeader>
          <CardTitle className="text-base">Monthly Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="number"
            value={formData.monthlyBudget}
            onChange={(e) => handleChange("monthlyBudget", e.target.value)}
            placeholder="Enter monthly budget"
          />
          <p className="text-xs text-muted-foreground mt-3">
            Set your overall monthly spending limit. You'll receive alerts when
            approaching this limit.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetSettings;
