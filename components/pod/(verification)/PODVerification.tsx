"use client";

import { useState } from "react";
import HeaderSection from "./HeaderSection";
import StatisticsSection from "./StatisticsSection";
import QuickActions from "./QuickActions";
import FiltersSection from "./FiltersSection";
import StatusTabs from "./StatusTabs";
import MainContent from "./MainContent";
import { verificationData, verificationStats } from "./data";

const PODVerification = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [selectedVerification, setSelectedVerification] = useState(
    verificationData[0]
  );
  const [verificationComment, setVerificationComment] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);

  const filteredVerifications = verificationData.filter((verification) => {
    const matchesSearch =
      verification.awbNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.receiver.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      verification.receiver.phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || verification.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || verification.priority === priorityFilter;
    const matchesRisk =
      riskFilter === "all" || verification.risk.level === riskFilter;
    const matchesTab = activeTab === "all" || verification.status === activeTab;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesRisk &&
      matchesTab
    );
  });

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const handleApprove = (verification: any) => {
    console.log("Approve verification:", verification.id);
  };

  const handleReject = (verification: any) => {
    console.log("Reject verification:", verification.id);
  };

  const handleRequestReview = (verification: any) => {
    console.log("Request review for:", verification.id);
  };

  return (
    <div className="space-y-6 p-6">
      <HeaderSection />
      <StatisticsSection stats={verificationStats} />
      <QuickActions />
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
      <StatusTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        verificationData={verificationData}
      />
      <MainContent
        filteredVerifications={filteredVerifications}
        selectedVerification={selectedVerification}
        setSelectedVerification={setSelectedVerification}
        verificationComment={verificationComment}
        setVerificationComment={setVerificationComment}
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestReview={handleRequestReview}
      />
    </div>
  );
};

export default PODVerification;
