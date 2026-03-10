"use client";

import {
  TrendingUp,
  TrendingDown,
  Download,
  FileText,
  IndianRupee,
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import { FinancialHeader } from "@/components/dashboard/financial/FinancialHeader";
import { FinancialStatsGrid } from "@/components/dashboard/financial/FinancialStatsGrid";
import { RevenueGSTPanel } from "@/components/dashboard/financial/RevenueGSTPanel";
import { GSTBreakdownPanel } from "@/components/dashboard/financial/GSTBreakdownPanel";
import { AgingAnalysisPanel } from "@/components/dashboard/financial/AgingAnalysisPanel";
import { RecentInvoicesPanel } from "@/components/dashboard/financial/RecentInvoicesPanel";
import { GSTCompliancePanel } from "@/components/dashboard/financial/GSTCompliancePanel";

export default function Page() {
  // ===== original data (unchanged) =====
  const financialStats = [
    {
      title: "Total Revenue",
      value: "₹28.4L",
      changeLabel: "This month",
      changeValue: "+12.4%",
      trend: "up",
      icon: IndianRupee,
      color: "text-success",
    },
    {
      title: "GST Collected",
      value: "₹4.2L",
      changeLabel: "CGST + SGST + IGST",
      changeValue: "+8.2%",
      trend: "up",
      icon: Shield,
      color: "text-primary",
    },
    {
      title: "Collection Efficiency",
      value: "94.7",
      suffix: "%",
      changeLabel: "vs last month",
      changeValue: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-success",
    },
    {
      title: "Pending Payments",
      value: "₹3.8L",
      changeLabel: "Overdue > 30 days",
      changeValue: "₹84.2K",
      trend: "warning",
      icon: AlertTriangle,
      color: "text-warning",
    },
    {
      title: "Tax Liability",
      value: "₹3.1L",
      changeLabel: "Net payable",
      changeValue: "-12.8%",
      trend: "down",
      icon: FileText,
      color: "text-muted-foreground",
    },
    {
      title: "Input Tax Credit",
      value: "₹2.4L",
      changeLabel: "Available credit",
      changeValue: "+5.3%",
      trend: "up",
      icon: CheckCircle2,
      color: "text-success",
    },
  ];

  const gstBreakdown = [
    { name: "CGST", value: 42, color: "bg-primary" },
    { name: "SGST", value: 41, color: "bg-success" },
    { name: "IGST", value: 17, color: "bg-warning" },
  ];

  const revenueTrend = [
    { month: "Jan", revenue: 22.4, gst: 3.2 },
    { month: "Feb", revenue: 24.1, gst: 3.5 },
    { month: "Mar", revenue: 26.8, gst: 3.9 },
    { month: "Apr", revenue: 25.2, gst: 3.7 },
    { month: "May", revenue: 28.4, gst: 4.2 },
    { month: "Jun", revenue: 31.2, gst: 4.6 },
  ];

  const agingAnalysis = [
    { period: "Current", amount: 18.2, percentage: 48, color: "bg-success" },
    { period: "1-30 days", amount: 12.4, percentage: 33, color: "bg-warning" },
    { period: "31-60 days", amount: 5.8, percentage: 15, color: "bg-error" },
    { period: ">60 days", amount: 2.4, percentage: 4, color: "bg-destructive" },
  ];

  const recentInvoices = [
    {
      id: "INV-2841",
      customer: "TechNova Solutions",
      amount: "₹84,200",
      gst: "₹12,630",
      status: "paid",
      dueDate: "15 Dec 2024",
      type: "B2B",
    },
    {
      id: "INV-2842",
      customer: "Global Imports Ltd",
      amount: "₹1,24,800",
      gst: "₹18,720",
      status: "pending",
      dueDate: "18 Dec 2024",
      type: "B2B",
    },
    {
      id: "INV-2843",
      customer: "Metro Retail Chain",
      amount: "₹56,400",
      gst: "₹8,460",
      status: "overdue",
      dueDate: "10 Dec 2024",
      type: "B2B",
    },
    {
      id: "INV-2844",
      customer: "QuickServe Logistics",
      amount: "₹92,100",
      gst: "₹13,815",
      status: "paid",
      dueDate: "20 Dec 2024",
      type: "B2C",
    },
  ];

  const gstrFilingStatus = [
    {
      form: "GSTR-1",
      period: "Nov 2024",
      status: "filed",
      dueDate: "11 Dec",
      filedOn: "10 Dec 2024",
    },
    {
      form: "GSTR-3B",
      period: "Nov 2024",
      status: "pending",
      dueDate: "20 Dec",
      filedOn: "-",
    },
    {
      form: "GSTR-2A",
      period: "Oct 2024",
      status: "reconciled",
      dueDate: "15 Nov",
      filedOn: "14 Nov 2024",
    },
    {
      form: "GSTR-9",
      period: "FY 2023-24",
      status: "pending",
      dueDate: "31 Dec",
      filedOn: "-",
    },
  ];

  return (
    <div className="space-y-7">
      <FinancialHeader />

      <FinancialStatsGrid stats={financialStats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueGSTPanel data={revenueTrend} />
        <GSTBreakdownPanel data={gstBreakdown} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AgingAnalysisPanel data={agingAnalysis} />
        <RecentInvoicesPanel data={recentInvoices} />
      </div>

      <GSTCompliancePanel data={gstrFilingStatus} />
    </div>
  );
}
