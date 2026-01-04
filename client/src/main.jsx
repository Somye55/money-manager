import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import "./index.css";
import App from "./App.jsx";
import { Capacitor } from "@capacitor/core";

// Expose plugins to window for testing (only on native platforms)
if (Capacitor.isNativePlatform()) {
  import("./lib/notificationPlugin").then((module) => {
    window.NotificationListenerPlugin = module.default;
    console.log("✅ NotificationListenerPlugin exposed to window");
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <App />
    </ThemeProvider>
  </StrictMode>
);
