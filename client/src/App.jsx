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
import { SMSProvider } from "./context/SMSContext";
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
      }}
    >
      <div className="flex justify-around items-center px-2 py-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 min-w-0 flex-1 ${
              location.pathname === item.path
                ? "text-primary"
                : "text-text-secondary"
            }`}
            style={{
              textDecoration: "none",
              background:
                location.pathname === item.path
                  ? "rgba(99, 102, 241, 0.1)"
                  : "transparent",
            }}
          >
            <item.icon
              size={22}
              strokeWidth={location.pathname === item.path ? 2.5 : 2}
            />
            <Typography
              variant="caption"
              className="mt-1 truncate"
              style={{ textDecoration: "none" }}
            >
              {item.label}
            </Typography>
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
    >
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
          <Wallet className="text-white" size={24} />
        </div>
        <Typography
          variant="h3"
          className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"
        >
          Money Manager
        </Typography>
      </div>
    </Card>
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
                  <main className="container mx-auto max-w-md">
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
