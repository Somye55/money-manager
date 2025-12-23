import { App } from "@capacitor/app";
import { supabase } from "./supabase";

export const initializeDeepLinks = () => {
  // Handle deep links for OAuth callbacks
  App.addListener("appUrlOpen", async (event) => {
    console.log("🔗 Deep link received:", event.url);

    // Check if this is an auth callback
    if (event.url.includes("auth/callback")) {
      try {
        console.log("🔄 Processing OAuth callback...");

        // Use Supabase's built-in session handling from URL
        const { data, error } = await supabase.auth.getSessionFromUrl({
          url: event.url,
          storeSession: true,
        });

        if (error) {
          console.error("❌ Error processing OAuth callback:", error);

          // Try manual parsing as fallback
          await handleManualTokenParsing(event.url);
        } else if (data.session) {
          console.log(
            "✅ Session created successfully:",
            data.session.user?.email
          );

          // Trigger auth state change
          window.dispatchEvent(new CustomEvent("supabase-auth-success"));
        } else {
          console.log("⚠️ No session data in callback");
          await handleManualTokenParsing(event.url);
        }
      } catch (error) {
        console.error("❌ Error handling deep link:", error);
        // Try manual parsing as fallback
        await handleManualTokenParsing(event.url);
      }
    }
  });
};

// Fallback manual token parsing
const handleManualTokenParsing = async (urlString) => {
  try {
    console.log("🔄 Attempting manual token parsing...");

    const url = new URL(urlString);
    let accessToken = null;
    let refreshToken = null;

    // Check both hash and search params
    const sources = [
      url.hash ? new URLSearchParams(url.hash.substring(1)) : null,
      url.search ? new URLSearchParams(url.search) : null,
    ].filter(Boolean);

    for (const params of sources) {
      accessToken = params.get("access_token");
      refreshToken = params.get("refresh_token");
      if (accessToken) break;
    }

    if (accessToken) {
      console.log("✅ Tokens found, setting session manually...");

      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        console.error("❌ Error setting session manually:", error);
      } else {
        console.log("✅ Manual session set successfully:", data.user?.email);
        window.dispatchEvent(new CustomEvent("supabase-auth-success"));
      }
    } else {
      console.log("⚠️ No tokens found in URL");
    }
  } catch (error) {
    console.error("❌ Manual token parsing failed:", error);
  }
};
