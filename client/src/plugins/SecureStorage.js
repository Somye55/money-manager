import { registerPlugin } from "@capacitor/core";

const SecureStorage = registerPlugin("SecureStorage", {
  web: () => ({
    set: async () => {
      throw new Error(
        "SecureStorage native plugin is only available on Android. Use WebKeyStorage for web platform.",
      );
    },
    get: async () => {
      throw new Error(
        "SecureStorage native plugin is only available on Android. Use WebKeyStorage for web platform.",
      );
    },
    remove: async () => {
      throw new Error(
        "SecureStorage native plugin is only available on Android. Use WebKeyStorage for web platform.",
      );
    },
  }),
});

export { SecureStorage };
