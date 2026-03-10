import { Users, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface UserHeaderProps {
  onAddUser: () => void;
  userCount: number;
}

const UserHeader = ({ onAddUser, userCount }: UserHeaderProps) => {
  const { session } = useAuth();
  const role = session?.user?.role || "customer";

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-100 p-2">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage user accounts, roles, and permissions across the system
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="gap-2 rounded-xl border-border/70">
          <Download className="h-4 w-4" />
          Export Users
        </Button>
        {!['rider', 'customer'].includes(role) && (
          <Button
            className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand"
            onClick={onAddUser}
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserHeader;
