"use client";

import { useState, useEffect } from "react";
import { liveTrackingData, trackingStats } from "./data/mockData";
import {
  statusConfig,
  priorityConfig,
  confidenceConfig,
} from "./data/statusConfig";
import HeaderSection from "./HeaderSection";
import StatsSection from "./StatsSection";
import ShipmentsList from "./ShipmentsList";
import TrackingDetails from "./TrackingDetails";

const LiveTracking = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState(liveTrackingData[0]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Auto-refresh simulation
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // In real app, this would fetch updated tracking data
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const filteredShipments = liveTrackingData.filter((shipment) => {
    const matchesSearch =
      shipment.awbNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.receiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.receiver.phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || shipment.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || shipment.priority === priorityFilter;
    const matchesTab = activeTab === "all" || shipment.status === activeTab;

    return matchesSearch && matchesStatus && matchesPriority && matchesTab;
  });

  return (
    <div className="space-y-6 p-6">
      <HeaderSection
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        lastUpdated={lastUpdated}
      />

      <StatsSection stats={trackingStats} />

      {/* Main Tracking Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Shipments List */}
        <div className="xl:col-span-1 space-y-4">
          <ShipmentsList
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            filteredShipments={filteredShipments}
            selectedShipment={selectedShipment}
            setSelectedShipment={setSelectedShipment}
            lastUpdated={lastUpdated}
          />
        </div>

        {/* Tracking Details */}
        <div className="xl:col-span-2 space-y-6">
          <TrackingDetails
            selectedShipment={selectedShipment}
            lastUpdated={lastUpdated}
            setLastUpdated={setLastUpdated}
          />
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
