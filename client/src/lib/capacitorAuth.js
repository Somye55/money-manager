import { supabase } from "./supabase";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";

export const signInWithGoogleCapacitor = async () => {
  if (!Capacitor.isNativePlatform()) {
    // For web, use normal OAuth
    return supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }

  try {
    console.log("🚀 Starting Capacitor Google OAuth...");

    // Get the OAuth URL from Supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "com.moneymanager.app://auth/callback",
      },
    });

    if (error) {
      console.error("❌ Error getting OAuth URL:", error);
      throw error;
    }

    console.log("✅ OAuth URL obtained, opening browser...");

    // Open the OAuth URL in the system browser
    if (data?.url) {
      await Browser.open({
        url: data.url,
        windowName: "_system",
      });
    }

    return { data, error: null };
  } catch (error) {
    console.error("❌ Capacitor OAuth error:", error);
    throw error;
  }
};
