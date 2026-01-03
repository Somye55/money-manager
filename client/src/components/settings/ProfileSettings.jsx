import { User, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ProfileSettings = () => {
  const { user: authUser, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="animate-slide-up card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Account Details
          </h3>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              {authUser?.user_metadata?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground">
                {authUser?.user_metadata?.name || "User"}
              </h4>
              <p className="text-sm text-muted-foreground">{authUser?.email}</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <p className="text-xs text-muted-foreground mb-1 font-medium">
                Email
              </p>
              <p className="text-sm font-semibold text-foreground">
                {authUser?.email}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <p className="text-xs text-muted-foreground mb-1 font-medium">
                Name
              </p>
              <p className="text-sm font-semibold text-foreground">
                {authUser?.user_metadata?.name || "Not set"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <p className="text-xs text-muted-foreground mb-1 font-medium">
                User ID
              </p>
              <p className="text-sm font-mono text-xs text-foreground">
                {authUser?.id}
              </p>
            </div>
          </div>

          <button
            className="w-full py-4 px-6 rounded-xl btn-gradient-danger font-semibold flex items-center justify-center gap-2"
            onClick={handleSignOut}
            aria-label="Sign out of your account"
          >
            <LogOut size={18} aria-hidden="true" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
