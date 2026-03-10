"use client";

import { useMemo } from "react";
import Link from "next/link";

import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";

import { PermissionGate } from "@/components/auth/PermissionGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  AlertCircle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  DollarSign,
  Eye,
  FileText,
  MapPin,
  Package,
  Truck,
  TrendingUp,
  Warehouse,
  Plus,
  Search as SearchIcon,
  Receipt,
  Users,
  Download,
} from "lucide-react";

// New dashboard widgets (create under src/components/dashboard/*)
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { SystemAlertsPanel } from "@/components/dashboard/SystemAlertsPanel";
import { LiveTrackingMap } from "@/components/dashboard/LiveTrackingMap";
import { QuickActionsPanel } from "@/components/dashboard/QuickActionsPanel";

export default function DashboardPage() {
  const { session } = useAuth();
  const { can } = usePermissions();

  // === ORIGINAL LOGIC (unchanged) ===
  const getRoleMetrics = () => {
    const role = session?.user.role;
    if (role === "super_admin") {
      return {
        totalOrders: 1247,
        pendingOrders: 23,
        inTransit: 45,
        delivered: 1179,
        totalBranches: 12,
        activeRiders: 48,
        totalCustomers: 342,
        totalPartners: 5,
        revenue: 2450000,
        gstPending: 8,
      } as const;
    } else if (role === "partner_admin") {
      return {
        totalOrders: 456,
        pendingOrders: 12,
        inTransit: 18,
        delivered: 426,
        totalBranches: 4,
        activeRiders: 15,
        totalCustomers: 128,
        revenue: 890000,
        settlementPending: 2,
      } as const;
    } else if (role === "branch_admin") {
      return {
        totalOrders: 89,
        pendingOrders: 5,
        inTransit: 12,
        delivered: 72,
        activeRiders: 6,
        totalCustomers: 45,
        drsPending: 3,
        todayDeliveries: 15,
      } as const;
    } else if (role === "warehouse_admin") {
      return {
        totalInventory: 1245,
        pendingInward: 12,
        pendingOutward: 8,
        manifestCreated: 23,
        stockAlerts: 3,
        reconciledToday: 45,
      } as const;
    } else if (role === "dispatcher") {
      return {
        pendingAssignments: 15,
        assignedToday: 32,
        inTransit: 18,
        activeRiders: 6,
        drsCreated: 5,
        unassignedOrders: 8,
      } as const;
    } else if (role === "rider") {
      return {
        myTasks: 8,
        completedToday: 12,
        pendingDelivery: 5,
        inTransit: 3,
        totalDeliveries: 234,
        rating: 4.8,
      } as const;
    } else {
      return {
        myOrders: 12,
        pendingOrders: 3,
        inTransit: 2,
        delivered: 7,
        totalSpent: 12500,
      } as const;
    }
  };

  const metrics = getRoleMetrics();

  const getRoleContent = () => {
    const role = session?.user.role;
    if (role === "super_admin") {
      return {
        badge: "Enterprise Command Center",
        title: "Delivery Management System",
        blurb:
          "End-to-end logistics intelligence with GST compliance, multi-partner operations, and real-time tracking.",
      } as const;
    } else if (role === "partner_admin") {
      return {
        badge: "Partner Dashboard",
        title: "Regional Operations",
        blurb:
          "Manage partner network, branches, and operations with analytics.",
      } as const;
    } else if (role === "branch_admin") {
      return {
        badge: "Branch Operations",
        title: "Daily Operations Management",
        blurb: "Manage branch orders, riders, DRS creation, and deliveries.",
      } as const;
    } else if (role === "warehouse_admin") {
      return {
        badge: "Warehouse Operations",
        title: "Inventory & Manifest Management",
        blurb:
          "Manage inventory, manifests, stock reconciliation, and operations.",
      } as const;
    } else if (role === "dispatcher") {
      return {
        badge: "Dispatcher Dashboard",
        title: "Order Assignment & Coordination",
        blurb: "Assign orders, create DRS, and coordinate deliveries.",
      } as const;
    } else if (role === "rider") {
      return {
        badge: "Rider Dashboard",
        title: "My Delivery Tasks",
        blurb: "View tasks, capture POD, and track performance.",
      } as const;
    } else {
      return {
        badge: `${session?.user?.roleDisplayName || 'Customer'}`,
        title: `${session?.user?.roleDisplayName || 'Dashboard'}`,
        blurb: "Overview of your activities and modules.",
      } as const;
    }
  };

  const roleContent = getRoleContent();

  // ======= UI DATA (for StatsCard & Panels) matching MainDashboard =======
  const stats = [
    {
      title: "Total Shipments",
      value:
        (metrics as any).totalOrders?.toLocaleString?.() ||
        (metrics as any).myOrders?.toString?.() ||
        "0",
      changeLabel: "Today",
      changeValue: "+8.4%",
      trend: "up" as const,
    },
    {
      title: "Active Riders",
      value: String((metrics as any).activeRiders || 0),
      changeLabel: "across cities",
      changeValue: "+62",
      trend: "up" as const,
    },
    {
      title: "On-time Delivery %",
      value: "96.2",
      suffix: "%",
      changeLabel: "SLA Performance",
      changeValue: "-0.8%",
      trend: "down" as const,
    },
    {
      title: "GST Compliance",
      value: "98.5",
      suffix: "%",
      changeLabel: "Filings Completed",
      changeValue: "+2.1%",
      trend: "up" as const,
    },
    {
      title: "POD Capture Rate",
      value: "94.7",
      suffix: "%",
      changeLabel: "Successful PODs",
      changeValue: "+1.2%",
      trend: "up" as const,
    },
    {
      title: "Exception Rate",
      value: "1.8",
      suffix: "%",
      changeLabel: "Requires Attention",
      changeValue: "+0.2%",
      trend: "down" as const,
    },
  ];

  const activities = [
    {
      id: "1",
      title: "Shipment DL-2391 Delivered with POD",
      description:
        "Bangalore Central Hub • Signature captured successfully • Rider #8421",
      status: "success" as const,
      timestamp: "2 mins ago",
    },
    {
      id: "2",
      title: "GST Invoice Generated",
      description:
        "Hyderabad South Facility • GSTR-1 filing completed • Compliance verified",
      status: "info" as const,
      timestamp: "12 mins ago",
    },
    {
      id: "3",
      title: "Address Validation Failed - Manual Review",
      description:
        "Shipment PN-8820 flagged • Customer confirmation pending • Exception workflow initiated",
      status: "warning" as const,
      timestamp: "22 mins ago",
    },
    {
      id: "4",
      title: "Partner Onboarding Completed",
      description:
        "LogiMax Partners • GSTIN verified • Training & infrastructure assessment passed",
      status: "success" as const,
      timestamp: "38 mins ago",
    },
    {
      id: "5",
      title: "DRS Created for Mumbai West",
      description:
        "Delivery Run Sheet generated • 42 shipments assigned • Rider allocation completed",
      status: "info" as const,
      timestamp: "45 mins ago",
    },
  ];

  const alerts = [
    {
      id: "1",
      title: "E-Way Bill Expiry - 12 Shipments",
      description:
        "Validity ending in 6 hours • Auto-extension required • Pune cluster affected",
      severity: "high" as const,
      timestamp: "5 mins ago",
    },
    {
      id: "2",
      title: "GSTR-3B Filing Deadline",
      description:
        "Maharashtra due in 2 days • Pending approval from finance • 48 branches impacted",
      severity: "medium" as const,
      timestamp: "18 mins ago",
    },
    {
      id: "3",
      title: "POD Capture Failure - Pune Cluster",
      description:
        "7 failed delivery attempts • Address verification workflow initiated • Rider support required",
      severity: "critical" as const,
      timestamp: "32 mins ago",
    },
    {
      id: "4",
      title: "Counter Manifest Inward Pending",
      description:
        "24 shipments awaiting processing • Bangalore Central Hub • Priority attention needed",
      severity: "medium" as const,
      timestamp: "1 hr ago",
    },
  ];

  return (
    <div className="space-y-7">
      {/* ======== Header Section (matches MainDashboard) ======== */}
      <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="space-y-3">
            <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary font-semibold">
              {roleContent.badge}
            </Badge>
            <div className="space-y-2">
              <h1 className="text-display-1 leading-tight font-bold">
                {roleContent.title}
              </h1>
              <p className="max-w-2xl text-body text-muted-foreground">
                {roleContent.blurb}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-2 rounded-full bg-success/15 px-3 py-1 text-success">
                <TrendingUp className="h-3.5 w-3.5" /> SLA Health: 96.2%
              </span>
              <span className="flex items-center gap-2 rounded-full bg-warning/15 px-3 py-1 text-warning">
                <AlertCircle className="h-3.5 w-3.5" /> 3 critical alerts
                pending
              </span>
              <span className="flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-primary">
                <Truck className="h-3.5 w-3.5" />{" "}
                {(metrics as any).activeRiders || 0} active riders
              </span>
            </div>
          </div>
          <div className="min-w-[280px] space-y-3 rounded-3xl border border-primary/30 bg-primary/5 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Operational Snapshot
                </p>
                <p className="text-lg font-bold text-foreground">Today</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-lg border-border/80"
              >
                <CalendarDays className="h-4 w-4" /> Range
              </Button>
            </div>
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Shipments processed</span>
                <span className="font-semibold text-foreground">+1,248</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>GST invoices generated</span>
                <span className="font-semibold text-foreground">92%</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Partners meeting SLA</span>
                <span className="font-semibold text-foreground">44/48</span>
              </div>
            </div>
            <Button className="w-full gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand font-semibold">
              <Download className="h-4 w-4" /> Export Compliance Report
            </Button>
          </div>
        </div>
      </section>

      {/* ======== Key Metrics Grid (StatsCard) ======== */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((s) => (
          <StatsCard key={s.title} {...s} />
        ))}
      </section>

      {/* ======== Main Content Grid ======== */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Live Tracking */}
          <LiveTrackingMap />

          {/* Performance + Service Mix */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Delivery Performance */}
            <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                    <BarChart3 className="h-4 w-4" /> Delivery Performance
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    SLA adherence & exception trends
                  </p>
                </div>
                <Badge className="rounded-full bg-success text-success-foreground">
                  96.2%
                </Badge>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="relative h-40 rounded-2xl bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
                  <div className="flex h-full w-full items-end gap-3">
                    {[62, 70, 68, 75, 82, 90, 96].map((v) => (
                      <div key={v} className="flex-1">
                        <div
                          className="rounded-t-2xl bg-primary transition-all hover:bg-primary/80"
                          style={{ height: `${v}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-x-4 bottom-4 flex items-center justify-between text-[0.65rem] text-muted-foreground">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (d) => (
                        <span key={d}>{d}</span>
                      )
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-primary" /> On-time
                    deliveries
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-warning" /> POD
                    pending
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-error" />{" "}
                    Exceptions
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Service Mix */}
            <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                    <Package className="h-4 w-4" /> Service Mix
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Today's shipment distribution
                  </p>
                </div>
                <Badge className="rounded-full bg-primary/15 px-3 py-1 text-primary">
                  Balanced
                </Badge>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  {
                    label: "Same-day",
                    value: 62,
                    trend: "+5.2%",
                    color: "bg-primary",
                  },
                  {
                    label: "Next-day",
                    value: 28,
                    trend: "+2.1%",
                    color: "bg-success",
                  },
                  {
                    label: "Intercity",
                    value: 10,
                    trend: "-1.3%",
                    color: "bg-warning",
                  },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{s.label}</span>
                      <span className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {s.value}%
                        </span>
                        <span
                          className={
                            s.trend.startsWith("+")
                              ? "text-success"
                              : "text-warning"
                          }
                        >
                          {s.trend}
                        </span>
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-muted/40">
                      <div
                        className={`h-full rounded-full ${s.color}`}
                        style={{ width: `${s.value}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="rounded-2xl bg-muted/40 p-4 text-xs text-muted-foreground">
                  Delivery capacity optimal across metro hubs. Monitor Pune
                  cluster for exceptions.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Activities & Alerts */}
        <div className="space-y-6">
          <ActivityFeed items={activities} />
          <SystemAlertsPanel alerts={alerts} />
        </div>
      </div>

      {/* ======== Operational Highlights + Quick Actions ======== */}
      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Operational Highlights
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                GST compliance, partner network, and service coverage
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-lg border-border/80"
            >
              <FileText className="h-4 w-4" /> Manage Programs
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {[
              {
                icon: TrendingUp,
                label: "GST Compliance",
                sublabel: "12 filings completed",
                trend: "+100%",
                status: "success",
              },
              {
                icon: Users,
                label: "Partner Network",
                sublabel: "48 active partners",
                trend: "+4 new",
                status: "info",
              },
              {
                icon: MapPin,
                label: "Service Coverage",
                sublabel: "1,240 pincodes",
                trend: "+32 expanded",
                status: "success",
              },
              {
                icon: FileText,
                label: "POD Completion",
                sublabel: "94.7% success rate",
                trend: "+1.2%",
                status: "success",
              },
            ].map((item) => {
              const Icon = item.icon as any;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-4 rounded-2xl border border-border/60 bg-background/80 p-4 transition-colors hover:border-primary/30"
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.status === "success"
                        ? "bg-success/10 text-success"
                        : item.status === "warning"
                          ? "bg-warning/10 text-warning"
                          : "bg-primary/10 text-primary"
                      }`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.sublabel}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-primary">
                      {item.trend}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
        <QuickActionsPanel />
      </section>
    </div>
  );
}
