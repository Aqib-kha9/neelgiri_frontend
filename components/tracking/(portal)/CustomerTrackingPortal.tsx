"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import HeaderSection from "./HeaderSection";
import StatisticsCards from "./StatisticsCards";
import QuickActions from "./QuickActions";
import FiltersSection from "./FiltersSection";
import StatusTabs from "./StatusTabs";
import { DRSTable } from "@/components/drs/shared/DRSTable";
import { ExportDialog } from "@/components/drs/shared/ActionDialogs";
import { Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const mapShipmentToCustomerTracking = (shipment: any) => {
  const history = shipment.history || [];
  const lastHistory = history[history.length - 1];

  return {
    id: shipment._id || shipment.awb,
    awbNumber: shipment.awb,
    customer: {
      name: shipment.receiver?.name || "—",
      phone: shipment.receiver?.phone || "—",
      email: shipment.receiver?.email || "—",
      address: shipment.receiver?.address || "—",
      city: shipment.receiver?.city || "—",
      pincode: shipment.receiver?.pincode || "—",
    },
    package: {
      type: shipment.contents || "Parcel",
      weight: shipment.weight ? `${shipment.weight} kg` : "—",
      dimensions: shipment.dimensions
        ? `${shipment.dimensions.length || 0} x ${shipment.dimensions.width || 0} x ${shipment.dimensions.height || 0} cm`
        : "—",
      description: shipment.contents || "—",
      codAmount: shipment.codAmount ? `₹${shipment.codAmount}` : "—",
      declaredValue: shipment.declaredValue ? `₹${shipment.declaredValue}` : "—",
      serviceType: "Standard",
      paymentMode: shipment.paymentMode?.toUpperCase() || "PREPAID",
    },
    status: shipment.status || "not_scheduled",
    currentStatus: shipment.status?.replace(/_/g, " ")?.replace(/\b\w/g, (c: string) => c.toUpperCase()) || "Unknown",
    timeline: {
      shipped: shipment.createdAt
        ? new Date(shipment.createdAt).toLocaleString("en-GB").replace(",", "")
        : "—",
      expectedDelivery: shipment.deliveredAt
        ? new Date(shipment.deliveredAt).toLocaleString("en-GB").replace(",", "")
        : "—",
      lastUpdate: shipment.updatedAt
        ? new Date(shipment.updatedAt).toLocaleString("en-GB").replace(",", "")
        : "—",
    },
    deliveryAgent: {
      id: "—",
      name: "—",
      phone: "—",
      status: "—",
    },
    location: {
      current: lastHistory?.remark || "—",
      coordinates: "—",
      lastScan: shipment.updatedAt
        ? new Date(shipment.updatedAt).toLocaleString("en-GB").replace(",", "")
        : "—",
    },
    communication: {
      lastContact: "—",
      contactMethod: "—",
      nextUpdate: "—",
    },
    alerts: [],
  };
};

const CustomerTrackingPortal = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [trackingData, setTrackingData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const [stats, setStats] = useState({
    totalActive: 0,
    deliveredToday: 0,
    inTransit: 0,
    exceptions: 0,
    onTimeRate: 0,
    customerSatisfaction: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE}/api/shipments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const shipmentList = Array.isArray(data) ? data : [];
      const mapped = shipmentList.map(mapShipmentToCustomerTracking);
      setTrackingData(mapped);

      // Compute stats
      const today = new Date().toDateString();
      const deliveredToday = shipmentList.filter(
        (s: any) => s.status === "complete" && s.deliveredAt && new Date(s.deliveredAt).toDateString() === today
      ).length;
      const inTransit = shipmentList.filter(
        (s: any) => s.status === "in_transit" || s.status === "in_progress" || s.status === "forwarded"
      ).length;
      const total = shipmentList.length;
      const delivered = shipmentList.filter((s: any) => s.status === "complete").length;
      const onTimeRate = total > 0 ? Math.round((delivered / total) * 100) : 0;

      setStats({
        totalActive: total,
        deliveredToday,
        inTransit,
        exceptions: 0,
        onTimeRate,
        customerSatisfaction: 4.5,
      });
    } catch (error) {
      console.error("Failed to load tracking data", error);
      toast.error("Failed to load customer tracking data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredTracking = trackingData.filter((tracking) => {
    const matchesSearch =
      tracking.awbNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tracking.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tracking.customer?.phone?.includes(searchTerm) ||
      tracking.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || tracking.status === statusFilter;
    const matchesCity =
      cityFilter === "all" || tracking.customer?.city === cityFilter;
    const matchesTab = activeTab === "all" || tracking.status === activeTab;

    return matchesSearch && matchesStatus && matchesCity && matchesTab;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <HeaderSection onExport={() => setIsExportOpen(true)} />
      <StatisticsCards stats={stats} />
      <QuickActions />
      <FiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        cityFilter={cityFilter}
        setCityFilter={setCityFilter}
      />
      <StatusTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        trackingData={trackingData}
      />

      {/* Main Content */}
      <div className="space-y-6">
        <DRSTable data={filteredTracking} title="Tracking History" />
      </div>

      <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />
    </div>
  );
};

export default CustomerTrackingPortal;
