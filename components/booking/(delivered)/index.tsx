"use client";

import { useState } from "react";
import HeaderSection from "./HeaderSection";
import StatsOverview from "./StatsOverview";
import FiltersSection from "./FiltersSection";
import StatusTabs from "./StatusTabs";
import DeliveryList from "./DeliveryList";
import PerformanceSummary from "./PerformanceSummary";
import { deliveredData } from "./data/mockData";

const Delivered = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const filteredDeliveries = deliveredData.filter((delivery) => {
    const matchesSearch =
      delivery.awbNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.receiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.receiver.phone.includes(searchTerm) ||
      delivery.sender.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVerification =
      verificationFilter === "all" ||
      delivery.podVerification.status === verificationFilter;
    const matchesPayment =
      paymentFilter === "all" ||
      delivery.financials.paymentStatus === paymentFilter;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "today" &&
        new Date(delivery.deliveryInfo.deliveredAt).toDateString() ===
          new Date().toDateString());

    return matchesSearch && matchesVerification && matchesPayment && matchesTab;
  });

  return (
    <div className="space-y-7 p-6">
      <HeaderSection />
      <StatsOverview />
      <FiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        verificationFilter={verificationFilter}
        setVerificationFilter={setVerificationFilter}
        paymentFilter={paymentFilter}
        setPaymentFilter={setPaymentFilter}
      />
      <StatusTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <DeliveryList
        deliveries={filteredDeliveries}
        searchTerm={searchTerm}
        verificationFilter={verificationFilter}
        paymentFilter={paymentFilter}
      />
      <PerformanceSummary />
    </div>
  );
};

export default Delivered;
