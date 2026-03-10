import { Users, UserCheck, UserX, UserCog } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "./types";

interface UserStatsProps {
  users: User[];
}

const UserStats = ({ users }: UserStatsProps) => {
  const activeUsers = users.filter((u) => u.status === "active").length;
  const inactiveUsers = users.filter((u) => u.status === "inactive").length;
  const pendingUsers = users.filter((u) => u.status === "pending").length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                    {users.length}
                  </span>
                  <Badge
                    variant="secondary"
                    className="rounded-lg bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-500 hover:bg-blue-500/20"
                  >
                    Active
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Registered accounts
              </p>
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
                  Active Users
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-foreground">
                    {activeUsers}
                  </span>
                  <Badge
                    variant="secondary"
                    className="rounded-lg bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500 hover:bg-green-500/20"
                  >
                    Live
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </div>
            <div className="rounded-2xl bg-green-500/10 p-3.5">
              <UserCheck className="h-6 w-6 text-green-500" />
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
                  Pending Users
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-foreground">
                    {pendingUsers}
                  </span>
                  <Badge
                    variant="secondary"
                    className="rounded-lg bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-500 hover:bg-orange-500/20"
                  >
                    Review
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting activation
              </p>
            </div>
            <div className="rounded-2xl bg-orange-500/10 p-3.5">
              <UserCog className="h-6 w-6 text-orange-500" />
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
                  Inactive Users
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-foreground">
                    {inactiveUsers}
                  </span>
                  <Badge
                    variant="secondary"
                    className="rounded-lg bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500 hover:bg-red-500/20"
                  >
                    Suspended
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Temporarily disabled
              </p>
            </div>
            <div className="rounded-2xl bg-red-500/10 p-3.5">
              <UserX className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStats;
