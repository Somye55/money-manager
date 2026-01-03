import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="min-h-[44px] min-w-[44px]">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const toggleTheme = () => {
    // Cycle through: light -> dark -> system -> light
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="min-h-[44px] min-w-[44px]"
      title={`Current theme: ${theme || "system"}`}
    >
      {theme === "dark" ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : theme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] opacity-50" />
      )}
      <span className="sr-only">
        Toggle theme (current: {theme || "system"})
      </span>
    </Button>
  );
}
