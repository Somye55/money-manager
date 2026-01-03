import { User, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

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
      <div className="flex items-center gap-3 mb-4">
        <div
          className="p-3 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <User className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-xs text-muted-foreground">
            Manage your account information
          </p>
        </div>
      </div>

      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="text-base">Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              {authUser?.user_metadata?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h4 className="text-lg font-bold">
                {authUser?.user_metadata?.name || "User"}
              </h4>
              <p className="text-sm text-muted-foreground">{authUser?.email}</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="p-3 rounded-lg bg-secondary">
              <p className="text-xs text-muted-foreground mb-1">Email</p>
              <p className="text-sm font-medium">{authUser?.email}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary">
              <p className="text-xs text-muted-foreground mb-1">Name</p>
              <p className="text-sm font-medium">
                {authUser?.user_metadata?.name || "Not set"}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-secondary">
              <p className="text-xs text-muted-foreground mb-1">User ID</p>
              <p className="text-sm font-mono text-xs">{authUser?.id}</p>
            </div>
          </div>

          <Button
            variant="destructive"
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
            onClick={handleSignOut}
            aria-label="Sign out of your account"
          >
            <LogOut size={18} aria-hidden="true" /> Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
