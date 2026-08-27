// app/dashboard/manifest/dispatch/components/Dispatch.tsx
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
import CreateDispatchModal from "./CreateDispatchModal";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

// Map backend manifest to dispatch display format
const mapManifestToDispatch = (m: any) => {
  const transport = m.transportDetails || {};
  const shipments = m.shipments || [];
  const totalWeight = m.stats?.totalWeight || shipments.reduce((sum: number, s: any) => sum + (s?.weight || 0), 0);

  // Map status
  let displayStatus = m.status || "complete";
  if (displayStatus === "in_transit") displayStatus = "in_transit";
  if (displayStatus === "received") displayStatus = "delivered";
  if (displayStatus === "complete") displayStatus = "scheduled";

  return {
    id: m._id || m.manifestId,
    manifestNumber: m.manifestId || "",
    status: displayStatus,
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
    createdTime: m.createdAt ? new Date(m.createdAt).toLocaleString() : "",
    dispatchTime: m.history?.find((h: any) => h.status === "in_transit")?.timestamp
      ? new Date(m.history.find((h: any) => h.status === "in_transit").timestamp).toLocaleString()
      : "",
    estimatedTime: "",
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
    route: {
      distance: "",
      estimatedDuration: "",
      route: `${m.sourceBranch?.name || ""} → ${m.destinationBranch?.name || ""}`,
    },
    bagsCount: m.bagTags?.length || 0,
    shipmentsCount: shipments.length,
    totalWeight: `${totalWeight} kg`,
    capacityUsed: "",
    notes: m.history?.[0]?.notes || "",
    alerts: [],
    timeline: (m.history || []).map((h: any) => ({
      event: h.status || h.action || "Update",
      timestamp: h.timestamp ? new Date(h.timestamp).toLocaleString() : "",
      status: h.status === "in_transit" ? "completed" : "completed",
      notes: h.notes || h.remarks || "",
    })),
  };
};

const Dispatch = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hubFilter, setHubFilter] = useState("all");
  const [vehicleFilter, setVehicleFilter] = useState("all");

  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [dispatches, setDispatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDispatches = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      // Fetch outward manifests (dispatches from this branch)
      const res = await axios.get(`${API_BASE}/api/manifests?type=outward`, { headers });
      const manifests = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setDispatches(manifests.map(mapManifestToDispatch));
    } catch (error: any) {
      console.error("Failed to fetch dispatches:", error);
      toast.error(error?.response?.data?.message || "Failed to load dispatches");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDispatches();
  }, [fetchDispatches]);

  // Compute stats dynamically
  const dispatchStats = {
    totalDispatches: dispatches.length,
    pendingDispatch: dispatches.filter((d) => d.status === "scheduled").length,
    inTransit: dispatches.filter((d) => d.status === "in_transit").length,
    deliveredToday: dispatches.filter((d) => d.status === "delivered").length,
    delayed: 0,
    onTimeRate: dispatches.length > 0 ? Math.round((dispatches.filter((d) => d.status === "delivered").length / dispatches.length) * 100) : 0,
  };

  const filteredDispatches = dispatches.filter((dispatch) => {
    const matchesSearch =
      dispatch.manifestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispatch.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispatch.driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispatch.origin.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || dispatch.status === statusFilter;
    const matchesHub = hubFilter === "all" || dispatch.origin.hub === hubFilter;
    const matchesVehicle =
      vehicleFilter === "all" || dispatch.vehicle.type === vehicleFilter;
    const matchesTab = activeTab === "all" || dispatch.status === activeTab;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesHub &&
      matchesVehicle &&
      matchesTab
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
        onRoutePlan={() => console.log("Route Planner")}
        onNewDispatch={() => setShowCreateModal(true)}
      />
      <StatisticsSection stats={dispatchStats} />
      <QuickActions
        onAssignVehicle={() => console.log("Assign Vehicle")}
        onPlanRoute={() => console.log("Plan Route")}
        onLoadManifest={() => console.log("Load Manifest")}
        onSchedule={() => console.log("Schedule Dispatch")}
        onBulkUpdate={() => console.log("Bulk Update")}
      />
      <FiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        hubFilter={hubFilter}
        setHubFilter={setHubFilter}
        vehicleFilter={vehicleFilter}
        setVehicleFilter={setVehicleFilter}
      />
      <StatusTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        data={dispatches}
      />

      <div className="space-y-6">
        <ManifestTable
          title="Active Dispatches"
          data={filteredDispatches.map(d => ({
            ...d,
            awb: d.manifestNumber,
            customer: d.driver.name,
            phone: d.driver.phone,
            weight: parseFloat(d.totalWeight.replace(',', '').replace(' kg', '')),
            location: d.destination.name,
            type: d.vehicle.type
          }))}
        />
      </div>

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onExport={(format) => {
          console.log(`Exporting dispatch report as ${format}`);
          setShowExportDialog(false);
        }}
      />

      <CreateDispatchModal
        showModal={showCreateModal}
        setShowModal={setShowCreateModal}
      />
    </div>
  );
};

export default Dispatch;
