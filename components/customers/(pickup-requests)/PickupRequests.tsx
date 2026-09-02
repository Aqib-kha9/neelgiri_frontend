"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Package, Plus, Download, BarChart3, Search, X, MoreHorizontal, Eye, MapPin, CheckCircle, Clock, RefreshCw, User, Play, Ban, ScanLine, CircleAlert, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AddPickupRequestDialog } from "./AddPickupRequestDialog";
import { pickupApi, type PickupRequest, type PickupRider } from "@/lib/api-services";
import { toast } from "sonner";

const statusVariantMap: Record<string, "success" | "warning" | "secondary" | "error" | "default"> = {
    requested: "secondary",
    assigned: "default",
    pickup_started: "warning",
    picked_up: "warning",
    completed: "success",
    cancelled: "error",
};

const statusLabelMap: Record<string, string> = {
    requested: "Pending",
    assigned: "Assigned",
    pickup_started: "Pickup Started",
    picked_up: "Picked Up",
    completed: "Completed",
    cancelled: "Cancelled",
};

const PickupRequests = () => {
    const { session } = useAuth();
    const currentUserId = session?.user?.id || session?.user?._id;
    const currentRole = session?.user?.role;
    const isCustomer = currentRole === "customer";
    const isOperationsRole = ["super_admin", "partner_admin", "partner", "branch_admin", "branch", "dispatcher"].includes(currentRole || "");
    const isRider = currentRole === "rider";
    const canCreate = isCustomer || isOperationsRole;
    const canAssign = isOperationsRole;
    const canExecute = (pickup: PickupRequest) => {
        if (isOperationsRole) return true;
        if (!isRider || !currentUserId) return false;
        return typeof pickup.assignedRider === "object"
            ? pickup.assignedRider?._id === currentUserId
            : pickup.assignedRider === currentUserId;
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [priorityFilter, setPriorityFilter] = useState("all-priority");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pickups, setPickups] = useState<PickupRequest[]>([]);
    const [riders, setRiders] = useState<PickupRider[]>([]);
    const [selectedPickup, setSelectedPickup] = useState<PickupRequest | null>(null);
    const [scanAwb, setScanAwb] = useState("");
    const [parcelActionLoading, setParcelActionLoading] = useState(false);
    const [assigningPickupId, setAssigningPickupId] = useState<string | null>(null);
    const [selectedRiderId, setSelectedRiderId] = useState("");
    const [stats, setStats] = useState({ total: 0, requested: 0, assigned: 0, inProgress: 0, completed: 0, cancelled: 0 });

    const fetchPickups = useCallback(async () => {
        setLoading(true);
        try {
            const [listRes, statsRes, ridersRes] = await Promise.all([
                pickupApi.list({ page: 1, limit: 100 }),
                pickupApi.stats().catch(() => ({ total: 0, requested: 0, assigned: 0, inProgress: 0, completed: 0, cancelled: 0 })),
                canAssign ? pickupApi.riders().catch(() => []) : Promise.resolve([]),
            ]);
            setPickups(listRes.pickups || []);
            setStats(statsRes);
            setRiders(ridersRes);
        } catch (error) {
            console.error("Failed to fetch pickups:", error);
            toast.error("Failed to load pickup requests");
        } finally {
            setLoading(false);
        }
    }, [canAssign]);

    useEffect(() => {
        fetchPickups();
    }, [fetchPickups]);

    const handleAssign = async () => {
        if (!assigningPickupId || !selectedRiderId) return;
        try {
            await pickupApi.assignRider(assigningPickupId, selectedRiderId);
            toast.success("Rider assigned successfully");
            setAssigningPickupId(null);
            setSelectedRiderId("");
            await fetchPickups();
        } catch (error: any) {
            toast.error(error.message || "Failed to assign rider");
        }
    };

    const openDetails = async (pickup: PickupRequest) => {
        try {
            setScanAwb("");
            setSelectedPickup(await pickupApi.getById(pickup._id));
        } catch (error: any) {
            toast.error(error.message || "Failed to load pickup details");
        }
    };

    const handleScanParcel = async () => {
        if (!selectedPickup || !scanAwb.trim()) return;
        setParcelActionLoading(true);
        try {
            const response = await pickupApi.scanParcel(selectedPickup._id, scanAwb.trim());
            setSelectedPickup(response.pickup);
            setScanAwb("");
            toast.success("Parcel scanned successfully");
            await fetchPickups();
        } catch (error: any) {
            toast.error(error.message || "Failed to scan parcel");
        } finally {
            setParcelActionLoading(false);
        }
    };

    const handleMarkMissed = async (awb: string) => {
        if (!selectedPickup) return;
        const reason = window.prompt("Enter reason for missed parcel:") || "Missed during pickup";
        setParcelActionLoading(true);
        try {
            const response = await pickupApi.markMissed(selectedPickup._id, awb, reason);
            setSelectedPickup(response.pickup);
            toast.success("Parcel marked as missed");
            await fetchPickups();
        } catch (error: any) {
            toast.error(error.message || "Failed to mark parcel missed");
        } finally {
            setParcelActionLoading(false);
        }
    };

    const handleStart = async (id: string) => {
        if (!window.confirm("Are you sure you want to start this pickup run?")) return;
        try {
            await pickupApi.startPickup(id);
            toast.success("Pickup run started");
            fetchPickups();
        } catch (error: any) {
            toast.error(error.message || "Failed to start pickup run");
        }
    };

    const handleComplete = async (id: string) => {
        if (!window.confirm("Are you sure you want to complete this pickup? Ensure all parcels are either scanned or marked as missed.")) return;
        try {
            await pickupApi.complete(id);
            toast.success("Pickup completed");
            fetchPickups();
        } catch (error: any) {
            toast.error(error.message || "Failed to complete pickup");
        }
    };

    const handleCancel = async (id: string) => {
        const reason = window.prompt("Enter cancellation reason:");
        if (reason === null) return;
        try {
            await pickupApi.cancel(id, reason);
            toast.success("Pickup cancelled");
            fetchPickups();
        } catch (error: any) {
            toast.error(error.message || "Failed to cancel pickup");
        }
    };

    const handleExport = () => {
        const columns = ["Request ID", "Customer", "Customer Code", "Customer Email", "Customer Phone", "Pickup Contact", "Address", "City", "Pincode", "Preferred Date", "Priority", "Status", "Shipments", "Weight (kg)"];
        const escapeCsv = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
        const rows = filteredData.map((pickup) => {
            const customerRecord = typeof pickup.customerId === "object" ? pickup.customerId : undefined;
            return [
                pickup.pickupRequestId,
                customerRecord?.name || pickup.customer?.name || "N/A",
                customerRecord?.code || "",
                customerRecord?.email || pickup.customer?.email || "",
                customerRecord?.mobileNo || customerRecord?.phoneO || customerRecord?.phoneR || pickup.customer?.phone || "",
                pickup.pickupAddress?.name,
                pickup.pickupAddress?.addressLine1,
                pickup.pickupAddress?.city,
                pickup.pickupAddress?.pincode,
                pickup.preferredDate ? new Date(pickup.preferredDate).toLocaleDateString("en-IN") : "",
                pickup.priority,
                pickup.status,
                pickup.totalShipments || pickup.estimatedPackageCount || 0,
                pickup.totalWeight || pickup.estimatedWeight || 0,
            ];
        });
        const csv = [columns, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\\r\\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `pickup-requests-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const filteredData = pickups.filter((pickup) => {
        const customerRecord = typeof pickup.customerId === "object" ? pickup.customerId : undefined;
        const searchableCustomer = [
            customerRecord?.name,
            customerRecord?.code,
            customerRecord?.contactPerson,
            customerRecord?.email,
            customerRecord?.mobileNo,
            customerRecord?.phoneO,
            customerRecord?.phoneR,
            pickup.customer?.name,
            pickup.customer?.email,
            pickup.customer?.phone,
        ].filter(Boolean).join(" ");
        const requestId = pickup.pickupRequestId || "";
        const addressStr = `${pickup.pickupAddress?.name || ""} ${pickup.pickupAddress?.phone || ""} ${pickup.pickupAddress?.addressLine1 || ""} ${pickup.pickupAddress?.city || ""} ${pickup.pickupAddress?.pincode || ""}`;
        const normalizedSearch = searchQuery.toLowerCase();
        const matchesSearch =
            searchableCustomer.toLowerCase().includes(normalizedSearch) ||
            requestId.toLowerCase().includes(normalizedSearch) ||
            addressStr.toLowerCase().includes(normalizedSearch);
        const matchesStatus = statusFilter === "all-status" || pickup.status === statusFilter;
        const matchesPriority = priorityFilter === "all-priority" || pickup.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    const pickupStats = [
        { title: "Total Requests", value: String(stats.total || 0), change: "", trend: "up" as const, icon: Package, description: "All time" },
        { title: "Pending Pickups", value: String(stats.requested || 0), change: "", trend: "down" as const, icon: Clock, description: "Awaiting assignment" },
        { title: "In Progress", value: String(stats.inProgress || 0), change: "", trend: "up" as const, icon: RefreshCw, description: "Active runs" },
        { title: "Completed", value: String(stats.completed || 0), change: "", trend: "up" as const, icon: CheckCircle, description: "Successful" },
    ];

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
                                <Package className="h-3.5 w-3.5 text-primary" />{stats.requested || 0} pending
                            </span>
                            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                                <BarChart3 className="h-3.5 w-3.5 text-success" />{stats.completed || 0} completed
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            {canCreate && (
                                <Button className="gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand" onClick={() => setIsAddOpen(true)}>
                                    <Plus className="h-4 w-4" />New Request
                                </Button>
                            )}
                            <Button variant="outline" className="gap-2 rounded-lg border-border/70" onClick={handleExport}>
                                <Download className="h-4 w-4" />Export
                            </Button>
                            <Button variant="outline" className="gap-2 rounded-lg border-border/70" onClick={fetchPickups}>
                                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
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
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-10 w-[160px] rounded-xl">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-status">All Status</SelectItem>
                                <SelectItem value="requested">Pending</SelectItem>
                                <SelectItem value="assigned">Assigned</SelectItem>
                                <SelectItem value="pickup_started">Pickup Started</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
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
                                    <TableHead>Parcels</TableHead>
                                    <TableHead>Scheduled Date</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={8} className="h-24 text-center text-muted-foreground animate-pulse">Loading pickup requests...</TableCell></TableRow>
                                ) : filteredData.length === 0 ? (
                                    <TableRow><TableCell colSpan={8} className="h-24 text-center">No pickup requests found.</TableCell></TableRow>
                                ) : (
                                    filteredData.map((pickup) => (
                                        <TableRow key={pickup._id} className="group hover:bg-muted/20">
                                            <TableCell>
                                                <div className="min-w-[190px]">
                                                    <p className="font-semibold text-foreground">
                                                        {(typeof pickup.customerId === "object" ? pickup.customerId.name : undefined) || pickup.customer?.name || "N/A"}
                                                    </p>
                                                    {(typeof pickup.customerId === "object" && pickup.customerId.code) && (
                                                        <p className="text-xs font-mono text-muted-foreground">{pickup.customerId.code}</p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground">
                                                        {(typeof pickup.customerId === "object" ? pickup.customerId.email : undefined) || pickup.customer?.email || "Customer account"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {(typeof pickup.customerId === "object" ? (pickup.customerId.mobileNo || pickup.customerId.phoneO || pickup.customerId.phoneR) : undefined) || pickup.customer?.phone || "Phone not available"}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell><span className="text-sm text-muted-foreground font-mono">{pickup.pickupRequestId}</span></TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span className="text-sm">{`${pickup.pickupAddress?.addressLine1 || ""}, ${pickup.pickupAddress?.city || ""}`}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell><span className="font-semibold">{pickup.totalShipments || pickup.estimatedPackageCount || 0}</span></TableCell>
                                            <TableCell><span className="text-sm">{pickup.preferredDate ? new Date(pickup.preferredDate).toLocaleDateString("en-IN") : "—"}</span></TableCell>
                                            <TableCell>
                                                <Badge variant={pickup.priority === "urgent" ? "error" : pickup.priority === "high" ? "warning" : "secondary"} className="rounded-full text-xs">
                                                    {pickup.priority === "urgent" ? "Urgent" : pickup.priority === "high" ? "High" : "Normal"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={statusVariantMap[pickup.status] || "secondary"} className="rounded-full">
                                                    {statusLabelMap[pickup.status] || pickup.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg" onClick={() => openDetails(pickup)}><Eye className="h-4 w-4" />View Details</DropdownMenuItem>
                                                            {canAssign && (pickup.status === "requested" || pickup.status === "assigned") && (
                                                                <DropdownMenuItem className="flex items-center gap-2 rounded-lg" onClick={() => setAssigningPickupId(pickup._id)}>
                                                                    <User className="h-4 w-4" />{pickup.status === "requested" ? "Assign Rider" : "Reassign Rider"}
                                                                </DropdownMenuItem>
                                                            )}
                                                            {canExecute(pickup) && pickup.status === "assigned" && (
                                                                <DropdownMenuItem className="flex items-center gap-2 rounded-lg" onClick={() => handleStart(pickup._id)}>
                                                                    <Play className="h-4 w-4" />Start Pickup
                                                                </DropdownMenuItem>
                                                            )}
                                                            {canExecute(pickup) && (pickup.status === "pickup_started" || pickup.status === "picked_up") && (
                                                                <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-success" onClick={() => handleComplete(pickup._id)}>
                                                                    <CheckCircle className="h-4 w-4" />Mark Complete
                                                                </DropdownMenuItem>
                                                            )}
                                                            {canCreate && pickup.status !== "completed" && pickup.status !== "cancelled" && (
                                                                <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-error" onClick={() => handleCancel(pickup._id)}>
                                                                    <Ban className="h-4 w-4" />Cancel
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

            {canCreate && <AddPickupRequestDialog open={isAddOpen} onOpenChange={setIsAddOpen} onCreated={fetchPickups} />}
            {canAssign && (
                <Dialog open={Boolean(assigningPickupId)} onOpenChange={(open) => !open && setAssigningPickupId(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Assign Rider</DialogTitle>
                            <DialogDescription>Select an active rider in your operational scope.</DialogDescription>
                        </DialogHeader>
                        <Select value={selectedRiderId} onValueChange={setSelectedRiderId}>
                            <SelectTrigger><SelectValue placeholder="Select rider" /></SelectTrigger>
                            <SelectContent>
                                {riders.map((rider) => <SelectItem key={rider._id} value={rider._id}>{rider.name}{rider.phone ? ` - ${rider.phone}` : ""}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleAssign} disabled={!selectedRiderId}>Assign Rider</Button>
                    </DialogContent>
                </Dialog>
            )}
            <Dialog open={Boolean(selectedPickup)} onOpenChange={(open) => !open && setSelectedPickup(null)}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{selectedPickup?.pickupRequestId || "Pickup details"}</DialogTitle>
                        <DialogDescription>Pickup status and scan history.</DialogDescription>
                    </DialogHeader>
                    {selectedPickup && (
                        <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-3">
                                <div><span className="text-muted-foreground">Status</span><p className="font-medium">{statusLabelMap[selectedPickup.status] || selectedPickup.status}</p></div>
                                <div><span className="text-muted-foreground">Assigned Rider</span><p className="font-medium">{typeof selectedPickup.assignedRider === "object" && selectedPickup.assignedRider ? selectedPickup.assignedRider.name : "Unassigned"}</p></div>
                                <div>
                                    <span className="text-muted-foreground">Customer Account</span>
                                    <p className="font-medium">{(typeof selectedPickup.customerId === "object" ? selectedPickup.customerId.name : undefined) || selectedPickup.customer?.name || "N/A"}</p>
                                    {(typeof selectedPickup.customerId === "object" && selectedPickup.customerId.code) && <p className="text-xs font-mono text-muted-foreground">{selectedPickup.customerId.code}</p>}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Customer Contact</span>
                                    <p className="font-medium">{(typeof selectedPickup.customerId === "object" ? (selectedPickup.customerId.mobileNo || selectedPickup.customerId.phoneO || selectedPickup.customerId.phoneR) : undefined) || selectedPickup.customer?.phone || "Phone not available"}</p>
                                    <p className="text-xs text-muted-foreground">{(typeof selectedPickup.customerId === "object" ? selectedPickup.customerId.email : undefined) || selectedPickup.customer?.email || "Email not available"}</p>
                                </div>
                                <div><span className="text-muted-foreground">Shipments</span><p className="font-medium">{selectedPickup.totalShipments || selectedPickup.estimatedPackageCount}</p></div>
                                <div><span className="text-muted-foreground">Weight</span><p className="font-medium">{selectedPickup.totalWeight || selectedPickup.estimatedWeight} kg</p></div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="font-medium">Registered parcels</span>
                                    <span className="text-xs text-muted-foreground">
                                        {(selectedPickup.shipments || []).filter((shipment) => shipment.scanStatus === "scanned").length} scanned / {(selectedPickup.shipments || []).length} total
                                    </span>
                                </div>
                                {(selectedPickup.shipments || []).length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No AWBs are registered on this pickup.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {selectedPickup.shipments.map((shipment) => (
                                            <div key={shipment.awb || shipment.shipmentId} className="flex items-center justify-between gap-3 rounded-md border p-3">
                                                <div className="min-w-0">
                                                    <p className="font-mono text-sm font-medium">{shipment.awb || "AWB unavailable"}</p>
                                                    <p className="text-xs text-muted-foreground">{shipment.weight || 0} kg{shipment.description ? ` · ${shipment.description}` : ""}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={shipment.scanStatus === "scanned" ? "success" : shipment.scanStatus === "missed" ? "error" : "secondary"}>
                                                        {shipment.scanStatus === "scanned" ? "Scanned" : shipment.scanStatus === "missed" ? "Missed" : shipment.scanStatus === "rejected" ? "Rejected" : "Pending"}
                                                    </Badge>
                                                    {canExecute(selectedPickup) && selectedPickup.status === "pickup_started" && shipment.scanStatus === "pending" && shipment.awb && (
                                                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMarkMissed(shipment.awb as string)} disabled={parcelActionLoading} title="Mark parcel missed">
                                                            <CircleAlert className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {canExecute(selectedPickup) && selectedPickup.status === "pickup_started" && (
                                    <div className="flex gap-2">
                                        <Input
                                            value={scanAwb}
                                            onChange={(event) => setScanAwb(event.target.value.toUpperCase())}
                                            onKeyDown={(event) => {
                                                if (event.key === "Enter") {
                                                    event.preventDefault();
                                                    void handleScanParcel();
                                                }
                                            }}
                                            placeholder="Scan or enter registered AWB"
                                            aria-label="Scan registered AWB"
                                            disabled={parcelActionLoading}
                                        />
                                        <Button type="button" onClick={() => void handleScanParcel()} disabled={parcelActionLoading || !scanAwb.trim()}>
                                            {parcelActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanLine className="h-4 w-4" />}
                                            <span className="sr-only">Scan parcel</span>
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Pickup Contact / Address</span>
                                <p>{selectedPickup.pickupAddress.name} · {selectedPickup.pickupAddress.phone}</p>
                                <p>{selectedPickup.pickupAddress.addressLine1}, {selectedPickup.pickupAddress.city}, {selectedPickup.pickupAddress.state} - {selectedPickup.pickupAddress.pincode}</p>
                            </div>
                            <div><span className="text-muted-foreground">History</span><div className="mt-2 space-y-2">{(selectedPickup.history || []).map((event, index) => <div key={`${event.status}-${index}`} className="border-l-2 border-primary/30 pl-3"><p className="font-medium">{statusLabelMap[event.status] || event.status}</p><p className="text-xs text-muted-foreground">{event.timestamp ? new Date(event.timestamp).toLocaleString("en-IN") : ""}{event.remark ? ` - ${event.remark}` : ""}</p></div>)}</div></div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PickupRequests;
