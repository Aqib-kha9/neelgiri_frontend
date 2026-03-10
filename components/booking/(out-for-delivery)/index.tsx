"use client";

import { useState } from "react";
import HeaderSection from "./HeaderSection";
import StatsOverview from "./StatsOverview";
import FiltersSection from "./FiltersSection";
import StatusTabs from "./StatusTabs";
import DeliveryList from "./DeliveryList";
import RiderOverview from "./RiderOverview";
import { outForDeliveryData } from "./data/mockData";

const OutForDelivery = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredDeliveries = outForDeliveryData.filter((delivery) => {
    const matchesSearch =
      delivery.awbNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.receiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.receiver.phone.includes(searchTerm) ||
      delivery.rider.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || delivery.currentStatus === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || delivery.priority === priorityFilter;
    const matchesTab =
      activeTab === "all" || delivery.currentStatus === activeTab;

    return matchesSearch && matchesStatus && matchesPriority && matchesTab;
  });

  return (
    <div className="space-y-7 p-6">
      <HeaderSection />
      <StatsOverview />
      <FiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />
      <StatusTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <DeliveryList
        deliveries={filteredDeliveries}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
      />
      <RiderOverview />
    </div>
  );
};

export default OutForDelivery;