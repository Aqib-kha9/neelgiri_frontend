"use client";

import { useState, useEffect } from "react";
import HeaderSection from "./HeaderSection";
import PerformanceOverview from "./PerformanceOverview";
import AnalyticsSummary from "./AnalyticsSummary";
import FiltersSection from "./FiltersSection";
import StatusTabs from "./StatusTabs";
import DRSContent from "./DRSContent";
// Live data fetched from API
import { ExportDialog } from "../shared/ActionDialogs";
import { EditDRSDialog } from "../shared/EditDRSDialog"; // Import Dialog
import { DirectCompleteTable } from "../shared/DirectCompleteTable";

const DRSHistory = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riderFilter, setRiderFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");

  // Real Data State
  const [drsHistoryData, setDrsHistoryData] = useState<any[]>([]);
  const [selectedDRS, setSelectedDRS] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [viewMode, setViewMode] = useState("detailed");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const [branches, setBranches] = useState<any[]>([]);

  // Fetch Completed DRS History
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/drs/list?status=completed', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((d: any) => ({
            id: d._id,
            drsNumber: d.drsId,
            rider: d.rider || { name: 'Unknown', phone: 'N/A' },
            vehicleMode: d.vehicleMode,
            pincodes: d.pincodes || [],
            shipments: d.shipments,
            stats: d.stats || { totalShipments: 0, totalCOD: 0 },
            status: d.status,
            date: new Date(d.createdAt).toLocaleDateString(),
            scheduledDate: d.scheduledDate,
            branchId: d.branchId
          }));
          setDrsHistoryData(mapped);
        }
      } catch (e) {
        console.error("Failed to fetch history", e);
      }
    };
    fetchHistory();
    fetchUserRole();
    fetchBranches();
  }, []);

  const fetchUserRole = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role || "");
      }
    } catch (error) {
      console.error("Error parsing token:", error);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await fetch('/api/branches?purpose=dropdown', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBranches(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewDetails = (drs: any) => {
    setSelectedDRS(drs);
    setIsViewDialogOpen(true);
  };

  const filteredDRS = drsHistoryData.filter((drs) => {
    const matchesSearch =
      drs.drsNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drs.rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drs.rider.phone.includes(searchTerm);

    const matchesStatus = statusFilter === "all" || drs.status === statusFilter;
    const matchesRider = riderFilter === "all" || drs.rider.id === riderFilter || drs.rider._id === riderFilter;
    const matchesTab = activeTab === "all" || drs.status === activeTab;
    const matchesBranch = branchFilter === "all" ||
      (drs.branchId?._id ? drs.branchId._id === branchFilter : drs.branchId === branchFilter);

    return matchesSearch && matchesStatus && matchesBranch && matchesTab && matchesRider;
  });

  // Calculate Real-time Analytics
  const liveAnalytics = {
    totalDRS: drsHistoryData.length,
    completedDRS: drsHistoryData.filter(d => d.status === 'completed').length,
    cancellationRate: (drsHistoryData.filter(d => d.status === 'cancelled').length / (drsHistoryData.length || 1)) * 100,
    averageEfficiency: drsHistoryData.length > 0
      ? drsHistoryData.reduce((acc, d) => acc + (d.performance?.efficiency || 85), 0) / drsHistoryData.length
      : 0,
    totalRevenue: drsHistoryData.reduce((acc, d) => acc + (d.stats?.totalCOD || 0), 0),
    onTimeDelivery: drsHistoryData.length > 0
      ? (drsHistoryData.filter(d => d.performance?.onTimeRate >= 90).length / drsHistoryData.length) * 100
      : 0,
    customerSatisfaction: 4.5, // Default for now
    peakPerformance: {
      rider: drsHistoryData[0]?.rider?.name || 'N/A',
      efficiency: 95,
      deliveries: 120
    }
  };

  return (
    <div className="space-y-6 p-6">
      <HeaderSection
        viewMode={viewMode}
        setViewMode={setViewMode}
        onExport={() => setIsExportOpen(true)}
      />
      <PerformanceOverview performanceStats={liveAnalytics} />
      <AnalyticsSummary performanceStats={liveAnalytics} />

      <FiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        riderFilter={riderFilter}
        setRiderFilter={setRiderFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        drsHistoryData={drsHistoryData}
        branchFilter={branchFilter}
        setBranchFilter={setBranchFilter}
        userRole={userRole}
        branches={branches}
      />

      <StatusTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        drsHistoryData={drsHistoryData}
      />

      <DRSContent
        filteredDRS={filteredDRS}
        selectedDRS={selectedDRS}
        setSelectedDRS={handleViewDetails}
        performanceStats={liveAnalytics}
      />

      <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />

      {/* Reused Edit Dialog in ReadOnly Mode */}
      <EditDRSDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        drs={selectedDRS}
        readOnly={true}
      />

      {/* Direct Complete Shipments Section */}
      <div className="mt-8 border-t pt-8">
        <DirectCompleteTable />
      </div>
    </div>
  );
};

export default DRSHistory;
