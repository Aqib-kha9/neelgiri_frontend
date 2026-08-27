// app/dashboard/manifest/bag-tags/components/BagTags.tsx
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
import CreateBagTagModal from "./CreateBagTagModal";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

// Map backend Bag to display format
const mapBag = (b: any) => {
  const shipments = b.shipments || [];
  const shipmentCount = Array.isArray(shipments) ? shipments.length : 0;
  const totalWeight = b.weight || 0;
  const destBranch = b.destinationBranch || {};
  const srcBranch = b.sourceBranch || b.currentBranch || {};

  return {
    id: b._id || b.bagId,
    bagNumber: b.bagId || "",
    status: b.status || "open",
    type: "consolidation",
    origin: {
      name: srcBranch.name || srcBranch.code || "Unknown",
      code: srcBranch.code || "",
      hub: srcBranch.name || "Unknown",
      address: srcBranch.address || "",
    },
    destination: {
      name: destBranch.name || destBranch.code || "Unknown",
      code: destBranch.code || "",
      address: destBranch.address || "",
    },
    manifestNumber: b.manifestId || b.bagId || "",
    createdTime: b.createdAt ? new Date(b.createdAt).toLocaleString() : "",
    sealedTime: b.history?.find((h: any) => h.status === "sealed")?.timestamp
      ? new Date(b.history.find((h: any) => h.status === "sealed").timestamp).toLocaleString()
      : "",
    dispatchTime: b.history?.find((h: any) => h.status === "manifested")?.timestamp
      ? new Date(b.history.find((h: any) => h.status === "manifested").timestamp).toLocaleString()
      : "",
    createdBy: b.createdBy?.name || b.createdBy?.email || "System",
    sealNumber: b.sealNumber || "N/A",
    vehicleNumber: "N/A",
    serviceType: "Surface",
    shipments: {
      current: shipmentCount,
      capacity: 50,
    },
    weight: {
      current: totalWeight,
      capacity: 200,
    },
    notes: b.history?.[0]?.remark || "",
    issues: [],
  };
};

const BagTags = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hubFilter, setHubFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [bags, setBags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBags = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_BASE}/api/bags`, { headers });
      const raw = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setBags(raw.map(mapBag));
    } catch (error: any) {
      console.error("Failed to fetch bag tags:", error);
      toast.error(error?.response?.data?.message || "Failed to load bag tags");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBags();
  }, [fetchBags]);

  // Compute stats dynamically
  const bagTagsStats = {
    totalBags: bags.length,
    activeBags: bags.filter((b) => b.status === "open" || b.status === "sealed").length,
    sealedToday: bags.filter((b) => {
      if (!b.sealedTime) return false;
      const today = new Date().toDateString();
      return new Date(b.sealedTime).toDateString() === today;
    }).length,
    inTransit: bags.filter((b) => b.status === "manifested").length,
    delivered: bags.filter((b) => b.status === "received").length,
    pendingSealing: bags.filter((b) => b.status === "open").length,
  };

  const filteredBags = bags.filter((bag) => {
    const matchesSearch =
      bag.bagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bag.origin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bag.destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bag.manifestNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || bag.status === statusFilter;
    const matchesHub = hubFilter === "all" || bag.origin.hub === hubFilter;
    const matchesType = typeFilter === "all" || bag.type === typeFilter;
    const matchesTab = activeTab === "all" || bag.status === activeTab;

    return (
      matchesSearch && matchesStatus && matchesHub && matchesType && matchesTab
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
        onPrint={() => console.log("Print Tags")}
        onNewTag={() => setShowCreateModal(true)}
      />
      <StatisticsSection stats={bagTagsStats} />
      <QuickActions
        onBulkPrint={() => console.log("Bulk Print")}
        onScanBag={() => console.log("Scan Bag")}
        onCreateMultiple={() => console.log("Create Multiple")}
        onImportData={() => console.log("Import Data")}
        onGenerateQR={() => console.log("Generate QR")}
      />
      <FiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        hubFilter={hubFilter}
        setHubFilter={setHubFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />
      <StatusTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        data={bags}
      />

      <div className="space-y-6">
        <ManifestTable
          title="Bag Tags"
          data={filteredBags.map(b => ({
            ...b,
            awb: b.bagNumber,
            customer: b.destination.name,
            phone: b.manifestNumber, // Using Manifest Number as duplicate info field
            weight: b.weight.current,
            location: b.origin.name,
            type: b.type
          }))}
        />
      </div>

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onExport={(format) => {
          console.log(`Exporting bag tags as ${format}`);
          setShowExportDialog(false);
        }}
      />

      <CreateBagTagModal
        showModal={showCreateModal}
        setShowModal={setShowCreateModal}
      />
    </div>
  );
};

export default BagTags;
