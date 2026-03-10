"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import HeaderSection from "./HeaderSection";
import StatisticsCards from "./StatisticsCards";
import QuickActions from "./QuickActions";
import FiltersSection from "./FiltersSection";
import StatusTabs from "./StatusTabs";
import ProcessingModal from "./ProcessingModal";
import { inwardStats } from "./data/mockData"; // Keep stats mock for now or fetch too?
import { ManifestTable } from "../../shared/ManifestTable";
import { ExportDialog } from "@/components/drs/shared/ActionDialogs";
import { toast } from "sonner"; // Assuming sonner is used

import BulkUploadModal from "../(bulk)/BulkUploadModal";

const InwardProcessing = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [originFilter, setOriginFilter] = useState("all");

  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [processingNotes, setProcessingNotes] = useState("");
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Fetch Manifests (NOT Shipments!)
  useEffect(() => {
    const fetchManifests = async () => {
      try {
        console.log('🔍 [INWARD] Fetching manifests with type=inward');
        setLoading(true);

        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/manifests?type=inward&status=in_transit`;
        console.log('🔍 [INWARD] API URL:', url);

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        console.log('✅ [INWARD] API Response:', response.data);
        console.log('✅ [INWARD] Manifest Count:', response.data.length);

        // Extract shipments from manifests
        const allShipments: any[] = [];
        response.data.forEach((manifest: any) => {
          if (manifest.shipments && Array.isArray(manifest.shipments)) {
            manifest.shipments.forEach((shipment: any) => {
              allShipments.push({
                ...shipment,
                manifestId: manifest.manifestId,
                sourceBranch: manifest.sourceBranch
              });
            });
          }
        });

        console.log('✅ [INWARD] Total Shipments:', allShipments.length);
        setShipments(allShipments);
      } catch (error) {
        console.error("❌ [INWARD] Error fetching manifests:", error);
        toast.error("Failed to load inward manifests");
      } finally {
        setLoading(false);
      }
    };

    fetchManifests();
  }, []);

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      (shipment.awb || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shipment.receiver?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shipment.receiver?.phone || "").includes(searchTerm) ||
      (shipment.sender?.city || "").toLowerCase().includes(searchTerm.toLowerCase()); // mapped origin to sender city

    const matchesStatus =
      statusFilter === "all" || shipment.status === statusFilter;
    // const matchesPriority = priorityFilter === "all" || shipment.priority === priorityFilter; // Priority might not exist on real object yet
    const matchesOrigin = originFilter === "all" || (shipment.type || "Domestic") === originFilter;
    const matchesTab = activeTab === "all" || shipment.status === activeTab;

    return (
      matchesSearch &&
      matchesStatus &&
      // matchesPriority && 
      matchesOrigin &&
      matchesTab
    );
  });

  return (
    <div className="space-y-6 p-6">
      <HeaderSection
        onExport={() => setShowExportDialog(true)}
        onNewEntry={() => setShowProcessingModal(true)}
      />
      <StatisticsCards stats={inwardStats} />
      <QuickActions
        onBulkUpload={() => setShowBulkUploadModal(true)}
        onBatchScan={() => console.log("Batch Scan")}
        onBulkWeigh={() => console.log("Bulk Weigh")}
        onAutoAssign={() => console.log("Auto Assign")}
      />

      <FiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        originFilter={originFilter}
        setOriginFilter={setOriginFilter}
      />

      <StatusTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        shipmentsData={shipments}
      />

      <div className="space-y-6">
        <ManifestTable
          data={filteredShipments.map(s => ({
            ...s,
            awb: s.awb,
            customer: s.receiver?.name || "Unknown",
            phone: s.receiver?.phone || "",
            weight: s.weight || 0,
            location: s.receiver?.city || s.receiver?.address || "N/A",
            type: s.type || "Standard"
          }))}
          title="Inward Shipments"
        />
      </div>

      {showProcessingModal && (
        <ProcessingModal
          selectedShipment={selectedShipment}
          showProcessingModal={showProcessingModal}
          setShowProcessingModal={setShowProcessingModal}
        />
      )}

      {showBulkUploadModal && (
        <BulkUploadModal onClose={() => setShowBulkUploadModal(false)} />
      )}

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onExport={(format) => {
          console.log(`Exporting as ${format}`);
          setShowExportDialog(false);
        }}
      />
    </div>
  );
};

export default InwardProcessing;
