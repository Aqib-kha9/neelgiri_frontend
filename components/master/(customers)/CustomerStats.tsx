import { Users, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Customer } from "./types";

interface CustomerStatsProps {
  customers: Customer[];
}

const CustomerStats = ({ customers }: CustomerStatsProps) => {
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const inactiveCustomers = customers.filter(
    (c) => c.status === "inactive"
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total Customers
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {customers.length}
                </span>
                <Badge variant="secondary" className="rounded-full text-xs">
                  +12%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Total registered
              </p>
            </div>
            <div className="rounded-2xl bg-primary/10 p-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Active Customers
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {activeCustomers}
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  Live
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </div>
            <div className="rounded-2xl bg-success/10 p-3">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Inactive Accounts
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {inactiveCustomers}
                </span>
                <Badge variant="warning" className="rounded-full text-xs">
                  Suspended
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Requires validation
              </p>
            </div>
            <div className="rounded-2xl bg-warning/10 p-3">
              <XCircle className="h-6 w-6 text-warning" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Revenue Growth
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  ₹24.5L
                </span>
                <Badge variant="default" className="rounded-full text-xs">
                  +8.4%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Monthly analytics
              </p>
            </div>
            <div className="rounded-2xl bg-purple-500/10 p-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerStats;
