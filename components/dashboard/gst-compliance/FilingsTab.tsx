"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  FileText,
  Edit,
} from "lucide-react";
import { CheckCircle2, Clock, AlertTriangle, IndianRupee } from "lucide-react";

const gstFilings = [
  {
    id: "GSTR-001",
    branch: "Mumbai Central Hub",
    period: "Nov 2024",
    type: "GSTR-3B",
    filedDate: "2024-12-05",
    dueDate: "2024-12-20",
    status: "filed" as const,
    taxAmount: 2.8,
    penalty: 0,
    receipt: "GSTR3B-784215",
  },
  {
    id: "GSTR-002",
    branch: "Delhi North Gateway",
    period: "Nov 2024",
    type: "GSTR-3B",
    filedDate: "2024-12-04",
    dueDate: "2024-12-20",
    status: "filed" as const,
    taxAmount: 1.9,
    penalty: 0,
    receipt: "GSTR3B-784216",
  },
  {
    id: "GSTR-003",
    branch: "Chennai Coastal Hub",
    period: "Oct 2024",
    type: "GSTR-3B",
    filedDate: "2024-11-25",
    dueDate: "2024-11-20",
    status: "filed_late" as const,
    taxAmount: 1.2,
    penalty: 0.25,
    receipt: "GSTR3B-784217",
  },
  {
    id: "GSTR-004",
    branch: "Hyderabad Tech City",
    period: "Nov 2024",
    type: "GSTR-1",
    filedDate: "",
    dueDate: "2024-12-11",
    status: "pending" as const,
    taxAmount: 0,
    penalty: 0,
    receipt: "",
  },
  {
    id: "GSTR-005",
    branch: "Pune IT Park",
    period: "Oct 2024",
    type: "GSTR-3B",
    filedDate: "",
    dueDate: "2024-11-20",
    status: "overdue" as const,
    taxAmount: 1.1,
    penalty: 0.15,
    receipt: "",
  },
  {
    id: "GSTR-006",
    branch: "Bangalore Tech Park",
    period: "Nov 2024",
    type: "GSTR-3B",
    filedDate: "2024-12-03",
    dueDate: "2024-12-20",
    status: "filed" as const,
    taxAmount: 1.7,
    penalty: 0,
    receipt: "GSTR3B-784218",
  },
];

const complianceData = {
  gstStatus: {
    filed: 44,
    pending: 3,
    overdue: 1,
  },
  overview: {
    totalBranches: 48,
  },
};

const formatCurrency = (amount: number) => {
  return `₹${amount.toFixed(1)}L`;
};

const getGSTStatusBadge = (status: string) => {
  switch (status) {
    case "filed":
      return (
        <Badge variant="success" className="rounded-full text-xs">
          Filed
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="warning" className="rounded-full text-xs">
          Pending
        </Badge>
      );
    case "overdue":
      return (
        <Badge variant="error" className="rounded-full text-xs">
          Overdue
        </Badge>
      );
    case "filed_late":
      return (
        <Badge variant="warning" className="rounded-full text-xs">
          Filed Late
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="rounded-full text-xs">
          Unknown
        </Badge>
      );
  }
};

const FilingsTab = () => {
  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
        <CardHeader className="flex flex-row items-center justify-between p-4 lg:p-6">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              GST Filing History
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Complete history of GST returns and filings across all branches
            </p>
          </div>
          <Button className="gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand text-sm">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Filing</span>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Filing ID</TableHead>
                  <TableHead className="min-w-[150px]">Branch</TableHead>
                  <TableHead className="min-w-[120px]">Period & Type</TableHead>
                  <TableHead className="min-w-[100px]">Filed Date</TableHead>
                  <TableHead className="min-w-[100px]">Due Date</TableHead>
                  <TableHead className="min-w-[100px]">Tax Amount</TableHead>
                  <TableHead className="min-w-[90px]">Penalty</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[80px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gstFilings.map((filing) => (
                  <TableRow key={filing.id} className="group hover:bg-muted/20">
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground text-sm">
                          {filing.id}
                        </p>
                        {filing.receipt && (
                          <p className="text-xs text-muted-foreground">
                            Receipt: {filing.receipt}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-foreground">
                        {filing.branch}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          {filing.period}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {filing.type}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-foreground">
                        {filing.filedDate
                          ? new Date(filing.filedDate).toLocaleDateString(
                              "en-IN"
                            )
                          : "-"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm text-foreground">
                          {new Date(filing.dueDate).toLocaleDateString("en-IN")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {filing.status === "overdue" && (
                            <span className="text-error">Overdue</span>
                          )}
                          {filing.status === "pending" && (
                            <span className="text-warning">Due soon</span>
                          )}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-foreground">
                          {filing.taxAmount > 0
                            ? formatCurrency(filing.taxAmount)
                            : "-"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`text-center ${
                          filing.penalty > 0 ? "text-error" : "text-success"
                        }`}
                      >
                        <p className="text-sm font-semibold">
                          {filing.penalty > 0
                            ? formatCurrency(filing.penalty)
                            : "-"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getGSTStatusBadge(filing.status)}</TableCell>
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
                              View Filing
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-sm">
                              <Download className="h-4 w-4" />
                              Download Receipt
                            </DropdownMenuItem>
                            {filing.status === "pending" && (
                              <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-sm">
                                <FileText className="h-4 w-4" />
                                File Now
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-sm">
                              <Edit className="h-4 w-4" />
                              Amend Return
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

      {/* Filing Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
          <CardContent className="p-4 lg:p-5">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-success/10 p-2 lg:p-3">
                  <CheckCircle2 className="h-5 w-5 lg:h-6 lg:w-6 text-success" />
                </div>
                <div>
                  <p className="text-xl lg:text-2xl font-bold text-foreground">
                    {complianceData.gstStatus.filed}
                  </p>
                  <p className="text-sm text-muted-foreground">Returns Filed</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {(
                  (complianceData.gstStatus.filed /
                    complianceData.overview.totalBranches) *
                  100
                ).toFixed(1)}
                % completion rate
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
          <CardContent className="p-4 lg:p-5">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-warning/10 p-2 lg:p-3">
                  <Clock className="h-5 w-5 lg:h-6 lg:w-6 text-warning" />
                </div>
                <div>
                  <p className="text-xl lg:text-2xl font-bold text-foreground">
                    {complianceData.gstStatus.pending}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Due in next 10 days
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
          <CardContent className="p-4 lg:p-5">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-error/10 p-2 lg:p-3">
                  <AlertTriangle className="h-5 w-5 lg:h-6 lg:w-6 text-error" />
                </div>
                <div>
                  <p className="text-xl lg:text-2xl font-bold text-foreground">
                    {complianceData.gstStatus.overdue}
                  </p>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Requires immediate attention
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
          <CardContent className="p-4 lg:p-5">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/10 p-2 lg:p-3">
                  <IndianRupee className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xl lg:text-2xl font-bold text-foreground">
                    {gstFilings
                      .reduce((acc, filing) => acc + filing.penalty, 0)
                      .toFixed(2)}
                    L
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Penalties
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Current financial year
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FilingsTab;
