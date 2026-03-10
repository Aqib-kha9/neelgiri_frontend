// components/manifest/counter/bulk/BulkManifestPage.tsx
"use client";

import { useState } from "react";
import BulkManifestHeader from "./BulkManifestHeader";
import BulkManifestStats from "./BulkManifestStats";
import BulkManifestTools from "./BulkManifestTools";
import BulkManifestFilters from "./BulkManifestFilters";
import BulkManifestTabs from "./BulkManifestTabs";
import BulkUploadModal from "./BulkUploadModal";
import { ManifestTable } from "../../shared/ManifestTable";

// Mock data for bulk manifest
const bulkManifestData = [
  {
    id: "BLK-001",
    manifestNumber: "BLK-20241211-001",
    status: "processing",
    type: "inward",
    totalShipments: 45,
    processed: 28,
    failed: 2,
    createdAt: "2024-12-11 09:30:00",
    createdBy: "Counter Staff A",
    hub: "Kolkata Central Hub",
    progress: 62,
    fileInfo: {
      name: "inward_shipments_20241211.csv",
      size: "2.4 MB",
      rows: 45,
    },
  },
  {
    id: "BLK-002",
    manifestNumber: "BLK-20241211-002",
    status: "completed",
    type: "weight_update",
    totalShipments: 32,
    processed: 32,
    failed: 0,
    createdAt: "2024-12-11 08:15:00",
    createdBy: "Weight Team B",
    hub: "Mumbai Central Hub",
    progress: 100,
    fileInfo: {
      name: "weight_updates_20241211.csv",
      size: "1.8 MB",
      rows: 32,
    },
  },
  {
    id: "BLK-003",
    manifestNumber: "BLK-20241211-003",
    status: "failed",
    type: "drs_creation",
    totalShipments: 25,
    processed: 18,
    failed: 7,
    createdAt: "2024-12-11 10:45:00",
    createdBy: "DRS Manager",
    hub: "Bangalore Central Hub",
    progress: 72,
    fileInfo: {
      name: "drs_assignments_20241211.csv",
      size: "3.1 MB",
      rows: 25,
    },
  },
  {
    id: "BLK-004",
    manifestNumber: "BLK-20241211-004",
    status: "pending",
    type: "inward",
    totalShipments: 38,
    processed: 0,
    failed: 0,
    createdAt: "2024-12-11 11:20:00",
    createdBy: "Counter Staff B",
    hub: "Delhi Central Hub",
    progress: 0,
    fileInfo: {
      name: "inward_batch_20241211.csv",
      size: "2.9 MB",
      rows: 38,
    },
  },
  {
    id: "BLK-005",
    manifestNumber: "BLK-20241211-005",
    status: "processing",
    type: "weight_update",
    totalShipments: 52,
    processed: 41,
    failed: 3,
    createdAt: "2024-12-11 14:30:00",
    createdBy: "Weight Team A",
    hub: "Kolkata Central Hub",
    progress: 79,
    fileInfo: {
      name: "bulk_weights_20241211.csv",
      size: "4.2 MB",
      rows: 52,
    },
  },
];

// Mock data for bulk manifest statistics
const bulkStats = {
  totalProcessed: 156,
  pendingBatches: 3,
  successfulBatches: 12,
  failedBatches: 2,
  totalShipments: 2450,
  averageProcessingTime: "8 min",
  successRate: 94.5,
};

const BulkManifestPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [hubFilter, setHubFilter] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredManifests = bulkManifestData.filter((manifest) => {
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
    return bulkManifestData.filter(
      (manifest) => status === "all" || manifest.status === status
    ).length;
  };

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
