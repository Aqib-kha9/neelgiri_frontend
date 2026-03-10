'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Filter, Plus, Download, Upload, MoreHorizontal, Eye, Edit, FileText, Trash2 } from "lucide-react";

const branchesCompliance = [
  {
    id: "BR-001",
    name: "Mumbai Central Hub",
    gstin: "27AABCU9603R1ZM",
    state: "Maharashtra",
    complianceStatus: "compliant" as const,
    gstStatus: "filed" as const,
    lastFiling: "2024-11-30",
    nextDeadline: "2024-12-20",
    taxLiability: 2.8,
    penalties: 0,
    alerts: 0,
    documents: 12
  },
  {
    id: "BR-002",
    name: "Delhi North Gateway",
    gstin: "07AABCU9603R1ZN",
    state: "Delhi",
    complianceStatus: "compliant" as const,
    gstStatus: "filed" as const,
    lastFiling: "2024-11-30",
    nextDeadline: "2024-12-20",
    taxLiability: 1.9,
    penalties: 0,
    alerts: 1,
    documents: 10
  },
  // ... include other branches as needed
];

const complianceData = {
  overview: {
    totalBranches: 48
  }
};

const formatCurrency = (amount: number) => {
  return `₹${amount.toFixed(1)}L`;
};

const getComplianceStatusBadge = (status: string) => {
  switch (status) {
    case "compliant":
      return <Badge variant="success" className="rounded-full">Compliant</Badge>;
    case "non_compliant":
      return <Badge variant="error" className="rounded-full">Non-Compliant</Badge>;
    case "pending":
      return <Badge variant="warning" className="rounded-full">Pending</Badge>;
    default:
      return <Badge variant="secondary" className="rounded-full">Unknown</Badge>;
  }
};

const getGSTStatusBadge = (status: string) => {
  switch (status) {
    case "filed":
      return <Badge variant="success" className="rounded-full">Filed</Badge>;
    case "pending":
      return <Badge variant="warning" className="rounded-full">Pending</Badge>;
    case "overdue":
      return <Badge variant="error" className="rounded-full">Overdue</Badge>;
    case "filed_late":
      return <Badge variant="warning" className="rounded-full">Filed Late</Badge>;
    default:
      return <Badge variant="secondary" className="rounded-full">Unknown</Badge>;
  }
};

const BranchesTab = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBranches = branchesCompliance.filter((branch) => {
    const statusMatch =
      selectedStatus === "all" || branch.complianceStatus === selectedStatus;
    const searchMatch =
      searchQuery === "" ||
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.gstin.includes(searchQuery);
    return statusMatch && searchMatch;
  });

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 items-center gap-3 lg:gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search branches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl pl-10 text-sm"
                />
              </div>
              <Button
                variant="outline"
                className="gap-2 rounded-xl border-border/70 text-sm"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="rounded-lg w-32 lg:w-40 text-sm">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Button className="gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand text-sm">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Branch GST</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branches Compliance Table */}
      <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
        <CardHeader className="flex flex-row items-center justify-between p-4 lg:p-6">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Branch Compliance Status
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {filteredBranches.length} branches found •{" "}
              {complianceData.overview.totalBranches} total branches
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-2 rounded-lg border-border/70 text-sm"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-lg border-border/70 text-sm"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Bulk Update</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">
                    Branch & GSTIN
                  </TableHead>
                  <TableHead className="min-w-[100px]">State</TableHead>
                  <TableHead className="min-w-[120px]">
                    Compliance Status
                  </TableHead>
                  <TableHead className="min-w-[100px]">GST Status</TableHead>
                  <TableHead className="min-w-[100px]">Tax Liability</TableHead>
                  <TableHead className="min-w-[90px]">Penalties</TableHead>
                  <TableHead className="min-w-[80px]">Alerts</TableHead>
                  <TableHead className="min-w-[120px]">Next Deadline</TableHead>
                  <TableHead className="min-w-[80px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBranches.map((branch) => (
                  <TableRow key={branch.id} className="group hover:bg-muted/20">
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground text-sm">
                          {branch.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          GSTIN: {branch.gstin}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ID: {branch.id}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-full text-xs">
                        {branch.state}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getComplianceStatusBadge(branch.complianceStatus)}
                    </TableCell>
                    <TableCell>{getGSTStatusBadge(branch.gstStatus)}</TableCell>
                    <TableCell>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-foreground">
                          {formatCurrency(branch.taxLiability)}
                        </p>
                        <p className="text-xs text-muted-foreground">Current</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`text-center ${
                          branch.penalties > 0 ? "text-error" : "text-success"
                        }`}
                      >
                        <p className="text-sm font-semibold">
                          {formatCurrency(branch.penalties)}
                        </p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-foreground">
                          {branch.alerts}
                        </p>
                        <p className="text-xs text-muted-foreground">Active</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm text-foreground">
                          {new Date(branch.nextDeadline).toLocaleDateString(
                            "en-IN"
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {branch.documents} documents
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-lg h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="rounded-xl"
                          >
                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-sm">
                              <Eye className="h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-sm">
                              <Edit className="h-4 w-4" />
                              Edit GSTIN
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-sm">
                              <FileText className="h-4 w-4" />
                              File Return
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-sm">
                              <Download className="h-4 w-4" />
                              Download Certificates
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-error text-sm">
                              <Trash2 className="h-4 w-4" />
                              Remove GSTIN
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchesTab;