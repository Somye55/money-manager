import { useState, useEffect, useRef } from "react";
import { useData } from "../../context/DataContext";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";

const AppearanceSettings = () => {
  const { settings, modifySettings } = useData();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ theme: "system" });
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        theme: settings.theme || "system",
      });
      // Only set theme if it's different and we haven't just changed it
      if (settings.theme && settings.theme !== theme) {
        setTheme(settings.theme);
      }
    }
  }, [settings]); // Remove theme and setTheme from dependencies to prevent infinite loop

  const autoSave = async (updates) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await modifySettings(updates);
        if (updates.theme) {
          setTheme(updates.theme);
        }
        toast({
          variant: "success",
          title: "Theme saved",
          description: `Theme set to ${updates.theme}`,
        });
      } catch (error) {
        toast({
          variant: "error",
          title: "Save failed",
          description: "Failed to save theme",
        });
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
      <div className="animate-slide-up card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Theme</h3>
        </div>
        <div className="p-6">
          <Select value={formData.theme} onValueChange={handleChange}>
            <SelectTrigger className="w-full border-2">
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
          <div className="mt-4 p-4 rounded-xl bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground">
              The theme will automatically apply across the entire app. System
              theme follows your device settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
