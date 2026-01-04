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

        const url = new URL(event.url);
        const code = url.searchParams.get("code");
        const accessToken = url.searchParams.get("access_token");
        const refreshToken = url.searchParams.get("refresh_token");

        // Check hash params as well
        const hashParams = url.hash
          ? new URLSearchParams(url.hash.substring(1))
          : null;
        const hashAccessToken = hashParams?.get("access_token");
        const hashRefreshToken = hashParams?.get("refresh_token");

        if (code) {
          // Exchange code for session (PKCE flow)
          console.log("🔄 Exchanging code for session...");
          const { data, error } = await supabase.auth.exchangeCodeForSession(
            code
          );

          if (error) {
            console.error("❌ Error exchanging code:", error);
          } else if (data.session) {
            console.log(
              "✅ Session created successfully:",
              data.session.user?.email
            );
            window.dispatchEvent(new CustomEvent("supabase-auth-success"));
            window.location.href = "/";
          }
        } else if (accessToken || hashAccessToken) {
          // Direct token flow
          console.log("🔄 Setting session from tokens...");
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken || hashAccessToken,
            refresh_token: refreshToken || hashRefreshToken,
          });

          if (error) {
            console.error("❌ Error setting session:", error);
          } else {
            console.log("✅ Session set successfully:", data.user?.email);
            window.dispatchEvent(new CustomEvent("supabase-auth-success"));
            window.location.href = "/";
          }
        } else {
          console.log("⚠️ No code or tokens found in callback URL");
        }
      } catch (error) {
        console.error("❌ Error handling deep link:", error);
      }
    }
  });
};
