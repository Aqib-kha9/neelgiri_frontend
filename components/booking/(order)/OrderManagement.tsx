"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Package, Download, Plus, RefreshCcw, Loader2, InboxIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStats } from "./OrderStats";
import { OrderFilters } from "./OrderFilters";
import { OrderTabs } from "./OrderTabs";
import { OrderCard } from "./OrderCard";
import { Order } from "./types";
import { Clock, Truck, MapPin, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const statusConfig = {
  not_scheduled: {
    label: "Booked",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Clock,
  },
  booked: {
    label: "Booked",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Clock,
  },
  scheduled: {
    label: "In Transit",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: Truck,
  },
  "in-transit": {
    label: "In Transit",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: Truck,
  },
  in_progress: {
    label: "Out for Delivery",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    icon: MapPin,
  },
  "out-for-delivery": {
    label: "Out for Delivery",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    icon: MapPin,
  },
  complete: {
    label: "Delivered",
    color: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle2,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle2,
  },
  exception: {
    label: "Exception",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: AlertTriangle,
  },
  cancelled: {
    label: "Exception",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: AlertTriangle,
  },
};

// Map backend shipment to the Order type used by child components
function mapShipmentToOrder(s: any): Order {
  const statusMap: Record<string, string> = {
    not_scheduled: "booked",
    scheduled: "in-transit",
    in_progress: "out-for-delivery",
    complete: "delivered",
    delivered: "delivered",
    cancelled: "exception",
    exception: "exception",
  };

  return {
    id: s._id,
    awbNumber: s.awb,
    sender: {
      name: s.sender?.name || "—",
      phone: s.sender?.phone || "—",
      address: s.sender?.city || s.sender?.address || "—",
      pincode: s.sender?.pincode || "—",
      gstin: s.sender?.gstin || "—",
    },
    receiver: {
      name: s.receiver?.name || "—",
      phone: s.receiver?.phone || "—",
      address: s.receiver?.city || s.receiver?.address || "—",
      pincode: s.receiver?.pincode || "—",
      gstin: s.receiver?.gstin || "—",
    },
    package: {
      weight: s.weight ? `${s.weight} kg` : "—",
      volumetricWeight: s.chargeableWeight ? `${s.chargeableWeight} kg` : "—",
      actualWeight: s.weight ? `${s.weight} kg` : "—",
      type: s.packageType || "Parcel",
      description: s.contents || "—",
      invoiceValue: s.declaredValue ? `₹${s.declaredValue.toLocaleString()}` : "—",
      freightValue: s.totalAmount ? `₹${s.totalAmount.toFixed(2)}` : "—",
    },
    service: {
      type: s.mode === "AIR" ? "Air Express" : "Surface",
      mode: s.mode === "AIR" ? "Air" : "Surface",
      payment: s.paymentMode
        ? s.paymentMode.charAt(0).toUpperCase() + s.paymentMode.slice(1)
        : "—",
      codAmount: s.codAmount ? `₹${s.codAmount}` : "-",
      charges: s.totalAmount ? `₹${s.totalAmount.toFixed(2)}` : "—",
    },
    status: (statusMap[s.status] || "booked") as Order["status"],
    bookedDate: s.createdAt
      ? new Date(s.createdAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—",
    lastUpdated: s.updatedAt
      ? new Date(s.updatedAt).toLocaleString("en-IN", { day: "2-digit", month: "short" })
      : "—",
    qrCode: s.awb,
    eWayBill: s.eWayBill || "—",
    senderInvoiceNo: s.senderInvoiceNo || "—",
    additionalDocNos: s.additionalDocNos || [],
    fovCharge: typeof s.fovCharge === 'number' ? `₹${s.fovCharge.toFixed(2)}` : "—",
    attachments: s.attachments || [],
    partner: s.currentBranch?.name || "—",
    rider: s.rider?.name || "—",
  };
}

export const OrderManagement = () => {
  const { session } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/shipments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.map(mapShipmentToOrder));
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch only once on mount — use Refresh button for manual updates
  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !searchTerm ||
      order.awbNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.sender?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.receiver?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesTab = activeTab === "all" || order.status === activeTab;

    return matchesSearch && matchesStatus && matchesTab;
  });

  return (
    <div className="space-y-7 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-2">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Manage shipments, track deliveries, and handle multi-vendor operations with GST-compliant billing
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 rounded-xl border-border/70"
            onClick={fetchOrders}
            disabled={loading}
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button asChild className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand hover:shadow-brand-lg">
            <Link href="/dashboard/create-booking">
              <Plus className="h-4 w-4" />
              New Booking
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <OrderStats orders={orders} />

      {/* Filters */}
      <OrderFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />

      {/* Tabs */}
      <OrderTabs activeTab={activeTab} setActiveTab={setActiveTab} orders={orders} />

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Loading your orders...</p>
        </div>
      ) : error ? (
        <Card className="rounded-2xl border-destructive/30 bg-destructive/5">
          <CardContent className="p-10 text-center text-destructive text-sm">
            {error}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
              <CardContent className="p-12 text-center">
                <InboxIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-40" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No orders found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {searchTerm || statusFilter !== "all"
                    ? "No orders match your current search criteria. Try adjusting your filters."
                    : "Your bookings will appear here once created."}
                </p>
                <Button asChild className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand">
                  <Link href="/dashboard/create-booking">
                    <Plus className="h-4 w-4" />
                    Create New Booking
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};