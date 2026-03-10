"use client";

import { useState } from "react";
import SignaturesHeader from "./SignaturesHeader";
import SignaturesStats from "./SignaturesStats";
import SignaturesFilters from "./SignaturesFilters";
import SignaturesTabs from "./SignaturesTabs";
import SignaturesList from "./SignaturesList";
import SignatureDetails from "./SignatureDetails";
import SignatureVerification from "./SignatureVerification";
import SignatureCapture from "./SignatureCapture";

// ✅ YAHAN SE DATA AA RAHA HAI - YEH MOCK DATA HAI
const signaturesData = [
  {
    id: "SIG-001",
    awbNumber: "HJD292412504",
    status: "verified",
    priority: "high",
    receiver: {
      name: "Aqib Khan",
      phone: "8601677140",
      signature: "captured",
      idVerified: true,
      relation: "Self",
    },
    package: {
      type: "Parcel",
      weight: "5 kg",
      description: "Electronics items - Mobile Phone",
      condition: "Good",
    },
    delivery: {
      agent: "Raj Kumar (RDR-001)",
      timestamp: "2024-12-11 14:45:30",
      location: "45 Park Street, Kolkata - 700016",
    },
    signature: {
      url: "/api/placeholder/400/200",
      quality: 95,
      timestamp: "2024-12-11 14:45:00",
      confidence: 98.2,
      type: "digital",
    },
    verification: {
      status: "verified",
      confidence: 95.7,
      verifiedBy: "AI System",
      verifiedAt: "2024-12-11 14:46:00",
    },
  },
  {
    id: "SIG-002",
    awbNumber: "HJD292412505",
    status: "pending",
    priority: "medium",
    receiver: {
      name: "Priya Singh",
      phone: "9876543211",
      signature: "pending",
      idVerified: false,
      relation: "Secretary",
    },
    package: {
      type: "Documents",
      weight: "0.5 kg",
      description: "Contract documents",
      condition: "Good",
    },
    delivery: {
      agent: "Amit Sharma (RDR-002)",
      timestamp: "2024-12-11 15:30:00",
      location: "23 Nariman Point, Mumbai - 400021",
    },
    signature: {
      url: null,
      quality: 0,
      timestamp: null,
      confidence: 0,
      type: "pending",
    },
    verification: {
      status: "pending",
      confidence: 0,
      verifiedBy: null,
      verifiedAt: null,
    },
  },
  {
    id: "SIG-003",
    awbNumber: "HJD292412506",
    status: "review_required",
    priority: "high",
    receiver: {
      name: "Global Enterprises",
      phone: "9012345679",
      signature: "captured",
      idVerified: true,
      relation: "Reception",
    },
    package: {
      type: "Clothing",
      weight: "3 kg",
      description: "Summer collection",
      condition: "Good",
    },
    delivery: {
      agent: "Rohit Verma (RDR-003)",
      timestamp: "2024-12-11 13:20:00",
      location: "78 Electronics City, Bangalore - 560100",
    },
    signature: {
      url: "/api/placeholder/400/200",
      quality: 78,
      timestamp: "2024-12-11 13:20:00",
      confidence: 65.3,
      type: "digital",
    },
    verification: {
      status: "review_required",
      confidence: 65.3,
      verifiedBy: "AI System",
      verifiedAt: "2024-12-11 13:21:00",
    },
  },
];

// ✅ YEH STATS DATA BHI YAHAN SE AA RAHA HAI
const signaturesStats = {
  totalSignatures: 1245,
  pendingVerification: 89,
  verifiedToday: 234,
  rejectionRate: 2.3,
  avgQualityScore: 94.7,
  digitalAdoption: 87.2,
};

const SignaturesDashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSignature, setSelectedSignature] = useState(signaturesData[0]);
  const [captureMode, setCaptureMode] = useState(false);

  const filteredSignatures = signaturesData.filter((sig) => {
    const matchesSearch =
      sig.awbNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sig.receiver.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || sig.status === statusFilter;
    const matchesTab = activeTab === "all" || sig.status === activeTab;

    return matchesSearch && matchesStatus && matchesTab;
  });

  return (
    <div className="space-y-6 p-6">
      <SignaturesHeader onNewCapture={() => setCaptureMode(true)} />

      <SignaturesStats stats={signaturesStats} />

      <SignaturesFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <SignaturesTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        signaturesData={signaturesData}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <SignaturesList
            signatures={filteredSignatures}
            selectedSignature={selectedSignature}
            onSignatureSelect={setSelectedSignature}
          />
        </div>

        <div className="xl:col-span-2 space-y-6">
          <SignatureDetails signature={selectedSignature} />
          <SignatureVerification
            signature={selectedSignature}
            onVerify={() => console.log("Verify")}
            onReject={() => console.log("Reject")}
          />
        </div>
      </div>

      {captureMode && (
        <SignatureCapture
          onClose={() => setCaptureMode(false)}
          onSave={(signatureData) => {
            console.log("Signature saved:", signatureData);
            setCaptureMode(false);
          }}
        />
      )}
    </div>
  );
};

// ✅ DEFAULT EXPORT KARO
export default SignaturesDashboard;
