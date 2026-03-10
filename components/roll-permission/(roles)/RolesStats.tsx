import { Shield, Users, Key, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Role } from "./types";

interface RolesStatsProps {
  roles: Role[];
}

const RolesStats = ({ roles }: RolesStatsProps) => {
  const totalUsers = roles.reduce((sum, role) => sum + role.userCount, 0);
  const systemRoles = roles.filter((role) => role.isSystem).length;
  const customRoles = roles.filter((role) => !role.isSystem).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card className="rounded-3xl border-border/70 bg-card shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Roles
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-foreground">
                    {roles.length}
                  </span>
                  <Badge
                    variant="secondary"
                    className="rounded-lg bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-500 hover:bg-purple-500/20"
                  >
                    Active
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                System & custom roles
              </p>
            </div>
            <div className="rounded-2xl bg-purple-500/10 p-3.5">
              <Shield className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-border/70 bg-card shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Users
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-foreground">
                    {totalUsers}
                  </span>
                  <Badge
                    variant="secondary"
                    className="rounded-lg bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-500 hover:bg-blue-500/20"
                  >
                    Assigned
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Across all roles</p>
            </div>
            <div className="rounded-2xl bg-blue-500/10 p-3.5">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-border/70 bg-card shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  System Roles
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-foreground">
                    {systemRoles}
                  </span>
                  <Badge
                    variant="secondary"
                    className="rounded-lg bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500 hover:bg-green-500/20"
                  >
                    Protected
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Pre-defined roles</p>
            </div>
            <div className="rounded-2xl bg-green-500/10 p-3.5">
              <Lock className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-border/70 bg-card shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Custom Roles
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-foreground">
                    {customRoles}
                  </span>
                  <Badge
                    variant="secondary"
                    className="rounded-lg bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-500 hover:bg-orange-500/20"
                  >
                    Editable
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                User-defined roles
              </p>
            </div>
            <div className="rounded-2xl bg-orange-500/10 p-3.5">
              <Key className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RolesStats;
