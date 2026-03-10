"use client";

import { useState } from "react";
import { Download, FileText, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { missingPODData, missingPODStats } from "./data/mockData";
import {
  statusConfig,
  priorityConfig,
  riskConfig,
  investigationConfig,
} from "./data/configs";
import MissingPODStats from "./MissingPODStats";
import QuickActions from "./QuickActions";
import FiltersSection from "./FiltersSection";
import StatusTabs from "./StatusTabs";
import PODList from "./PODList";
import CaseDetails from "./CaseDetails";
import ResolutionModal from "./ResolutionModal";

const MissingPOD = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [selectedPOD, setSelectedPOD] = useState(missingPODData[0]);
  const [showResolutionModal, setShowResolutionModal] = useState(false);

  const filteredPODs = missingPODData.filter((pod) => {
    const matchesSearch =
      pod.awbNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pod.receiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pod.receiver.phone.includes(searchTerm);

    const matchesStatus = statusFilter === "all" || pod.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || pod.priority === priorityFilter;
    const matchesRisk = riskFilter === "all" || pod.risk.level === riskFilter;
    const matchesTab = activeTab === "all" || pod.status === activeTab;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesRisk &&
      matchesTab
    );
  });

  const handleResolve = (pod: any) => {
    setShowResolutionModal(true);
  };

  const submitResolution = () => {
    console.log("Submit resolution for:", selectedPOD.id);
    setShowResolutionModal(false);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-red-100 p-2">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Missing POD
              </h1>
              <p className="text-muted-foreground">
                Track and resolve shipments with missing proof of delivery
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 rounded-xl border-border/70"
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand">
            <Plus className="h-4 w-4" />
            New Investigation
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <MissingPODStats stats={missingPODStats} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Filters */}
      <FiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        riskFilter={riskFilter}
        setRiskFilter={setRiskFilter}
      />

      {/* Status Tabs */}
      <StatusTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        data={missingPODData}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* POD List */}
        <div className="xl:col-span-1 space-y-4">
          <PODList
            pods={filteredPODs}
            selectedPOD={selectedPOD}
            onSelectPOD={setSelectedPOD}
            statusConfig={statusConfig}
            priorityConfig={priorityConfig}
            riskConfig={riskConfig}
          />
        </div>

        {/* Case Details */}
        <div className="xl:col-span-2 space-y-6">
          <CaseDetails
            pod={selectedPOD}
            statusConfig={statusConfig}
            priorityConfig={priorityConfig}
            riskConfig={riskConfig}
            investigationConfig={investigationConfig}
            onResolve={handleResolve}
          />
        </div>
      </div>

      {/* Resolution Modal */}
      {showResolutionModal && (
        <ResolutionModal
          onClose={() => setShowResolutionModal(false)}
          onSubmit={submitResolution}
        />
      )}
    </div>
  );
};

export default MissingPOD;
