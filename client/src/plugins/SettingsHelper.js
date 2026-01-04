import { registerPlugin } from "@capacitor/core";

const SettingsHelper = registerPlugin("SettingsHelper", {
  web: () => ({
    openNotificationSettings: async () => {
      throw new Error("SettingsHelper is only available on Android");
    },
    openOverlaySettings: async () => {
      throw new Error("SettingsHelper is only available on Android");
    },
    sendTestNotification: async () => {
      throw new Error("SettingsHelper is only available on Android");
    },
  }),
});

export { SettingsHelper };
