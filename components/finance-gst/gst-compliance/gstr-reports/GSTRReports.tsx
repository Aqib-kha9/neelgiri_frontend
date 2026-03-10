"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileText, Download, Upload, Search, X, MoreHorizontal, Eye, RefreshCw } from "lucide-react";
import { ImportDialog } from "../../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../../warehouse/(inventory)/ExportDialog";
import { gstrStats, gstrReports } from "./mockData";

const GSTRReports = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [typeFilter, setTypeFilter] = useState("all-types");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);

    const filteredData = gstrReports.filter((report) => {
        const matchesSearch =
            report.period.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.reportType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (report.arn && report.arn.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === "all-status" || report.status === statusFilter;
        const matchesType = typeFilter === "all-types" || report.reportType === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    return (
        <div className="space-y-7">
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">GST Compliance</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">GSTR Reports</h1>
                            <p className="max-w-2xl text-body">Manage and track all GST return filings. View filing history, download reports, and monitor compliance.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                                <FileText className="h-3.5 w-3.5 text-primary" />36 returns filed
                            </span>
                            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                                <RefreshCw className="h-3.5 w-3.5 text-success" />94.4% on-time
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <Button variant="outline" className="gap-2 rounded-lg border-border/70" onClick={() => setIsExportOpen(true)}>
                                <Download className="h-4 w-4" />Export
                            </Button>
                            <Button variant="outline" className="gap-2 rounded-lg border-border/70" onClick={() => setIsImportOpen(true)}>
                                <Upload className="h-4 w-4" />Import
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {gstrStats.map((stat, index) => (
                    <Card key={index} className="relative overflow-hidden rounded-2xl border-border/70 bg-card/95 shadow-card">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                    <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">{stat.value}</div>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <stat.icon className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${stat.trend === "up" ? "bg-success/15 text-success" : "bg-error/15 text-error"}`}>
                                    {stat.change}
                                </span>
                                <span className="text-xs text-muted-foreground">{stat.description}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="rounded-2xl border-border/70 bg-card/50 p-4 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by period, type, or ARN..."
                            className="h-10 w-full rounded-xl bg-background/50 pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="h-10 w-[160px] rounded-xl">
                                <SelectValue placeholder="Report Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-types">All Types</SelectItem>
                                <SelectItem value="GSTR-1">GSTR-1</SelectItem>
                                <SelectItem value="GSTR-3B">GSTR-3B</SelectItem>
                                <SelectItem value="GSTR-9">GSTR-9</SelectItem>
                                <SelectItem value="GSTR-9C">GSTR-9C</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-10 w-[160px] rounded-xl">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-status">All Status</SelectItem>
                                <SelectItem value="filed">Filed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                                <SelectItem value="revised">Revised</SelectItem>
                            </SelectContent>
                        </Select>
                        {(searchQuery || statusFilter !== "all-status" || typeFilter !== "all-types") && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setSearchQuery("");
                                    setStatusFilter("all-status");
                                    setTypeFilter("all-types");
                                }}
                                className="h-10 w-10 rounded-xl"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">GST Returns</CardTitle>
                    <p className="text-xs text-muted-foreground">Complete filing history and reports</p>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[120px]">Report Type</TableHead>
                                    <TableHead>Period</TableHead>
                                    <TableHead>Financial Year</TableHead>
                                    <TableHead>Taxable Amount</TableHead>
                                    <TableHead>CGST</TableHead>
                                    <TableHead>SGST</TableHead>
                                    <TableHead>Total Tax</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Filing Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={11} className="h-24 text-center">No reports found.</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData.map((report) => (
                                        <TableRow key={report.id} className="group hover:bg-muted/20">
                                            <TableCell>
                                                <Badge variant="outline" className="rounded-full font-semibold">
                                                    {report.reportType}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium text-foreground">{report.period}</p>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-muted-foreground">{report.financialYear}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium">₹{report.taxableAmount.toLocaleString("en-IN")}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">₹{report.cgst.toLocaleString("en-IN")}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">₹{report.sgst.toLocaleString("en-IN")}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-foreground">₹{report.totalTax.toLocaleString("en-IN")}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">{new Date(report.dueDate).toLocaleDateString("en-IN")}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">
                                                    {report.filingDate ? new Date(report.filingDate).toLocaleDateString("en-IN") : "-"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        report.status === "filed" ? "success" :
                                                            report.status === "overdue" ? "error" :
                                                                report.status === "revised" ? "warning" :
                                                                    "secondary"
                                                    }
                                                    className="rounded-full"
                                                >
                                                    {report.status === "filed" ? "Filed" :
                                                        report.status === "overdue" ? "Overdue" :
                                                            report.status === "revised" ? "Revised" :
                                                                "Pending"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-lg">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                                                                <Eye className="h-4 w-4" />View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                                                                <Download className="h-4 w-4" />Download Report
                                                            </DropdownMenuItem>
                                                            {report.status === "pending" && (
                                                                <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                                                                    <FileText className="h-4 w-4" />File Return
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
            <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />
        </div>
    );
};

export default GSTRReports;
