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
import {
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  AlertCircle,
  Zap,
} from "lucide-react";
import { useToast } from "../components/ui/use-toast";
import * as Icons from "lucide-react";

export default function QuickSave() {
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
    // Check for data in window or sessionStorage (set by MainActivity or Share Target plugin)
    const checkWindowData = () => {
      // First check window.ocrData (from MainActivity OCR processing)
      if (window.ocrData) {
        console.log("📱 Found OCR data in window:", window.ocrData);
        handleOCRData(window.ocrData);
        delete window.ocrData; // Clean up
        sessionStorage.removeItem("ocrData"); // Clean up sessionStorage too
        return true;
      }

      // Then check sessionStorage for OCR data (survives page reloads)
      const storedData = sessionStorage.getItem("ocrData");
      if (storedData) {
        try {
          const ocrData = JSON.parse(storedData);
          console.log("📱 Found OCR data in sessionStorage:", ocrData);
          handleOCRData(ocrData);
          sessionStorage.removeItem("ocrData"); // Clean up
          return true;
        } catch (e) {
          console.error("Error parsing sessionStorage ocrData:", e);
        }
      }

      // Check for shared image from Share Target plugin
      const sharedImageData = sessionStorage.getItem("sharedImage");
      if (sharedImageData) {
        try {
          const imageData = JSON.parse(sharedImageData);
          console.log("📱 Found shared image from plugin:", imageData);
          // Process the shared image with OCR
          processSharedImage(imageData);
          sessionStorage.removeItem("sharedImage"); // Clean up
          sessionStorage.removeItem("shareIntentPending"); // Clean up
          return true;
        } catch (e) {
          console.error("Error parsing shared image data:", e);
        }
      }

      console.log("⏳ Waiting for OCR data...");
      return false;
    };

    // Check immediately
    if (checkWindowData()) return;

    // Check multiple times with delays
    const timer1 = setTimeout(() => checkWindowData(), 300);
    const timer2 = setTimeout(() => checkWindowData(), 600);
    const timer3 = setTimeout(() => checkWindowData(), 1000);
    const timer4 = setTimeout(() => checkWindowData(), 1500);

    // Final timeout - redirect if no data after 3 seconds
    const timeoutTimer = setTimeout(() => {
      if (!checkWindowData()) {
        console.log(
          "⚠️ No OCR data found after 3 seconds, redirecting to home",
        );
        navigate("/", { replace: true });
      }
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timeoutTimer);
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
      const parsedAmount = parseFloat(ocrData.data.amount);
      setAmount(ocrData.data.amount?.toString() || "");
      setMerchant(ocrData.data.merchant || "");

      // Check if amount is zero, invalid, or missing
      if (!ocrData.data.amount || isNaN(parsedAmount) || parsedAmount <= 0) {
        console.log("⚠️ Invalid amount detected:", ocrData.data.amount);
        setStatus("no-amount");
      } else {
        console.log("✅ Valid amount detected:", parsedAmount);
        setStatus("ready");
      }

      // Auto-select first category if available
      if (categories.length > 0) {
        setSelectedCategory(categories[0].id.toString());
      }
    } else if (ocrData.status === "error") {
      setStatus("error");
    }
  };

  const processSharedImage = async (imageData) => {
    console.log("🖼️ Processing shared image:", imageData);
    setStatus("processing");

    try {
      // The image URI from the plugin needs to be processed by MainActivity's OCR
      // For now, we'll trigger the OCR processing through the native layer
      // The MainActivity should have already processed it, but if not, we show an error

      // Since MainActivity handles OCR, we should have received ocrData already
      // If we're here, it means the plugin intercepted before MainActivity could process
      // So we'll wait a bit more for MainActivity to process

      setTimeout(() => {
        const ocrData = sessionStorage.getItem("ocrData");
        if (ocrData) {
          handleOCRData(JSON.parse(ocrData));
          sessionStorage.removeItem("ocrData");
        } else {
          console.error("❌ No OCR data received from MainActivity");
          setStatus("error");
        }
      }, 1000);
    } catch (error) {
      console.error("Error processing shared image:", error);
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
        description: merchant || "Quick Save",
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

      // Navigate to home after short delay and replace history
      setTimeout(() => {
        navigate("/", { replace: true });
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
    // Clear any OCR data
    sessionStorage.removeItem("ocrData");
    sessionStorage.removeItem("sharedImage");
    sessionStorage.removeItem("shareIntentPending");
    if (window.ocrData) {
      delete window.ocrData;
    }

    // Navigate to dashboard and replace history to prevent back button loop
    navigate("/", { replace: true });
  };

  if (status === "processing") {
    return (
      <div className="min-h-screen bg-page-gradient flex items-center justify-center p-4">
        <Card className="w-full max-w-md card-elevated">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative p-4 rounded-full bg-gradient-primary">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Processing Image...
              </h2>
              <p className="text-sm text-muted-foreground text-center">
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
      <div className="min-h-screen bg-page-gradient flex items-center justify-center p-4">
        <Card className="w-full max-w-md card-elevated">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 rounded-full bg-gradient-danger">
                <XCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Processing Failed
              </h2>
              <p className="text-sm text-muted-foreground text-center">
                Could not extract expense details from the image
              </p>
              <Button onClick={handleCancel} variant="outline" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "no-amount") {
    return (
      <div className="min-h-screen bg-page-gradient flex items-center justify-center p-4">
        <Card className="w-full max-w-md card-elevated">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div
                className="p-4 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                }}
              >
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Amount Not Detected
              </h2>
              <p className="text-sm text-muted-foreground text-center">
                Unable to extract transaction amount from the image. Please try
                again with a clearer screenshot.
              </p>
              {merchant && (
                <div className="bg-secondary p-3 rounded-xl w-full">
                  <p className="text-sm text-muted-foreground text-center">
                    Merchant detected:{" "}
                    <span className="font-medium text-foreground">
                      {merchant}
                    </span>
                  </p>
                </div>
              )}
              <div className="flex flex-col space-y-2 w-full pt-2">
                <Button onClick={handleCancel} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
                <Button
                  onClick={() => setStatus("ready")}
                  className="btn-gradient-primary"
                >
                  Enter Amount Manually
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-gradient-primary">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-gradient-primary">Quick Save</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Amount */}
          <div className="space-y-2">
            <label
              htmlFor="amount"
              className="text-sm font-medium text-foreground"
            >
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
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
            <label
              htmlFor="merchant"
              className="text-sm font-medium text-foreground"
            >
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
            <label
              htmlFor="category"
              className="text-sm font-medium text-foreground"
            >
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
                {categories.map((category) => {
                  const IconComponent = category.icon
                    ? Icons[category.icon]
                    : Icons.Circle;
                  return (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="p-1.5 rounded-lg"
                          style={{ background: `${category.color}20` }}
                        >
                          <IconComponent
                            size={16}
                            style={{ color: category.color }}
                            strokeWidth={2.5}
                          />
                        </div>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Transaction Type */}
          {expenseData?.type && (
            <div className="bg-secondary p-3 rounded-xl">
              <p className="text-sm text-muted-foreground">
                Type:{" "}
                <span className="font-medium text-foreground capitalize">
                  {expenseData.type}
                </span>
              </p>
              {expenseData.confidence && (
                <p className="text-sm text-muted-foreground">
                  Confidence:{" "}
                  <span className="font-medium text-foreground">
                    {expenseData.confidence}%
                  </span>
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
              className="flex-1 btn-gradient-primary"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
