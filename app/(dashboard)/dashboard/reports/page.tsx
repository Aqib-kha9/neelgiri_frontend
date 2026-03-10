"use client";

import { usePermissions } from "@/hooks/usePermissions";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, FileText, TrendingUp } from "lucide-react";

export default function ReportsPage() {
  const { allowedActions } = usePermissions();

  const reports = [
    {
      id: "1",
      name: "Order Summary Report",
      description: "Complete overview of all orders",
      type: "order",
    },
    {
      id: "2",
      name: "Delivery Performance",
      description: "Rider and branch performance metrics",
      type: "performance",
    },
    {
      id: "3",
      name: "GST Compliance Report",
      description: "Tax and compliance documentation",
      type: "gst",
    },
    {
      id: "4",
      name: "Settlement Report",
      description: "Financial settlement details",
      type: "settlement",
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Generate and download reports
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {report.name}
              </CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {allowedActions("report").includes("view") && (
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                )}
                {allowedActions("report").includes("export") && (
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                )}
                {allowedActions("report").includes("analytics") && (
                  <Button variant="outline" size="sm">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytics
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

