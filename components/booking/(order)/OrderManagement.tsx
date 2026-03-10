"use client";

import { useState } from "react";
import { Package, Download, Plus, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStats } from "./OrderStats";
import { OrderFilters } from "./OrderFilters";
import { OrderTabs } from "./OrderTabs";
import { OrderCard } from "./OrderCard";
import { Order } from "./types";
import { Clock, Truck, MapPin, CheckCircle2, AlertTriangle } from "lucide-react";

// Mock data for orders - Enhanced with SOW fields
export const ordersData: Order[] = [
  {
    id: "ORD-001",
    awbNumber: "HJD292412504",
    sender: {
      name: "Aqib",
      phone: "8601677140",
      address: "Delhi, India",
      pincode: "110094",
      gstin: "07AABCU9603R1ZM"
    },
    receiver: {
      name: "Aqib Khan", 
      phone: "8601677140",
      address: "Delhi, India",
      pincode: "110094",
      gstin: "07AABCU9603R1ZN"
    },
    package: {
      weight: "5 kg",
      volumetricWeight: "6 kg",
      actualWeight: "5.2 kg",
      type: "Parcel",
      description: "Electronics items - Mobile Phone",
      invoiceValue: "₹15,000",
      freightValue: "₹462.56"
    },
    service: {
      type: "Standard",
      mode: "Surface",
      payment: "COD",
      codAmount: "₹500",
      charges: "₹462.56"
    },
    status: "booked",
    bookedDate: "2024-12-10 23:36",
    lastUpdated: "2 mins ago",
    qrCode: "HJD292412504",
    eWayBill: "EWB240312345678",
    partner: "Delhi Central Hub",
    rider: "Rider-001"
  },
  {
    id: "ORD-002",
    awbNumber: "HJD292412505",
    sender: {
      name: "Rajesh Kumar",
      phone: "9876543210",
      address: "Mumbai, Maharashtra",
      pincode: "400001",
      gstin: "27AABCU9603R1ZO"
    },
    receiver: {
      name: "Priya Singh",
      phone: "9876543211", 
      address: "Bangalore, Karnataka",
      pincode: "560001",
      gstin: "29AABCU9603R1ZP"
    },
    package: {
      weight: "2 kg",
      volumetricWeight: "2.5 kg",
      actualWeight: "2.1 kg",
      type: "Document",
      description: "Important documents",
      invoiceValue: "₹2,000",
      freightValue: "₹300.00"
    },
    service: {
      type: "Express",
      mode: "Air",
      payment: "Prepaid",
      codAmount: "-",
      charges: "₹300.00"
    },
    status: "in-transit",
    bookedDate: "2024-12-10 22:15",
    lastUpdated: "15 mins ago",
    qrCode: "HJD292412505",
    eWayBill: "EWB240312345679",
    partner: "Mumbai West Hub",
    rider: "Rider-002"
  },
  {
    id: "ORD-003", 
    awbNumber: "HJD292412506",
    sender: {
      name: "Tech Solutions Ltd",
      phone: "9012345678",
      address: "Hyderabad, Telangana",
      pincode: "500001",
      gstin: "36AABCU9603R1ZQ"
    },
    receiver: {
      name: "Global Enterprises",
      phone: "9012345679",
      address: "Chennai, Tamil Nadu",
      pincode: "600001",
      gstin: "33AABCU9603R1ZR"
    },
    package: {
      weight: "10 kg",
      volumetricWeight: "12 kg",
      actualWeight: "10.5 kg",
      type: "Electronics",
      description: "Laptop and accessories",
      invoiceValue: "₹85,000",
      freightValue: "₹1,200.00"
    },
    service: {
      type: "Same Day",
      mode: "Air",
      payment: "Credit",
      codAmount: "-",
      charges: "₹1,200.00"
    },
    status: "out-for-delivery",
    bookedDate: "2024-12-10 21:30",
    lastUpdated: "1 hour ago",
    qrCode: "HJD292412506",
    eWayBill: "EWB240312345680",
    partner: "Hyderabad Tech Hub",
    rider: "Rider-003"
  },
  {
    id: "ORD-004",
    awbNumber: "HJD292412507",
    sender: {
      name: "Fashion Store",
      phone: "8899776655", 
      address: "Pune, Maharashtra",
      pincode: "411001",
      gstin: "27AABCU9603R1ZS"
    },
    receiver: {
      name: "Customer Care",
      phone: "8899776656",
      address: "Kolkata, West Bengal",
      pincode: "700001",
      gstin: "19AABCU9603R1ZT"
    },
    package: {
      weight: "3 kg",
      volumetricWeight: "4 kg",
      actualWeight: "3.2 kg",
      type: "Clothing",
      description: "Clothing items",
      invoiceValue: "₹12,000",
      freightValue: "₹240.00"
    },
    service: {
      type: "Next Day",
      mode: "Surface",
      payment: "COD",
      codAmount: "₹1,500",
      charges: "₹240.00"
    },
    status: "delivered",
    bookedDate: "2024-12-10 20:45",
    lastUpdated: "3 hours ago",
    qrCode: "HJD292412507",
    eWayBill: "EWB240312345681",
    partner: "Pune Central Hub",
    rider: "Rider-004"
  },
  {
    id: "ORD-005",
    awbNumber: "HJD292412508",
    sender: {
      name: "Book Store",
      phone: "7766554433",
      address: "Ahmedabad, Gujarat",
      pincode: "380001",
      gstin: "24AABCU9603R1ZU"
    },
    receiver: {
      name: "Student Center",
      phone: "7766554434",
      address: "Delhi, India",
      pincode: "110001",
      gstin: "07AABCU9603R1ZV"
    },
    package: {
      weight: "8 kg",
      volumetricWeight: "9 kg",
      actualWeight: "8.3 kg",
      type: "Fragile",
      description: "Glass items - Handle with care",
      invoiceValue: "₹6,000",
      freightValue: "₹180.00"
    },
    service: {
      type: "Economy",
      mode: "Surface",
      payment: "To Pay",
      codAmount: "₹800",
      charges: "₹180.00"
    },
    status: "exception",
    bookedDate: "2024-12-10 19:20",
    lastUpdated: "5 hours ago",
    qrCode: "HJD292412508",
    eWayBill: "EWB240312345682",
    partner: "Ahmedabad North Hub",
    rider: "Rider-005"
  }
];

