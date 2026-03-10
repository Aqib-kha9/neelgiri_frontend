"use client";

import { useState } from "react";
import HeaderSection from "./HeaderSection";
import StatisticsSection from "./StatisticsSection";
import QuickActions from "./QuickActions";
import FiltersSection from "./FiltersSection";
import StatusTabs from "./StatusTabs";
import MainContent from "./MainContent";
import CaptureModal from "./CaptureModal";
import { podData, podStats } from "./data";

const PODCapture = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [selectedPOD, setSelectedPOD] = useState(podData[0]);
  const [captureMode, setCaptureMode] = useState<
    "signature" | "photo" | "id" | null
  >(null);

  const filteredPODs = podData.filter((pod) => {
    const matchesSearch =
      pod.awbNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pod.receiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pod.receiver.phone.includes(searchTerm);

    const matchesStatus = statusFilter === "all" || pod.status === statusFilter;
    const matchesDelivery =
      deliveryFilter === "all" || pod.deliveryStatus === deliveryFilter;
    const matchesTab = activeTab === "all" || pod.status === activeTab;

    return matchesSearch && matchesStatus && matchesDelivery && matchesTab;
  });

  return (
    <div className="space-y-6 p-6">
      <HeaderSection />
      <StatisticsSection stats={podStats} />
      <QuickActions />
      <FiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        deliveryFilter={deliveryFilter}
        setDeliveryFilter={setDeliveryFilter}
      />
      <StatusTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        podData={podData}
      />
      <MainContent
        filteredPODs={filteredPODs}
        selectedPOD={selectedPOD}
        setSelectedPOD={setSelectedPOD}
        setCaptureMode={setCaptureMode}
      />
      {captureMode && (
        <CaptureModal
          captureMode={captureMode}
          setCaptureMode={setCaptureMode}
        />
      )}
    </div>
  );
};

export default PODCapture;
