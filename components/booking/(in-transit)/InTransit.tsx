"use client";

import { useState } from "react";
import { Truck, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TransitStats } from "./TransitStats";
import { TransitFilters } from "./TransitFilters";
import { TransitTabs } from "./TransitTabs";
import { TransitCard } from "./TransitCard";
import { LiveMonitoring } from "./LiveMonitoring";
import { Shipment } from "./types";
import { Warehouse, Navigation, AlertCircle } from "lucide-react";

// Mock data for in-transit shipments
export const inTransitData: Shipment[] = [
  {
    id: "TRN-001",
    awbNumber: "HJD292412504",
    sender: {
      name: "Aqib",
      phone: "8601677140",
      city: "Delhi",
      pincode: "110094"
    },
    receiver: {
      name: "Aqib Khan",
      phone: "8601677140",
      city: "Bangalore", 
      pincode: "560001"
    },
    package: {
      type: "Parcel",
      weight: "5 kg",
      description: "Electronics items - Mobile Phone",
      declaredValue: "₹15,000"
    },
    service: {
      type: "Standard",
      payment: "COD",
      codAmount: "₹500",
      charges: "₹462.56"
    },
    currentStatus: "in_transit",
    transitRoute: [
      { location: "Delhi Hub", timestamp: "2024-12-10 23:36", status: "departed" },
      { location: "Gurgaon Sorting Center", timestamp: "2024-12-11 02:15", status: "processed" },
      { location: "Mumbai Gateway Hub", timestamp: "2024-12-11 08:30", status: "in_transit" },
      { location: "Bangalore Distribution", timestamp: "2024-12-11 14:00", status: "expected" }
    ],
    currentLocation: "Mumbai Gateway Hub",
    nextHub: "Bangalore Distribution",
    estimatedArrival: "2024-12-11 14:00",
    delay: 0,
    transportMode: "Air",
    vehicleId: "FLT-AI-784",
    driver: "Rajesh Kumar (DRV-004)",
    lastUpdated: "2 hours ago",
    temperature: "Normal",
    specialHandling: "Fragile",
    partner: "SwiftAir Express"
  },
  // ... include all other shipment data objects from the original file
];

export const statusConfig = {
  in_transit: { 
    label: "In Transit", 
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Truck
  },
  hub_processing: { 
    label: "Hub Processing", 
    color: "bg-orange-50 text-orange-700 border-orange-200",
    icon: Warehouse
  },
  delay: { 
    label: "Delayed", 
    color: "bg-red-50 text-red-700 border-red-200",
    icon: AlertCircle
  },
  out_for_delivery: { 
    label: "Out for Delivery", 
    color: "bg-green-50 text-green-700 border-green-200",
    icon: Navigation
  }
};

export const transportConfig = {
  Air: { label: "Air", color: "bg-purple-100 text-purple-800 border-purple-200" },
  Surface: { label: "Surface", color: "bg-gray-100 text-gray-800 border-gray-200" },
  Rail: { label: "Rail", color: "bg-yellow-100 text-yellow-800 border-yellow-200" }
};

export const InTransit = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [transportFilter, setTransportFilter] = useState("all");

  const filteredShipments = inTransitData.filter((shipment) => {
    const matchesSearch =
      shipment.awbNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.receiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.sender.phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || shipment.currentStatus === statusFilter;
    const matchesTransport =
      transportFilter === "all" || shipment.transportMode === transportFilter;
    const matchesTab =
      activeTab === "all" || shipment.currentStatus === activeTab;

    return matchesSearch && matchesStatus && matchesTransport && matchesTab;
  });

  return (
    <div className="space-y-7 p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-100 p-2">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">In Transit</h1>
              <p className="text-muted-foreground">
                Track shipments currently in movement between hubs and branches
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
            <RefreshCw className="h-4 w-4" />
            Refresh All
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <TransitStats shipments={inTransitData} />

      {/* Filters and Search */}
      <TransitFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        transportFilter={transportFilter}
        setTransportFilter={setTransportFilter}
      />

      {/* Status Tabs */}
      <TransitTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        shipments={inTransitData}
      />

      {/* In Transit Shipments */}
      <div className="space-y-4">
        {filteredShipments.map((shipment) => (
          <TransitCard key={shipment.id} shipment={shipment} />
        ))}

        {filteredShipments.length === 0 && (
          <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
            <CardContent className="p-12 text-center">
              <Truck className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No shipments in transit
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchTerm ||
                statusFilter !== "all" ||
                transportFilter !== "all"
                  ? "No shipments match your current search criteria. Try adjusting your filters."
                  : "All shipments have been delivered or are awaiting pickup."}
              </p>
              <Button className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand">
                <RefreshCw className="h-4 w-4" />
                Refresh Status
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Live Monitoring Panel */}
      <LiveMonitoring shipments={inTransitData} />
    </div>
  );
};