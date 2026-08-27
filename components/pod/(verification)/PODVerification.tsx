"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import HeaderSection from "./HeaderSection";
import StatisticsSection from "./StatisticsSection";
import QuickActions from "./QuickActions";
import FiltersSection from "./FiltersSection";
import StatusTabs from "./StatusTabs";
import MainContent from "./MainContent";
import { verificationStats as fallbackStats } from "./data";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const mapVerificationStatus = (s: string): string => {
  const map: Record<string, string> = {
    PENDING: "pending",
    VERIFIED: "verified",
    REJECTED: "rejected",
  };
  return map[s] || "pending";
};

const mapPriority = (pod: any): string => {
  if (pod.undeliveredReason || pod.deliveryStatus === "REFUSED") return "high";
  if (pod.deliveryStatus === "RTO" || pod.deliveryStatus === "PARTIAL") return "medium";
  return "low";
};

const mapRiskLevel = (pod: any): string => {
  if (pod.undeliveredReason || pod.deliveryStatus === "REFUSED") return "high";
  if (pod.deliveryStatus === "RTO") return "medium";
  return "low";
};

const mapRiskScore = (pod: any): number => {
  if (pod.undeliveredReason) return 85;
  if (pod.deliveryStatus === "REFUSED") return 85;
  if (pod.deliveryStatus === "RTO") return 50;
  if (pod.verificationStatus === "VERIFIED") return 12;
  return 40;
};

const mapPod = (p: any) => {
  const shipment = p.shipmentId || {};
  const status = mapVerificationStatus(p.verificationStatus);
  return {
    id: p.podId || p._id,
    _id: p._id,
    podId: p.podId,
    awbNumber: p.awb || shipment.awb || "",
    status,
    priority: mapPriority(p),
    receiver: {
      name: p.deliveredTo?.name || shipment.receiver?.name || "Unknown",
      phone: p.deliveredTo?.phone || shipment.receiver?.phone || "",
      signature: p.signature ? "captured" : "pending",
      idVerified: !!(p.attachments && p.attachments.some((a: any) => a.type === "document")),
      relation: p.deliveredTo?.relation || "Self",
    },
    package: {
      type: shipment.contents || "Parcel",
      weight: shipment.weight ? `${shipment.weight} kg` : "N/A",
      description: shipment.contents || "",
      condition: p.deliveryStatus === "REFUSED" ? "Damaged" : "Good",
    },
    delivery: {
      agent: p.capturedByName || "Unknown",
      timestamp: p.deliveryDate ? new Date(p.deliveryDate).toLocaleString() : "",
      location: p.location?.address || "",
    },
    capture: {
      signature: p.signature
        ? {
          url: p.signature,
          quality: 90,
          timestamp: p.capturedAt ? new Date(p.capturedAt).toLocaleString() : "",
          confidence: p.verificationStatus === "VERIFIED" ? 95 : 60,
        }
        : null,
      photos: (p.attachments || []).filter((a: any) => a.type === "image").map((a: any, i: number) => ({
        id: `photo-${i + 1}`,
        type: "package",
        url: a.url,
        timestamp: a.uploadedAt ? new Date(a.uploadedAt).toLocaleString() : "",
        description: "Delivery photo",
        quality: 85,
        flags: [],
      })),
      idVerification: p.attachments && p.attachments.some((a: any) => a.type === "document")
        ? {
          type: "ID",
          number: "N/A",
          photo: p.attachments.find((a: any) => a.type === "document")?.url || "",
          verified: true,
          confidence: 90,
        }
        : null,
      notes: p.remarks || "",
    },
    verification: {
      status,
      confidence: p.verificationStatus === "VERIFIED" ? 95 : p.verificationStatus === "REJECTED" ? 10 : 0,
      automated: false,
      verifiedBy: p.verifiedBy?.name || p.verifiedBy?.email || null,
      verifiedAt: p.verifiedAt ? new Date(p.verifiedAt).toLocaleString() : null,
      flags: p.undeliveredReason ? [p.undeliveredReason] : [],
      comments: p.rejectionReason || "",
      score: p.verificationStatus === "VERIFIED" ? 95 : p.verificationStatus === "REJECTED" ? 10 : 0,
    },
    risk: {
      level: mapRiskLevel(p),
      factors: p.undeliveredReason ? [p.undeliveredReason] : [],
      score: mapRiskScore(p),
    },
  };
};

const mapStats = (s: any) => ({
  totalPending: s.pendingVerification || 0,
  verifiedToday: s.verified || 0,
  rejectionRate: s.total > 0 ? Number(((s.rejected / s.total) * 100).toFixed(1)) : 0,
  avgVerificationTime: "2.1 min",
  automationRate: 0,
  qualityScore: s.total > 0 ? Number(((s.verified / s.total) * 100).toFixed(1)) : 0,
  highRiskCases: s.undelivered || 0,
});

const PODVerification = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [verifications, setVerifications] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(mapStats({}));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVerification, setSelectedVerification] = useState<any>(null);
  const [verificationComment, setVerificationComment] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const [podsRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE}/api/pods`, { headers }),
        axios.get(`${API_BASE}/api/pods/stats`, { headers }),
      ]);
      const rawPods = podsRes.data?.data || [];
      const mapped = rawPods.map(mapPod);
      setVerifications(mapped);
      setStats(mapStats(statsRes.data || {}));
      setSelectedVerification(mapped[0] || null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to load verification data";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredVerifications = verifications.filter((verification) => {
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

  const handleApprove = async (verification: any) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(
        `${API_BASE}/api/pods/${verification._id}/verify`,
        { status: "VERIFIED" },
        { headers }
      );
      toast.success(`POD ${verification.awbNumber} verified successfully`);
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to verify POD");
    }
  };

  const handleReject = async (verification: any) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(
        `${API_BASE}/api/pods/${verification._id}/verify`,
        { status: "REJECTED", rejectionReason: verificationComment || "Rejected by verifier" },
        { headers }
      );
      toast.success(`POD ${verification.awbNumber} rejected`);
      setVerificationComment("");
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reject POD");
    }
  };

  const handleRequestReview = (verification: any) => {
    toast.info(`Review requested for ${verification.awbNumber}. Please add comments and approve/reject.`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-error font-medium">{error}</p>
        <button onClick={fetchData} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <HeaderSection />
      <StatisticsSection stats={stats} />
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
        verificationData={verifications}
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
