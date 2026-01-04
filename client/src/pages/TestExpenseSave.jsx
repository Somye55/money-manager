import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { CheckCircle, XCircle, Loader } from "lucide-react";

const TestExpenseSave = () => {
  const navigate = useNavigate();
  const { addExpense, categories, user } = useData();
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const testExpenseSave = async () => {
    setTesting(true);
    setResult(null);

    try {
      // Simulate what the Android overlay sends (ONLY required fields)
      const testData = {
        amount: 150.5,
        description: "Test Transaction",
        date: new Date().toISOString(), // This is the fix!
        categoryId:
          categories && categories.length > 0 ? categories[0].id : null,
      };

      console.log("Testing expense save with data:", testData);
      console.log("User:", user);
      console.log("Categories:", categories);

      const savedExpense = await addExpense(testData);

      setResult({
        success: true,
        message: "✅ Expense saved successfully!",
        expense: savedExpense,
      });

      console.log("✅ Test successful! Expense:", savedExpense);

      // Navigate to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setResult({
        success: false,
        message: "❌ Failed to save expense",
        error: error.message,
      });

      console.error("❌ Test failed:", error);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-page-gradient px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-card rounded-3xl p-6 shadow-xl">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Test Expense Save
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            This simulates what the Android overlay does when you save an
            expense.
          </p>

          {/* User Info */}
          <div className="mb-6 p-4 bg-secondary rounded-xl">
            <h3 className="font-semibold text-sm mb-2">Current State:</h3>
            <div className="space-y-1 text-xs">
              <p>
                <span className="text-muted-foreground">User:</span>{" "}
                {user ? `${user.email} (ID: ${user.id})` : "Not logged in"}
              </p>
              <p>
                <span className="text-muted-foreground">Categories:</span>{" "}
                {categories ? categories.length : 0} loaded
              </p>
            </div>
          </div>

          {/* Test Data */}
          <div className="mb-6 p-4 bg-secondary rounded-xl">
            <h3 className="font-semibold text-sm mb-2">Test Data:</h3>
            <div className="space-y-1 text-xs font-mono">
              <p>Amount: Rs.150.50</p>
              <p>
                Category:{" "}
                {categories && categories.length > 0
                  ? categories[0].name
                  : "None"}
              </p>
              <p>Source: NOTIFICATION_OVERLAY</p>
              <p>Type: debit</p>
              <p>Date: {new Date().toISOString()}</p>
            </div>
          </div>

          {/* Test Button */}
          <button
            onClick={testExpenseSave}
            disabled={testing || !user}
            className="w-full py-4 px-6 rounded-2xl text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 mb-4"
            style={{
              background:
                testing || !user
                  ? "var(--color-muted)"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              cursor: testing || !user ? "not-allowed" : "pointer",
            }}
          >
            {testing ? (
              <>
                <Loader size={20} className="animate-spin" />
                <span>Testing...</span>
              </>
            ) : (
              <span>Test Expense Save</span>
            )}
          </button>

          {!user && (
            <p className="text-xs text-red-500 text-center mb-4">
              ⚠️ You must be logged in to test
            </p>
          )}

          {/* Result */}
          {result && (
            <div
              className={`p-4 rounded-xl ${
                result.success
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              }`}
            >
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle
                    className="text-green-600 dark:text-green-400 flex-shrink-0"
                    size={20}
                  />
                ) : (
                  <XCircle
                    className="text-red-600 dark:text-red-400 flex-shrink-0"
                    size={20}
                  />
                )}
                <div className="flex-1">
                  <p
                    className={`font-semibold text-sm ${
                      result.success
                        ? "text-green-800 dark:text-green-200"
                        : "text-red-800 dark:text-red-200"
                    }`}
                  >
                    {result.message}
                  </p>
                  {result.success && result.expense && (
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Expense ID: {result.expense.id}
                    </p>
                  )}
                  {!result.success && result.error && (
                    <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                      Error: {result.error}
                    </p>
                  )}
                  {result.success && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                      Redirecting to dashboard...
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-sm text-blue-800 dark:text-blue-200 mb-2">
              What This Tests:
            </h3>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>✓ User authentication</li>
              <li>✓ Category mapping</li>
              <li>✓ Date field (the fix!)</li>
              <li>✓ Database save</li>
              <li>✓ Context update</li>
            </ul>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-3">
              This is exactly what happens when you save from the Android
              overlay!
            </p>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate("/settings")}
            className="w-full mt-4 py-3 px-6 rounded-2xl border-2 border-border text-sm font-semibold hover:bg-secondary transition-all"
          >
            Back to Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestExpenseSave;
