import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";

const SystemSettings = () => {
  const { user, categories } = useData();
  const { user: authUser } = useAuth();

  return (
    <div className="space-y-4">
      <div className="animate-slide-up card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Database Status
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
              <p className="text-sm font-medium text-foreground">Connection</p>
              <span className="text-xs bg-emerald-500/20 text-emerald-600 px-3 py-1.5 rounded-full font-bold">
                ✓ Connected
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
              <p className="text-sm font-medium text-foreground">
                User Profile
              </p>
              <span className="text-xs bg-emerald-500/20 text-emerald-600 px-3 py-1.5 rounded-full font-bold">
                ✓ {user ? "Loaded" : "Loading..."}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
              <p className="text-sm font-medium text-foreground">Categories</p>
              <span className="text-xs bg-emerald-500/20 text-emerald-600 px-3 py-1.5 rounded-full font-bold">
                ✓ {categories.length} loaded
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="animate-slide-up card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card"
        style={{ animationDelay: "0.05s" }}
      >
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            App Information
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <p className="text-xs text-muted-foreground mb-1 font-medium">
                Version
              </p>
              <p className="text-sm font-semibold text-foreground">1.0.0</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <p className="text-xs text-muted-foreground mb-1 font-medium">
                User ID
              </p>
              <p className="text-sm font-mono text-xs break-all text-foreground">
                {authUser?.id || "Not available"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <p className="text-xs text-muted-foreground mb-1 font-medium">
                Build
              </p>
              <p className="text-sm font-semibold text-foreground">
                Production
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
