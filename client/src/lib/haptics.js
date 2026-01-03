import { Capacitor } from "@capacitor/core";

/**
 * Trigger haptic feedback on supported devices
 * @param {string} type - 'success', 'error', 'warning', or 'light'
 */
export const triggerHaptic = async (type = "light") => {
  // Only run on native platforms
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    // Try to use Capacitor Haptics if available
    const { Haptics, ImpactStyle, NotificationType } = await import(
      "@capacitor/haptics"
    );

    switch (type) {
      case "success":
        await Haptics.notification({ type: NotificationType.Success });
        break;
      case "error":
        await Haptics.notification({ type: NotificationType.Error });
        break;
      case "warning":
        await Haptics.notification({ type: NotificationType.Warning });
        break;
      case "light":
        await Haptics.impact({ style: ImpactStyle.Light });
        break;
      case "medium":
        await Haptics.impact({ style: ImpactStyle.Medium });
        break;
      case "heavy":
        await Haptics.impact({ style: ImpactStyle.Heavy });
        break;
      default:
        await Haptics.impact({ style: ImpactStyle.Light });
    }
  } catch (error) {
    // Haptics not available or failed, silently ignore
    console.debug("Haptics not available:", error.message);
  }
};
