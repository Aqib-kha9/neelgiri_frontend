"use client";

import { useState } from "react";
import { bulkShipmentsData } from "./data";
import { bookingTemplates } from "./config";
import { BulkShipment } from "./types";
import { QuickBookingHeader } from "./QuickBookingHeader";
import { QuickBookingStats } from "./QuickBookingStats";
import { QuickActions } from "./QuickActions";
import { QuickBookingFilters } from "./QuickBookingFilters";
import { QuickBookingTabs } from "./QuickBookingTabs";
import { BatchCard } from "./BatchCard";
import { EmptyState } from "./EmptyState";
import { QuickBookingAnalytics } from "./QuickBookingAnalytics";
import { TemplateSelector } from "./TemplateSelector";

export const QuickBooking = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [bulkShipments, setBulkShipments] =
    useState<BulkShipment[]>(bulkShipmentsData);

  // Filter bulk shipments based on search and filters
  const filteredBulkShipments = bulkShipments.filter((shipment) => {
    const matchesSearch =
      shipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.createdBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || shipment.status === statusFilter;
    const matchesTab = activeTab === "all" || shipment.status === activeTab;

    return matchesSearch && matchesStatus && matchesTab;
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowTemplateSelector(false);
    // In a real app, you would navigate to the booking form with the selected template
  };

  const handleDeleteBulkShipment = (id: string) => {
    setBulkShipments((prev) => prev.filter((shipment) => shipment.id !== id));
  };

  const handleDuplicateBulkShipment = (batch: BulkShipment) => {
    const newShipment: BulkShipment = {
      ...batch,
      id: `BULK-${String(bulkShipments.length + 1).padStart(3, "0")}`,
      name: `${batch.name} (Copy)`,
      status: "draft",
      processed: 0,
      failed: 0,
      progress: 0,
      createdAt: new Date().toLocaleString("en-IN"),
      updatedAt: new Date().toLocaleString("en-IN"),
    };
    setBulkShipments((prev) => [newShipment, ...prev]);
  };

  const handleExport = () => {
    console.log("Exporting template...");
    // Export logic here
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <QuickBookingHeader
        onExport={handleExport}
        onNewBulkShipment={() => setShowTemplateSelector(true)}
      />

      {/* Template Selector Modal */}
      <TemplateSelector
        isOpen={showTemplateSelector}
        selectedTemplate={selectedTemplate}
        onTemplateSelect={handleTemplateSelect}
        onClose={() => setShowTemplateSelector(false)}
      />

      {/* Stats Overview */}
      <QuickBookingStats
        bulkShipments={bulkShipments}
        bookingTemplates={bookingTemplates}
      />

      {/* Quick Actions */}
      <QuickActions />

      {/* Filters and Search */}
      <QuickBookingFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Status Tabs */}
      <QuickBookingTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        bulkShipments={bulkShipments}
      />

      {/* Bulk Shipments List */}
      <div className="space-y-4">
        {filteredBulkShipments.map((batch) => (
          <BatchCard
            key={batch.id}
            batch={batch}
            onDelete={handleDeleteBulkShipment}
            onDuplicate={handleDuplicateBulkShipment}
          />
        ))}

        {filteredBulkShipments.length === 0 && (
          <EmptyState
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onNewBulkShipment={() => setShowTemplateSelector(true)}
          />
        )}
      </div>

      {/* Batch Analytics */}
      <QuickBookingAnalytics bulkShipments={bulkShipments} />
    </div>
  );
};
