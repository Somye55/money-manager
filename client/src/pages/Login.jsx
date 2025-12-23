import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Wallet, Sparkles } from "lucide-react";
import { Capacitor } from "@capacitor/core";

const Login = () => {
  const { signInWithGoogle, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset loading state when user changes (successful auth)
  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  // Reset loading state when app becomes active (for Capacitor)
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const handleAppStateChange = () => {
        // Reset loading after a delay when app becomes active
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      };

      // Listen for app state changes
      document.addEventListener("visibilitychange", handleAppStateChange);

      return () => {
        document.removeEventListener("visibilitychange", handleAppStateChange);
      };
    }
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("🚀 Starting Google OAuth...");

      await signInWithGoogle();

      // For web, redirect happens automatically
      // For native, we'll return to the app via deep link
      if (!Capacitor.isNativePlatform()) {
        // Reset loading after timeout for web
        setTimeout(() => setLoading(false), 5000);
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(
        err.message ||
          "Failed to sign in with Google. Please ensure Google auth is enabled in Supabase."
      );
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "var(--bg-secondary)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Gradients */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          right: "-20%",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          animation: "pulse 4s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-30%",
          left: "-10%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          animation: "pulse 5s ease-in-out infinite",
        }}
      />

      <div className="container max-w-md mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div
              style={{
                background: "var(--gradient-primary)",
                padding: "1.5rem",
                borderRadius: "2rem",
                boxShadow: "0 10px 40px rgba(99, 102, 241, 0.3)",
                animation: "slideUp 0.8s ease-out",
              }}
            >
              <Wallet className="w-12 h-12 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h1
            className="text-4xl font-extrabold mb-3"
            style={{
              background:
                "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Welcome Back
          </h1>
          <p className="text-secondary text-lg font-medium flex items-center justify-center gap-2">
            <Sparkles size={18} className="text-primary" />
            Track your finances with ease
          </p>
        </div>

        {/* Main Card */}
        <div
          className="card animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          {error && (
            <div
              className="mb-6 p-4 rounded-lg animate-fade-in"
              style={{
                background:
                  "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(252, 165, 165, 0.1) 100%)",
                border: "2px solid rgba(239, 68, 68, 0.3)",
                color: "var(--danger)",
              }}
            >
              <div className="flex items-start gap-3">
                <div className="bg-danger text-white rounded-full p-1 mt-0.5">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM7 4h2v5H7V4zm0 6h2v2H7v-2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Debug Info */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-4 p-3 rounded-lg bg-gray-100 text-xs">
              <p>
                <strong>Debug Info:</strong>
              </p>
              <p>User: {user ? user.email : "Not authenticated"}</p>
              <p>Loading: {loading ? "Yes" : "No"}</p>
              <p>Platform: {Capacitor.isNativePlatform() ? "Native" : "Web"}</p>
              <p>URL: {window.location.href}</p>
            </div>
          )}

          {/* Sign in message */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-2">Sign in to continue</h3>
            <p className="text-sm text-tertiary">
              Use your Google account to access your financial dashboard
            </p>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="btn btn-primary btn-block group"
            disabled={loading}
            style={{
              background: "var(--gradient-primary)",
              border: "none",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
            }}
          >
            {loading ? (
              <div className="animate-pulse">Signing in...</div>
            ) : (
              <>
                <svg
                  width="18"
                  height="18"
                  className="transition-transform group-hover:scale-110"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="font-semibold">Continue with Google</span>
              </>
            )}
          </button>

          {/* Info Footer */}
          <div
            className="mt-6 p-4 rounded-lg"
            style={{
              background: "var(--gradient-bg)",
              border: "1px solid var(--border-light)",
            }}
          >
            <p className="text-xs text-center text-tertiary">
              🔒 Your data is secure and encrypted
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-tertiary mt-6">
          By continuing, you agree to our{" "}
          <a href="#" className="text-primary font-semibold hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary font-semibold hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
