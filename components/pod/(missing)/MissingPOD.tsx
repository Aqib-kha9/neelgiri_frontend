"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Download, FileText, Plus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { missingPODStats as fallbackStats } from "./data/mockData";
import {
  statusConfig,
  priorityConfig,
  riskConfig,
  investigationConfig,
} from "./data/configs";
import MissingPODStats from "./MissingPODStats";
import QuickActions from "./QuickActions";
import FiltersSection from "./FiltersSection";
import StatusTabs from "./StatusTabs";
import PODList from "./PODList";
import CaseDetails from "./CaseDetails";
import ResolutionModal from "./ResolutionModal";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const mapPriority = (shipment: any): string => {
  if (shipment.paymentMode === "cod" && shipment.codAmount > 0) return "high";
  if (shipment.declaredValue > 10000) return "high";
  return "medium";
};

const mapRiskLevel = (shipment: any): string => {
  if (shipment.paymentMode === "cod" && shipment.codAmount > 0) return "high";
  if (shipment.declaredValue > 10000) return "high";
  if (shipment.paymentMode === "cod") return "medium";
  return "low";
};

const mapRiskScore = (shipment: any): number => {
  let score = 30;
  if (shipment.paymentMode === "cod") score += 30;
  if (shipment.codAmount > 500) score += 20;
  if (shipment.declaredValue > 10000) score += 20;
  return Math.min(score, 100);
};

const mapMissingPOD = (s: any) => {
  return {
    id: s.awb || s._id,
    _id: s._id,
    awbNumber: s.awb || "",
    status: "pending",
    priority: mapPriority(s),
    shipmentDate: s.createdAt ? new Date(s.createdAt).toISOString().split("T")[0] : "",
    deliveryDate: s.history?.find((h: any) => h.status === "DELIVERED")?.timestamp
      ? new Date(s.history.find((h: any) => h.status === "DELIVERED").timestamp).toISOString().split("T")[0]
      : "",
    deliveryAgent: s.history?.find((h: any) => h.status === "DELIVERED")?.updatedBy?.name || "Unknown",
    receiver: {
      name: s.receiver?.name || "Unknown",
      phone: s.receiver?.phone || "",
      address: s.receiver?.address || "",
      city: s.receiver?.city || "",
      pincode: s.receiver?.pincode || "",
    },
    package: {
      type: s.contents || "Parcel",
      weight: s.weight ? `${s.weight} kg` : "N/A",
      description: s.contents || "",
      codAmount: s.codAmount ? `₹${s.codAmount}` : "-",
      declaredValue: s.declaredValue ? `₹${s.declaredValue}` : "-",
    },
    service: {
      type: s.mode || "Surface",
      payment: s.paymentMode === "cod" ? "COD" : "Prepaid",
    },
    timeline: {
      reported: s.updatedAt ? new Date(s.updatedAt).toLocaleString() : "",
      lastUpdated: s.updatedAt ? new Date(s.updatedAt).toLocaleString() : "",
      sla: "",
    },
    investigation: {
      status: "not_started",
      assignedTo: null,
      attempts: 0,
      lastAttempt: null,
      notes: "",
    },
    risk: {
      level: mapRiskLevel(s),
      score: mapRiskScore(s),
      factors: s.paymentMode === "cod" ? ["cod_shipment"] : [],
    },
    financial: {
      potentialLoss: s.codAmount ? `₹${s.codAmount}` : "₹0",
      insuranceCovered: s.declaredValue ? `₹${s.declaredValue}` : "₹0",
      resolutionCost: "₹0",
    },
  };
};

