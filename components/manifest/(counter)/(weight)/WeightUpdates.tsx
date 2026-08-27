"use client";

import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Package,
  Scale,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Download,
  Upload,
  BarChart3,
  Calculator,
  Ruler,
  Weight,
  Edit,
  Eye,
  Copy,
  Trash2,
  ChevronDown,
  IndianRupee,
  QrCode,
  Shield,
  Zap,
  FileText,
  Loader2,
} from "lucide-react";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import WeightStats from "./WeightStats";
import WeightTools from "./WeightTools";
import WeightFilters from "./WeightFilters";
import WeightTabs from "./WeightTabs";
import WeightUpdateModal from "./WeightUpdateModal";
import { Button } from "@/components/ui/button";
import { ManifestTable } from "../../shared/ManifestTable";
import { ExportDialog } from "@/components/drs/shared/ActionDialogs";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

// Map backend Shipment to weight update display format
const mapShipmentToWeight = (s: any) => {
  const declaredWeight = s.weight || 0;
  const actualWeight = s.chargeableWeight || s.weight || 0;
  const dims = s.dimensions || {};
  const dimensionsStr = dims.length && dims.width && dims.height
    ? `${dims.length}x${dims.width}x${dims.height} cm`
    : "N/A";
  // Calculate volumetric weight (L*W*H / 5000 for surface, / 6000 for air)
  const volumetric = dims.length && dims.width && dims.height
    ? Math.round(((dims.length * dims.width * dims.height) / 5000) * 100) / 100
    : 0;

  const discrepancyAmount = Math.abs(actualWeight - declaredWeight);
  const discrepancyPct = declaredWeight > 0 ? Math.round((discrepancyAmount / declaredWeight) * 100) : 0;
  const hasDiscrepancy = discrepancyAmount > 0.5;

  let status = "verified";
  let priority = "low";
  if (hasDiscrepancy) {
    status = "discrepancy";
    priority = discrepancyPct > 20 ? "high" : "medium";
  } else if (!s.chargeableWeight) {
    status = "pending";
    priority = "medium";
  }

  const history = s.history || [];
  const receivedEntry = history.find((h: any) => h.status === "received" || h.status === "in_transit");
  const weighedEntry = history.find((h: any) => h.status === "forwarded" || h.status === "complete");

  return {
    id: s._id || s.awb,
    awbNumber: s.awb || "",
    status,
    priority,
    shipment: {
      type: s.contents || s.originType || "General",
      description: s.contents || "Package",
      dimensions: dimensionsStr,
      declaredValue: s.declaredValue ? `₹${s.declaredValue.toLocaleString()}` : "₹0",
      codAmount: s.codAmount ? `₹${s.codAmount.toLocaleString()}` : "-",
    },
    weights: {
      declared: declaredWeight,
      initial: declaredWeight,
      actual: actualWeight,
      volumetric,
      charged: s.chargeableWeight || 0,
    },
    discrepancy: {
      type: actualWeight > declaredWeight ? "overweight" : "underweight",
      amount: Math.round(discrepancyAmount * 100) / 100,
      percentage: discrepancyPct,
      severity: discrepancyPct > 20 ? "high" : discrepancyPct > 10 ? "medium" : "low",
    },
    charges: {
      declared: s.baseFreight ? `₹${s.baseFreight}` : "₹0",
      actual: s.totalCharges ? `₹${s.totalCharges}` : "₹0",
      difference: s.totalCharges && s.baseFreight ? `₹${s.totalCharges - s.baseFreight}` : "₹0",
      extraCharges: s.totalCharges && s.baseFreight ? `₹${Math.max(0, s.totalCharges - s.baseFreight)}` : "₹0",
    },
    processing: {
      hub: s.currentBranch?.name || s.originBranchId?.name || "Unknown",
      processedBy: null,
      processedAt: null,
      verified: !!s.chargeableWeight,
      scanned: true,
    },
    timeline: {
      received: receivedEntry?.timestamp ? new Date(receivedEntry.timestamp).toLocaleString() : "",
      weighed: weighedEntry?.timestamp ? new Date(weighedEntry.timestamp).toLocaleString() : "",
      lastUpdate: s.updatedAt ? new Date(s.updatedAt).toLocaleString() : "",
    },
    notes: history?.[0]?.remark || "",
  };
};

const WeightUpdates = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [hubFilter, setHubFilter] = useState("all");
  const [weights, setWeights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeight, setSelectedWeight] = useState<any>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const fetchWeights = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      // Fetch shipments that have been received/forwarded (weight processing stage)
      const res = await axios.get(`${API_BASE}/api/shipments`, { headers });
      const raw = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.shipments || []);
      const mapped = raw.map(mapShipmentToWeight);
      setWeights(mapped);
      if (mapped.length > 0 && !selectedWeight) {
        setSelectedWeight(mapped[0]);
      }
    } catch (error: any) {
      console.error("Failed to fetch weight updates:", error);
      toast.error(error?.response?.data?.message || "Failed to load weight updates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeights();
  }, [fetchWeights]);

  const filteredWeights = weights.filter((weight) => {
    const matchesSearch =
      weight.awbNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      weight.shipment.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || weight.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || weight.priority === priorityFilter;
    const matchesHub =
      hubFilter === "all" || weight.processing.hub === hubFilter;
    const matchesTab = activeTab === "all" || weight.status === activeTab;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesHub &&
      matchesTab
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-orange-100 p-2">
              <Scale className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Weight Updates
              </h1>
              <p className="text-muted-foreground">
                Update and correct shipment weights at hub processing
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 rounded-xl border-border/70"
            onClick={() => setShowExportDialog(true)}
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button
            className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand"
            onClick={() => setShowUpdateModal(true)}
          >
            <Plus className="h-4 w-4" />
            New Weight Entry
          </Button>
        </div>
      </div>

      <WeightStats />
      <WeightTools
        onBulkWeigh={() => console.log("Bulk Weighing")}
        onCalculator={() => console.log("Charge Calculator")}
        onVolumetricCalc={() => console.log("Volumetric Calc")}
        onAutoVerify={() => console.log("Auto Verify")}
      />
      <WeightFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        hubFilter={hubFilter}
        setHubFilter={setHubFilter}
      />
      <WeightTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="space-y-6">
        <ManifestTable
          title="Weight Updates"
          data={filteredWeights.map(w => ({
            ...w,
            awb: w.awbNumber,
            customer: w.shipment.type, // Mapping Type as Customer is missing
            phone: "N/A", // Phone missing
            weight: w.weights.actual || w.weights.declared,
            location: w.processing.hub,
            type: w.priority
          }))}
        />
      </div>

      {showUpdateModal && selectedWeight && (
        <WeightUpdateModal
          weight={selectedWeight}
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
        />
      )}

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onExport={(format) => {
          console.log(`Exporting weight report as ${format}`);
          setShowExportDialog(false);
        }}
      />
    </div>
  );
};

export default WeightUpdates;
