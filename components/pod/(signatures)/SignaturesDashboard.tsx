"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import SignaturesHeader from "./SignaturesHeader";
import SignaturesStats from "./SignaturesStats";
import SignaturesFilters from "./SignaturesFilters";
import SignaturesTabs from "./SignaturesTabs";
import SignaturesList from "./SignaturesList";
import SignatureDetails from "./SignatureDetails";
import SignatureVerification from "./SignatureVerification";
import SignatureCapture from "./SignatureCapture";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const mapStatus = (pod: any): string => {
  if (pod.verificationStatus === "VERIFIED") return "verified";
  if (pod.verificationStatus === "REJECTED") return "rejected";
  if (pod.signature) return "review_required";
  return "pending";
};

const mapPriority = (pod: any): string => {
  if (pod.undeliveredReason || pod.deliveryStatus === "REFUSED") return "high";
  if (pod.deliveryStatus === "RTO") return "medium";
  return "low";
};

const mapSignature = (p: any) => {
  const shipment = p.shipmentId || {};
  const status = mapStatus(p);
  return {
    id: p.podId || p._id,
    _id: p._id,
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
    signature: p.signature
      ? {
        url: p.signature,
        quality: 90,
        timestamp: p.capturedAt ? new Date(p.capturedAt).toLocaleString() : "",
        confidence: p.verificationStatus === "VERIFIED" ? 95 : 60,
        type: "digital",
      }
      : {
        url: null,
        quality: 0,
        timestamp: null,
        confidence: 0,
        type: "pending",
      },
    verification: {
      status,
      confidence: p.verificationStatus === "VERIFIED" ? 95 : 0,
      verifiedBy: p.verifiedBy?.name || p.verifiedBy?.email || null,
      verifiedAt: p.verifiedAt ? new Date(p.verifiedAt).toLocaleString() : null,
    },
  };
};

const SignaturesDashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [signatures, setSignatures] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalSignatures: 0,
    pendingVerification: 0,
    verifiedToday: 0,
    rejectionRate: 0,
    avgQualityScore: 0,
    digitalAdoption: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSignature, setSelectedSignature] = useState<any>(null);
  const [captureMode, setCaptureMode] = useState(false);

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
      const mapped = rawPods.map(mapSignature);
      setSignatures(mapped);
      setSelectedSignature(mapped[0] || null);

      const s = statsRes.data || {};
      const total = s.total || 0;
      const verified = s.verified || 0;
      const rejected = s.rejected || 0;
      const pending = s.pendingVerification || 0;
      setStats({
        totalSignatures: total,
        pendingVerification: pending,
        verifiedToday: verified,
        rejectionRate: total > 0 ? Number(((rejected / total) * 100).toFixed(1)) : 0,
        avgQualityScore: total > 0 ? Number(((verified / total) * 100).toFixed(1)) : 0,
        digitalAdoption: s.verificationRate || 0,
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to load signatures data";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleVerify = async () => {
    if (!selectedSignature) return;
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(
        `${API_BASE}/api/pods/${selectedSignature._id}/verify`,
        { status: "VERIFIED" },
        { headers }
      );
      toast.success(`Signature for ${selectedSignature.awbNumber} verified`);
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to verify signature");
    }
  };

  const handleReject = async () => {
    if (!selectedSignature) return;
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(
        `${API_BASE}/api/pods/${selectedSignature._id}/verify`,
        { status: "REJECTED", rejectionReason: "Signature quality issue" },
        { headers }
      );
      toast.success(`Signature for ${selectedSignature.awbNumber} rejected`);
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reject signature");
    }
  };

  const handleSaveSignature = async (signatureData: any) => {
    if (!selectedSignature) {
      setCaptureMode(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(
        `${API_BASE}/api/pods/${selectedSignature._id}`,
        { signature: signatureData },
        { headers }
      );
      toast.success("Signature saved successfully");
      setCaptureMode(false);
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save signature");
    }
  };

  const filteredSignatures = signatures.filter((sig) => {
    const matchesSearch =
      sig.awbNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sig.receiver.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || sig.status === statusFilter;
    const matchesTab = activeTab === "all" || sig.status === activeTab;

    return matchesSearch && matchesStatus && matchesTab;
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
      <SignaturesHeader onNewCapture={() => setCaptureMode(true)} />

      <SignaturesStats stats={stats} />

      <SignaturesFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <SignaturesTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        signaturesData={signatures}
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
            onVerify={handleVerify}
            onReject={handleReject}
          />
        </div>
      </div>

      {captureMode && (
        <SignatureCapture
          onClose={() => setCaptureMode(false)}
          onSave={handleSaveSignature}
        />
      )}
    </div>
  );
};

export default SignaturesDashboard;
