// app/dashboard/manifest/forwarding/create/components/ForwardingCreate.tsx
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
import BulkUploadModal from "../(counter)/(bulk)/BulkUploadModal";
import CreateManifestModal from "./CreateManifestModal";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

// Map backend manifest to forwarding display format
const mapManifestToForwarding = (m: any) => {
  const shipments = (m.shipments || []).map((s: any) => {
    const ship = typeof s === "string" ? { awb: s } : s;
    return {
      id: ship._id || ship.awb,
      awbNumber: ship.awb || "",
      status: ship.status || "pending",
      priority: ship.priority || "medium",
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
      shipmentDate: m.createdAt ? new Date(m.createdAt).toISOString().split("T")[0] : "",
      receivedTime: m.createdAt ? new Date(m.createdAt).toLocaleString() : "",
      consignor: {
        name: ship.sender?.name || ship.consignor?.name || "N/A",
        phone: ship.sender?.phone || ship.consignor?.phone || "",
        address: ship.sender?.address || ship.consignor?.address || "",
        city: ship.sender?.city || ship.consignor?.city || "",
        pincode: ship.sender?.pincode || ship.consignor?.pincode || "",
      },
      consignee: {
        name: ship.receiver?.name || ship.consignee?.name || "N/A",
        phone: ship.receiver?.phone || ship.consignee?.phone || "",
        address: ship.receiver?.address || ship.consignee?.address || "",
        city: ship.receiver?.city || ship.consignee?.city || "",
        pincode: ship.receiver?.pincode || ship.consignee?.pincode || "",
      },
      package: {
        type: ship.packageType || ship.type || "Standard",
        weight: ship.weight ? `${ship.weight} kg` : "0 kg",
        description: ship.description || ship.content || "",
        codAmount: ship.codAmount ? `₹${ship.codAmount}` : "-",
        declaredValue: ship.declaredValue ? `₹${ship.declaredValue}` : "₹0",
        dimensions: ship.dimensions || "",
      },
      service: {
        type: ship.serviceType || ship.service?.type || "Surface",
        payment: ship.paymentType || ship.service?.payment || "Prepaid",
      },
      forwarding: {
        assignedTo: null,
        startTime: null,
        endTime: null,
        scanned: true,
        documented: true,
        manifested: m.status === "in_transit",
        issues: [],
      },
      charges: {
        freight: ship.freight ? `₹${ship.freight}` : "₹0",
        handling: ship.handling ? `₹${ship.handling}` : "₹0",
        codFee: ship.codFee ? `₹${ship.codFee}` : "₹0",
        total: ship.totalCharges ? `₹${ship.totalCharges}` : "₹0",
      },
      notes: ship.notes || "",
    };
  });
  return shipments;
};

const ForwardingCreate = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [hubFilter, setHubFilter] = useState("all");

  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchForwarding = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      // Fetch outward manifests (source branch = current branch)
      const res = await axios.get(`${API_BASE}/api/manifests?type=outward`, { headers });
      const manifests = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      const allShipments: any[] = [];
      manifests.forEach((m: any) => {
        allShipments.push(...mapManifestToForwarding(m));
      });
      setShipments(allShipments);
    } catch (error: any) {
      console.error("Failed to fetch forwarding data:", error);
      toast.error(error?.response?.data?.message || "Failed to load forwarding shipments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForwarding();
  }, [fetchForwarding]);

  // Compute stats dynamically
  const forwardingStats = {
    totalShipments: shipments.length,
    pendingForwarding: shipments.filter((s) => s.status === "pending" || s.status === "ready").length,
    forwardedToday: shipments.filter((s) => s.forwarding?.manifested).length,
    averageProcessingTime: "—",
    efficiency: shipments.length > 0 ? Math.round((shipments.filter((s) => s.forwarding?.manifested).length / shipments.length) * 100) : 0,
    readyForDispatch: shipments.filter((s) => s.status === "ready").length,
  };

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.awbNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.consignor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.consignee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.origin.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || shipment.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || shipment.priority === priorityFilter;
    const matchesHub = hubFilter === "all" || shipment.origin.hub === hubFilter;
    const matchesTab = activeTab === "all" || shipment.status === activeTab;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesHub &&
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
        onNewManifest={() => setShowCreateModal(true)}
      />
      <StatisticsSection stats={forwardingStats} />
      <QuickActions
        onBulkUpload={() => setShowBulkUploadModal(true)}
        onVehicleAssign={() => console.log("Vehicle Assign")}
        onBatchSelect={() => console.log("Batch Select")}
        onAutoGenerate={() => console.log("Auto Generate")}
      />
      <FiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        hubFilter={hubFilter}
        setHubFilter={setHubFilter}
      />
      <StatusTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        data={shipments}
      />

      <div className="space-y-6">
        <ManifestTable
          title="Forwarding Shipments"
          data={filteredShipments.map(s => ({
            ...s,
            awb: s.awbNumber,
            customer: s.consignee.name,
            phone: s.consignee.phone,
            weight: parseFloat(s.package.weight.replace(' kg', '')),
            location: s.destination.name,
            type: s.priority
          }))}
        />
      </div>

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onExport={(format) => {
          console.log(`Exporting forwarding manifest as ${format}`);
          setShowExportDialog(false);
        }}
      />

      {showBulkUploadModal && (
        <BulkUploadModal onClose={() => setShowBulkUploadModal(false)} />
      )}

      <CreateManifestModal
        showModal={showCreateModal}
        setShowModal={setShowCreateModal}
      />
    </div>
  );
};

export default ForwardingCreate;
