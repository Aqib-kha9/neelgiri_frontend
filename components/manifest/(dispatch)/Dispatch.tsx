// app/dashboard/manifest/dispatch/components/Dispatch.tsx
"use client";

import { useState } from "react";
import HeaderSection from "./HeaderSection";
import StatisticsSection from "./StatisticsSection";
import QuickActions from "./QuickActions";
import FiltersSection from "./FiltersSection";
import StatusTabs from "./StatusTabs";
import { ManifestTable } from "../shared/ManifestTable";
import { ExportDialog } from "@/components/drs/shared/ActionDialogs";
import CreateDispatchModal from "./CreateDispatchModal";
import { dispatchData, dispatchStats } from "./data/mockData";

const Dispatch = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hubFilter, setHubFilter] = useState("all");
  const [vehicleFilter, setVehicleFilter] = useState("all");

  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredDispatches = dispatchData.filter((dispatch) => {
    const matchesSearch =
      dispatch.manifestNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
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
        data={dispatchData}
      />

      <div className="space-y-6">
        <ManifestTable
          title="Active Dispatches"
          data={filteredDispatches.map(d => ({
            ...d,
            awb: d.manifestNumber,
            customer: d.driver.name,
            phone: d.driver.phone,
            weight: parseFloat(d.totalWeight.replace(',', '').replace(' kg', '')), // Parsing weight
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
