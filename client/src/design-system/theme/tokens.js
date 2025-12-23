// Design tokens - the foundation of our design system
export const tokens = {
  colors: {
    primary: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9", // Base primary color
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
    },
    secondary: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b", // Base secondary color
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
    success: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e", // Base success color
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
    },
    error: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444", // Base error color
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
    },
    warning: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b", // Base warning color
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
    },
    neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373", // Base neutral color
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
    },
  },
  typography: {
    fontFamily: {
      sans: [
        "Inter",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "sans-serif",
      ],
      mono: [
        "JetBrains Mono",
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace",
      ],
    },
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.2,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },
  },
  spacing: {
    0: "0px",
    1: "0.25rem", // 4px
    2: "0.5rem", // 8px
    3: "0.75rem", // 12px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    8: "2rem", // 32px
    10: "2.5rem", // 40px
    12: "3rem", // 48px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
    32: "8rem", // 128px
    // Semantic spacing
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
  },
  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  },
  radii: {
    none: "0px",
    sm: "0.25rem", // 4px
    base: "0.375rem", // 6px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    "2xl": "1.5rem", // 24px
    "3xl": "2rem", // 32px
    full: "9999px",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  zIndex: {
    hide: -1,
    auto: "auto",
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
  // Mobile-specific tokens
  mobile: {
    touchTarget: {
      min: "44px", // Minimum touch target size (WCAG AA)
      comfortable: "48px", // Comfortable touch target size
      large: "56px", // Large touch target for primary actions
    },
    spacing: {
      screenPadding: {
        xs: "0.75rem", // 12px - tight mobile padding
        sm: "1rem", // 16px - standard mobile padding
        md: "1.25rem", // 20px - comfortable mobile padding
        lg: "1.5rem", // 24px - spacious mobile padding
      },
      componentGap: {
        xs: "0.5rem", // 8px - tight component spacing
        sm: "0.75rem", // 12px - standard component spacing
        md: "1rem", // 16px - comfortable component spacing
        lg: "1.25rem", // 20px - spacious component spacing
      },
      sectionGap: {
        xs: "1rem", // 16px - tight section spacing
        sm: "1.5rem", // 24px - standard section spacing
        md: "2rem", // 32px - comfortable section spacing
        lg: "2.5rem", // 40px - spacious section spacing
      },
    },
    viewport: {
      minWidth: "320px", // Minimum supported viewport width
      safeArea: {
        top: "env(safe-area-inset-top, 0px)",
        right: "env(safe-area-inset-right, 0px)",
        bottom: "env(safe-area-inset-bottom, 0px)",
        left: "env(safe-area-inset-left, 0px)",
      },
    },
  },
  // Responsive design tokens
  responsive: {
    // Mobile-first breakpoints
    breakpoints: {
      xs: "0px", // Extra small devices (phones)
      sm: "640px", // Small devices (large phones)
      md: "768px", // Medium devices (tablets)
      lg: "1024px", // Large devices (desktops)
      xl: "1280px", // Extra large devices
      "2xl": "1536px", // 2X large devices
    },
    // Responsive spacing scale
    spacing: {
      xs: {
        container: "0.75rem", // 12px
        section: "1rem", // 16px
        component: "0.5rem", // 8px
      },
      sm: {
        container: "1rem", // 16px
        section: "1.5rem", // 24px
        component: "0.75rem", // 12px
      },
      md: {
        container: "1.5rem", // 24px
        section: "2rem", // 32px
        component: "1rem", // 16px
      },
      lg: {
        container: "2rem", // 32px
        section: "3rem", // 48px
        component: "1.5rem", // 24px
      },
    },
    // Responsive typography scale
    typography: {
      xs: {
        h1: "1.5rem", // 24px
        h2: "1.25rem", // 20px
        h3: "1.125rem", // 18px
        body: "0.875rem", // 14px
      },
      sm: {
        h1: "1.875rem", // 30px
        h2: "1.5rem", // 24px
        h3: "1.25rem", // 20px
        body: "1rem", // 16px
      },
      md: {
        h1: "2.25rem", // 36px
        h2: "1.875rem", // 30px
        h3: "1.5rem", // 24px
        body: "1rem", // 16px
      },
      lg: {
        h1: "3rem", // 48px
        h2: "2.25rem", // 36px
        h3: "1.875rem", // 30px
        body: "1.125rem", // 18px
      },
    },
  },
};
