"use client";

import { useState } from "react";
import { exceptionsData } from "./data";
import { Exception } from "./types";
import { ExceptionsHeader } from "./ExceptionsHeader";
import { ExceptionsStats } from "./ExceptionsStats";
import { ExceptionsFilters } from "./ExceptionsFilters";
import { ExceptionsTabs } from "./ExceptionsTabs";
import { ExceptionCard } from "./ExceptionCard";
import { EmptyState } from "./EmptyState";
import { ExceptionAnalytics } from "./ExceptionAnalytics";

export const Exceptions = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredExceptions = exceptionsData.filter((exception) => {
    const matchesSearch =
      exception.awbNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exception.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exception.shipment.receiver.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      exception.shipment.receiver.phone.includes(searchTerm);

    const matchesType = typeFilter === "all" || exception.type === typeFilter;
    const matchesSeverity =
      severityFilter === "all" || exception.severity === severityFilter;
    const matchesStatus =
      statusFilter === "all" || exception.status === statusFilter;
    const matchesTab = activeTab === "all" || exception.status === activeTab;

    return (
      matchesSearch &&
      matchesType &&
      matchesSeverity &&
      matchesStatus &&
      matchesTab
    );
  });

  const handleExport = () => {
    console.log("Exporting report...");
    // Export logic here
  };

  const handleNewException = () => {
    console.log("Creating new exception...");
    // New exception logic here
  };

  const handleRefresh = () => {
    console.log("Refreshing data...");
    // Refresh logic here
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <ExceptionsHeader
        onExport={handleExport}
        onNewException={handleNewException}
      />

      {/* Stats Overview */}
      <ExceptionsStats exceptions={exceptionsData} />

      {/* Filters and Search */}
      <ExceptionsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        severityFilter={severityFilter}
        onSeverityFilterChange={setSeverityFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Status Tabs */}
      <ExceptionsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        exceptions={exceptionsData}
      />

      {/* Exceptions List */}
      <div className="space-y-4">
        {filteredExceptions.map((exception) => (
          <ExceptionCard key={exception.id} exception={exception} />
        ))}

        {filteredExceptions.length === 0 && (
          <EmptyState
            searchTerm={searchTerm}
            typeFilter={typeFilter}
            severityFilter={severityFilter}
            statusFilter={statusFilter}
            onRefresh={handleRefresh}
          />
        )}
      </div>

      {/* Exception Analytics */}
      <ExceptionAnalytics exceptions={exceptionsData} />
    </div>
  );
};
