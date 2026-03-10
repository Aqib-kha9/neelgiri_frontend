"use client";

import { usePermissions } from "@/hooks/usePermissions";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Plus } from "lucide-react";

export default function OrdersPage() {
  const { can, allowedActions } = usePermissions();

  const mockOrders = [
    {
      id: "order-1",
      orderNumber: "ORD-2024-001",
      customer: "Customer Name",
      status: "in_transit",
      pickupAddress: "123 Pickup St",
      deliveryAddress: "456 Delivery Ave",
      createdAt: "2024-01-15",
    },
    {
      id: "order-2",
      orderNumber: "ORD-2024-002",
      customer: "Customer Name 2",
      status: "pending",
      pickupAddress: "789 Pickup St",
      deliveryAddress: "012 Delivery Ave",
      createdAt: "2024-01-16",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      in_transit: "default",
      delivered: "outline",
      cancelled: "destructive",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track all orders
          </p>
        </div>
        <PermissionGate action="create" resource="order">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Order
          </Button>
        </PermissionGate>
      </div>

      <div className="space-y-4">
        {mockOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {order.orderNumber}
                  </CardTitle>
                  <CardDescription>{order.customer}</CardDescription>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Pickup Address</p>
                  <p className="text-sm text-muted-foreground">
                    {order.pickupAddress}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Delivery Address</p>
                  <p className="text-sm text-muted-foreground">
                    {order.deliveryAddress}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                {allowedActions("order").includes("update_status") && (
                  <Button variant="outline" size="sm">
                    Update Status
                  </Button>
                )}
                {allowedActions("order").includes("assign_rider") && (
                  <Button variant="outline" size="sm">
                    Assign Rider
                  </Button>
                )}
                {allowedActions("order").includes("cancel") && (
                  <Button variant="destructive" size="sm">
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

