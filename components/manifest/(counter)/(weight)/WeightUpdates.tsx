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
} from "lucide-react";

import { useState } from "react";
import WeightStats from "./WeightStats";
import WeightTools from "./WeightTools";
import WeightFilters from "./WeightFilters";
import WeightTabs from "./WeightTabs";
import WeightUpdateModal from "./WeightUpdateModal";
import { weightUpdatesData } from "./data";
import { Button } from "@/components/ui/button";
import { ManifestTable } from "../../shared/ManifestTable";
import { ExportDialog } from "@/components/drs/shared/ActionDialogs";

const WeightUpdates = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [hubFilter, setHubFilter] = useState("all");
  const [selectedWeight, setSelectedWeight] = useState(weightUpdatesData[0]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const filteredWeights = weightUpdatesData.filter((weight) => {
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

      {showUpdateModal && (
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
