"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import HeaderSection from "./HeaderSection";
import StatsOverview, { type AwbStats } from "./StatsOverview";
import QuickActions from "./QuickActions";
import FiltersSection from "./FiltersSection";
import StatusTabs from "./StatusTabs";
import SeriesList from "./SeriesList";
import AnalyticsSection from "./AnalyticsSection";
import CreateSeriesDialog from "./CreateSeriesDialog";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

// Map backend AWB series to frontend display format
const mapAwbSeries = (s: any) => {
  const totalCapacity = s.totalCapacity ?? (s.endNumber - s.startNumber + 1);
  const allocations = Array.isArray(s.allocations) ? s.allocations : [];
  const allocated = s.totalAllocated ?? allocations.reduce(
    (sum: number, allocation: any) =>
      sum + allocation.endNumber - allocation.startNumber + 1,
    0,
  );
  const consumed = s.totalConsumed ?? allocations.reduce(
    (sum: number, allocation: any) => sum + (allocation.consumedCount || 0),
    0,
  );
  const available = s.totalAvailable ?? Math.max(0, allocated - consumed);
  const percentage = totalCapacity > 0 ? Math.round((consumed / totalCapacity) * 100) : 0;

  // Keep persisted lifecycle status separate from the derived utilization warning.
  let displayStatus = (s.status || "ACTIVE").toLowerCase();
  if (displayStatus === "exhausted") {
    displayStatus = "expired";
  }

  // Get latest allocation
  const latestAllocation = allocations.length > 0
    ? allocations[allocations.length - 1]
    : null;

  const allocatedTo = latestAllocation
    ? {
      type: latestAllocation.allocatedToType || "unallocated",
      id: latestAllocation.allocatedToId || "",
      name: latestAllocation.allocatedToName || "Unallocated",
      contact: "",
    }
    : null;

  return {
    id: s._id || s.id,
    seriesName: s.name || s.seriesName || "Unnamed Series",
    prefix: s.prefix || "",
    seriesCode: s.code || s.seriesCode || "",
    numberWidth: s.numberWidth || String(s.endNumber ?? s.endRange ?? 0).length,
    startRange: s.startNumber ?? s.startRange ?? 0,
    endRange: s.endNumber ?? s.endRange ?? 0,
    current: s.currentNumber ?? s.current ?? s.startNumber ?? 0,
    status: displayStatus,
    allocatedTo,
    usage: {
      used: consumed,
      available,
      percentage,
      nearExhaustion: percentage >= 80 && displayStatus === "active",
      lastUsed: s.updatedAt ? new Date(s.updatedAt).toLocaleString() : null,
    },
    allocation: {
      type: latestAllocation?.allocatedToType || "unallocated",
      date: latestAllocation?.allocatedAt ? new Date(latestAllocation.allocatedAt).toISOString().split("T")[0] : null,
      validUntil: null,
      autoRenew: false,
    },
    restrictions: {
      serviceType: [],
      paymentType: [],
      maxWeight: "",
      specialHandling: false,
    },
    financial: {
      ratePerShipment: "₹0",
      creditLimit: "₹0",
      usedCredit: "₹0",
    },
    createdBy: s.createdBy?.name || s.createdBy?.email || "System",
    createdAt: s.createdAt ? new Date(s.createdAt).toLocaleString() : "",
    updatedAt: s.updatedAt ? new Date(s.updatedAt).toLocaleString() : "",
    _raw: s,
  };
};

const AWBManagement = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [allocationFilter, setAllocationFilter] = useState("all");

  const [series, setSeries] = useState<any[]>([]);
  const [stats, setStats] = useState<AwbStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSeries = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const [seriesRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE}/api/awb-series`, { headers }),
        axios.get(`${API_BASE}/api/awb-series/stats`, { headers }).catch(() => null),
      ]);
      const raw = seriesRes.data?.data || seriesRes.data || [];
      const list = Array.isArray(raw) ? raw.map(mapAwbSeries) : [];
      setSeries(list);
      if (statsRes?.data) {
        setStats(statsRes.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch AWB series:", error);
      toast.error(error?.response?.data?.message || "Failed to load AWB series");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeries();
  }, [fetchSeries]);

  const filteredSeries = series.filter((s) => {
    const matchesSearch =
      s.seriesName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.prefix.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.seriesCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.allocatedTo?.name || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || s.status === statusFilter;
    const matchesAllocation =
      allocationFilter === "all" || s.allocation.type === allocationFilter;
    const matchesTab = activeTab === "all" || s.status === activeTab;

    return matchesSearch && matchesStatus && matchesAllocation && matchesTab;
  });

  const nearExhaustionCount = series.filter(
    (s) => s.usage.nearExhaustion,
  ).length;

  const exportReport = () => {
    const rows = [
      ["Series", "Prefix", "Start", "End", "Status", "Used", "Available", "Allocation"],
      ...series.map((item) => [
        item.seriesName,
        item.prefix,
        item.startRange,
        item.endRange,
        item.status,
        item.usage.used,
        item.usage.available,
        item.allocatedTo?.name || "Unallocated",
      ]),
    ];
    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "awb-series-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const [createOpen, setCreateOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <HeaderSection
        onCreate={() => setCreateOpen(true)}
        onExport={exportReport}
      />
      <StatsOverview stats={stats} nearExhaustionCount={nearExhaustionCount} />
      <QuickActions />
      <FiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        allocationFilter={allocationFilter}
        setAllocationFilter={setAllocationFilter}
        onRefresh={fetchSeries}
      />
      <StatusTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        series={series}
      />
      <SeriesList series={filteredSeries} onCreate={() => setCreateOpen(true)} />
      <AnalyticsSection series={series} />
      <CreateSeriesDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={fetchSeries}
      />
    </div>
  );
};

export default AWBManagement;
