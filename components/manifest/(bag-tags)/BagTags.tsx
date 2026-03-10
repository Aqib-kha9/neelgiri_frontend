// app/dashboard/manifest/bag-tags/components/BagTags.tsx
"use client";

import { useState } from "react";
import HeaderSection from "./HeaderSection";
import StatisticsSection from "./StatisticsSection";
import QuickActions from "./QuickActions";
import FiltersSection from "./FiltersSection";
import StatusTabs from "./StatusTabs";
import { ManifestTable } from "../shared/ManifestTable";
import { ExportDialog } from "@/components/drs/shared/ActionDialogs";
import CreateBagTagModal from "./CreateBagTagModal";
import { bagTagsData, bagTagsStats } from "./data/mockData";

const BagTags = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hubFilter, setHubFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredBags = bagTagsData.filter((bag) => {
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
        data={bagTagsData}
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
