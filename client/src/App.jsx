import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useTheme } from "next-themes";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { SMSProvider, useSMS } from "./context/SMSContext";
import { ScreenshotProvider } from "./context/ScreenshotContext";
import { Capacitor } from "@capacitor/core";
import { CapacitorShareTarget } from "@capgo/capacitor-share-target";
import { initializeDeepLinks } from "./lib/deepLinks";
import {
  Smartphone,
  LayoutDashboard,
  PlusCircle,
  Settings as SettingsIcon,
  Wallet,
  Receipt,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent } from "./components/ui/card";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AddExpense from "./pages/AddExpense";
import Settings from "./pages/Settings";
import SettingsGroup from "./pages/SettingsGroup";
import AIKeySettings from "./components/settings/AIKeySettings";
import Expenses from "./pages/Expenses";
import ExpenseDetail from "./pages/ExpenseDetail";
import QuickSave from "./pages/QuickSave";
import TestExpenseSave from "./pages/TestExpenseSave";
import TestNotificationPopup from "./pages/TestNotificationPopup";
import DebugExpenses from "./pages/DebugExpenses";
import AuthDebug from "./components/AuthDebug";
import ThemeDebug from "./components/ThemeDebug";
import CategorySelectionModal from "./components/CategorySelectionModal";
import { Toaster } from "./components/ui/toaster";
import StartupLogo from "./components/StartupLogo";
import NavIcon from "./components/NavIcon";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // CRITICAL: Check for pending share intent IMMEDIATELY using useLayoutEffect
  React.useLayoutEffect(() => {
    if (Capacitor.isNativePlatform() && location.pathname === "/") {
      // Check if there's a share intent pending
      const shareIntentPending = sessionStorage.getItem("shareIntentPending");
      const sharedImage = sessionStorage.getItem("sharedImage");
      const ocrData = sessionStorage.getItem("ocrData");

      if (
        shareIntentPending === "true" ||
        sharedImage ||
        ocrData ||
        window.ocrData
      ) {
        console.log(
          "🚀 IMMEDIATE REDIRECT: Share intent detected, navigating to /quick-save",
        );
        // Use window.location for immediate redirect (faster than React Router)
        window.location.replace("/quick-save");
        return;
      }
    }
  }, [location.pathname, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const Navigation = () => {
  const location = useLocation();

  // Hide nav on login page
  if (location.pathname === "/login") return null;

  const navItems = [
    { svg: "dashboard-interactive.svg", label: "Home", path: "/" },
    { svg: "expenses-interactive.svg", label: "Expenses", path: "/expenses" },
    { svg: "add-expense-interactive.svg", label: "Add", path: "/add" },
    { svg: "settings-interactive.svg", label: "Settings", path: "/settings" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-card dark:bg-card border-t border-border safe-area-bottom z-50"
      style={{
        boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.05)",
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex justify-around items-center px-3 py-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center p-3 rounded-xl transition-all duration-200 min-w-0 flex-1 min-h-[44px]"
              style={{
                textDecoration: "none",
              }}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <NavIcon svg={item.svg} isActive={isActive} label={item.label} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/login") return null;

  // Determine page title based on route
  const getPageTitle = () => {
    if (location.pathname === "/") return "Money Manager";
    if (location.pathname === "/expenses") return "Expenses";
    if (location.pathname === "/add") return "Add Expense";
    if (location.pathname === "/quick-save") return "Quick Save";
    if (location.pathname === "/settings") return "Settings";
    if (location.pathname === "/settings/ai-keys") return "Settings → AI Keys";
    if (location.pathname.startsWith("/expenses/")) {
      return "Expenses → Details";
    }
    if (location.pathname.startsWith("/settings/")) {
      const group = location.pathname.split("/")[2];
      const groupName = group.charAt(0).toUpperCase() + group.slice(1);
      return `Settings → ${groupName}`;
    }
    return "Money Manager";
  };

  // Show back button for sub-pages
  const showBackButton =
    location.pathname.startsWith("/settings/") ||
    location.pathname.startsWith("/expenses/") ||
    location.pathname === "/quick-save";

  return (
    <Card className="fixed top-0 left-0 right-0 flex items-center justify-between z-50 backdrop-blur-lg bg-opacity-90 rounded-none border-b border-border p-4 w-full">
      <div className="flex items-center gap-3">
        {showBackButton ? (
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all"
            aria-label="Go back"
          >
            <ArrowLeft className="text-white" size={24} />
          </button>
        ) : (
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
            <Wallet className="text-white" size={24} />
          </div>
        )}
        <h3
          className="text-xl font-bold truncate"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {getPageTitle()}
        </h3>
      </div>
    </Card>
  );
};

const NotificationPopup = () => {
  const {
    pendingExpense,
    showCategoryModal,
    handleCategoryConfirm,
    handleCategoryModalClose,
  } = useSMS();

  return (
    <CategorySelectionModal
      expense={pendingExpense}
      isOpen={showCategoryModal}
      onClose={handleCategoryModalClose}
      onConfirm={handleCategoryConfirm}
    />
  );
};

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll both window and main container to top
    window.scrollTo(0, 0);

    // Also scroll the main content container
    const mainElement = document.querySelector("main");
    if (mainElement) {
      mainElement.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return null;
};

// Component to handle shared image intent using Capacitor Share Target plugin
const ShareIntentHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    console.log("🎯 Initializing Share Target listener");

    // Listen for shared content
    const listener = CapacitorShareTarget.addListener(
      "shareReceived",
      (event) => {
        console.log("📱 Share received:", event);

        // Handle shared files (images)
        if (event.files && event.files.length > 0) {
          const imageFile = event.files[0];
          console.log("🖼️ Shared image:", imageFile);

          // Store the image URI for processing
          const shareData = {
            uri: imageFile.uri,
            name: imageFile.name,
            mimeType: imageFile.mimeType,
            timestamp: Date.now(),
          };

          // Store in sessionStorage for QuickSave page to pick up
          sessionStorage.setItem("sharedImage", JSON.stringify(shareData));
          sessionStorage.setItem("shareIntentPending", "true");

          // Navigate directly to quick-save page
          console.log("🔄 Navigating to /quick-save");
          navigate("/quick-save", { replace: true });
        }
      },
    );

    // Check if we have a pending share intent on mount
    if (
      sessionStorage.getItem("shareIntentPending") === "true" &&
      location.pathname !== "/quick-save"
    ) {
      console.log(
        "🔄 Pending share intent detected, redirecting to /quick-save",
      );
      navigate("/quick-save", { replace: true });
    }

    // Cleanup listener on unmount
    return () => {
      console.log("🧹 Cleaning up Share Target listener");
      listener.remove();
    };
  }, [navigate, location.pathname]);

  return null;
};

function App() {
  // Only show startup logo on first load (not on subsequent navigations)
  const [showStartup, setShowStartup] = useState(() => {
    // Check if we've already shown the startup screen in this session
    const hasShownStartup = sessionStorage.getItem("hasShownStartup");
    return !hasShownStartup;
  });

  useEffect(() => {
    // Initialize deep links for Capacitor
    if (Capacitor.isNativePlatform()) {
      console.log("🚀 Initializing deep links for native platform");
      initializeDeepLinks();
    }
  }, []);

  const handleStartupComplete = () => {
    setShowStartup(false);
    sessionStorage.setItem("hasShownStartup", "true");
  };

  return (
    <AuthProvider>
      <DataProvider>
        <SMSProvider>
          <ScreenshotProvider>
            <Router>
              {showStartup && (
                <StartupLogo onComplete={handleStartupComplete} />
              )}
              <ShareIntentHandler />
              <ScrollToTop />
              <div className="flex flex-col h-screen overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto w-full pb-20 pt-[72px]">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/add"
                      element={
                        <ProtectedRoute>
                          <AddExpense />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/quick-save"
                      element={
                        <ProtectedRoute>
                          <QuickSave />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/expenses"
                      element={
                        <ProtectedRoute>
                          <Expenses />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/expenses/:id"
                      element={
                        <ProtectedRoute>
                          <ExpenseDetail />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings/:group"
                      element={
                        <ProtectedRoute>
                          <SettingsGroup />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings/ai-keys"
                      element={
                        <ProtectedRoute>
                          <AIKeySettings />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/test-expense-save"
                      element={
                        <ProtectedRoute>
                          <TestExpenseSave />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/test-notification-popup"
                      element={
                        <ProtectedRoute>
                          <TestNotificationPopup />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/debug-expenses"
                      element={
                        <ProtectedRoute>
                          <DebugExpenses />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>
                <Navigation />
                <NotificationPopup />
                <AuthDebug />
                <ThemeDebug />
                <Toaster />
              </div>
            </Router>
          </ScreenshotProvider>
        </SMSProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
