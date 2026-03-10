"use client";

import { useState } from "react";
import { BarChart3, Plus, Download, PieChart, TrendingUp, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Import components
import {
  StatsOverview,
  QuickInsights,
  ReportTools,
  FiltersSection,
  StatusTabs,
  ReportCard,
  ReportAnalytics,
} from "@/components/awb/(usage)";

// Mock data (same as original)
const reportData = [
  {
    id: "REP-001",
    name: "Monthly AWB Usage Report - December 2024",
    type: "monthly",
    period: "2024-12-01 to 2024-12-31",
    generatedAt: "2024-12-31 23:59",
    generatedBy: "Admin User",
    status: "completed",
    size: "2.4 MB",
    recordCount: 15420,
    summary: {
      totalSeries: 15,
      totalAllocated: 125000,
      totalUsed: 89234,
      utilizationRate: 71.4,
      activeBranches: 8,
      activePartners: 12,
      revenue: "₹1,45,678",
    },
    filters: {
      dateRange: "Dec 1 - Dec 31, 2024",
      series: "All Series",
      allocationType: "All Types",
      status: "All Status",
    },
  },
  {
    id: "REP-002",
    name: "AWB Series Performance - Q4 2024",
    type: "quarterly",
    period: "2024-10-01 to 2024-12-31",
    generatedAt: "2025-01-05 10:30",
    generatedBy: "Analytics Team",
    status: "completed",
    size: "4.1 MB",
    recordCount: 45210,
    summary: {
      totalSeries: 18,
      totalAllocated: 385000,
      totalUsed: 298765,
      utilizationRate: 77.6,
      activeBranches: 10,
      activePartners: 15,
      revenue: "₹4,89,123",
    },
    filters: {
      dateRange: "Oct 1 - Dec 31, 2024",
      series: "All Series",
      allocationType: "All Types",
      status: "Active Only",
    },
  },
  {
    id: "REP-003",
    name: "Branch Allocation Report - Bangalore Hub",
    type: "branch",
    period: "2024-12-01 to 2024-12-31",
    generatedAt: "2024-12-31 18:45",
    generatedBy: "Branch Manager",
    status: "completed",
    size: "1.2 MB",
    recordCount: 8450,
    summary: {
      totalSeries: 3,
      totalAllocated: 15000,
      totalUsed: 12450,
      utilizationRate: 83.0,
      activeBranches: 1,
      activePartners: 0,
      revenue: "₹87,450",
    },
    filters: {
      dateRange: "Dec 1 - Dec 31, 2024",
      series: "HJD2924, HJD2925, HJD2926",
      allocationType: "Branch Only",
      status: "Active Only",
    },
  },
  {
    id: "REP-004",
    name: "Partner Performance Analysis",
    type: "partner",
    period: "2024-12-01 to 2024-12-31",
    generatedAt: "2024-12-31 20:15",
    generatedBy: "Partner Relations",
    status: "completed",
    size: "1.8 MB",
    recordCount: 11200,
    summary: {
      totalSeries: 8,
      totalAllocated: 45000,
      totalUsed: 38900,
      utilizationRate: 86.4,
      activeBranches: 0,
      activePartners: 8,
      revenue: "₹1,12,300",
    },
    filters: {
      dateRange: "Dec 1 - Dec 31, 2024",
      series: "Partner Series",
      allocationType: "Partner Only",
      status: "Active Only",
    },
  },
  {
    id: "REP-005",
    name: "AWB Reconciliation - Daily",
    type: "reconciliation",
    period: "2024-12-11",
    generatedAt: "2024-12-11 23:59",
    generatedBy: "System Auto",
    status: "completed",
    size: "0.8 MB",
    recordCount: 2450,
    summary: {
      totalSeries: 12,
      totalAllocated: 0,
      totalUsed: 2450,
      utilizationRate: 0,
      activeBranches: 8,
      activePartners: 12,
      revenue: "₹36,750",
    },
    filters: {
      dateRange: "Dec 11, 2024",
      series: "All Series",
      allocationType: "All Types",
      status: "All Status",
    },
  },
  {
    id: "REP-006",
    name: "Weekly Usage Trend",
    type: "weekly",
    period: "2024-12-08 to 2024-12-14",
    generatedAt: "2024-12-14 23:59",
    generatedBy: "Analytics Team",
    status: "processing",
    size: "0 MB",
    recordCount: 0,
    summary: {
      totalSeries: 0,
      totalAllocated: 0,
      totalUsed: 0,
      utilizationRate: 0,
      activeBranches: 0,
      activePartners: 0,
      revenue: "₹0",
    },
    filters: {
      dateRange: "Dec 8 - Dec 14, 2024",
      series: "All Series",
      allocationType: "All Types",
      status: "All Status",
    },
  },
  {
    id: "REP-007",
    name: "Expired Series Analysis",
    type: "analytical",
    period: "2024-01-01 to 2024-12-31",
    generatedAt: "2024-12-30 14:20",
    generatedBy: "Admin User",
    status: "failed",
    size: "0 MB",
    recordCount: 0,
    summary: {
      totalSeries: 0,
      totalAllocated: 0,
      totalUsed: 0,
      utilizationRate: 0,
      activeBranches: 0,
      activePartners: 0,
      revenue: "₹0",
    },
    filters: {
      dateRange: "Jan 1 - Dec 31, 2024",
      series: "Expired Series",
      allocationType: "All Types",
      status: "Expired Only",
    },
  },
];

// Mock data for real-time stats
const realTimeStats = {
  totalSeries: 25,
  activeSeries: 18,
  allocatedSeries: 22,
  totalAWBNumbers: 1250000,
  usedToday: 2450,
  availableNow: 456780,
  utilizationRate: 63.5,
  monthlyUsage: 89234,
  revenue: "₹1,45,678",
  branchesActive: 12,
  partnersActive: 18,
};

// Mock data for quick insights
const quickInsights = [
  {
    title: "Top Performing Series",
    value: "HJD2924",
    change: "+12.5%",
    description: "E-commerce Primary series showing highest growth",
    icon: TrendingUp,
    color: "text-green-600",
  },
  {
    title: "Utilization Rate",
    value: "71.4%",
    change: "+3.2%",
    description: "Overall AWB number utilization this month",
    icon: PieChart,
    color: "text-blue-600",
  },
  {
    title: "Daily Average Usage",
    value: "2,450",
    change: "+8.7%",
    description: "Average AWB numbers used per day",
    icon: BarChart3,
    color: "text-purple-600",
  },
  {
    title: "Revenue Generated",
    value: "₹1.45L",
    change: "+15.3%",
    description: "Total revenue from AWB usage this month",
    icon: IndianRupee,
    color: "text-green-600",
  },
];

const AWBUsageReportsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  const filteredReports = reportData.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.generatedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || report.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;
    const matchesTab = activeTab === "all" || report.type === activeTab;

    return matchesSearch && matchesType && matchesStatus && matchesTab;
  });

  const getStatusCount = (status: string) => {
    return reportData.filter(
      (report) => status === "all" || report.status === status
    ).length;
  };

  const getTypeCount = (type: string) => {
    return reportData.filter((report) => type === "all" || report.type === type)
      .length;
  };

  const getTotalReports = () => reportData.length;
  const getCompletedReports = () =>
    reportData.filter((r) => r.status === "completed").length;
  const getTotalRecords = () =>
    reportData.reduce((sum, report) => sum + report.recordCount, 0);
  const getTotalSize = () =>
    reportData
      .reduce((sum, report) => {
        const size = parseFloat(report.size) || 0;
        return sum + size;
      }, 0)
      .toFixed(1);

  const typeCounts = {
    all: getTotalReports(),
    monthly: getTypeCount("monthly"),
    quarterly: getTypeCount("quarterly"),
    branch: getTypeCount("branch"),
    partner: getTypeCount("partner"),
    reconciliation: getTypeCount("reconciliation"),
    weekly: getTypeCount("weekly"),
    analytical: getTypeCount("analytical"),
  };

  const handleGenerateReport = () => {
    console.log("Generate new report");
  };

  const handleDownloadReport = (reportId: string) => {
    console.log("Download report:", reportId);
  };

  const handleDeleteReport = (reportId: string) => {
    console.log("Delete report:", reportId);
  };

  const handleExportAll = () => {
    console.log("Export all reports");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-100 p-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                AWB Usage Reports
              </h1>
              <p className="text-muted-foreground">
                Generate comprehensive reports on AWB number usage and
                reconciliation
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
            Export All
          </Button>
          <Button
            className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand"
            onClick={handleGenerateReport}
          >
            <Plus className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Real-time Stats */}
      <StatsOverview realTimeStats={realTimeStats} />

      {/* Quick Insights */}
      <QuickInsights quickInsights={quickInsights} />

      {/* Report Generation Tools */}
      <ReportTools />

      {/* Filters and Search */}
      <FiltersSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* Status Tabs */}
      <StatusTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        typeCounts={typeCounts}
      />

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            onDownload={handleDownloadReport}
            onDelete={handleDeleteReport}
          />
        ))}

        {filteredReports.length === 0 && (
          <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
            <CardContent className="p-12 text-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No reports found
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                  ? "No reports match your current search criteria. Try adjusting your filters."
                  : "Get started by generating your first AWB usage report."}
              </p>
              <Button
                className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand"
                onClick={handleGenerateReport}
              >
                <Plus className="h-4 w-4" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Report Analytics */}
      <ReportAnalytics
        totalReports={getTotalReports()}
        completedReports={getCompletedReports()}
        totalRecords={getTotalRecords()}
        totalSize={getTotalSize()}
      />
    </div>
  );
};

export default AWBUsageReportsPage;
