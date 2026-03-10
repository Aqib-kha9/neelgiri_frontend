// ==============================
// FILE: src/app/(dashboard)/dashboard/operations/page.tsx
// ROUTE: /dashboard/operations
// ==============================
"use client";

import { OperationsHeader } from "@/components/dashboard/operations/OperationsHeader";
import { OperationsStatsGrid } from "@/components/dashboard/operations/OperationsStatsGrid";
import { ShipmentLifecycleChart } from "@/components/dashboard/operations/ShipmentLifecycleChart"; // (Exact UI bars)
import { HubPerformancePanel } from "@/components/dashboard/operations/HubPerformancePanel";
import { RiderEfficiencyPanel } from "@/components/dashboard/operations/RiderEfficiencyPanel";
import { ExceptionSummaryPanel } from "@/components/dashboard/operations/ExceptionSummaryPanel";
import { OperationsAlertsPanel } from "@/components/dashboard/operations/OperationsAlertsPanel";

const operationsStats = [
  {
    title: "Total Shipments",
    value: "1,248",
    changeLabel: "Today",
    changeValue: "+8.4%",
    trend: "up",
    icon: "Package",
    color: "text-primary",
  },
  {
    title: "In Transit",
    value: "342",
    changeLabel: "Active",
    changeValue: "+12",
    trend: "up",
    icon: "Truck",
    color: "text-warning",
  },
  {
    title: "Out for Delivery",
    value: "189",
    changeLabel: "This hour",
    changeValue: "+8",
    trend: "up",
    icon: "MapPin",
    color: "text-success",
  },
  {
    title: "Delivered Today",
    value: "714",
    changeLabel: "Success rate",
    changeValue: "96.2%",
    trend: "up",
    icon: "CheckCircle2",
    color: "text-success",
  },
  {
    title: "Exceptions",
    value: "23",
    changeLabel: "Require attention",
    changeValue: "+4",
    trend: "warning",
    icon: "AlertTriangle",
    color: "text-error",
  },
  {
    title: "Avg. Transit Time",
    value: "38",
    suffix: "hours",
    changeLabel: "vs last week",
    changeValue: "-2.1",
    trend: "down",
    icon: "Clock",
    color: "text-muted-foreground",
  },
];

const shipmentLifecycle = [
  { stage: "Booking", count: 1248, percentage: 100, color: "bg-primary" },
  { stage: "Picked Up", count: 1189, percentage: 95, color: "bg-success" },
  { stage: "In Transit", count: 978, percentage: 78, color: "bg-warning" },
  { stage: "Out for Delivery", count: 714, percentage: 57, color: "bg-info" },
  { stage: "Delivered", count: 689, percentage: 55, color: "bg-success" },
];

const hubPerformance = [
  {
    hub: "Mumbai Central",
    shipments: 284,
    onTime: 96,
    efficiency: 94,
    status: "excellent",
  },
  {
    hub: "Delhi North",
    shipments: 312,
    onTime: 92,
    efficiency: 89,
    status: "good",
  },
  {
    hub: "Bangalore South",
    shipments: 198,
    onTime: 95,
    efficiency: 93,
    status: "excellent",
  },
  {
    hub: "Chennai East",
    shipments: 156,
    onTime: 88,
    efficiency: 85,
    status: "good",
  },
  {
    hub: "Hyderabad Central",
    shipments: 223,
    onTime: 91,
    efficiency: 90,
    status: "good",
  },
  {
    hub: "Kolkata West",
    shipments: 175,
    onTime: 84,
    efficiency: 82,
    status: "warning",
  },
];

const riderEfficiency = [
  {
    name: "Rider #8421",
    deliveries: 42,
    successRate: 98,
    avgTime: "28min",
    status: "excellent",
  },
  {
    name: "Rider #7392",
    deliveries: 38,
    successRate: 95,
    avgTime: "32min",
    status: "good",
  },
  {
    name: "Rider #6154",
    deliveries: 35,
    successRate: 92,
    avgTime: "35min",
    status: "good",
  },
  {
    name: "Rider #5287",
    deliveries: 28,
    successRate: 85,
    avgTime: "41min",
    status: "warning",
  },
  {
    name: "Rider #4931",
    deliveries: 31,
    successRate: 96,
    avgTime: "30min",
    status: "excellent",
  },
];

const exceptionTypes = [
  { type: "Address Issues", count: 8, percentage: 35, color: "bg-warning" },
  {
    type: "Customer Not Available",
    count: 6,
    percentage: 26,
    color: "bg-error",
  },
  {
    type: "Payment Disputes",
    count: 4,
    percentage: 17,
    color: "bg-destructive",
  },
  { type: "Package Damage", count: 3, percentage: 13, color: "bg-muted" },
  { type: "Weather Delays", count: 2, percentage: 9, color: "bg-info" },
];

const recentActivities = [
  {
    id: "1",
    title: "Shipment DL-8472 delayed",
    description:
      "Heavy traffic in Mumbai Western Expressway. ETA updated to 14:30",
    status: "warning" as const,
    timestamp: "15 mins ago",
    hub: "Mumbai Central",
  },
  {
    id: "2",
    title: "Rider assignment completed",
    description: "48 shipments assigned to 12 riders for morning shift",
    status: "success" as const,
    timestamp: "32 mins ago",
    hub: "Bangalore South",
  },
  {
    id: "3",
    title: "Hub capacity alert",
    description:
      "Chennai East hub at 85% capacity. Consider rerouting to Chennai North",
    status: "error" as const,
    timestamp: "45 mins ago",
    hub: "Chennai East",
  },
  {
    id: "4",
    title: "Weather advisory issued",
    description:
      "Heavy rainfall expected in Hyderabad. Delivery times may increase by 30%",
    status: "warning" as const,
    timestamp: "1 hour ago",
    hub: "Hyderabad Central",
  },
  {
    id: "5",
    title: "Performance milestone",
    description: "Delhi North hub achieved 95% on-time delivery for week",
    status: "success" as const,
    timestamp: "2 hours ago",
    hub: "Delhi North",
  },
];

export default function Page() {
  return (
    <div className="space-y-7">
      {/* Header Section */}
      <OperationsHeader />

      {/* Key Operations Metrics */}
      <OperationsStatsGrid stats={operationsStats} />

      {/* Shipment Lifecycle & Hub Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ShipmentLifecycleChart data={shipmentLifecycle} total={1248} />
        <HubPerformancePanel data={hubPerformance} />
      </div>

      {/* Rider Efficiency & Exception Analysis */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RiderEfficiencyPanel data={riderEfficiency} />
        <ExceptionSummaryPanel data={exceptionTypes} />
      </div>

      {/* Recent Operational Activities */}
      <OperationsAlertsPanel activities={recentActivities} />
    </div>
  );
}

// =====================================================
