"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileText, Plus, Download, Upload, BarChart3, Search, X, MoreHorizontal, Eye, Edit, CheckCircle, Clock, AlertCircle, IndianRupee } from "lucide-react";
import { ImportDialog } from "../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../warehouse/(inventory)/ExportDialog";

const agreementStats = [
    { title: "Total Agreements", value: "156", change: "+12", trend: "up", icon: FileText, description: "Active contracts" },
    { title: "Active Agreements", value: "142", change: "+10", trend: "up", icon: CheckCircle, description: "Currently valid" },
    { title: "Expiring Soon", value: "8", change: "+3", trend: "down", icon: Clock, description: "Within 30 days" },
    { title: "Total Value", value: "₹95.2L", change: "+18%", trend: "up", icon: IndianRupee, description: "Contract value" },
];

const agreementData = [
    { id: "AGR-001", customerName: "TechCorp Solutions", agreementId: "TC-AGR-2024-001", type: "Annual", startDate: "2024-01-15", endDate: "2025-01-14", value: 850000, status: "active", renewalStatus: "auto-renew" },
    { id: "AGR-002", customerName: "RetailHub India", agreementId: "RH-AGR-2024-002", type: "Quarterly", startDate: "2024-10-01", endDate: "2024-12-31", value: 320000, status: "active", renewalStatus: "pending" },
    { id: "AGR-003", customerName: "FoodMart Chain", agreementId: "FM-AGR-2024-003", type: "Annual", startDate: "2024-03-20", endDate: "2025-03-19", value: 1200000, status: "active", renewalStatus: "auto-renew" },
    { id: "AGR-004", customerName: "Fashion Trends", agreementId: "FT-AGR-2024-004", type: "Monthly", startDate: "2024-12-01", endDate: "2024-12-31", value: 95000, status: "expiring", renewalStatus: "pending" },
    { id: "AGR-005", customerName: "MediCare Pharma", agreementId: "MP-AGR-2024-005", type: "Annual", startDate: "2023-11-10", endDate: "2024-11-09", value: 650000, status: "expired", renewalStatus: "none" },
];

const ServiceAgreements = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [typeFilter, setTypeFilter] = useState("all-types");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);

    const filteredData = agreementData.filter((agr) => {
        const matchesSearch = agr.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || agr.agreementId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all-status" || agr.status === statusFilter;
        const matchesType = typeFilter === "all-types" || agr.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    return (
        <div className="space-y-7">
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">Contract Management</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">Service Agreements</h1>
                            <p className="max-w-2xl text-body">Manage customer service agreements and contracts. Track renewals, expiration dates, and contract values.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                                <FileText className="h-3.5 w-3.5 text-primary" />156 agreements
                            </span>
                            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                                <BarChart3 className="h-3.5 w-3.5 text-success" />91% active
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <Button className="gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand">
                                <Plus className="h-4 w-4" />New Agreement
                            </Button>
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
                {agreementStats.map((stat, index) => (
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
                        <Input placeholder="Search agreements..." className="h-10 w-full rounded-xl bg-background/50 pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="h-10 w-[160px] rounded-xl">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-types">All Types</SelectItem>
                                <SelectItem value="Annual">Annual</SelectItem>
                                <SelectItem value="Quarterly">Quarterly</SelectItem>
                                <SelectItem value="Monthly">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-10 w-[160px] rounded-xl">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-status">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="expiring">Expiring</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                            </SelectContent>
                        </Select>
                        {(searchQuery || statusFilter !== "all-status" || typeFilter !== "all-types") && (
                            <Button variant="ghost" size="icon" onClick={() => { setSearchQuery(""); setStatusFilter("all-status"); setTypeFilter("all-types"); }} className="h-10 w-10 rounded-xl">
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Service Agreements</CardTitle>
                    <p className="text-xs text-muted-foreground">Customer service contracts</p>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[250px]">Customer</TableHead>
                                    <TableHead>Agreement ID</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead>Value</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow><TableCell colSpan={8} className="h-24 text-center">No agreements found.</TableCell></TableRow>
                                ) : (
                                    filteredData.map((agr) => (
                                        <TableRow key={agr.id} className="group hover:bg-muted/20">
                                            <TableCell><p className="font-semibold text-foreground">{agr.customerName}</p></TableCell>
                                            <TableCell><span className="text-sm text-muted-foreground">{agr.agreementId}</span></TableCell>
                                            <TableCell><Badge variant="secondary" className="rounded-full text-xs">{agr.type}</Badge></TableCell>
                                            <TableCell><span className="text-sm">{new Date(agr.startDate).toLocaleDateString("en-IN")}</span></TableCell>
                                            <TableCell><span className="text-sm">{new Date(agr.endDate).toLocaleDateString("en-IN")}</span></TableCell>
                                            <TableCell><span className="font-semibold">₹{(agr.value / 1000).toFixed(0)}K</span></TableCell>
                                            <TableCell>
                                                <Badge variant={agr.status === "active" ? "success" : agr.status === "expiring" ? "warning" : "error"} className="rounded-full">
                                                    {agr.status === "active" ? "Active" : agr.status === "expiring" ? "Expiring" : "Expired"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Eye className="h-4 w-4" />View Details</DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Edit className="h-4 w-4" />Edit Agreement</DropdownMenuItem>
                                                            {agr.status === "expiring" && <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-success"><CheckCircle className="h-4 w-4" />Renew</DropdownMenuItem>}
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

export default ServiceAgreements;
