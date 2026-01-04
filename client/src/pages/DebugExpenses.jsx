import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { Button } from "../components/ui/button";

const DebugExpenses = () => {
  const { user, expenses } = useData();
  const { user: authUser } = useAuth();
  const [dbExpenses, setDbExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDirectFromDB = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch ALL expenses for this user without any filters
      const { data, error } = await supabase
        .from("Expense")
        .select(
          `
          *,
          category:Category(*)
        `
        )
        .eq("userId", user.id)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching expenses:", error);
      } else {
        console.log("Direct DB fetch:", data);
        setDbExpenses(data || []);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDirectFromDB();
    }
  }, [user]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Debug Expenses</h1>

      <div className="bg-card p-4 rounded-lg border">
        <h2 className="font-bold mb-2">Auth User</h2>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(authUser, null, 2)}
        </pre>
      </div>

      <div className="bg-card p-4 rounded-lg border">
        <h2 className="font-bold mb-2">DataContext User</h2>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div className="bg-card p-4 rounded-lg border">
        <h2 className="font-bold mb-2">
          Expenses from DataContext (filtered by current month)
        </h2>
        <p className="text-sm mb-2">Count: {expenses.length}</p>
        <pre className="text-xs overflow-auto max-h-96">
          {JSON.stringify(expenses, null, 2)}
        </pre>
      </div>

      <div className="bg-card p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold">All Expenses from Database (no filters)</h2>
          <Button onClick={fetchDirectFromDB} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>
        <p className="text-sm mb-2">Count: {dbExpenses.length}</p>
        <pre className="text-xs overflow-auto max-h-96">
          {JSON.stringify(dbExpenses, null, 2)}
        </pre>
      </div>

      <div className="bg-card p-4 rounded-lg border">
        <h2 className="font-bold mb-2">Current Month Range</h2>
        <pre className="text-xs">
          {JSON.stringify(
            {
              start: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1
              )
                .toISOString()
                .split("T")[0],
              end: new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                0
              )
                .toISOString()
                .split("T")[0],
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
};

export default DebugExpenses;
