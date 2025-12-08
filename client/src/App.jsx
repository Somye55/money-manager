import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { SMSProvider } from "./context/SMSContext";
import {
  Smartphone,
  LayoutDashboard,
  PlusCircle,
  Settings as SettingsIcon,
  Wallet,
} from "lucide-react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AddExpense from "./pages/AddExpense";
import Settings from "./pages/Settings";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // ===== AUTH DISABLED FOR TESTING =====
  // Uncomment below to re-enable:
  // if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  // if (!user) {
  //   return <Navigate to="/login" replace />;
  // }

  return children;
};

const Navigation = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Hide nav on login page
  if (location.pathname === "/login") return null;

  const navItems = [
    { icon: LayoutDashboard, label: "Home", path: "/" },
    { icon: PlusCircle, label: "Add", path: "/add" },
    { icon: SettingsIcon, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 safe-area-bottom z-20">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              location.pathname === item.path
                ? "text-primary"
                : "text-text-secondary"
            }`}
          >
            <item.icon size={24} />
            <span className="text-xs mt-1">{item.label}</span>
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
    <header className="p-4 flex-between bg-card shadow-sm sticky top-0 z-10 backdrop-blur-lg bg-opacity-90">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
          <Wallet className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          Money Manager
        </h1>
      </div>
    </header>
  );
};

function App() {
  return (
    <ThemeProvider>
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
