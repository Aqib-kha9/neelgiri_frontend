"use client";

import { useState } from "react";
import GSTHeader from "@/components/dashboard/gst-compliance/GSTHeader";
import ComplianceStats from "@/components/dashboard/gst-compliance/ComplianceStats";
import OverviewTab from "@/components/dashboard/gst-compliance/OverviewTab";
import BranchesTab from "@/components/dashboard/gst-compliance/BranchesTab";
import FilingsTab from "@/components/dashboard/gst-compliance/FilingsTab";
import AlertsTab from "@/components/dashboard/gst-compliance/AlertsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Building, FileText, AlertTriangle } from "lucide-react";

const ComplianceGST = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-7">
      <GSTHeader />
      <ComplianceStats />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-7"
      >
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 rounded-2xl bg-muted/50 p-1">
          <TabsTrigger
            value="overview"
            className="rounded-xl data-[state=active]:bg-background text-xs lg:text-sm"
          >
            <BarChart3 className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="branches"
            className="rounded-xl data-[state=active]:bg-background text-xs lg:text-sm"
          >
            <Building className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
            Branches
          </TabsTrigger>
          <TabsTrigger
            value="filings"
            className="rounded-xl data-[state=active]:bg-background text-xs lg:text-sm"
          >
            <FileText className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
            GST Filings
          </TabsTrigger>
          <TabsTrigger
            value="alerts"
            className="rounded-xl data-[state=active]:bg-background text-xs lg:text-sm"
          >
            <AlertTriangle className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-7">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="branches" className="space-y-7">
          <BranchesTab />
        </TabsContent>

        <TabsContent value="filings" className="space-y-7">
          <FilingsTab />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-7">
          <AlertsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceGST;
