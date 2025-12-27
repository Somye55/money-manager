import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";

export interface StatusBarConfig {
  style: "light" | "dark";
  backgroundColor?: string;
}

/**
 * Status bar utility for managing theme synchronization on mobile devices
 */
export class StatusBarManager {
  private static instance: StatusBarManager;
  private isAvailable: boolean = false;

  private constructor() {
    this.isAvailable = Capacitor.isNativePlatform();
  }

  public static getInstance(): StatusBarManager {
    if (!StatusBarManager.instance) {
      StatusBarManager.instance = new StatusBarManager();
    }
    return StatusBarManager.instance;
  }

  /**
   * Initialize status bar with default configuration
   */
  public async initialize(): Promise<void> {
    if (!this.isAvailable) {
      console.log("StatusBar: Not available on this platform");
      return;
    }

    try {
      // Show status bar by default
      await StatusBar.show();
      console.log("StatusBar: Initialized successfully");
    } catch (error) {
      console.warn("StatusBar: Failed to initialize", error);
      this.isAvailable = false;
    }
  }

  /**
   * Update status bar style and background color based on theme
   */
  public async updateTheme(config: StatusBarConfig): Promise<void> {
    if (!this.isAvailable) {
      return;
    }

    try {
      // Set status bar style (affects text/icon color)
      await StatusBar.setStyle({
        style: config.style === "dark" ? Style.Dark : Style.Light,
      });

      // Set background color if provided
      if (config.backgroundColor) {
        await StatusBar.setBackgroundColor({
          color: config.backgroundColor,
        });
      }

      console.log(`StatusBar: Updated to ${config.style} theme`);
    } catch (error) {
      console.warn("StatusBar: Failed to update theme", error);
    }
  }

  /**
   * Set status bar overlay mode (for immersive experiences)
   */
  public async setOverlay(overlay: boolean): Promise<void> {
    if (!this.isAvailable) {
      return;
    }

    try {
      await StatusBar.setOverlaysWebView({ overlay });
      console.log(
        `StatusBar: Overlay mode ${overlay ? "enabled" : "disabled"}`
      );
    } catch (error) {
      console.warn("StatusBar: Failed to set overlay mode", error);
    }
  }

  /**
   * Hide status bar
   */
  public async hide(): Promise<void> {
    if (!this.isAvailable) {
      return;
    }

    try {
      await StatusBar.hide();
      console.log("StatusBar: Hidden");
    } catch (error) {
      console.warn("StatusBar: Failed to hide", error);
    }
  }

  /**
   * Show status bar
   */
  public async show(): Promise<void> {
    if (!this.isAvailable) {
      return;
    }

    try {
      await StatusBar.show();
      console.log("StatusBar: Shown");
    } catch (error) {
      console.warn("StatusBar: Failed to show", error);
    }
  }

  /**
   * Check if status bar is available on current platform
   */
  public isStatusBarAvailable(): boolean {
    return this.isAvailable;
  }
}

// Export singleton instance
export const statusBarManager = StatusBarManager.getInstance();

// Theme color mappings for different themes
export const THEME_COLORS = {
  light: {
    style: "dark" as const, // Dark text on light background
    backgroundColor: "#ffffff",
  },
  dark: {
    style: "light" as const, // Light text on dark background
    backgroundColor: "#0f172a", // slate-900
  },
} as const;

/**
 * Get status bar configuration for a given theme
 */
export function getStatusBarConfig(
  theme: "light" | "dark" | "system"
): StatusBarConfig {
  if (theme === "system") {
    // Detect system theme
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return THEME_COLORS[prefersDark ? "dark" : "light"];
  }

  return THEME_COLORS[theme === "dark" ? "dark" : "light"];
}
