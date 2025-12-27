/**
 * Mobile Navigation Components Tests
 *
 * Tests for the mobile navigation components including bottom navigation,
 * navigation sheets, and mobile headers. Validates touch target sizing,
 * accessibility features, and mobile-specific behaviors.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  BottomNavigation,
  BottomNavigationItem,
  NavigationSheet,
  NavigationSheetItem,
  MobileHeader,
} from "../components/ui/mobile-navigation";
import { Home, Settings } from "lucide-react";

// Mock mobile utilities
vi.mock("../lib/mobile-utils", () => ({
  isTouchDevice: vi.fn(() => true),
  optimizeForMobile: vi.fn(() => vi.fn()),
  TOUCH_TARGET: {
    MIN_SIZE: 44,
    COMFORTABLE_SIZE: 48,
    LARGE_SIZE: 56,
  },
  MOBILE_CLASSES: {
    TOUCH_TARGET: "min-h-touch min-w-touch",
    SAFE_AREA_TOP: "pt-safe-top",
    SAFE_AREA_BOTTOM: "pb-safe-bottom",
    SAFE_AREA_LEFT: "pl-safe-left",
    SAFE_AREA_RIGHT: "pr-safe-right",
    SAFE_AREA_ALL: "pt-safe-top pb-safe-bottom pl-safe-left pr-safe-right",
    TOUCH_MANIPULATION: "touch-manipulation",
    PREVENT_ZOOM: "text-base",
  },
}));

describe("BottomNavigation", () => {
  it("renders with proper navigation role and aria-label", () => {
    render(
      <BottomNavigation>
        <BottomNavigationItem icon={Home} label="Home" />
      </BottomNavigation>
    );

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Bottom navigation");
  });

  it("applies correct CSS classes for mobile optimization", () => {
    render(
      <BottomNavigation data-testid="bottom-nav">
        <BottomNavigationItem icon={Home} label="Home" />
      </BottomNavigation>
    );

    const nav = screen.getByTestId("bottom-nav");
    expect(nav).toHaveClass("fixed", "bottom-0", "left-0", "right-0");
    expect(nav).toHaveClass("flex", "items-center", "justify-around");
  });

  it("renders floating variant with correct styles", () => {
    render(
      <BottomNavigation variant="floating" data-testid="floating-nav">
        <BottomNavigationItem icon={Home} label="Home" />
      </BottomNavigation>
    );

    const nav = screen.getByTestId("floating-nav");
    expect(nav).toHaveClass("mx-4", "mb-4", "rounded-2xl");
  });
});

describe("BottomNavigationItem", () => {
  it("renders with proper touch target size", () => {
    render(<BottomNavigationItem icon={Home} label="Home" />);

    const button = screen.getByRole("button");

    // Check that minimum dimensions are set via style attribute
    expect(button).toHaveStyle({
      minHeight: "44px",
      minWidth: "44px",
    });
  });

  it("displays icon and label correctly", () => {
    render(<BottomNavigationItem icon={Home} label="Home" />);

    expect(screen.getByLabelText("Home")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("shows active state with proper styling", () => {
    render(<BottomNavigationItem icon={Home} label="Home" active={true} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-primary", "bg-primary/10");
    expect(button).toHaveAttribute("aria-current", "page");
  });

  it("displays badge when provided", () => {
    render(<BottomNavigationItem icon={Home} label="Home" badge={5} />);

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByLabelText("5 notifications")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = vi.fn();

    render(
      <BottomNavigationItem icon={Home} label="Home" onClick={handleClick} />
    );

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<BottomNavigationItem icon={Home} label="Home" disabled={true} />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("opacity-50", "cursor-not-allowed");
  });

  it("hides label when showLabel is false", () => {
    render(<BottomNavigationItem icon={Home} label="Home" showLabel={false} />);

    expect(screen.queryByText("Home")).not.toBeInTheDocument();
    // But aria-label should still be present
    expect(screen.getByLabelText("Home")).toBeInTheDocument();
  });
});

describe("NavigationSheet", () => {
  it("renders trigger button with proper accessibility", () => {
    render(
      <NavigationSheet>
        <NavigationSheetItem icon={Settings} label="Settings" />
      </NavigationSheet>
    );

    const trigger = screen.getByRole("button");
    expect(screen.getByText("Open navigation menu")).toBeInTheDocument();
  });

  it("renders custom trigger when provided", () => {
    const customTrigger = <button>Custom Menu</button>;

    render(
      <NavigationSheet trigger={customTrigger}>
        <NavigationSheetItem icon={Settings} label="Settings" />
      </NavigationSheet>
    );

    expect(screen.getByText("Custom Menu")).toBeInTheDocument();
  });
});

describe("NavigationSheetItem", () => {
  it("renders with proper touch target size", () => {
    render(<NavigationSheetItem icon={Settings} label="Settings" />);

    const button = screen.getByRole("button");
    expect(button).toHaveStyle({ minHeight: "44px" });
  });

  it("displays icon, label, and description", () => {
    render(
      <NavigationSheetItem
        icon={Settings}
        label="Settings"
        description="Manage your preferences"
      />
    );

    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Manage your preferences")).toBeInTheDocument();
  });

  it("shows active state correctly", () => {
    render(
      <NavigationSheetItem icon={Settings} label="Settings" active={true} />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-primary/10", "text-primary");
    expect(button).toHaveAttribute("aria-current", "page");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();

    render(
      <NavigationSheetItem
        icon={Settings}
        label="Settings"
        onClick={handleClick}
      />
    );

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe("MobileHeader", () => {
  it("renders with proper banner role", () => {
    render(<MobileHeader title="Test Header" />);

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  it("displays title when provided", () => {
    render(<MobileHeader title="Test Title" />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Test Title"
    );
  });

  it("shows back button when showBackButton is true", () => {
    const handleBack = vi.fn();

    render(<MobileHeader showBackButton={true} onBack={handleBack} />);

    const backButton = screen.getByRole("button");
    expect(screen.getByText("Go back")).toBeInTheDocument();
  });

  it("handles back button click", () => {
    const handleBack = vi.fn();

    render(<MobileHeader showBackButton={true} onBack={handleBack} />);

    fireEvent.click(screen.getByRole("button"));
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it("renders left and right actions", () => {
    const leftAction = <button>Left</button>;
    const rightAction = <button>Right</button>;

    render(<MobileHeader leftAction={leftAction} rightAction={rightAction} />);

    expect(screen.getByText("Left")).toBeInTheDocument();
    expect(screen.getByText("Right")).toBeInTheDocument();
  });
});

describe("Touch Target Validation", () => {
  it("all interactive elements meet minimum touch target size", () => {
    render(
      <div>
        <BottomNavigationItem icon={Home} label="Home" data-testid="nav-item" />
        <NavigationSheetItem
          icon={Settings}
          label="Settings"
          data-testid="sheet-item"
        />
      </div>
    );

    const navItem = screen.getByTestId("nav-item");
    const sheetItem = screen.getByTestId("sheet-item");

    // Check minimum dimensions
    expect(navItem).toHaveStyle({
      minHeight: "44px",
      minWidth: "44px",
    });

    expect(sheetItem).toHaveStyle({
      minHeight: "44px",
    });
  });
});

describe("Accessibility", () => {
  it("provides proper ARIA labels and roles", () => {
    render(
      <BottomNavigation>
        <BottomNavigationItem icon={Home} label="Home" active={true} />
        <BottomNavigationItem icon={Settings} label="Settings" />
      </BottomNavigation>
    );

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Bottom navigation");

    const activeItem = screen.getByRole("button", { current: "page" });
    expect(activeItem).toHaveAttribute("aria-current", "page");
  });
});
