import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, IndianRupee, Truck, AlertTriangle } from "lucide-react";
import { Order } from "./types";

interface OrderStatsProps {
  orders: Order[];
}

export const OrderStats = ({ orders }: OrderStatsProps) => {
  const getStatusCount = (status: string) => {
    return orders.filter((order) => status === "all" || order.status === status)
      .length;
  };

  const getTotalRevenue = () => {
    return orders.reduce(
      (sum, order) =>
        sum +
        parseFloat(order.service.charges.replace("₹", "").replace(",", "")),
      0
    );
  };

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-blue-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total Orders
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {orders.length}
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  +12%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Active shipments</p>
            </div>
            <div className="rounded-2xl bg-blue-100 p-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-green-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Revenue
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  ₹{getTotalRevenue().toLocaleString()}
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  +8%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </div>
            <div className="rounded-2xl bg-green-100 p-3">
              <IndianRupee className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-orange-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                In Delivery
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {getStatusCount("out-for-delivery") +
                    getStatusCount("in-transit")}
                </span>
                <Badge variant="warning" className="rounded-full text-xs">
                  Active
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">On the move</p>
            </div>
            <div className="rounded-2xl bg-orange-100 p-3">
              <Truck className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-red-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Exceptions
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {getStatusCount("exception")}
                </span>
                <Badge variant="error" className="rounded-full text-xs">
                  Attention
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Need resolution</p>
            </div>
            <div className="rounded-2xl bg-red-100 p-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