const MissingPOD = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [pods, setPods] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(fallbackStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPOD, setSelectedPOD] = useState<any>(null);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [resolving, setResolving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      // Fetch delivered shipments
      const res = await axios.get(`${API_BASE}/api/shipments`, {
        headers,
        params: { status: "DELIVERED", limit: 100 },
      });
      const rawShipments = res.data?.data || res.data?.shipments || res.data || [];
      const arr = Array.isArray(rawShipments) ? rawShipments : [];
      // Filter out shipments that already have a POD
      let missing: any[] = [];
      for (const s of arr) {
        try {
          await axios.get(`${API_BASE}/api/pods/awb/${s.awb}`, { headers });
          // POD exists, skip
        } catch {
          // No POD found - this is a missing POD
          missing.push(s);
        }
      }
      const mapped = missing.map(mapMissingPOD);
      setPods(mapped);
      setSelectedPOD(mapped[0] || null);

      // Compute stats
      const totalMissing = mapped.length;
      const highRisk = mapped.filter((m) => m.risk.level === "high").length;
      const codShipments = mapped.filter((m) => m.service.payment === "COD");
      const financialRisk = codShipments.reduce((sum, m) => {
        const amt = parseInt(m.package.codAmount.replace(/[₹,]/g, "")) || 0;
        return sum + amt;
      }, 0);
      setStats({
        totalMissing,
        pendingResolution: totalMissing,
        resolvedToday: 0,
        escalatedCases: highRisk,
        avgResolutionTime: "N/A",
        successRate: 0,
        financialRisk: `₹${financialRisk.toLocaleString("en-IN")}`,
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to load missing POD data";
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
    const matchesPriority =
      priorityFilter === "all" || pod.priority === priorityFilter;
    const matchesRisk = riskFilter === "all" || pod.risk.level === riskFilter;
    const matchesTab = activeTab === "all" || pod.status === activeTab;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesRisk &&
      matchesTab
    );
  });

  const handleResolve = (pod: any) => {
    setShowResolutionModal(true);
  };

  const submitResolution = async (resolutionData?: any) => {
    if (!selectedPOD) return;
    setResolving(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      // Capture a POD for this shipment to resolve the missing POD
      await axios.post(
        `${API_BASE}/api/pods`,
        {
          shipmentId: selectedPOD._id,
          awb: selectedPOD.awbNumber,
          deliveryStatus: "DELIVERED",
          deliveredTo: {
            name: selectedPOD.receiver.name,
            phone: selectedPOD.receiver.phone,
            relation: "Self",
          },
          remarks: resolutionData?.notes || "POD resolved via missing POD investigation",
          location: {
            address: selectedPOD.receiver.address,
          },
          deliveryDate: new Date(),
          captureDevice: "web",
        },
        { headers }
      );
      toast.success(`POD captured for ${selectedPOD.awbNumber}`);
      setShowResolutionModal(false);
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to resolve missing POD");
    } finally {
      setResolving(false);
    }
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
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-red-100 p-2">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Missing POD
              </h1>
              <p className="text-muted-foreground">
                Track and resolve shipments with missing proof of delivery
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 rounded-xl border-border/70"
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand">
            <Plus className="h-4 w-4" />
            New Investigation
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <MissingPODStats stats={stats} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Filters */}
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

      {/* Status Tabs */}
      <StatusTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        data={pods}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* POD List */}
        <div className="xl:col-span-1 space-y-4">
          <PODList
            pods={filteredPODs}
            selectedPOD={selectedPOD}
            onSelectPOD={setSelectedPOD}
            statusConfig={statusConfig}
            priorityConfig={priorityConfig}
            riskConfig={riskConfig}
          />
        </div>

        {/* Case Details */}
        <div className="xl:col-span-2 space-y-6">
          <CaseDetails
            pod={selectedPOD}
            statusConfig={statusConfig}
            priorityConfig={priorityConfig}
            riskConfig={riskConfig}
            investigationConfig={investigationConfig}
            onResolve={handleResolve}
          />
        </div>
      </div>

      {/* Resolution Modal */}
      {showResolutionModal && (
        <ResolutionModal
          onClose={() => setShowResolutionModal(false)}
          onSubmit={submitResolution}
        />
      )}
    </div>
  );
};

export default MissingPOD;
