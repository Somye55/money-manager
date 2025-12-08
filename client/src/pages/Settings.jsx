import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";
import { useSMS } from "../context/SMSContext";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  DollarSign,
  LogOut,
  Save,
  Loader,
  Check,
  Smartphone,
  RefreshCw,
  MessageSquare,
} from "lucide-react";

const Settings = () => {
  const { user: authUser, signOut } = useAuth();
  const { user, settings, modifySettings, loading: dataLoading } = useData();
  const { theme: currentTheme, setSpecificTheme } = useTheme();
  const {
    isSupported,
    permissionGranted: smsGranted, // Mapped from legacy name
    notifPermissionGranted,
    requestSMSPermission,
    requestNotificationPermission,
    scanSMS,
    scanning,
    lastScanTime,
  } = useSMS();

  const [formData, setFormData] = useState({
    currency: "INR",
    monthlyBudget: "",
    enableNotifications: true,
    theme: "system",
  });

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [scanMessage, setScanMessage] = useState("");

  useEffect(() => {
    if (settings) {
      setFormData({
        currency: settings.currency || "INR",
        monthlyBudget: settings.monthlyBudget
          ? settings.monthlyBudget.toString()
          : "",
        enableNotifications: settings.enableNotifications ?? true,
        theme: settings.theme || "system",
      });
    }
  }, [settings]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaveMessage("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveMessage("");

      const updates = {
        currency: formData.currency,
        monthlyBudget: formData.monthlyBudget
          ? parseFloat(formData.monthlyBudget)
          : null,
        enableNotifications: formData.enableNotifications,
        theme: formData.theme,
      };

      await modifySettings(updates);
      setSpecificTheme(formData.theme);
      setSaveMessage("Settings saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveMessage("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  // Permission Handlers
  const handleSMSRequest = async () => {
    try {
      const granted = await requestSMSPermission();
      if (granted) {
        setScanMessage("✓ SMS Permission granted! You can now scan messages.");
      } else {
        setScanMessage(
          "⚠️ SMS Permission denied. Go to: Settings > Apps > MoneyManager > Permissions > SMS"
        );
      }
    } catch (e) {
      console.error("SMS permission error:", e);
      setScanMessage(
        `❌ Error: ${e.message || "Failed to request SMS permission"}`
      );
    }
    setTimeout(() => setScanMessage(""), 5000);
  };

  const handleNotifRequest = async () => {
    try {
      await requestNotificationPermission();
      setScanMessage(
        "⚠️ Notification listener feature requires additional setup. This feature is coming soon!"
      );
    } catch (e) {
      console.error("Notification permission error:", e);
      setScanMessage(
        `❌ ${e.message || "Notification listener not available"}`
      );
    }
    setTimeout(() => setScanMessage(""), 5000);
  };

  const handleManualScan = async () => {
    try {
      const results = await scanSMS(30);
      setScanMessage(
        `Scan complete! Found ${results.length} potential expenses.`
      );
    } catch (err) {
      setScanMessage("Scan failed.");
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

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-3 rounded-xl"
          style={{ background: "var(--gradient-primary)" }}
        >
          <SettingsIcon className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-tertiary">Manage preferences</p>
        </div>
      </div>

      {saveMessage && (
        <div
          className={`p-4 rounded-lg animate-fade-in ${
            saveMessage.includes("success")
              ? "bg-green-500/10 text-green-600"
              : "bg-red-500/10 text-red-600"
          }`}
        >
          <p className="text-sm font-medium">{saveMessage}</p>
        </div>
      )}

      {/* Profile */}
      <div className="card p-5 animate-slide-up">
        <div className="flex items-center gap-2 mb-4">
          <User size={20} className="text-primary" />
          <h3 className="font-bold text-lg">Profile</h3>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
            style={{ background: "var(--gradient-primary)" }}
          >
            {authUser?.user_metadata?.name?.charAt(0) || "U"}
          </div>
          <div>
            <p className="font-semibold">
              {authUser?.user_metadata?.name || "User"}
            </p>
            <p className="text-sm text-tertiary">{authUser?.email}</p>
          </div>
        </div>
      </div>

      {/* Automation Section */}
      <div
        className="card p-5 animate-slide-up"
        style={{ animationDelay: "0.05s" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Smartphone size={20} className="text-primary" />
          <h3 className="font-bold text-lg">Expense Automation</h3>
        </div>

        {!isSupported ? (
          <p className="text-sm text-tertiary">
            Automation features are available on Android only.
          </p>
        ) : (
          <div className="space-y-4 mt-4">
            {scanMessage && (
              <p className="text-sm font-medium text-primary bg-primary/10 p-2 rounded">
                {scanMessage}
              </p>
            )}

            {/* SMS Permission */}
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <div>
                <p className="font-semibold text-sm">Read SMS Database</p>
                <p className="text-xs text-tertiary">
                  Scan past messages for expenses
                </p>
              </div>
              {smsGranted ? (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">
                  Active
                </span>
              ) : (
                <button
                  onClick={handleSMSRequest}
                  className="text-xs bg-primary text-white px-3 py-1.5 rounded"
                >
                  Enable
                </button>
              )}
            </div>

            {/* Notification Permission */}
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <div>
                <p className="font-semibold text-sm">Read Notifications</p>
                <p className="text-xs text-tertiary">
                  WhatsApp, GPay, Paytm support
                </p>
              </div>
              {notifPermissionGranted ? (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">
                  Active
                </span>
              ) : (
                <button
                  onClick={handleNotifRequest}
                  className="text-xs bg-primary text-white px-3 py-1.5 rounded"
                >
                  Enable
                </button>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={handleManualScan}
                disabled={scanning || !smsGranted}
                className="btn btn-secondary w-full flex items-center justify-center gap-2"
              >
                {scanning ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  <RefreshCw size={18} />
                )}
                {scanning ? "Scanning..." : "Scan Past SMS (30 Days)"}
              </button>
              {!smsGranted && (
                <p className="text-xs text-center text-red-500 mt-2">
                  Enable SMS permission above to scan
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Currency */}
      <div
        className="card p-5 animate-slide-up"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={20} className="text-primary" />
          <h3 className="font-bold text-lg">Currency</h3>
        </div>
        <select
          value={formData.currency}
          onChange={(e) => handleChange("currency", e.target.value)}
          className="w-full p-3 rounded-lg border border-border bg-bg-secondary outline-none focus:border-primary transition"
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
        className="card p-5 animate-slide-up"
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
          className="w-full p-3 rounded-lg border border-border bg-bg-secondary outline-none focus:border-primary transition"
        />
      </div>

      {/* Theme */}
      <div
        className="card p-5 animate-slide-up"
        style={{ animationDelay: "0.3s" }}
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

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn btn-primary btn-block flex items-center justify-center gap-2 animate-slide-up"
        style={{
          animationDelay: "0.5s",
          background: "var(--gradient-primary)",
          border: "none",
        }}
      >
        {saving ? (
          <>
            <Loader size={18} className="animate-spin" /> Saving...
          </>
        ) : (
          <>
            <Save size={18} /> Save Settings
          </>
        )}
      </button>

      <button
        onClick={handleSignOut}
        className="btn btn-block flex items-center justify-center gap-2 animate-slide-up"
        style={{
          animationDelay: "0.6s",
          background: "var(--gradient-danger)",
          border: "none",
          color: "white",
        }}
      >
        <LogOut size={18} /> Sign Out
      </button>

      <div style={{ height: "20px" }} />
    </div>
  );
};

export default Settings;
