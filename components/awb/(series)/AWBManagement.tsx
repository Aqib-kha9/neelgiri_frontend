"use client";

import { useState } from "react";
import HeaderSection from "./HeaderSection";
import StatsOverview from "./StatsOverview";
import QuickActions from "./QuickActions";
import FiltersSection from "./FiltersSection";
import StatusTabs from "./StatusTabs";
import SeriesList from "./SeriesList";
import AnalyticsSection from "./AnalyticsSection";
import { awbSeriesData } from "./data/mockData";

const AWBManagement = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [allocationFilter, setAllocationFilter] = useState("all");

  const filteredSeries = awbSeriesData.filter((series) => {
    const matchesSearch =
      series.seriesName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      series.prefix.toLowerCase().includes(searchTerm.toLowerCase()) ||
      series.seriesCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      series.allocatedTo?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || series.status === statusFilter;
    const matchesAllocation =
      allocationFilter === "all" || series.allocation.type === allocationFilter;
    const matchesTab = activeTab === "all" || series.status === activeTab;

    return matchesSearch && matchesStatus && matchesAllocation && matchesTab;
  });

  return (
    <div className="space-y-6 p-6">
      <HeaderSection />
      <StatsOverview />
      <QuickActions />
      <FiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        allocationFilter={allocationFilter}
        setAllocationFilter={setAllocationFilter}
      />
      <StatusTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <SeriesList series={filteredSeries} />
      <AnalyticsSection />
    </div>
  );
};

export default AWBManagement;
