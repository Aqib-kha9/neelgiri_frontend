"use client";

import { useState, useEffect } from "react";
import DRSHeader from "./DRSHeader";
import DRSStats from "./DRSStats";
import MonitoringTools from "./MonitoringTools";
import FiltersSection from "./FiltersSection";
import StatusTabs from "./StatusTabs";
import DRSContent from "./DRSContent";
import { EditDRSDialog } from "../shared/EditDRSDialog";
import { ImportDialog, ExportDialog } from "../shared/ActionDialogs";

const ActiveDRS = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riderFilter, setRiderFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");

  // Restored State
  const [selectedDRS, setSelectedDRS] = useState<any>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingDRS, setEditingDRS] = useState<any>(null);

  const [drsList, setDrsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  const [branches, setBranches] = useState<any[]>([]);

  // Fetch DRS Data
  const fetchDRS = async () => {
    try {
      const res = await fetch('/api/drs/list', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Map backend data
        // Map backend data - RESTORE FULL OBJECTS
        const mapped = data.map((d: any) => ({
          ...d,
          id: d._id,
          drsNumber: d.drsId,
          rider: {
            id: d.rider?._id,
            name: d.rider?.name || 'Unknown',
            phone: d.rider?.phone || ''
          },
          date: new Date(d.createdAt).toLocaleDateString(),
          // Preserve full shipments for detail view with safe parsing
          shipments: d.shipments.map((s: any) => typeof s === 'string' ? { awb: s, status: 'pending' } : s),
        }));
        setDrsList(mapped);
        if (mapped.length > 0) setSelectedDRS(mapped[0]);
      }
    } catch (error) {
      console.error("Failed to fetch DRS", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDRS();
    fetchUserRole();
    fetchBranches();
  }, [autoRefresh]);

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

  const filteredDRS = drsList.filter((drs) => {
    // Exclude completed DRS from Active page (logic was already here)
    if (drs.status === "completed") return false;

    const matchesSearch =
      drs.drsNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drs.rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drs.rider.phone.includes(searchTerm);

    const matchesStatus = statusFilter === "all" || drs.status === statusFilter;
    const matchesRider = riderFilter === "all" || drs.rider.id === riderFilter;
    const matchesTab = activeTab === "all" || drs.status === activeTab;
    const matchesBranch = branchFilter === "all" || drs.branchId?._id === branchFilter || drs.branchId === branchFilter;

    return matchesSearch && matchesStatus && matchesRider && matchesTab && matchesBranch;
  });

  const handleEdit = (drs: any) => {
    setEditingDRS(drs);
    setIsEditOpen(true);
  };

  // Calculate Real-time Stats
  const liveStats = {
    totalActive: drsList.filter(d => d.status === 'active' || d.status === 'in_progress').length,
    completedToday: drsList.filter(d => d.status === 'completed').length, // Should be 0 on active page usually
    totalRiders: new Set(drsList.map(d => d.rider?.id)).size,
    averageEfficiency: 0, // Placeholder for now
    totalCODCollection: drsList.reduce((acc, d) => acc + (d.stats?.totalCOD || 0), 0),
    onTimeDelivery: 0,
    pendingShipments: drsList.reduce((acc, d) => acc + (d.stats?.pendingShipments || 0), 0),
    activeRiders: new Set(drsList.filter(d => d.status === 'active' || d.status === 'in_progress').map(d => d.rider?.id)).size,
  };

  return (
    <div className="space-y-6 p-6">
      <DRSHeader
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        onImport={() => setIsImportOpen(true)}
        onExport={() => setIsExportOpen(true)}
      />

      <DRSStats stats={liveStats} />

      <MonitoringTools />

      <FiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        riderFilter={riderFilter}
        setRiderFilter={setRiderFilter}
        branchFilter={branchFilter}
        setBranchFilter={setBranchFilter}
        userRole={userRole}
        branches={branches}
      />

      <StatusTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeDRSData={drsList}
      />

      <DRSContent
        filteredDRS={filteredDRS}
        selectedDRS={selectedDRS}
        setSelectedDRS={setSelectedDRS}
        onEdit={handleEdit}
        onRefresh={fetchDRS}
      />

      <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
      <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />
      <EditDRSDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        drs={editingDRS}
        onSuccess={fetchDRS}
      />
    </div>
  );
};

export default ActiveDRS;
