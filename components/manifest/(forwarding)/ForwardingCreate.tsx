// app/dashboard/manifest/forwarding/create/components/ForwardingCreate.tsx
"use client";

import { useState } from "react";
import HeaderSection from "./HeaderSection";
import StatisticsSection from "./StatisticsSection";
import QuickActions from "./QuickActions";
import FiltersSection from "./FiltersSection";
import StatusTabs from "./StatusTabs";
import { ManifestTable } from "../shared/ManifestTable";
import { ExportDialog } from "@/components/drs/shared/ActionDialogs";
import BulkUploadModal from "../(counter)/(bulk)/BulkUploadModal";
import CreateManifestModal from "./CreateManifestModal";
import { forwardingData, forwardingStats } from "./data/mockData";

const ForwardingCreate = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [hubFilter, setHubFilter] = useState("all");

  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredShipments = forwardingData.filter((shipment) => {
    const matchesSearch =
      shipment.awbNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.consignor.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      shipment.consignee.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
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
        data={forwardingData}
      />

      <div className="space-y-6">
        <ManifestTable
          title="Forwarding Shipments"
          data={filteredShipments.map(s => ({
            ...s,
            awb: s.awbNumber,
            customer: s.consignee.name,
            phone: s.consignee.phone,
            weight: parseFloat(s.package.weight.replace(' kg', '')), // Parsing weight string
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
