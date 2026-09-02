"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { liveTrackingData as fallbackData, trackingStats as fallbackStats } from "./data/mockData";
import {
  statusConfig,
  priorityConfig,
  confidenceConfig,
} from "./data/statusConfig";
import HeaderSection from "./HeaderSection";
import StatsSection from "./StatsSection";
import ShipmentsList from "./ShipmentsList";
import TrackingDetails from "./TrackingDetails";
import { Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const formatDate = (dateString: any) => {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB").replace(",", "");
};

const mapShipmentToTracking = (shipment: any, trackingData?: any) => {
  const history = shipment.history || [];
  const milestones = history.map((h: any, idx: number) => ({
    id: String(idx + 1),
    status: idx < history.length - 1 ? "completed" : "current",
    title: h.status?.replace(/_/g, " ")?.replace(/\b\w/g, (c: string) => c.toUpperCase()) || "Status Update",
    location: h.remark || "",
    timestamp: formatDate(h.timestamp),
    description: h.remark || "",
  }));

  const currentLocation = trackingData?.currentLocation || null;

  return {
    id: shipment._id || shipment.awb,
    awbNumber: shipment.awb,
    status: shipment.status || "not_scheduled",
    currentStatus: shipment.status?.replace(/_/g, " ")?.replace(/\b\w/g, (c: string) => c.toUpperCase()) || "Unknown",
    priority: shipment.paymentMode === "cod" ? "high" : "medium",
    sender: {
      name: shipment.sender?.name || "—",
      phone: shipment.sender?.phone || "—",
      address: shipment.sender?.address || "—",
      city: shipment.sender?.city || "—",
      pincode: shipment.sender?.pincode || "—",
    },
    receiver: {
      name: shipment.receiver?.name || "—",
      phone: shipment.receiver?.phone || "—",
      address: shipment.receiver?.address || "—",
      city: shipment.receiver?.city || "—",
      pincode: shipment.receiver?.pincode || "—",
    },
    package: {
      type: shipment.contents || "Parcel",
      weight: shipment.weight ? `${shipment.weight} kg` : "—",
      description: shipment.contents || "—",
      codAmount: shipment.codAmount ? `₹${shipment.codAmount}` : "—",
      dimensions: shipment.dimensions
        ? `${shipment.dimensions.length || 0}x${shipment.dimensions.width || 0}x${shipment.dimensions.height || 0} cm`
        : "—",
    },
    service: {
      type: "Surface",
      payment: shipment.paymentMode?.toUpperCase() || "PREPAID",
    },
    tracking: {
      currentLocation: currentLocation
        ? {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            address: currentLocation.address || "—",
            timestamp: formatDate(currentLocation.updatedAt),
            speed: currentLocation.speed ? `${currentLocation.speed} km/h` : "—",
          }
        : null,
      route: {
        origin: shipment.sender?.city || "—",
        destination: shipment.receiver?.city || "—",
        totalDistance: "—",
        distanceCovered: "—",
        distanceRemaining: "—",
      },
      eta: {
        predicted: formatDate(shipment.deliveredAt),
        confidence: "medium",
        updatedAt: formatDate(shipment.updatedAt),
      },
      carrier: trackingData?.rider
        ? {
            name: trackingData.rider.name || "—",
            phone: "—",
            vehicle: "—",
            partner: "—",
          }
        : null,
      milestones: milestones.length > 0 ? milestones : [
        {
          id: "1",
          status: "current",
          title: "Shipment Created",
          location: shipment.sender?.city || "—",
          timestamp: formatDate(shipment.createdAt),
          description: "Shipment booked",
        },
      ],
    },
  };
};

const LiveTracking = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [shipments, setShipments] = useState<any[]>([]);
  const [trackingMap, setTrackingMap] = useState<Record<string, any>>({});
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalActive: 0,
    inTransit: 0,
    outForDelivery: 0,
    delayed: 0,
    deliveredToday: 0,
    avgDeliveryTime: "—",
    onTimeRate: "—",
  });

  const fetchTrackingStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE}/api/tracking/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats({
        totalActive: data.activeRiders || 0,
        inTransit: data.activeDrs || 0,
        outForDelivery: data.onlineRiders || 0,
        delayed: 0,
        deliveredToday: 0,
        avgDeliveryTime: "—",
        onTimeRate: "—",
      });
    } catch (error) {
      console.error("Failed to load tracking stats", error);
    }
  }, []);

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${API_BASE}/api/shipments?status=in_transit,in_progress,scheduled,not_scheduled,forwarded,received`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const shipmentList = Array.isArray(data) ? data : [];
      const mapped = shipmentList.map((s: any) => mapShipmentToTracking(s));
      setShipments(mapped);

      // Fetch tracking details for each shipment in parallel (limit to first 20)
      const activeAwbs = shipmentList.slice(0, 20).map((s: any) => s.awb).filter(Boolean);
      const trackingResults = await Promise.allSettled(
        activeAwbs.map((awb: string) =>
          axios.get(`${API_BASE}/api/tracking/awb/${awb}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      const newTrackingMap: Record<string, any> = {};
      trackingResults.forEach((result, idx) => {
        if (result.status === "fulfilled" && result.value.data) {
          newTrackingMap[activeAwbs[idx]] = result.value.data;
        }
      });
      setTrackingMap(newTrackingMap);

      // Re-map with tracking data
      const mappedWithTracking = shipmentList.map((s: any) =>
        mapShipmentToTracking(s, newTrackingMap[s.awb])
      );
      setShipments(mappedWithTracking);

      if (mappedWithTracking.length > 0 && !selectedShipment) {
        setSelectedShipment(mappedWithTracking[0]);
      }

      // Compute stats from shipments
      const inTransitCount = shipmentList.filter(
        (s: any) => s.status === "in_transit" || s.status === "in_progress"
      ).length;
      const outForDeliveryCount = shipmentList.filter(
        (s: any) => s.status === "scheduled" || s.status === "in_progress"
      ).length;
      setStats((prev) => ({
        ...prev,
        totalActive: shipmentList.length,
        inTransit: inTransitCount,
        outForDelivery: outForDeliveryCount,
      }));
    } catch (error) {
      console.error("Failed to load live tracking data", error);
      toast.error("Failed to load live tracking data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrackingStats();
    fetchShipments();
  }, [fetchTrackingStats, fetchShipments]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastUpdated(new Date());
      fetchShipments();
      fetchTrackingStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, fetchShipments, fetchTrackingStats]);

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.awbNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.receiver?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.receiver?.phone?.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || shipment.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || shipment.priority === priorityFilter;
    const matchesTab = activeTab === "all" || shipment.status === activeTab;

    return matchesSearch && matchesStatus && matchesPriority && matchesTab;
  });

  if (loading && shipments.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <HeaderSection
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        lastUpdated={lastUpdated}
      />

      <StatsSection stats={stats} />

      {/* Main Tracking Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Shipments List */}
        <div className="xl:col-span-1 space-y-4">
          <ShipmentsList
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            filteredShipments={filteredShipments}
            selectedShipment={selectedShipment}
            setSelectedShipment={setSelectedShipment}
            lastUpdated={lastUpdated}
          />
        </div>

        {/* Tracking Details */}
        <div className="xl:col-span-2 space-y-6">
          <TrackingDetails
            selectedShipment={selectedShipment}
            lastUpdated={lastUpdated}
            setLastUpdated={setLastUpdated}
          />
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
