import { Shield, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RolesHeaderProps {
  onAddRole: () => void;
  roleCount: number;
}

const RolesHeader = ({ onAddRole, roleCount }: RolesHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-purple-100 p-2">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Roles & Permissions
            </h1>
            <p className="text-muted-foreground">
              Manage user roles, permissions, and access controls
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="gap-2 rounded-xl border-border/70">
          <Download className="h-4 w-4" />
          Export Roles
        </Button>
        <Button
          className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand"
          onClick={onAddRole}
        >
          <Plus className="h-4 w-4" />
          Add Role
        </Button>
      </div>
    </div>
  );
};

export default RolesHeader;
