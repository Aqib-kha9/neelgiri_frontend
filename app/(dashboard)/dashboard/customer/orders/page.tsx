"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Search, Download } from "lucide-react";

export default function CustomerOrdersPage() {
  const orders = [
    {
      id: "order-1",
      orderNumber: "ORD-2024-001",
      status: "in_transit",
      createdAt: "2024-01-15",
      deliveryAddress: "456 Park Ave, Mumbai",
      amount: "₹500",
    },
    {
      id: "order-2",
      orderNumber: "ORD-2024-002",
      status: "delivered",
      createdAt: "2024-01-14",
      deliveryAddress: "789 Oak St, Mumbai",
      amount: "₹750",
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
        <p className="text-muted-foreground">
          View all your shipment orders
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {order.orderNumber}
                </CardTitle>
                {getStatusBadge(order.status)}
              </div>
              <CardDescription>
                Created on {new Date(order.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium mb-1">Delivery Address</p>
                  <p className="text-sm text-muted-foreground">
                    {order.deliveryAddress}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Amount</p>
                  <p className="text-sm text-muted-foreground">{order.amount}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Search className="mr-2 h-4 w-4" />
                  Track
                </Button>
                {order.status === "delivered" && (
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download Invoice
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

