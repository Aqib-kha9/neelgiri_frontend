"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Wrench, Plus, Download, Upload, BarChart3, Search, X, MoreHorizontal, Eye, Edit, Phone, Users, CheckCircle, Clock, IndianRupee } from "lucide-react";
import { ImportDialog } from "../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../warehouse/(inventory)/ExportDialog";
import { AddServicePartnerDialog } from "./AddServicePartnerDialog";

const serviceStats = [
    { title: "Total Partners", value: "32", change: "+4", trend: "up", icon: Users, description: "Service providers" },
    { title: "Active Services", value: "85", change: "+8", trend: "up", icon: Wrench, description: "Running services" },
    { title: "Pending Requests", value: "12", change: "+5", trend: "down", icon: Clock, description: "Awaiting approval" },
    { title: "Monthly Spend", value: "₹18.2L", change: "+12%", trend: "up", icon: IndianRupee, description: "This month" },
];

const serviceData = [
    { id: "SP-001", partnerName: "TechFix Solutions", partnerId: "TFS-2024-001", serviceType: "IT Support", location: "Delhi NCR", status: "active", activeContracts: 8, monthlySpend: 250000, rating: 4.7, contactPerson: "Rajesh Kumar", phone: "+91 98765 11111" },
    { id: "SP-002", partnerName: "CleanPro Services", partnerId: "CPS-2024-002", serviceType: "Cleaning", location: "Noida", status: "active", activeContracts: 12, monthlySpend: 150000, rating: 4.5, contactPerson: "Priya Sharma", phone: "+91 98765 22222" },
    { id: "SP-003", partnerName: "SecureGuard", partnerId: "SG-2024-003", serviceType: "Security", location: "Gurugram", status: "pending", activeContracts: 0, monthlySpend: 0, rating: 0, contactPerson: "Vikram Singh", phone: "+91 98765 33333" },
    { id: "SP-004", partnerName: "MaintainPro", partnerId: "MP-2024-004", serviceType: "Maintenance", location: "Delhi", status: "active", activeContracts: 6, monthlySpend: 180000, rating: 4.6, contactPerson: "Neha Gupta", phone: "+91 98765 44444" },
    { id: "SP-005", partnerName: "PackMasters", partnerId: "PM-2024-005", serviceType: "Packaging", location: "Ghaziabad", status: "inactive", activeContracts: 0, monthlySpend: 0, rating: 4.2, contactPerson: "Amit Verma", phone: "+91 98765 55555" },
];

const ServicePartners = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [serviceFilter, setServiceFilter] = useState("all-services");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);

    const filteredData = serviceData.filter((partner) => {
        const matchesSearch = partner.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) || partner.partnerId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all-status" || partner.status === statusFilter;
        const matchesService = serviceFilter === "all-services" || partner.serviceType === serviceFilter;
        return matchesSearch && matchesStatus && matchesService;
    });

    return (
        <div className="space-y-7">
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">Vendor Management</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">Service Partners</h1>
                            <p className="max-w-2xl text-body">Manage service provider partnerships. Track contracts, service quality, and monthly expenditure.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                                <Wrench className="h-3.5 w-3.5 text-primary" />32 partners
                            </span>
                            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                                <BarChart3 className="h-3.5 w-3.5 text-success" />85 services
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <Button className="gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand" onClick={() => setIsAddPartnerOpen(true)}>
                                <Plus className="h-4 w-4" />Add Partner
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
                {serviceStats.map((stat, index) => (
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
                        <Input placeholder="Search partners..." className="h-10 w-full rounded-xl bg-background/50 pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select value={serviceFilter} onValueChange={setServiceFilter}>
                            <SelectTrigger className="h-10 w-[160px] rounded-xl">
                                <SelectValue placeholder="Service Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-services">All Services</SelectItem>
                                <SelectItem value="IT Support">IT Support</SelectItem>
                                <SelectItem value="Cleaning">Cleaning</SelectItem>
                                <SelectItem value="Security">Security</SelectItem>
                                <SelectItem value="Maintenance">Maintenance</SelectItem>
                                <SelectItem value="Packaging">Packaging</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-10 w-[160px] rounded-xl">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-status">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                        {(searchQuery || statusFilter !== "all-status" || serviceFilter !== "all-services") && (
                            <Button variant="ghost" size="icon" onClick={() => { setSearchQuery(""); setStatusFilter("all-status"); setServiceFilter("all-services"); }} className="h-10 w-10 rounded-xl">
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Service Partners</CardTitle>
                    <p className="text-xs text-muted-foreground">Service provider partnerships</p>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[250px]">Partner Details</TableHead>
                                    <TableHead>Service Type</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Active Contracts</TableHead>
                                    <TableHead>Monthly Spend</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow><TableCell colSpan={8} className="h-24 text-center">No partners found.</TableCell></TableRow>
                                ) : (
                                    filteredData.map((partner) => (
                                        <TableRow key={partner.id} className="group hover:bg-muted/20">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-2xl p-2 bg-primary/10 text-primary">
                                                        <Wrench className="h-5 w-5" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="font-semibold text-foreground">{partner.partnerName}</p>
                                                        <p className="text-xs text-muted-foreground">ID: {partner.partnerId}</p>
                                                        <p className="text-xs text-muted-foreground">{partner.contactPerson}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell><Badge variant="secondary" className="rounded-full text-xs">{partner.serviceType}</Badge></TableCell>
                                            <TableCell><span className="text-sm">{partner.location}</span></TableCell>
                                            <TableCell><span className="font-semibold">{partner.activeContracts}</span></TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-foreground">
                                                    {partner.monthlySpend > 0 ? `₹${(partner.monthlySpend / 1000).toFixed(0)}K` : "—"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium">{partner.rating > 0 ? `${partner.rating} / 5.0` : "—"}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={partner.status === "active" ? "success" : partner.status === "pending" ? "warning" : "secondary"} className="rounded-full">
                                                    {partner.status === "active" ? "Active" : partner.status === "pending" ? "Pending" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Eye className="h-4 w-4" />View Details</DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Edit className="h-4 w-4" />Edit Partner</DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Phone className="h-4 w-4" />Contact</DropdownMenuItem>
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
            <AddServicePartnerDialog open={isAddPartnerOpen} onOpenChange={setIsAddPartnerOpen} />
        </div>
    );
};

export default ServicePartners;
