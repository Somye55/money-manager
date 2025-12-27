import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { DesignSystemThemeProvider } from "./design-system";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { SMSProvider, useSMS } from "./context/SMSContext";
import { Capacitor } from "@capacitor/core";
import { initializeDeepLinks } from "./lib/deepLinks";
import {
  Smartphone,
  LayoutDashboard,
  PlusCircle,
  Settings as SettingsIcon,
  Wallet,
  Receipt,
} from "lucide-react";
import { Typography, Card } from "./design-system";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AddExpense from "./pages/AddExpense";
import Settings from "./pages/Settings";
import Expenses from "./pages/Expenses";
import AuthDebug from "./components/AuthDebug";
import ThemeDebug from "./components/ThemeDebug";
import CategorySelectionModal from "./components/CategorySelectionModal";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

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
  const { theme, toggleTheme } = useTheme();

  // Hide nav on login page
  if (location.pathname === "/login") return null;

  const navItems = [
    { icon: LayoutDashboard, label: "Home", path: "/" },
    { icon: Receipt, label: "Expenses", path: "/expenses" },
    { icon: PlusCircle, label: "Add", path: "/add" },
    { icon: SettingsIcon, label: "Settings", path: "/settings" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-bottom z-20"
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="flex justify-around items-center px-3 py-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 min-w-0 flex-1 min-h-[48px] ${
              location.pathname === item.path
                ? "text-primary"
                : "text-text-secondary"
            }`}
            style={{
              textDecoration: "none",
              background:
                location.pathname === item.path
                  ? "rgba(99, 102, 241, 0.12)"
                  : "transparent",
            }}
          >
            <item.icon
              size={24}
              strokeWidth={location.pathname === item.path ? 2.5 : 2}
            />
            <Typography
              variant="caption"
              className="mt-1 truncate text-xs font-medium"
              style={{ textDecoration: "none" }}
            >
              {item.label}
            </Typography>
            {location.pathname === item.path && (
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-t-full"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

const Header = () => {
  const location = useLocation();

  if (location.pathname === "/login") return null;

  return (
    <Card
      variant="elevated"
      padding="md"
      className="flex-between sticky top-0 z-10 backdrop-blur-lg bg-opacity-90"
      style={{
        borderRadius: "0",
        borderBottom: "1px solid var(--border)",
        padding: "1rem 1.5rem",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="p-2.5 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <Wallet className="text-white" size={24} />
        </div>
        <Typography
          variant="h3"
          className="text-xl font-bold"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Money Manager
        </Typography>
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

function App() {
  useEffect(() => {
    // Initialize deep links for Capacitor
    if (Capacitor.isNativePlatform()) {
      console.log("🚀 Initializing deep links for native platform");
      initializeDeepLinks();
    }
  }, []);

  return (
    <ThemeProvider>
      <DesignSystemThemeProvider>
        <AuthProvider>
          <DataProvider>
            <SMSProvider>
              <Router>
                <div className="pb-20">
                  {" "}
                  {/* Padding for bottom nav */}
                  <Header />
                  <main className="container mx-auto max-w-sm sm:max-w-md px-4 sm:px-6">
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
                        path="/expenses"
                        element={
                          <ProtectedRoute>
                            <Expenses />
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
                    </Routes>
                  </main>
                  <Navigation />
                  <NotificationPopup />
                  <AuthDebug />
                  <ThemeDebug />
                </div>
              </Router>
            </SMSProvider>
          </DataProvider>
        </AuthProvider>
      </DesignSystemThemeProvider>
    </ThemeProvider>
  );
}

export default App;
