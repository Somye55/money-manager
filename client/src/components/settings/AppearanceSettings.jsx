import { useState, useEffect, useRef } from "react";
import { useData } from "../../context/DataContext";
import { useTheme } from "next-themes";
import { Palette, Check, Loader, X } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const AppearanceSettings = () => {
  const { settings, modifySettings } = useData();
  const { theme, setTheme } = useTheme();
  const [formData, setFormData] = useState({ theme: "system" });
  const [saveStatus, setSaveStatus] = useState("");
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        theme: settings.theme || "system",
      });
      if (settings.theme && settings.theme !== theme) {
        setTheme(settings.theme);
      }
    }
  }, [settings, theme, setTheme]);

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

  const handleChange = (value) => {
    const newFormData = { ...formData, theme: value };
    setFormData(newFormData);
    autoSave({ theme: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <Palette className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Appearance</h1>
            <p className="text-xs text-muted-foreground">
              Customize your visual experience
            </p>
          </div>
        </div>
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

      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="text-base">Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={formData.theme} onValueChange={handleChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">☀️ Light</SelectItem>
              <SelectItem value="dark">🌙 Dark</SelectItem>
              <SelectItem value="system">💻 System</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-3">
            Current:{" "}
            {theme === "system"
              ? "System (auto)"
              : theme === "dark"
              ? "Dark"
              : "Light"}
          </p>
          <div className="mt-4 p-3 rounded-lg bg-secondary">
            <p className="text-xs text-muted-foreground">
              The theme will automatically apply across the entire app. System
              theme follows your device settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceSettings;
