// app/dashboard/manifest/history/components/History.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import HeaderSection from "./HeaderSection";
import StatisticsSection from "./StatisticsSection";
import QuickActions from "./QuickActions";
import FiltersSection from "./FiltersSection";
import StatusTabs from "./StatusTabs";
import { ManifestTable } from "../shared/ManifestTable";
import { ExportDialog } from "@/components/drs/shared/ActionDialogs";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

// Map backend manifest to history display format
const mapManifestToHistory = (m: any) => {
  const transport = m.transportDetails || {};
  const shipments = m.shipments || [];
  const totalWeight = m.stats?.totalWeight || shipments.reduce((sum: number, s: any) => sum + (s?.weight || 0), 0);

  return {
    id: m._id || m.manifestId,
    manifestNumber: m.manifestId || "",
    status: m.status || "complete",
    priority: m.priority || "medium",
    vehicleNumber: transport.vehicleNo || "N/A",
    origin: {
      name: m.sourceBranch?.name || "Unknown",
      code: m.sourceBranch?.code || "",
      hub: m.sourceBranch?.name || "",
      address: m.sourceBranch?.address || "",
    },
    destination: {
      name: m.destinationBranch?.name || "Unknown",
      code: m.destinationBranch?.code || "",
      address: m.destinationBranch?.address || "",
    },
    dateRange: m.createdAt ? new Date(m.createdAt).toISOString().split("T")[0] : "",
    createdTime: m.createdAt ? new Date(m.createdAt).toLocaleString() : "",
    vehicle: {
      type: transport.mode || "truck",
      model: transport.vendor || "",
      year: "",
      capacity: "",
      insuranceStatus: "",
    },
    driver: {
      name: transport.driverName || "N/A",
      licenseNumber: "",
      phone: transport.driverPhone || "",
      experience: "",
      status: "active",
    },
    bagsCount: m.bagTags?.length || 0,
    shipmentsCount: shipments.length,
    totalWeight: `${totalWeight} kg`,
    notes: m.history?.[0]?.notes || "",
    timeline: (m.history || []).map((h: any) => ({
      event: h.status || h.action || "Update",
      timestamp: h.timestamp ? new Date(h.timestamp).toLocaleString() : "",
      status: "completed",
      notes: h.notes || h.remarks || "",
    })),
  };
};

const History = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hubFilter, setHubFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const [showExportDialog, setShowExportDialog] = useState(false);

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      // Fetch all manifests (history view - no type filter gets all from this branch)
      const res = await axios.get(`${API_BASE}/api/manifests`, { headers });
      const manifests = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setHistory(manifests.map(mapManifestToHistory));
    } catch (error: any) {
      console.error("Failed to fetch manifest history:", error);
      toast.error(error?.response?.data?.message || "Failed to load manifest history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Compute stats dynamically
  const completedCount = history.filter((h) => h.status === "received" || h.status === "complete" || h.status === "delivered").length;
  const inProgressCount = history.filter((h) => h.status === "in_transit" || h.status === "scheduled").length;
  const historyStats = {
    totalManifests: history.length,
    completed: completedCount,
    inProgress: inProgressCount,
    delayed: 0,
    onTimeRate: history.length > 0 ? Math.round((completedCount / history.length) * 100) : 0,
    averageDeliveryTime: history.length > 0 ? `${Math.round(history.reduce((sum, h) => {
      const timeline = h.timeline || [];
      if (timeline.length >= 2) {
        const start = new Date(timeline[0].timestamp).getTime();
        const end = new Date(timeline[timeline.length - 1].timestamp).getTime();
        if (!isNaN(start) && !isNaN(end) && end > start) {
          return sum + Math.round((end - start) / (1000 * 60 * 60 * 24));
        }
      }
      return sum;
    }, 0) / history.length)}d` : "—",
  };

  const filteredHistory = history.filter((h) => {
    const matchesSearch =
      h.manifestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.origin.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || h.status === statusFilter;
    const matchesHub = hubFilter === "all" || h.origin.hub === hubFilter;
    const matchesDate =
      dateFilter === "all" || h.dateRange === dateFilter;
    const matchesTab = activeTab === "all" || h.status === activeTab;

    return (
      matchesSearch && matchesStatus && matchesHub && matchesDate && matchesTab
    );
  });

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
        onExport={() => setShowExportDialog(true)}
        onRefresh={fetchHistory}
      />
      <StatisticsSection stats={historyStats} />
      <QuickActions
        onExport={() => setShowExportDialog(true)}
        onGenerateReport={() => console.log("Generate Report")}
      />
      <FiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        hubFilter={hubFilter}
        setHubFilter={setHubFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />
      <StatusTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        data={history}
      />

      <div className="space-y-6">
        <ManifestTable
          title="Manifest History"
          data={filteredHistory.map(h => ({
            ...h,
            awb: h.manifestNumber,
            customer: h.destination.name,
            phone: h.driver.phone,
            weight: parseFloat(h.totalWeight.replace(',', '').replace(' kg', '')),
            location: h.origin.name,
            type: h.vehicle.type
          }))}
        />
      </div>

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onExport={(format) => {
          console.log(`Exporting history report as ${format}`);
          setShowExportDialog(false);
        }}
      />
    </div>
  );
};

export default History;
