"use client";

import { useState } from "react";
import { Package, Download, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PickupStats } from "./PickupStats";
import { PickupFilters } from "./PickupFilters";
import { PickupTabs } from "./PickupTabs";
import { RiderAssignmentModal } from "./RiderAssignmentModal";
import { PickupTable } from "./PickupTable";
import { AvailableRiders } from "./AvailableRiders";
import { Pickup, Rider } from "./types";
import { Clock, UserPlus as UserPlusIcon, Calendar, XCircle, CheckCircle, Truck, AlertCircle } from "lucide-react";

// Mock data for pending pickups
export const pendingPickupsData: Pickup[] = [
  {
    id: "PKP-001",
    awbNumber: "HJD292412504",
    sender: {
      name: "Aqib",
      phone: "8601677140",
      email: "aqib@example.com",
      address: "123 Main Street, Connaught Place",
      city: "Delhi",
      pincode: "110094",
      gstin: "07AABCU9603R1ZM"
    },
    receiver: {
      name: "Aqib Khan",
      phone: "8601677140", 
      email: "aqib.khan@example.com",
      address: "456 MG Road, Bangalore",
      city: "Bangalore",
      pincode: "560001",
      gstin: "29AABCU9603R1ZN"
    },
    package: {
      type: "Parcel",
      weight: "5 kg",
      dimensions: "30x20x15 cm",
      description: "Electronics items - Mobile Phone",
      declaredValue: "₹15,000",
      actualWeight: "5.2 kg"
    },
    service: {
      type: "Standard",
      payment: "COD",
      codAmount: "₹500",
      charges: "₹462.56"
    },
    status: "pending",
    priority: "high",
    bookingDate: "2024-12-10 23:36",
    preferredPickup: "2024-12-11 10:00-13:00",
    timeInState: "2 hours",
    assignedRider: "",
    pickupAttempts: 0,
    specialInstructions: "Call before pickup - Office building",
    documents: ["Invoice"],
    qrCode: "HJD292412504"
  },
  // ... include all other pickup data objects from the original file
];

export const ridersData: Rider[] = [
  { id: "Rider-001", name: "Amit Sharma", phone: "9876543210", status: "available", currentLoad: 3, maxLoad: 8 },
  { id: "Rider-002", name: "Raj Kumar", phone: "9876543211", status: "on_duty", currentLoad: 5, maxLoad: 8 },
  { id: "Rider-003", name: "Suresh Patel", phone: "9876543212", status: "available", currentLoad: 2, maxLoad: 8 },
  { id: "Rider-004", name: "Vikram Singh", phone: "9876543213", status: "on_break", currentLoad: 4, maxLoad: 8 },
  { id: "Rider-005", name: "Kumar Sanjay", phone: "9876543214", status: "available", currentLoad: 1, maxLoad: 8 },
];

export const statusConfig = {
  pending: { 
    label: "Pending Assignment", 
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: Clock
  },
  assigned: { 
    label: "Rider Assigned", 
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: UserPlusIcon
  },
  scheduled: { 
    label: "Pickup Scheduled", 
    color: "bg-orange-50 text-orange-700 border-orange-200",
    icon: Calendar
  },
  failed: { 
    label: "Pickup Failed", 
    color: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle
  },
  completed: { 
    label: "Picked Up", 
    color: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle
  }
};

export const priorityConfig = {
  high: { label: "High", color: "bg-red-100 text-red-800 border-red-200" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  low: { label: "Low", color: "bg-blue-100 text-blue-800 border-blue-200" }
};

export const PendingPickups = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedPickups, setSelectedPickups] = useState<string[]>([]);
  const [showRiderAssignment, setShowRiderAssignment] = useState(false);
  const [selectedRider, setSelectedRider] = useState("");

  const filteredPickups = pendingPickupsData.filter((pickup) => {
    const matchesSearch =
      pickup.awbNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pickup.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pickup.sender.phone.includes(searchTerm) ||
      pickup.receiver.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || pickup.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || pickup.priority === priorityFilter;
    const matchesTab = activeTab === "all" || pickup.status === activeTab;

    return matchesSearch && matchesStatus && matchesPriority && matchesTab;
  });

  const handleAssignRider = (pickupId: string, riderId: string) => {
    // In a real app, this would make an API call
    console.log(`Assigning rider ${riderId} to pickup ${pickupId}`);
    setShowRiderAssignment(false);
    setSelectedRider("");
  };

  const handleBulkAssign = () => {
    if (selectedPickups.length === 0 || !selectedRider) return;

    selectedPickups.forEach((pickupId) => {
      handleAssignRider(pickupId, selectedRider);
    });

    setSelectedPickups([]);
    setShowRiderAssignment(false);
  };

  const togglePickupSelection = (pickupId: string) => {
    setSelectedPickups((prev) =>
      prev.includes(pickupId)
        ? prev.filter((id) => id !== pickupId)
        : [...prev, pickupId]
    );
  };

  return (
    <div className="space-y-7 p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-orange-100 p-2">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Pending Pickups
              </h1>
              <p className="text-muted-foreground">
                Manage shipments awaiting pickup confirmation and rider
                allocation
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
            Export
          </Button>
          <Button
            className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand"
            onClick={() => setShowRiderAssignment(true)}
            disabled={selectedPickups.length === 0}
          >
            <UserPlus className="h-4 w-4" />
            Assign Rider ({selectedPickups.length})
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <PickupStats pickups={pendingPickupsData} riders={ridersData} />

      {/* Filters and Search */}
      <PickupFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

      {/* Status Tabs */}
      <PickupTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pickups={pendingPickupsData}
      />

      {/* Bulk Assignment Modal */}
      <RiderAssignmentModal
        showRiderAssignment={showRiderAssignment}
        setShowRiderAssignment={setShowRiderAssignment}
        selectedRider={selectedRider}
        setSelectedRider={setSelectedRider}
        selectedPickups={selectedPickups}
        riders={ridersData}
        onBulkAssign={handleBulkAssign}
      />

      {/* Pickups Table */}
      <PickupTable
        filteredPickups={filteredPickups}
        selectedPickups={selectedPickups}
        togglePickupSelection={togglePickupSelection}
        setSelectedPickups={setSelectedPickups}
      />

      {/* Available Riders Side Panel */}
      <AvailableRiders riders={ridersData} />
    </div>
  );
};