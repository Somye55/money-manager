/**
 * Mobile Navigation Example
 *
 * Demonstrates the usage of the new shadcn/ui mobile navigation components
 * including bottom navigation, navigation sheets, and mobile headers.
 *
 * This example shows how to integrate the mobile navigation components
 * with React Router and provides patterns for mobile-first navigation.
 */

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BottomNavigation,
  BottomNavigationItem,
  NavigationSheet,
  NavigationSheetItem,
  MobileHeader,
} from "./ui/mobile-navigation";
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  Settings as SettingsIcon,
  User,
  HelpCircle,
  LogOut,
  Bell,
  Search,
} from "lucide-react";

// Example Bottom Navigation Component
export const ExampleBottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide navigation on login page
  if (location.pathname === "/login") return null;

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Home",
      path: "/",
      badge: null,
    },
    {
      icon: Receipt,
      label: "Expenses",
      path: "/expenses",
      badge: null,
    },
    {
      icon: PlusCircle,
      label: "Add",
      path: "/add",
      badge: null,
    },
    {
      icon: SettingsIcon,
      label: "Settings",
      path: "/settings",
      badge: 2, // Example notification badge
    },
  ];

  return (
    <BottomNavigation variant="default" showBorder={true}>
      {navItems.map((item) => (
        <BottomNavigationItem
          key={item.path}
          icon={item.icon}
          label={item.label}
          active={location.pathname === item.path}
          badge={item.badge}
          onClick={() => navigate(item.path)}
        />
      ))}
    </BottomNavigation>
  );
};

// Example Navigation Sheet Component
export const ExampleNavigationSheet = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      icon: User,
      label: "Profile",
      description: "Manage your account",
      path: "/profile",
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "View your notifications",
      path: "/notifications",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "Get help and contact support",
      path: "/help",
    },
    {
      icon: LogOut,
      label: "Sign Out",
      description: "Sign out of your account",
      path: "/logout",
    },
  ];

  const handleItemClick = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <NavigationSheet
      open={open}
      onOpenChange={setOpen}
      title="Navigation Menu"
      description="Access additional features and settings"
    >
      <div className="space-y-2">
        {menuItems.map((item) => (
          <NavigationSheetItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            description={item.description}
            active={location.pathname === item.path}
            onClick={() => handleItemClick(item.path)}
          />
        ))}
      </div>
    </NavigationSheet>
  );
};

// Example Mobile Header Component
export const ExampleMobileHeader = ({
  title = "Money Manager",
  showBack = false,
  onBack,
  showMenu = true,
  showSearch = false,
}) => {
  const location = useLocation();

  // Hide header on login page
  if (location.pathname === "/login") return null;

  return (
    <MobileHeader
      title={title}
      showBackButton={showBack}
      onBack={onBack}
      leftAction={showMenu && !showBack ? <ExampleNavigationSheet /> : null}
      rightAction={
        showSearch ? (
          <button
            className="p-2 rounded-full hover:bg-accent"
            style={{ minHeight: "44px", minWidth: "44px" }}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </button>
        ) : null
      }
    />
  );
};

// Example Floating Bottom Navigation (Alternative Style)
export const ExampleFloatingBottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide navigation on login page
  if (location.pathname === "/login") return null;

  const navItems = [
    { icon: LayoutDashboard, label: "Home", path: "/" },
    { icon: Receipt, label: "Expenses", path: "/expenses" },
    { icon: PlusCircle, label: "Add", path: "/add" },
    { icon: SettingsIcon, label: "Settings", path: "/settings" },
  ];

  return (
    <BottomNavigation variant="floating" showBorder={false}>
      {navItems.map((item) => (
        <BottomNavigationItem
          key={item.path}
          icon={item.icon}
          label={item.label}
          active={location.pathname === item.path}
          showLabel={false} // Hide labels for floating variant
          onClick={() => navigate(item.path)}
        />
      ))}
    </BottomNavigation>
  );
};

// Example usage in App component
export const MobileNavigationApp = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <ExampleMobileHeader />

      {/* Main Content */}
      <main className="pb-20">
        {" "}
        {/* Add padding for bottom navigation */}
        {children}
      </main>

      {/* Bottom Navigation */}
      <ExampleBottomNavigation />
    </div>
  );
};

export default {
  ExampleBottomNavigation,
  ExampleNavigationSheet,
  ExampleMobileHeader,
  ExampleFloatingBottomNavigation,
  MobileNavigationApp,
};
