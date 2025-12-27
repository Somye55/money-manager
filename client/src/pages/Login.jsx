import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Wallet, Sparkles, Loader2 } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Login = () => {
  const { signInWithGoogle, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) setLoading(false);
  }, [user]);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const handleAppStateChange = () => {
        setTimeout(() => setLoading(false), 2000);
      };
      document.addEventListener("visibilitychange", handleAppStateChange);
      return () =>
        document.removeEventListener("visibilitychange", handleAppStateChange);
    }
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await signInWithGoogle();
      if (!Capacitor.isNativePlatform()) {
        setTimeout(() => setLoading(false), 5000);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to sign in with Google.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-sm relative z-10 px-4">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <div className="flex justify-center mb-6">
            <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/30">
              <Wallet className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="heading-1 mb-2">Welcome Back</h1>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Sparkles size={16} className="text-primary" />
            Track your finances with ease
          </p>
        </div>

        {/* Main Card */}
        <Card className="slide-up">
          <CardContent className="card-body">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="heading-4 mb-1">Sign in to continue</h3>
              <p className="text-body-sm text-muted">
                Use your Google account to access your dashboard
              </p>
            </div>

            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              fullWidth
              className="h-14 text-base font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Signing in...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24">
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
                  Continue with Google
                </>
              )}
            </Button>

            <div className="mt-6 p-4 rounded-xl bg-muted/50 text-center">
              <p className="text-caption">
                🔒 Your data is secure and encrypted
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-caption mt-6">
          By continuing, you agree to our{" "}
          <a href="#" className="text-primary font-medium">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary font-medium">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
