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
import CaptureModal from "./CaptureModal";
import { podData as fallbackPodData, podStats as fallbackStats } from "./data";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const mapDeliveryStatus = (s: string): string => {
  const map: Record<string, string> = {
    DELIVERED: "delivered",
    UNDELIVERED: "delivery_failed",
    RTO: "delivery_failed",
    PARTIAL: "delivered",
    REFUSED: "delivery_failed",
  };
  return map[s] || "in_transit";
};

const mapStatus = (pod: any): string => {
  if (pod.verificationStatus === "VERIFIED") return "completed";
  if (pod.verificationStatus === "REJECTED") return "failed";
  if (pod.deliveryStatus === "DELIVERED") return "in_progress";
  return "pending";
};

const mapPod = (p: any) => {
  const shipment = p.shipmentId || {};
  return {
    id: p.podId || p._id,
    _id: p._id,
    awbNumber: p.awb || shipment.awb || "",
    status: mapStatus(p),
    deliveryStatus: mapDeliveryStatus(p.deliveryStatus),
    timestamp: p.deliveryDate ? new Date(p.deliveryDate).toLocaleString() : p.capturedAt ? new Date(p.capturedAt).toLocaleString() : "",
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
      condition: p.deliveryStatus === "DELIVERED" ? "Good" : p.deliveryStatus === "REFUSED" ? "Damaged" : "Good",
    },
    delivery: {
      agent: p.capturedByName || "Unknown",
      vehicle: p.captureDevice || "N/A",
      timestamp: p.deliveryDate ? new Date(p.deliveryDate).toLocaleString() : "",
      location: {
        latitude: p.location?.latitude || 0,
        longitude: p.location?.longitude || 0,
        address: p.location?.address || "",
      },
    },
    capture: {
      signature: p.signature || null,
      photos: (p.attachments || []).filter((a: any) => a.type === "image").map((a: any, i: number) => ({
        id: `photo-${i + 1}`,
        type: "package",
        url: a.url,
        timestamp: a.uploadedAt ? new Date(a.uploadedAt).toLocaleString() : "",
        description: "Delivery photo",
      })),
      idVerification: p.attachments && p.attachments.some((a: any) => a.type === "document")
        ? {
          type: "ID",
          number: "N/A",
          photo: p.attachments.find((a: any) => a.type === "document")?.url || "",
          verified: true,
        }
        : null,
      notes: p.remarks || "",
      codPayment: {
        amount: shipment.codAmount ? `₹${shipment.codAmount}` : "-",
        method: shipment.paymentMode === "cod" ? "COD" : "Prepaid",
        received: p.deliveryStatus === "DELIVERED",
        timestamp: p.deliveryDate ? new Date(p.deliveryDate).toLocaleString() : null,
      },
    },
    verification: {
      automated: false,
      confidence: p.verificationStatus === "VERIFIED" ? 100 : 0,
      flags: p.undeliveredReason ? [p.undeliveredReason] : [],
      status: p.verificationStatus ? p.verificationStatus.toLowerCase() : "pending",
    },
  };
};

const mapStats = (s: any) => ({
  totalCaptured: s.total || 0,
  pendingCapture: s.pendingVerification || 0,
  verified: s.verified || 0,
  rejected: s.rejected || 0,
  successRate: s.deliveryRate || 0,
  avgCaptureTime: "N/A",
  digitalAdoption: s.verificationRate || 0,
});

const PODCapture = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [pods, setPods] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(mapStats(fallbackStats));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPOD, setSelectedPOD] = useState<any>(null);
  const [captureMode, setCaptureMode] = useState<"signature" | "photo" | "id" | null>(null);

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
      setPods(mapped);
      setStats(mapStats(statsRes.data || {}));
      setSelectedPOD(mapped[0] || null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to load POD data";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredPODs = pods.filter((pod) => {
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
        deliveryFilter={deliveryFilter}
        setDeliveryFilter={setDeliveryFilter}
      />
      <StatusTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        podData={pods}
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
