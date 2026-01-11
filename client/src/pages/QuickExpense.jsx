import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { useToast } from "../components/ui/use-toast";

export default function QuickExpense() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { categories, addExpense } = useData();

  const [status, setStatus] = useState("processing"); // processing, success, error, ready
  const [expenseData, setExpenseData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Check for data in window (set by MainActivity)
    const checkWindowData = () => {
      if (window.ocrData) {
        console.log("📱 Found OCR data in window:", window.ocrData);
        handleOCRData(window.ocrData);
        delete window.ocrData; // Clean up
      } else {
        // No data found, redirect to dashboard after 2 seconds
        setTimeout(() => {
          console.log("⚠️ No OCR data found, redirecting to dashboard");
          navigate("/dashboard");
        }, 2000);
      }
    };

    // Check immediately and after short delays
    checkWindowData();
    const timer1 = setTimeout(checkWindowData, 500);
    const timer2 = setTimeout(checkWindowData, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [navigate]);

  useEffect(() => {
    // Auto-select first category when categories load and we have expense data
    if (categories.length > 0 && expenseData && !selectedCategory) {
      setSelectedCategory(categories[0].id.toString());
    }
  }, [categories, expenseData, selectedCategory]);

  const handleOCRData = (ocrData) => {
    console.log("📱 Handling OCR data:", ocrData);

    if (ocrData.status === "success" && ocrData.data) {
      setExpenseData(ocrData.data);
      setAmount(ocrData.data.amount?.toString() || "");
      setMerchant(ocrData.data.merchant || "");
      setStatus("ready");

      // Auto-select first category if available
      if (categories.length > 0) {
        setSelectedCategory(categories[0].id.toString());
      }
    } else if (ocrData.status === "error") {
      setStatus("error");
    }
  };

  const handleSave = async () => {
    if (!amount || !selectedCategory) {
      toast({
        title: "Missing Information",
        description: "Please enter amount and select a category",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const expense = {
        amount: parseFloat(amount),
        description: merchant || "Quick Expense",
        categoryId: parseInt(selectedCategory),
        date: new Date().toISOString(),
        type: expenseData?.type || "debit",
        source: "OCR",
      };

      console.log("💾 Saving expense:", expense);
      await addExpense(expense);

      toast({
        title: "Expense Saved!",
        description: `₹${amount} saved successfully`,
      });

      // Navigate to dashboard after short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Error saving expense:", error);
      toast({
        title: "Error",
        description: "Failed to save expense",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  if (status === "processing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <h2 className="text-xl font-semibold">Processing Image...</h2>
              <p className="text-sm text-gray-600 text-center">
                Extracting expense details using AI
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-12 w-12 text-red-600" />
              <h2 className="text-xl font-semibold">Processing Failed</h2>
              <p className="text-sm text-gray-600 text-center">
                Could not extract expense details from the image
              </p>
              <Button onClick={handleCancel} variant="outline" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <span>Quick Expense</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Amount */}
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                ₹
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 text-lg font-semibold"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Merchant */}
          <div className="space-y-2">
            <label htmlFor="merchant" className="text-sm font-medium">
              Merchant / Description
            </label>
            <Input
              id="merchant"
              type="text"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="Enter merchant name"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    <div className="flex items-center space-x-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transaction Type */}
          {expenseData?.type && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                Type:{" "}
                <span className="font-medium capitalize">
                  {expenseData.type}
                </span>
              </p>
              {expenseData.confidence && (
                <p className="text-sm text-gray-600">
                  Confidence:{" "}
                  <span className="font-medium">{expenseData.confidence}%</span>
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !amount || !selectedCategory}
              className="flex-1"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Expense"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
