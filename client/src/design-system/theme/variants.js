import { tokens } from "./tokens.js";
import { createThemeVariants } from "./unified-theme.js";

// Get the theme variants from the unified theme system
const { lightTheme, darkTheme } = createThemeVariants();

// Export the themes
export { lightTheme, darkTheme };

// Component variants that work with both themes
export const componentVariants = {
  Button: {
    variants: {
      primary: {
        backgroundColor: "var(--color-primary)",
        color: "var(--color-text-inverse)",
        border: "none",
        "&:hover": {
          backgroundColor: "var(--color-primary-hover)",
        },
        "&:active": {
          backgroundColor: "var(--color-primary-active)",
        },
        "&:disabled": {
          backgroundColor: "var(--color-primary-disabled)",
          cursor: "not-allowed",
        },
      },
      secondary: {
        backgroundColor: "var(--color-surface)",
        color: "var(--color-text-primary)",
        border: "1px solid var(--color-border)",
        "&:hover": {
          backgroundColor: "var(--color-background-secondary)",
          borderColor: "var(--color-border-secondary)",
        },
        "&:active": {
          backgroundColor: "var(--color-background-tertiary)",
        },
        "&:disabled": {
          backgroundColor: "var(--color-surface)",
          color: "var(--color-text-disabled)",
          cursor: "not-allowed",
        },
      },
      outline: {
        backgroundColor: "transparent",
        color: "var(--color-primary)",
        border: "1px solid var(--color-primary)",
        "&:hover": {
          backgroundColor: "var(--color-primary)",
          color: "var(--color-text-inverse)",
        },
        "&:active": {
          backgroundColor: "var(--color-primary-active)",
        },
        "&:disabled": {
          borderColor: "var(--color-primary-disabled)",
          color: "var(--color-primary-disabled)",
          cursor: "not-allowed",
        },
      },
      ghost: {
        backgroundColor: "transparent",
        color: "var(--color-text-primary)",
        border: "none",
        "&:hover": {
          backgroundColor: "var(--color-background-secondary)",
        },
        "&:active": {
          backgroundColor: "var(--color-background-tertiary)",
        },
        "&:disabled": {
          color: "var(--color-text-disabled)",
          cursor: "not-allowed",
        },
      },
    },
    sizes: {
      sm: {
        padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
        fontSize: tokens.typography.fontSize.sm,
        minHeight: tokens.mobile.touchTarget.min,
      },
      md: {
        padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
        fontSize: tokens.typography.fontSize.base,
        minHeight: tokens.mobile.touchTarget.comfortable,
      },
      lg: {
        padding: `${tokens.spacing[4]} ${tokens.spacing[6]}`,
        fontSize: tokens.typography.fontSize.lg,
        minHeight: tokens.mobile.touchTarget.large,
      },
    },
    // Mobile-specific variants
    mobile: {
      touchOptimized: {
        minHeight: tokens.mobile.touchTarget.comfortable,
        padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
        fontSize: tokens.typography.fontSize.base,
        fontWeight: tokens.typography.fontWeight.medium,
      },
      fullWidth: {
        width: "100%",
        justifyContent: "center",
      },
    },
  },
  Input: {
    variants: {
      default: {
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        color: "var(--color-text-primary)",
        "&:focus": {
          borderColor: "var(--color-border-focus)",
          outline: "none",
          boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
        },
        "&:disabled": {
          backgroundColor: "var(--color-background-secondary)",
          color: "var(--color-text-disabled)",
          cursor: "not-allowed",
        },
      },
      error: {
        borderColor: "var(--color-error)",
        "&:focus": {
          borderColor: "var(--color-error)",
          boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.1)",
        },
      },
    },
    sizes: {
      sm: {
        padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
        fontSize: tokens.typography.fontSize.sm,
        minHeight: tokens.mobile.touchTarget.min,
      },
      md: {
        padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
        fontSize: tokens.typography.fontSize.base,
        minHeight: tokens.mobile.touchTarget.comfortable,
      },
      lg: {
        padding: `${tokens.spacing[4]} ${tokens.spacing[5]}`,
        fontSize: tokens.typography.fontSize.lg,
        minHeight: tokens.mobile.touchTarget.large,
      },
    },
    // Mobile-specific variants
    mobile: {
      touchOptimized: {
        minHeight: tokens.mobile.touchTarget.comfortable,
        padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
        fontSize: tokens.typography.fontSize.base,
      },
    },
  },
  Card: {
    variants: {
      default: {
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: tokens.radii.lg,
      },
      elevated: {
        backgroundColor: "var(--color-surface-elevated)",
        boxShadow: "var(--shadow-card)",
        border: "none",
        borderRadius: tokens.radii.lg,
      },
      outlined: {
        backgroundColor: "var(--color-surface)",
        border: "2px solid var(--color-border)",
        borderRadius: tokens.radii.lg,
      },
    },
    padding: {
      none: { padding: "0" },
      sm: { padding: tokens.spacing[3] },
      md: { padding: tokens.spacing[4] },
      lg: { padding: tokens.spacing[6] },
    },
    // Mobile-specific variants
    mobile: {
      fullWidth: {
        width: "100%",
        margin: `0 -${tokens.mobile.spacing.screenPadding.sm}`,
        borderRadius: "0",
        borderLeft: "none",
        borderRight: "none",
      },
      touchOptimized: {
        minHeight: tokens.mobile.touchTarget.comfortable,
        padding: tokens.spacing[4],
      },
    },
  },
  Modal: {
    variants: {
      default: {
        backgroundColor: "var(--color-surface)",
        borderRadius: tokens.radii.xl,
        boxShadow: "var(--shadow-modal)",
        border: "1px solid var(--color-border)",
      },
      fullscreen: {
        backgroundColor: "var(--color-surface)",
        borderRadius: "0",
        width: "100vw",
        height: "100vh",
        maxWidth: "none",
        maxHeight: "none",
      },
    },
    // Mobile-specific variants
    mobile: {
      bottomSheet: {
        position: "fixed",
        bottom: "0",
        left: "0",
        right: "0",
        borderRadius: `${tokens.radii.xl} ${tokens.radii.xl} 0 0`,
        maxHeight: "90vh",
        transform: "translateY(0)",
      },
      fullscreen: {
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        borderRadius: "0",
        width: "100vw",
        height: "100vh",
      },
    },
  },
  Navigation: {
    variants: {
      header: {
        backgroundColor: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
      },
      sidebar: {
        backgroundColor: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
        padding: tokens.spacing[4],
      },
    },
    // Mobile-specific variants
    mobile: {
      header: {
        position: "sticky",
        top: "0",
        zIndex: tokens.zIndex.sticky,
        minHeight: tokens.mobile.touchTarget.large,
        padding: `${tokens.spacing[2]} ${tokens.mobile.spacing.screenPadding.sm}`,
        paddingTop: `calc(${tokens.spacing[2]} + ${tokens.mobile.viewport.safeArea.top})`,
      },
      bottomNav: {
        position: "fixed",
        bottom: "0",
        left: "0",
        right: "0",
        backgroundColor: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        padding: `${tokens.spacing[2]} ${tokens.mobile.spacing.screenPadding.sm}`,
        paddingBottom: `calc(${tokens.spacing[2]} + ${tokens.mobile.viewport.safeArea.bottom})`,
        minHeight: tokens.mobile.touchTarget.large,
      },
    },
  },
};
