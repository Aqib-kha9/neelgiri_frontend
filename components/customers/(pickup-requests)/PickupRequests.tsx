"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Package, Plus, Download, Upload, BarChart3, Search, X, MoreHorizontal, Eye, MapPin, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { ImportDialog } from "../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../warehouse/(inventory)/ExportDialog";

const pickupStats = [
    { title: "Total Requests", value: "186", change: "+24", trend: "up", icon: Package, description: "This month" },
    { title: "Pending Pickups", value: "32", change: "+8", trend: "down", icon: Clock, description: "Awaiting collection" },
    { title: "Completed Today", value: "15", change: "+5", trend: "up", icon: CheckCircle, description: "Successful" },
    { title: "Avg Pickup Time", value: "45 mins", change: "-8", trend: "up", icon: TrendingUp, description: "Faster service" },
];

const pickupData = [
    { id: "PKP-001", customer: "TechCorp Solutions", requestId: "TC-PKP-2024-001", pickupAddress: "Sector 18, Noida", items: 5, requestDate: "2024-12-23", scheduledDate: "2024-12-24", status: "pending", priority: "high", assignedDriver: "Unassigned" },
    { id: "PKP-002", customer: "RetailHub India", requestId: "RH-PKP-2024-002", pickupAddress: "Andheri West, Mumbai", items: 12, requestDate: "2024-12-22", scheduledDate: "2024-12-23", status: "in-progress", priority: "medium", assignedDriver: "Rajesh Kumar" },
    { id: "PKP-003", customer: "FoodMart Chain", requestId: "FM-PKP-2024-003", pickupAddress: "Koramangala, Bangalore", items: 8, requestDate: "2024-12-23", scheduledDate: "2024-12-24", status: "pending", priority: "high", assignedDriver: "Unassigned" },
    { id: "PKP-004", customer: "Fashion Trends", requestId: "FT-PKP-2024-004", pickupAddress: "Connaught Place, Delhi", items: 3, requestDate: "2024-12-21", scheduledDate: "2024-12-22", status: "completed", priority: "low", assignedDriver: "Amit Sharma" },
    { id: "PKP-005", customer: "MediCare Pharma", requestId: "MP-PKP-2024-005", pickupAddress: "Banjara Hills, Hyderabad", items: 15, requestDate: "2024-12-22", scheduledDate: "2024-12-23", status: "in-progress", priority: "high", assignedDriver: "Priya Singh" },
];

const PickupRequests = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [priorityFilter, setPriorityFilter] = useState("all-priority");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);

    const filteredData = pickupData.filter((pickup) => {
        const matchesSearch = pickup.customer.toLowerCase().includes(searchQuery.toLowerCase()) || pickup.requestId.toLowerCase().includes(searchQuery.toLowerCase()) || pickup.pickupAddress.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all-status" || pickup.status === statusFilter;
        const matchesPriority = priorityFilter === "all-priority" || pickup.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    return (
        <div className="space-y-7">
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">Pickup Management</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">Pickup Requests</h1>
                            <p className="max-w-2xl text-body">Manage customer pickup requests. Schedule collections, assign drivers, and track pickup completion.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                                <Package className="h-3.5 w-3.5 text-primary" />32 pending
                            </span>
                            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                                <BarChart3 className="h-3.5 w-3.5 text-success" />45 mins avg
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <Button className="gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand">
                                <Plus className="h-4 w-4" />New Request
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
                {pickupStats.map((stat, index) => (
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
                        <Input placeholder="Search pickup requests..." className="h-10 w-full rounded-xl bg-background/50 pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                            <SelectTrigger className="h-10 w-[160px] rounded-xl">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-priority">All Priority</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-10 w-[160px] rounded-xl">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-status">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                        {(searchQuery || statusFilter !== "all-status" || priorityFilter !== "all-priority") && (
                            <Button variant="ghost" size="icon" onClick={() => { setSearchQuery(""); setStatusFilter("all-status"); setPriorityFilter("all-priority"); }} className="h-10 w-10 rounded-xl">
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Pickup Requests</CardTitle>
                    <p className="text-xs text-muted-foreground">Customer pickup scheduling</p>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Customer</TableHead>
                                    <TableHead>Request ID</TableHead>
                                    <TableHead>Pickup Address</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead>Scheduled Date</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow><TableCell colSpan={8} className="h-24 text-center">No pickup requests found.</TableCell></TableRow>
                                ) : (
                                    filteredData.map((pickup) => (
                                        <TableRow key={pickup.id} className="group hover:bg-muted/20">
                                            <TableCell><p className="font-semibold text-foreground">{pickup.customer}</p></TableCell>
                                            <TableCell><span className="text-sm text-muted-foreground">{pickup.requestId}</span></TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span className="text-sm">{pickup.pickupAddress}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell><span className="font-semibold">{pickup.items}</span></TableCell>
                                            <TableCell><span className="text-sm">{new Date(pickup.scheduledDate).toLocaleDateString("en-IN")}</span></TableCell>
                                            <TableCell>
                                                <Badge variant={pickup.priority === "high" ? "error" : pickup.priority === "medium" ? "warning" : "secondary"} className="rounded-full text-xs">
                                                    {pickup.priority === "high" ? "High" : pickup.priority === "medium" ? "Medium" : "Low"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={pickup.status === "completed" ? "success" : pickup.status === "in-progress" ? "warning" : "secondary"} className="rounded-full">
                                                    {pickup.status === "completed" ? "Completed" : pickup.status === "in-progress" ? "In Progress" : "Pending"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Eye className="h-4 w-4" />View Details</DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><MapPin className="h-4 w-4" />Track Location</DropdownMenuItem>
                                                            {pickup.status !== "completed" && <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-success"><CheckCircle className="h-4 w-4" />Mark Complete</DropdownMenuItem>}
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

export default PickupRequests;
