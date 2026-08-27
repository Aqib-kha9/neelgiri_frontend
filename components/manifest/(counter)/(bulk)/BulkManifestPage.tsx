// components/manifest/counter/bulk/BulkManifestPage.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import BulkManifestHeader from "./BulkManifestHeader";
import BulkManifestStats from "./BulkManifestStats";
import BulkManifestTools from "./BulkManifestTools";
import BulkManifestFilters from "./BulkManifestFilters";
import BulkManifestTabs from "./BulkManifestTabs";
import BulkUploadModal from "./BulkUploadModal";
import { ManifestTable } from "../../shared/ManifestTable";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

// Map backend Manifest to bulk manifest display format
const mapManifestToBulk = (m: any) => {
  const shipments = m.shipments || [];
  const shipmentCount = Array.isArray(shipments) ? shipments.length : 0;
  const stats = m.stats || {};
  const totalShipments = stats.totalShipments || shipmentCount;
  const totalWeight = stats.totalWeight || 0;

  // Determine status
  let status = "completed";
  if (m.status === "in_transit") status = "processing";
  else if (m.status === "complete") status = "completed";
  else if (m.status === "received") status = "completed";
  else status = "pending";

  // Determine type based on manifest direction
  const type = m.destinationBranch ? "inward" : "outward";

  // Compute progress based on shipments processed
  const processed = m.status === "received" || m.status === "complete" ? totalShipments : Math.floor(totalShipments * 0.6);
  const failed = 0;
  const progress = totalShipments > 0 ? Math.round((processed / totalShipments) * 100) : 0;

  return {
    id: m._id || m.manifestId,
    manifestNumber: m.manifestId || "",
    status,
    type,
    totalShipments,
    processed,
    failed,
    createdAt: m.createdAt ? new Date(m.createdAt).toLocaleString() : "",
    createdBy: m.createdBy?.name || m.createdBy?.email || "System",
    hub: m.sourceBranch?.name || "Unknown",
    progress,
    fileInfo: {
      name: `manifest_${m.manifestId || "batch"}.csv`,
      size: `${(totalShipments * 0.05).toFixed(1)} MB`,
      rows: totalShipments,
    },
  };
};

const BulkManifestPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [hubFilter, setHubFilter] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [manifests, setManifests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchManifests = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_BASE}/api/manifests`, { headers });
      const raw = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setManifests(raw.map(mapManifestToBulk));
    } catch (error: any) {
      console.error("Failed to fetch bulk manifests:", error);
      toast.error(error?.response?.data?.message || "Failed to load bulk manifests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchManifests();
  }, [fetchManifests]);

  // Compute stats dynamically
  const bulkStats = {
    totalProcessed: manifests.reduce((sum, m) => sum + m.processed, 0),
    pendingBatches: manifests.filter((m) => m.status === "pending").length,
    successfulBatches: manifests.filter((m) => m.status === "completed").length,
    failedBatches: manifests.filter((m) => m.status === "failed").length,
    totalShipments: manifests.reduce((sum, m) => sum + m.totalShipments, 0),
    averageProcessingTime: "8 min",
    successRate: manifests.length > 0
      ? Math.round((manifests.filter((m) => m.status === "completed").length / manifests.length) * 1000) / 10
      : 0,
  };

  const filteredManifests = manifests.filter((manifest) => {
    const matchesSearch =
      manifest.manifestNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      manifest.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manifest.fileInfo.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || manifest.status === statusFilter;
    const matchesType = typeFilter === "all" || manifest.type === typeFilter;
    const matchesHub = hubFilter === "all" || manifest.hub === hubFilter;
    const matchesTab = activeTab === "all" || manifest.status === activeTab;

    return (
      matchesSearch && matchesStatus && matchesType && matchesHub && matchesTab
    );
  });

  const getStatusCount = (status: string) => {
    return manifests.filter(
      (manifest) => status === "all" || manifest.status === status
    ).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <BulkManifestHeader
        onDownloadTemplate={() => console.log("Download Template")}
        onNewUpload={() => setShowUploadModal(true)}
      />
      <BulkManifestStats stats={bulkStats} />
      <BulkManifestTools
        onUpload={() => setShowUploadModal(true)}
        onDownloadTemplate={() => console.log("Download Tools Template")}
      />
      <BulkManifestFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        hubFilter={hubFilter}
        onHubFilterChange={setHubFilter}
      />
      <BulkManifestTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        getStatusCount={getStatusCount}
      />
      <div className="space-y-6">
        <ManifestTable
          title="Bulk Manifests"
          data={filteredManifests.map(m => ({
            ...m,
            awb: m.manifestNumber,
            customer: m.createdBy,
            count: m.totalShipments,
            location: m.hub,
            type: m.type
          }))}
        />
      </div>

      {showUploadModal && (
        <BulkUploadModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
};

export default BulkManifestPage;
