"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Truck, Plus, Download, Upload, BarChart3, Search, X, MoreHorizontal, Eye, Edit, Phone, Users, CheckCircle, Clock, IndianRupee } from "lucide-react";
import { ImportDialog } from "../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../warehouse/(inventory)/ExportDialog";

const coLoadingStats = [
    { title: "Total Partners", value: "45", change: "+5", trend: "up", icon: Users, description: "Active co-loaders" },
    { title: "Active Routes", value: "128", change: "+12", trend: "up", icon: Truck, description: "Operating routes" },
    { title: "Pending Requests", value: "8", change: "+3", trend: "down", icon: Clock, description: "Awaiting approval" },
    { title: "Monthly Revenue", value: "₹28.5L", change: "+18%", trend: "up", icon: IndianRupee, description: "This month" },
];

const coLoadingData = [
    { id: "CL-001", partnerName: "Express Logistics", partnerId: "EXL-2024-001", vehicleType: "Truck", capacity: "10 Ton", location: "Delhi NCR", status: "active", activeRoutes: 15, monthlyRevenue: 450000, rating: 4.8, contactPerson: "Amit Kumar", phone: "+91 98765 11111" },
    { id: "CL-002", partnerName: "Swift Transport", partnerId: "SWT-2024-002", vehicleType: "Van", capacity: "2 Ton", location: "Noida", status: "active", activeRoutes: 8, monthlyRevenue: 180000, rating: 4.5, contactPerson: "Priya Sharma", phone: "+91 98765 22222" },
    { id: "CL-003", partnerName: "Metro Cargo", partnerId: "MTC-2024-003", vehicleType: "Truck", capacity: "15 Ton", location: "Gurugram", status: "pending", activeRoutes: 0, monthlyRevenue: 0, rating: 0, contactPerson: "Rahul Verma", phone: "+91 98765 33333" },
    { id: "CL-004", partnerName: "City Movers", partnerId: "CTM-2024-004", vehicleType: "Mini Truck", capacity: "1 Ton", location: "Ghaziabad", status: "active", activeRoutes: 12, monthlyRevenue: 220000, rating: 4.6, contactPerson: "Neha Gupta", phone: "+91 98765 44444" },
    { id: "CL-005", partnerName: "Fast Track Logistics", partnerId: "FTL-2024-005", vehicleType: "Truck", capacity: "8 Ton", location: "Delhi", status: "inactive", activeRoutes: 0, monthlyRevenue: 0, rating: 3.9, contactPerson: "Vikram Singh", phone: "+91 98765 55555" },
];

const CoLoadingPartners = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [vehicleFilter, setVehicleFilter] = useState("all-vehicles");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);

    const filteredData = coLoadingData.filter((partner) => {
        const matchesSearch = partner.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) || partner.partnerId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all-status" || partner.status === statusFilter;
        const matchesVehicle = vehicleFilter === "all-vehicles" || partner.vehicleType === vehicleFilter;
        return matchesSearch && matchesStatus && matchesVehicle;
    });

    return (
        <div className="space-y-7">
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">Vendor Management</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">Co-loading Partners</h1>
                            <p className="max-w-2xl text-body">Manage co-loading partnerships for shared transportation. Track vehicle capacity, routes, and revenue sharing.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                                <Truck className="h-3.5 w-3.5 text-primary" />45 partners
                            </span>
                            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                                <BarChart3 className="h-3.5 w-3.5 text-success" />128 routes
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <Button className="gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand">
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
                {coLoadingStats.map((stat, index) => (
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
                        <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
                            <SelectTrigger className="h-10 w-[160px] rounded-xl">
                                <SelectValue placeholder="Vehicle Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-vehicles">All Vehicles</SelectItem>
                                <SelectItem value="Truck">Truck</SelectItem>
                                <SelectItem value="Van">Van</SelectItem>
                                <SelectItem value="Mini Truck">Mini Truck</SelectItem>
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
                        {(searchQuery || statusFilter !== "all-status" || vehicleFilter !== "all-vehicles") && (
                            <Button variant="ghost" size="icon" onClick={() => { setSearchQuery(""); setStatusFilter("all-status"); setVehicleFilter("all-vehicles"); }} className="h-10 w-10 rounded-xl">
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Co-loading Partners</CardTitle>
                    <p className="text-xs text-muted-foreground">Shared transportation partnerships</p>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[250px]">Partner Details</TableHead>
                                    <TableHead>Vehicle Type</TableHead>
                                    <TableHead>Capacity</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Active Routes</TableHead>
                                    <TableHead>Revenue</TableHead>
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
                                                        <Truck className="h-5 w-5" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="font-semibold text-foreground">{partner.partnerName}</p>
                                                        <p className="text-xs text-muted-foreground">ID: {partner.partnerId}</p>
                                                        <p className="text-xs text-muted-foreground">{partner.contactPerson}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell><Badge variant="secondary" className="rounded-full text-xs">{partner.vehicleType}</Badge></TableCell>
                                            <TableCell><span className="font-medium">{partner.capacity}</span></TableCell>
                                            <TableCell><span className="text-sm">{partner.location}</span></TableCell>
                                            <TableCell><span className="font-semibold">{partner.activeRoutes}</span></TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-foreground">
                                                    {partner.monthlyRevenue > 0 ? `₹${(partner.monthlyRevenue / 1000).toFixed(0)}K` : "—"}
                                                </span>
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
        </div>
    );
};

export default CoLoadingPartners;
