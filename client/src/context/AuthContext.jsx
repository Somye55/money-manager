import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Capacitor } from "@capacitor/core";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    console.log("🔄 Checking initial session...");
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log("🔄 Initial session check:", {
        user: session?.user?.email || "no user",
        error: error?.message || "no error",
      });
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        "🔄 Auth state changed:",
        event,
        session?.user?.email || "no user"
      );
      console.log("🔄 Full session data:", session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for custom auth success events from deep links
    const handleAuthSuccess = () => {
      console.log("🎉 Custom auth success event received");
      // Refresh session
      supabase.auth.getSession().then(({ data: { session } }) => {
        console.log("🔄 Refreshed session:", session?.user?.email || "no user");
        setUser(session?.user ?? null);
        setLoading(false);
      });
    };

    // Handle URL hash changes for web OAuth callbacks
    const handleHashChange = async () => {
      console.log("🔄 Hash change detected:", window.location.hash);
      if (
        window.location.hash &&
        window.location.hash.includes("access_token")
      ) {
        console.log("🔄 Processing OAuth callback from hash...");
        try {
          const { data, error } = await supabase.auth.getSessionFromUrl();
          if (error) {
            console.error("❌ Error processing hash callback:", error);
          } else if (data.session) {
            console.log("✅ Session from hash:", data.session.user?.email);
            setUser(data.session.user);
          }
        } catch (err) {
          console.error("❌ Hash processing error:", err);
        }
      }
    };

    window.addEventListener("supabase-auth-success", handleAuthSuccess);
    window.addEventListener("hashchange", handleHashChange);

    // Check hash on initial load
    handleHashChange();

    // Also check for URL parameters (some OAuth flows use search params instead of hash)
    const checkUrlParams = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("access_token") || urlParams.get("code")) {
        console.log("🔄 Processing OAuth callback from URL params...");
        try {
          const { data, error } = await supabase.auth.getSessionFromUrl();
          if (error) {
            console.error("❌ Error processing URL params callback:", error);
          } else if (data.session) {
            console.log(
              "✅ Session from URL params:",
              data.session.user?.email
            );
            setUser(data.session.user);
          }
        } catch (err) {
          console.error("❌ URL params processing error:", err);
        }
      }
    };

    checkUrlParams();

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("supabase-auth-success", handleAuthSuccess);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const isNative = Capacitor.isNativePlatform();
      console.log("🔄 Starting Google sign in, isNative:", isNative);
      console.log("🔄 Current URL:", window.location.href);

      if (isNative) {
        // For Capacitor/native apps, use custom scheme
        console.log("🔄 Using native redirect URL");
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: "com.moneymanager.app://auth/callback",
          },
        });
        console.log("🔄 Native OAuth response:", { data, error });
        if (error) throw error;
      } else {
        // For web/browser - try multiple redirect URL strategies
        const redirectUrls = [
          `${window.location.origin}/`,
          `${window.location.origin}`,
          window.location.href,
        ];

        console.log("🔄 Trying web redirect URLs:", redirectUrls);

        let lastError = null;
        for (const redirectTo of redirectUrls) {
          try {
            console.log("🔄 Attempting with redirect URL:", redirectTo);
            const { data, error } = await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo,
              },
            });
            console.log("🔄 Web OAuth response:", { data, error });
            if (!error) {
              return; // Success, exit the function
            }
            lastError = error;
          } catch (err) {
            lastError = err;
            console.log(
              "🔄 Failed with redirect URL:",
              redirectTo,
              err.message
            );
          }
        }

        // If all attempts failed, throw the last error
        if (lastError) throw lastError;
      }
    } catch (error) {
      console.error("❌ Google sign in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    signInWithGoogle,
    signOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
