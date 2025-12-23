import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { supabase } from "../lib/supabase";
import { Button, Card, Typography } from "../design-system";

const DebugSupabase = () => {
  const { user: authUser } = useAuth();
  const { user: dbUser, categories } = useData();
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    const info = {
      timestamp: new Date().toISOString(),
      authUser: null,
      dbUser: null,
      categories: [],
      errors: [],
      tests: {},
    };

    try {
      // Check auth user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) {
        info.errors.push(`Auth Error: ${authError.message}`);
      } else {
        info.authUser = {
          id: user?.id,
          email: user?.email,
          authenticated: !!user,
        };
      }

      // Check database user
      if (user) {
        const { data: dbUsers, error: dbError } = await supabase
          .from("User")
          .select("*")
          .eq("email", user.email);

        if (dbError) {
          info.errors.push(`DB User Error: ${dbError.message}`);
        } else {
          info.dbUser = dbUsers?.[0] || null;
        }

        // Test category fetch
        if (info.dbUser) {
          const { data: cats, error: catError } = await supabase
            .from("Category")
            .select("*")
            .eq("userId", info.dbUser.id);

          if (catError) {
            info.errors.push(`Category Fetch Error: ${catError.message}`);
          } else {
            info.categories = cats || [];
          }

          // Test category creation
          const testCategoryName = `Test-${Date.now()}`;
          const { data: newCat, error: createError } = await supabase
            .from("Category")
            .insert([
              {
                name: testCategoryName,
                icon: "Tag",
                color: "#6366f1",
                userId: info.dbUser.id,
                order: 999,
              },
            ])
            .select()
            .single();

          if (createError) {
            info.tests.categoryCreation = {
              success: false,
              error: createError.message,
              code: createError.code,
            };
          } else {
            info.tests.categoryCreation = {
              success: true,
              categoryId: newCat.id,
            };

            // Clean up test category
            await supabase.from("Category").delete().eq("id", newCat.id);
          }
        }
      }

      // Check RLS policies
      info.tests.rlsCheck = {
        authUserExists: !!info.authUser?.id,
        dbUserExists: !!info.dbUser?.id,
        googleIdMatch: info.authUser?.id === info.dbUser?.googleId,
      };
    } catch (error) {
      info.errors.push(`General Error: ${error.message}`);
    }

    setDebugInfo(info);
    setLoading(false);
  };

  const testCategoryCreation = async () => {
    if (!dbUser) {
      alert("No database user found");
      return;
    }

    try {
      const testName = `Debug-${Date.now()}`;
      const { data, error } = await supabase
        .from("Category")
        .insert([
          {
            name: testName,
            icon: "TestTube",
            color: "#ff0000",
            userId: dbUser.id,
            order: 0,
          },
        ])
        .select()
        .single();

      if (error) {
        alert(`Error: ${error.message} (Code: ${error.code})`);
      } else {
        alert(`Success! Created category: ${data.name}`);
      }
    } catch (error) {
      alert(`Exception: ${error.message}`);
    }
  };

  return (
    <Card padding="lg" className="mb-4">
      <Typography variant="h3" className="mb-4">
        🔍 Supabase Debug
      </Typography>

      <div className="space-y-3 mb-4">
        <Button onClick={runDiagnostics} loading={loading} variant="primary">
          Run Full Diagnostics
        </Button>

        <Button onClick={testCategoryCreation} variant="secondary">
          Test Category Creation
        </Button>
      </div>

      {debugInfo && (
        <div className="space-y-4">
          <div>
            <Typography variant="h4">Auth User</Typography>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(debugInfo.authUser, null, 2)}
            </pre>
          </div>

          <div>
            <Typography variant="h4">Database User</Typography>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(debugInfo.dbUser, null, 2)}
            </pre>
          </div>

          <div>
            <Typography variant="h4">
              Categories ({debugInfo.categories.length})
            </Typography>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(debugInfo.categories, null, 2)}
            </pre>
          </div>

          <div>
            <Typography variant="h4">Tests</Typography>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(debugInfo.tests, null, 2)}
            </pre>
          </div>

          {debugInfo.errors.length > 0 && (
            <div>
              <Typography variant="h4" color="error">
                Errors
              </Typography>
              <div className="text-xs text-red-600 space-y-1">
                {debugInfo.errors.map((error, idx) => (
                  <div key={idx}>{error}</div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Typography variant="h4">Context Data</Typography>
            <div className="text-xs space-y-1">
              <div>Auth User: {authUser?.email || "None"}</div>
              <div>DB User: {dbUser?.email || "None"}</div>
              <div>Categories: {categories?.length || 0}</div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DebugSupabase;
