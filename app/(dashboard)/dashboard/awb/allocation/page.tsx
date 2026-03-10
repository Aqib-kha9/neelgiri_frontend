"use client";

import { useState } from "react";
import { Truck, Plus, Download, AlertCircle, Clock, Building, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Import components
import {
  StatsOverview,
  QuickActions,
  FiltersSection,
  StatusTabs,
  AllocationCard,
  AllocationAnalytics,
  NewAllocationModal,
} from "@/components/awb/(allocation)";

const allocationData = [
  {
    id: "ALLOC-001",
    series: {
      id: "SERIES-001",
      name: "E-commerce Primary",
      prefix: "HJD",
      seriesCode: "2924",
      startRange: 1250001,
      endRange: 1251000,
      current: 1250345,
    },
    allocatedTo: {
      type: "branch",
      id: "BR-001",
      name: "Bangalore Central Hub",
      code: "BLR-CENTRAL",
      contact: {
        person: "Rajesh Kumar",
        phone: "9876543210",
        email: "rajesh@bangalorehub.com",
      },
      address: {
        street: "45 MG Road",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001",
        country: "India",
      },
      capacity: {
        daily: 500,
        monthly: 15000,
      },
    },
    allocation: {
      type: "branch",
      date: "2024-11-01",
      validUntil: "2025-01-01",
      autoRenew: true,
      allocatedBy: "Admin User",
      notes: "Primary allocation for Bangalore operations",
    },
    usage: {
      used: 344,
      available: 656,
      percentage: 34.4,
      lastUsed: "2024-12-11 14:30",
      dailyAverage: 45,
      monthlyUsage: 1344,
    },
    status: "active",
    restrictions: {
      serviceType: ["Surface", "Air", "Express"],
      paymentType: ["Prepaid", "COD"],
      maxWeight: "25 kg",
      specialHandling: false,
    },
    performance: {
      utilizationRate: 78.5,
      successRate: 99.2,
      lastMonthUsage: 1200,
    },
    financial: {
      ratePerShipment: "₹15",
      creditLimit: "₹50,000",
      usedCredit: "₹12,450",
      billingCycle: "Monthly",
    },
  },
  {
    id: "ALLOC-002",
    series: {
      id: "SERIES-002",
      name: "Corporate Bulk",
      prefix: "HJD",
      seriesCode: "2925",
      startRange: 1252001,
      endRange: "1253000",
      current: 1252001,
    },
    allocatedTo: {
      type: "partner",
      id: "PART-001",
      name: "Tech Solutions Ltd",
      code: "TECH-SOL",
      contact: {
        person: "Priya Singh",
        phone: "9876543211",
        email: "priya@techsolutions.com",
      },
      address: {
        street: "78 Electronics City",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560100",
        country: "India",
      },
      capacity: {
        daily: 200,
        monthly: 6000,
      },
    },
    allocation: {
      type: "partner",
      date: "2024-12-01",
      validUntil: "2025-03-01",
      autoRenew: true,
      allocatedBy: "Admin User",
      notes: "Corporate partner for bulk shipments",
    },
    usage: {
      used: 0,
      available: 1000,
      percentage: 0,
      lastUsed: null,
      dailyAverage: 0,
      monthlyUsage: 0,
    },
    status: "active",
    restrictions: {
      serviceType: ["Express", "Air"],
      paymentType: ["Credit"],
      maxWeight: "50 kg",
      specialHandling: true,
    },
    performance: {
      utilizationRate: 0,
      successRate: 0,
      lastMonthUsage: 0,
    },
    financial: {
      ratePerShipment: "₹12",
      creditLimit: "₹1,00,000",
      usedCredit: "₹0",
      billingCycle: "Monthly",
    },
  },
  {
    id: "ALLOC-003",
    series: {
      id: "SERIES-003",
      name: "International Export",
      prefix: "HJD",
      seriesCode: "2926",
      startRange: 1253001,
      endRange: 1253500,
      current: 1253125,
    },
    allocatedTo: {
      type: "branch",
      id: "BR-002",
      name: "Mumbai International Hub",
      code: "BOM-INTL",
      contact: {
        person: "Amit Sharma",
        phone: "9876543212",
        email: "amit@mumbaihub.com",
      },
      address: {
        street: "23 Nariman Point",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400021",
        country: "India",
      },
      capacity: {
        daily: 300,
        monthly: 9000,
      },
    },
    allocation: {
      type: "branch",
      date: "2024-10-15",
      validUntil: "2024-12-31",
      autoRenew: false,
      allocatedBy: "Admin User",
      notes: "International shipments only",
    },
    usage: {
      used: 124,
      available: 376,
      percentage: 24.8,
      lastUsed: "2024-12-11 12:15",
      dailyAverage: 15,
      monthlyUsage: 450,
    },
    status: "expiring_soon",
    restrictions: {
      serviceType: ["International"],
      paymentType: ["Prepaid"],
      maxWeight: "30 kg",
      specialHandling: true,
    },
    performance: {
      utilizationRate: 45.2,
      successRate: 98.7,
      lastMonthUsage: 380,
    },
    financial: {
      ratePerShipment: "₹25",
      creditLimit: "₹75,000",
      usedCredit: "₹18,600",
      billingCycle: "Weekly",
    },
  },
  {
    id: "ALLOC-004",
    series: {
      id: "SERIES-004",
      name: "Retail COD",
      prefix: "HJD",
      seriesCode: "2927",
      startRange: 1254001,
      endRange: 1254500,
      current: 1254450,
    },
    allocatedTo: {
      type: "partner",
      id: "PART-002",
      name: "Retail Mart Chain",
      code: "RETAIL-MART",
      contact: {
        person: "Sneha Patel",
        phone: "9876543213",
        email: "sneha@retailmart.com",
      },
      address: {
        street: "56 Commercial Street",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001",
        country: "India",
      },
      capacity: {
        daily: 150,
        monthly: 4500,
      },
    },
    allocation: {
      type: "partner",
      date: "2024-09-01",
      validUntil: "2024-12-31",
      autoRenew: true,
      allocatedBy: "Admin User",
      notes: "High volume COD partner",
    },
    usage: {
      used: 449,
      available: 51,
      percentage: 89.8,
      lastUsed: "2024-12-11 16:45",
      dailyAverage: 85,
      monthlyUsage: 2550,
    },
    status: "near_exhaustion",
    restrictions: {
      serviceType: ["Surface"],
      paymentType: ["COD"],
      maxWeight: "10 kg",
      specialHandling: false,
    },
    performance: {
      utilizationRate: 92.3,
      successRate: 99.5,
      lastMonthUsage: 2400,
    },
    financial: {
      ratePerShipment: "₹18",
      creditLimit: "₹25,000",
      usedCredit: "₹23,850",
      billingCycle: "Weekly",
    },
  },
  {
    id: "ALLOC-005",
    series: {
      id: "SERIES-005",
      name: "Express Priority",
      prefix: "HJD",
      seriesCode: "2929",
      startRange: 1256001,
      endRange: 1257000,
      current: 1256001,
    },
    allocatedTo: {
      type: "branch",
      id: "BR-003",
      name: "Delhi Express Hub",
      code: "DEL-EXP",
      contact: {
        person: "Rohit Verma",
        phone: "9876543214",
        email: "rohit@delhihub.com",
      },
      address: {
        street: "12 Connaught Place",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110001",
        country: "India",
      },
      capacity: {
        daily: 400,
        monthly: 12000,
      },
    },
    allocation: {
      type: "branch",
      date: "2024-12-01",
      validUntil: "2025-06-01",
      autoRenew: true,
      allocatedBy: "Admin User",
      notes: "Express and priority shipments",
    },
    usage: {
      used: 0,
      available: 1000,
      percentage: 0,
      lastUsed: null,
      dailyAverage: 0,
      monthlyUsage: 0,
    },
    status: "active",
    restrictions: {
      serviceType: ["Express", "Air"],
      paymentType: ["Prepaid", "COD", "Credit"],
      maxWeight: "15 kg",
      specialHandling: false,
    },
    performance: {
      utilizationRate: 0,
      successRate: 0,
      lastMonthUsage: 0,
    },
    financial: {
      ratePerShipment: "₹20",
      creditLimit: "₹0",
      usedCredit: "₹0",
      billingCycle: "Monthly",
    },
  },
  {
    id: "ALLOC-006",
    series: {
      id: "SERIES-007",
      name: "Warehouse Clearance",
      prefix: "HJD",
      seriesCode: "2930",
      startRange: 1257001,
      endRange: 1257500,
      current: 1257321,
    },
    allocatedTo: {
      type: "partner",
      id: "PART-003",
      name: "Clearance Hub",
      code: "CLEAR-HUB",
      contact: {
        person: "Anil Gupta",
        phone: "9876543215",
        email: "anil@clearancehub.com",
      },
      address: {
        street: "34 Industrial Area",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600044",
        country: "India",
      },
      capacity: {
        daily: 100,
        monthly: 3000,
      },
    },
    allocation: {
      type: "partner",
      date: "2024-08-01",
      validUntil: "2024-11-30",
      autoRenew: false,
      allocatedBy: "Admin User",
      notes: "Expired allocation - clearance partner",
    },
    usage: {
      used: 320,
      available: 180,
      percentage: 64,
      lastUsed: "2024-11-30 18:00",
      dailyAverage: 40,
      monthlyUsage: 1200,
    },
    status: "expired",
    restrictions: {
      serviceType: ["Surface"],
      paymentType: ["Prepaid"],
      maxWeight: "20 kg",
      specialHandling: false,
    },
    performance: {
      utilizationRate: 65.8,
      successRate: 97.8,
      lastMonthUsage: 1100,
    },
    financial: {
      ratePerShipment: "₹10",
      creditLimit: "₹15,000",
      usedCredit: "₹14,200",
      billingCycle: "Monthly",
    },
  },
];

// Mock data for available series
const availableSeries = [
  {
    id: "SERIES-006",
    name: "Internal Testing",
    prefix: "HJD",
    seriesCode: "2928",
    startRange: 1255001,
    endRange: 1255100,
    current: 1255001,
    available: 100,
    restrictions: {
      serviceType: ["Surface", "Air", "Express"],
      paymentType: ["Prepaid"],
      maxWeight: "5 kg",
    },
  },
  {
    id: "SERIES-008",
    name: "New Corporate Series",
    prefix: "HJD",
    seriesCode: "2931",
    startRange: 1258001,
    endRange: 1259000,
    current: 1258001,
    available: 1000,
    restrictions: {
      serviceType: ["Express", "Air"],
      paymentType: ["Credit", "Prepaid"],
      maxWeight: "25 kg",
    },
  },
];

// Mock data for branches and partners
const branchesPartners = [
  {
    id: "BR-004",
    type: "branch",
    name: "Hyderabad South Hub",
    code: "HYD-SOUTH",
    city: "Hyderabad",
    state: "Telangana",
    capacity: {
      daily: 250,
      monthly: 7500,
    },
    currentAllocations: 2,
    status: "active",
  },
  {
    id: "PART-004",
    type: "partner",
    name: "Quick Ship Logistics",
    code: "QUICK-SHIP",
    city: "Pune",
    state: "Maharashtra",
    capacity: {
      daily: 180,
      monthly: 5400,
    },
    currentAllocations: 1,
    status: "active",
  },
];

const statusConfig = {
  active: {
    label: "Active",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle2,
  },
  expired: {
    label: "Expired",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: Clock,
  },
  suspended: {
    label: "Suspended",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: AlertCircle,
  },
  near_exhaustion: {
    label: "Near Exhaustion",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: AlertCircle,
  },
  expiring_soon: {
    label: "Expiring Soon",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Clock,
  },
};

const allocationTypeConfig = {
  branch: {
    label: "Branch",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Building,
  },
  partner: {
    label: "Partner",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Users,
  },
};

const serviceTypeConfig = {
  Surface: {
    label: "Surface",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  Air: { label: "Air", color: "bg-blue-50 text-blue-700 border-blue-200" },
  Express: {
    label: "Express",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  International: {
    label: "International",
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
};

const AWBAllocationPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showAllocationModal, setShowAllocationModal] = useState(false);

  const filteredAllocations = allocationData.filter((allocation) => {
    const matchesSearch =
      allocation.series.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.allocatedTo.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      allocation.allocatedTo.code
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      allocation.series.prefix.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || allocation.status === statusFilter;
    const matchesType =
      typeFilter === "all" || allocation.allocatedTo.type === typeFilter;
    const matchesTab = activeTab === "all" || allocation.status === activeTab;

    return matchesSearch && matchesStatus && matchesType && matchesTab;
  });

  const getStatusCount = (status: string) => {
    return allocationData.filter(
      (allocation) => status === "all" || allocation.status === status
    ).length;
  };

  const getTotalAllocated = () => allocationData.length;
  const getActiveAllocations = () =>
    allocationData.filter((a) => a.status === "active").length;
  const getNearExhaustionCount = () =>
    allocationData.filter((a) => a.status === "near_exhaustion").length;
  const getExpiringSoonCount = () =>
    allocationData.filter((a) => a.status === "expiring_soon").length;

  const statusCounts = {
    all: allocationData.length,
    active: getStatusCount("active"),
    near_exhaustion: getStatusCount("near_exhaustion"),
    expiring_soon: getStatusCount("expiring_soon"),
    expired: getStatusCount("expired"),
    suspended: getStatusCount("suspended"),
  };

  const handleDeleteAllocation = (id: string) => {
    console.log("Delete allocation:", id);
  };

  const handleRenewAllocation = (allocation: any) => {
    console.log("Renew allocation:", allocation);
  };

  const handleModifyAllocation = (allocation: any) => {
    console.log("Modify allocation:", allocation);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-100 p-2">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                AWB Allocation
              </h1>
              <p className="text-muted-foreground">
                Manage AWB series allocation to branches and partners
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
          <Button
            className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand"
            onClick={() => setShowAllocationModal(true)}
          >
            <Plus className="h-4 w-4" />
            New Allocation
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview
        totalAllocations={getTotalAllocated()}
        activeAllocations={getActiveAllocations()}
        nearExhaustionCount={getNearExhaustionCount()}
        expiringSoonCount={getExpiringSoonCount()}
      />

      {/* Quick Actions */}
      <QuickActions />

      {/* Filters and Search */}
      <FiltersSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />

      {/* Status Tabs */}
      <StatusTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        statusCounts={statusCounts}
      />

      {/* Allocations List */}
      <div className="space-y-4">
        {filteredAllocations.map((allocation) => (
          <AllocationCard
            key={allocation.id}
            allocation={allocation}
            onDelete={handleDeleteAllocation}
            onRenew={handleRenewAllocation}
            onModify={handleModifyAllocation}
          />
        ))}

        {filteredAllocations.length === 0 && (
          <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
            <CardContent className="p-12 text-center">
              <Truck className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No allocations found
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                  ? "No allocations match your current search criteria. Try adjusting your filters."
                  : "Get started by creating your first AWB allocation to a branch or partner."}
              </p>
              <Button
                className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand"
                onClick={() => setShowAllocationModal(true)}
              >
                <Plus className="h-4 w-4" />
                Create Allocation
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Allocation Analytics */}
      <AllocationAnalytics
        allocationData={allocationData}
        nearExhaustionCount={getNearExhaustionCount()}
      />

      {/* New Allocation Modal */}
      <NewAllocationModal
        isOpen={showAllocationModal}
        onClose={() => setShowAllocationModal(false)}
        availableSeries={availableSeries}
        branchesPartners={branchesPartners}
      />
    </div>
  );
};

export default AWBAllocationPage;
