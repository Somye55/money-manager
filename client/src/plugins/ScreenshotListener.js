import { registerPlugin } from "@capacitor/core";

const ScreenshotListener = registerPlugin("ScreenshotListener", {
  web: () => ({
    startListener: async () => {
      console.log("Screenshot listener not available on web");
      return { success: false, message: "Not available on web" };
    },
    stopListener: async () => {
      console.log("Screenshot listener not available on web");
      return { success: false, message: "Not available on web" };
    },
    checkPermissions: async () => {
      return { granted: false, permission: "N/A" };
    },
    requestPermissions: async () => {
      return { granted: false };
    },
  }),
});

export { ScreenshotListener };
