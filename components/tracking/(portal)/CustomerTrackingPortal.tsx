"use client";

import { useState } from "react";
import HeaderSection from "./HeaderSection";
import StatisticsCards from "./StatisticsCards";
import QuickActions from "./QuickActions";
import FiltersSection from "./FiltersSection";
import StatusTabs from "./StatusTabs";
import { customerTrackingData, trackingStats } from "./data/mockData";
import { DRSTable } from "@/components/drs/shared/DRSTable";
import { ExportDialog } from "@/components/drs/shared/ActionDialogs";

const CustomerTrackingPortal = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [selectedTracking, setSelectedTracking] = useState(
    customerTrackingData[0]
  );
  const [isExportOpen, setIsExportOpen] = useState(false);

  const filteredTracking = customerTrackingData.filter((tracking) => {
    const matchesSearch =
      tracking.awbNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tracking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tracking.customer.phone.includes(searchTerm) ||
      tracking.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || tracking.status === statusFilter;
    const matchesCity =
      cityFilter === "all" || tracking.customer.city === cityFilter;
    const matchesTab = activeTab === "all" || tracking.status === activeTab;

    return matchesSearch && matchesStatus && matchesCity && matchesTab;
  });

  return (
    <div className="space-y-6 p-6">
      <HeaderSection onExport={() => setIsExportOpen(true)} />
      <StatisticsCards stats={trackingStats} />
      <QuickActions />
      <FiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        cityFilter={cityFilter}
        setCityFilter={setCityFilter}
      />
      <StatusTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        trackingData={customerTrackingData}
      />

      {/* Main Content */}
      <div className="space-y-6">
        <DRSTable data={filteredTracking} title="Tracking History" />
      </div>

      <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />
    </div>
  );
};

export default CustomerTrackingPortal;
