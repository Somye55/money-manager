import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

const AuthDebug = () => {
  const { user, loading } = useAuth();
  const [supabaseStatus, setSupabaseStatus] = useState("checking...");
  const [sessionInfo, setSessionInfo] = useState(null);

  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        // Test basic Supabase connection
        const { data, error } = await supabase
          .from("User")
          .select("count")
          .limit(1);
        if (error) {
          setSupabaseStatus(`Error: ${error.message}`);
        } else {
          setSupabaseStatus("Connected");
        }
      } catch (err) {
        setSupabaseStatus(`Connection failed: ${err.message}`);
      }
    };

    const getSessionInfo = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      setSessionInfo({
        session: session?.user?.email || "No session",
        error: error?.message,
      });
    };

    checkSupabaseConnection();
    getSessionInfo();
  }, []);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h4 className="font-bold mb-2">Auth Debug</h4>
      <div className="space-y-1">
        <p>
          <strong>Auth User:</strong> {user ? user.email : "None"}
        </p>
        <p>
          <strong>Loading:</strong> {loading ? "Yes" : "No"}
        </p>
        <p>
          <strong>Supabase:</strong> {supabaseStatus}
        </p>
        <p>
          <strong>Session:</strong> {sessionInfo?.session || "Loading..."}
        </p>
        {sessionInfo?.error && (
          <p>
            <strong>Session Error:</strong> {sessionInfo.error}
          </p>
        )}
        <p>
          <strong>URL Hash:</strong> {window.location.hash || "None"}
        </p>
        <p>
          <strong>URL Search:</strong> {window.location.search || "None"}
        </p>
      </div>
    </div>
  );
};

export default AuthDebug;
