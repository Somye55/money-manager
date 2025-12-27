import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, useTheme } from "./lib/theme-provider";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { SMSProvider } from "./context/SMSContext";
import { Capacitor } from "@capacitor/core";
import { initializeDeepLinks } from "./lib/deepLinks";
import {
  LayoutDashboard,
  PlusCircle,
  Settings as SettingsIcon,
  Wallet,
  Receipt,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import {
  MobileHeader,
  BottomNavigation,
  BottomNavigationItem,
} from "./components/ui/mobile-navigation";
import { IconButton } from "./components/ui/icon";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AddExpense from "./pages/AddExpense";
import Settings from "./pages/Settings";
import Expenses from "./pages/Expenses";

// Styles
import "./styles/globals.css";

// Loading component
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="text-center">
      <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <div className="animate-fade-in">{children}</div>;
};

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/login") return null;

  const navItems = [
    { icon: LayoutDashboard, label: "Home", path: "/" },
    { icon: Receipt, label: "Expenses", path: "/expenses" },
    { icon: PlusCircle, label: "Add", path: "/add" },
    { icon: SettingsIcon, label: "Settings", path: "/settings" },
  ];

  return (
    <BottomNavigation>
      {navItems.map((item) => (
        <BottomNavigationItem
          key={item.path}
          icon={item.icon}
          label={item.label}
          active={location.pathname === item.path}
          onClick={() => navigate(item.path)}
        />
      ))}
    </BottomNavigation>
  );
};

const Header = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  if (location.pathname === "/login") return null;

  const getThemeIcon = () => {
    if (theme === "system") return Monitor;
    if (theme === "light") return Sun;
    return Moon;
  };

  const CenterSection = (
    <div className="flex items-center gap-2">
      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 text-white ring-1 ring-white/10">
        <Wallet size={20} strokeWidth={2.5} />
      </div>
      <h1 className="text-lg font-extrabold tracking-tight text-foreground leading-none">
        Money Manager
      </h1>
    </div>
  );

  const RightSection = (
    <div className="flex items-center gap-3 pr-1">
      <IconButton
        onClick={toggleTheme}
        icon={getThemeIcon()}
        size="sm"
        variant="ghost"
        className="rounded-full w-9 h-9 bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
        aria-label={`Switch theme (current: ${theme})`}
      />

      {location.pathname === "/" && (
        <div className="text-right flex flex-col items-end justify-center min-h-[44px] hidden sm:flex">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            {new Date().toLocaleDateString("en-US", { month: "short" })}
          </span>
          <span className="text-xl font-black text-foreground leading-none -mt-0.5">
            {new Date().getDate()}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <MobileHeader
      leftAction={<div className="w-10" />} // Spacer to balance the right theme icon
      rightAction={RightSection}
      className="border-b bg-background shadow-sm"
    >
      {CenterSection}
    </MobileHeader>
  );
};

function App() {
  useEffect(() => {
    // Initialize deep links for Capacitor
    if (Capacitor.isNativePlatform()) {
      initializeDeepLinks();
    }
  }, []);

  return (
    <ThemeProvider enableTransitions={true}>
      <AuthProvider>
        <DataProvider>
          <SMSProvider>
            <Router>
              <div className="min-h-screen bg-background pb-20">
                <Header />
                {/* Mobile constrained layout */}
                <main className="max-w-md mx-auto w-full px-safe">
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
              </div>
            </Router>
          </SMSProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
