// app/dashboard/manifest/history/components/History.tsx
"use client";

import { useState } from "react";
import HeaderSection from "./HeaderSection";
import StatisticsSection from "./StatisticsSection";
import QuickActions from "./QuickActions";
import FiltersSection from "./FiltersSection";
import StatusTabs from "./StatusTabs";
import { ManifestTable } from "../shared/ManifestTable";
import { ExportDialog } from "@/components/drs/shared/ActionDialogs";
import { historyData, historyStats } from "./data/mockData";

const History = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hubFilter, setHubFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const [showExportDialog, setShowExportDialog] = useState(false);

  const filteredHistory = historyData.filter((history) => {
    const matchesSearch =
      history.manifestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      history.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      history.driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      history.origin.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || history.status === statusFilter;
    const matchesHub = hubFilter === "all" || history.origin.hub === hubFilter;
    const matchesDate =
      dateFilter === "all" || history.dateRange === dateFilter;
    const matchesTab = activeTab === "all" || history.status === activeTab;

    return (
      matchesSearch && matchesStatus && matchesHub && matchesDate && matchesTab
    );
  });

  return (
    <div className="space-y-6 p-6">
      <HeaderSection
        onExport={() => setShowExportDialog(true)}
        onRefresh={() => console.log("Refresh Data")}
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
        data={historyData}
      />

      <div className="space-y-6">
        <ManifestTable
          title="Manifest History"
          data={filteredHistory.map(h => ({
            ...h,
            awb: h.manifestNumber,
            customer: h.destination.name,
            phone: h.driver.phone,
            weight: parseFloat(h.totalWeight.replace(',', '').replace(' kg', '')), // Parsing weight
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