export const statusConfig = {
  booked: { 
    label: "Booked", 
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Clock 
  },
  "in-transit": { 
    label: "In Transit", 
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: Truck 
  },
  "out-for-delivery": { 
    label: "Out for Delivery", 
    color: "bg-orange-50 text-orange-700 border-orange-200",
    icon: MapPin 
  },
  delivered: { 
    label: "Delivered", 
    color: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle2 
  },
  exception: { 
    label: "Exception", 
    color: "bg-red-50 text-red-700 border-red-200",
    icon: AlertTriangle 
  },
};

export const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const filteredOrders = ordersData.filter((order) => {
    const matchesSearch =
      order.awbNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.receiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.sender.gstin.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesTab = activeTab === "all" || order.status === activeTab;

    return matchesSearch && matchesStatus && matchesTab;
  });

  return (
    <div className="space-y-7 p-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-2">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Order Management
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Manage shipments, track deliveries, and handle multi-vendor
            operations with GST-compliant billing
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 rounded-xl border-border/70"
          >
            <Download className="h-4 w-4" />
            Export Reports
          </Button>
          <Button className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand hover:shadow-brand-lg">
            <Plus className="h-4 w-4" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <OrderStats orders={ordersData} />

      {/* Enhanced Filters and Search */}
      <OrderFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />

      {/* Enhanced Status Tabs */}
      <OrderTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        orders={ordersData}
      />

      {/* Enhanced Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}

        {filteredOrders.length === 0 && (
          <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No orders found
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchTerm || statusFilter !== "all"
                  ? "No orders match your current search criteria. Try adjusting your filters."
                  : "Start managing your delivery operations by creating your first booking."}
              </p>
              <Button className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand">
                <Plus className="h-4 w-4" />
                Create New Booking
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};