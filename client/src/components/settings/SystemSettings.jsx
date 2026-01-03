import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { Database, Check } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";

const SystemSettings = () => {
  const { user, categories } = useData();
  const { user: authUser } = useAuth();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="p-3 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <Database className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">System</h1>
          <p className="text-xs text-muted-foreground">
            App status and information
          </p>
        </div>
      </div>

      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="text-base">Database Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
              <p className="text-sm">Connection</p>
              <span className="text-xs bg-emerald-500/20 text-emerald-600 px-2 py-1 rounded-full font-bold">
                ✓ Connected
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
              <p className="text-sm">User Profile</p>
              <span className="text-xs bg-emerald-500/20 text-emerald-600 px-2 py-1 rounded-full font-bold">
                ✓ {user ? "Loaded" : "Loading..."}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
              <p className="text-sm">Categories</p>
              <span className="text-xs bg-emerald-500/20 text-emerald-600 px-2 py-1 rounded-full font-bold">
                ✓ {categories.length} loaded
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-slide-up" style={{ animationDelay: "0.05s" }}>
        <CardHeader>
          <CardTitle className="text-base">App Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-secondary">
              <p className="text-xs text-muted-foreground mb-1">Version</p>
              <p className="text-sm font-medium">1.0.0</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary">
              <p className="text-xs text-muted-foreground mb-1">User ID</p>
              <p className="text-sm font-mono text-xs break-all">
                {authUser?.id || "Not available"}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-secondary">
              <p className="text-xs text-muted-foreground mb-1">Build</p>
              <p className="text-sm font-medium">Production</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;
