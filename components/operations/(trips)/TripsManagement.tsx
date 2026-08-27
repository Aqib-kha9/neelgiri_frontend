"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Truck, Plus, RefreshCw, Search, X, MoreHorizontal, Eye, Play, CheckCircle, AlertTriangle, Wrench, ArrowRightLeft, Ban, Package, Clock, MapPin, Loader2 } from "lucide-react";
import { tripApi, type Trip } from "@/lib/api-services";
import { toast } from "sonner";

const statusVariantMap: Record<string, "success" | "warning" | "secondary" | "error" | "default"> = {
    planned: "secondary",
    loading: "default",
    departed: "default",
    in_transit: "warning",
    arrived: "default",
    completed: "success",
    breakdown: "error",
    cancelled: "error",
};

const statusLabelMap: Record<string, string> = {
    planned: "Planned",
    loading: "Loading",
    departed: "Departed",
    in_transit: "In Transit",
    arrived: "Arrived",
    completed: "Completed",
    breakdown: "Breakdown",
    cancelled: "Cancelled",
};

const TripsManagement = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, breakdown: 0 });
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
    const [isReassignOpen, setIsReassignOpen] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchTrips = useCallback(async () => {
        setLoading(true);
        try {
            const [listRes, statsRes] = await Promise.all([
                tripApi.list({ page: 1, limit: 100 }),
                tripApi.stats().catch(() => ({ total: 0, active: 0, completed: 0, breakdown: 0 })),
            ]);
            setTrips(listRes.data || []);
            setStats(statsRes);
        } catch (error) {
            console.error("Failed to fetch trips:", error);
            toast.error("Failed to load trips");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrips();
    }, [fetchTrips]);

    const handleAction = async (action: string, trip: Trip, extraData?: any) => {
        setActionLoading(true);
        try {
            switch (action) {
                case "start-loading":
                    await tripApi.startLoading(trip._id);
                    toast.success("Loading started");
                    break;
                case "depart":
                    await tripApi.depart(trip._id);
                    toast.success("Trip departed");
                    break;
                case "arrive":
                    await tripApi.arrive(trip._id);
                    toast.success("Trip arrived");
                    break;
                case "complete":
                    await tripApi.complete(trip._id);
                    toast.success("Trip completed");
                    break;
                case "breakdown":
                    await tripApi.markBreakdown(trip._id, extraData.reason);
                    toast.success("Breakdown marked — manifests set to delayed");
                    break;
                case "reassign":
                    await tripApi.reassignVehicle(trip._id, extraData.vehicleId, extraData.driverId);
                    toast.success("Vehicle reassigned — manifests restored");
                    break;
                case "transfer":
                    await tripApi.transferManifests(trip._id, extraData.destinationTripId, extraData.manifestIds);
                    toast.success("Manifests transferred to new trip");
                    break;
                case "cancel":
                    await tripApi.cancel(trip._id, extraData?.reason);
                    toast.success("Trip cancelled");
                    break;
            }
            fetchTrips();
        } catch (error: any) {
            toast.error(error.message || `Failed to ${action}`);
        } finally {
            setActionLoading(false);
        }
    };

    const filteredTrips = trips.filter((trip) => {
        const matchesSearch =
            trip.tripId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trip.vehicleNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trip.originBranch?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trip.destinationBranch?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all-status" || trip.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const tripStats = [
        { title: "Total Trips", value: String(stats.total || 0), icon: Truck, color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Active", value: String(stats.active || 0), icon: Play, color: "text-orange-600", bg: "bg-orange-50" },
        { title: "Completed", value: String(stats.completed || 0), icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
        { title: "Breakdown", value: String(stats.breakdown || 0), icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    ];

    return (
        <div className="space-y-7">
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">Line-Haul Operations</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">Trip Management</h1>
                            <p className="max-w-2xl text-body">Manage line-haul trips between branches. Create trips, assign vehicles, track transit, handle breakdowns, and transfer manifests.</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button className="gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand" onClick={() => setIsCreateOpen(true)}>
                            <Plus className="h-4 w-4" />Create Trip
                        </Button>
                        <Button variant="outline" className="gap-2 rounded-lg border-border/70" onClick={fetchTrips}>
                            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh
                        </Button>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {tripStats.map((stat, index) => (
                    <Card key={index} className="rounded-2xl border-border/70 bg-card/95 shadow-card">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                    <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">{stat.value}</div>
                                </div>
                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="rounded-2xl border-border/70 bg-card/50 p-4 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Search by trip ID, vehicle, branch..." className="h-10 w-full rounded-xl bg-background/50 pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-10 w-[180px] rounded-xl">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-status">All Status</SelectItem>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="loading">Loading</SelectItem>
                            <SelectItem value="departed">Departed</SelectItem>
                            <SelectItem value="in_transit">In Transit</SelectItem>
                            <SelectItem value="arrived">Arrived</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="breakdown">Breakdown</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    {(searchQuery || statusFilter !== "all-status") && (
                        <Button variant="ghost" size="icon" onClick={() => { setSearchQuery(""); setStatusFilter("all-status"); }} className="h-10 w-10 rounded-xl">
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </Card>

            <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">All Trips</CardTitle>
                    <p className="text-xs text-muted-foreground">Line-haul vehicle movements</p>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Trip ID</TableHead>
                                    <TableHead>Route</TableHead>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead>Manifests</TableHead>
                                    <TableHead>Shipments</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground animate-pulse">Loading trips...</TableCell></TableRow>
                                ) : filteredTrips.length === 0 ? (
                                    <TableRow><TableCell colSpan={7} className="h-24 text-center">No trips found.</TableCell></TableRow>
                                ) : (
                                    filteredTrips.map((trip) => (
                                        <TableRow key={trip._id} className="group hover:bg-muted/20">
                                            <TableCell><span className="font-mono font-medium text-primary">{trip.tripId}</span></TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span>{trip.originBranch?.name || "—"}</span>
                                                    <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
                                                    <span>{trip.destinationBranch?.name || "—"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Truck className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm font-medium">{trip.vehicleNumber || trip.vehicle?.vehicleNumber || "—"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell><Badge variant="outline">{trip.manifests?.length || 0}</Badge></TableCell>
                                            <TableCell><span className="font-semibold">{trip.totalShipments || 0}</span></TableCell>
                                            <TableCell>
                                                <Badge variant={statusVariantMap[trip.status] || "secondary"} className="rounded-full">
                                                    {statusLabelMap[trip.status] || trip.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Eye className="h-4 w-4" />View Details</DropdownMenuItem>
                                                            {trip.status === "planned" && (
                                                                <DropdownMenuItem className="flex items-center gap-2 rounded-lg" onClick={() => handleAction("start-loading", trip)}>
                                                                    <Package className="h-4 w-4" />Start Loading
                                                                </DropdownMenuItem>
                                                            )}
                                                            {trip.status === "loading" && (
                                                                <DropdownMenuItem className="flex items-center gap-2 rounded-lg" onClick={() => handleAction("depart", trip)}>
                                                                    <Play className="h-4 w-4" />Depart
                                                                </DropdownMenuItem>
                                                            )}
                                                            {trip.status === "in_transit" && (
                                                                <DropdownMenuItem className="flex items-center gap-2 rounded-lg" onClick={() => handleAction("arrive", trip)}>
                                                                    <MapPin className="h-4 w-4" />Mark Arrived
                                                                </DropdownMenuItem>
                                                            )}
                                                            {trip.status === "arrived" && (
                                                                <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-success" onClick={() => handleAction("complete", trip)}>
                                                                    <CheckCircle className="h-4 w-4" />Complete Trip
                                                                </DropdownMenuItem>
                                                            )}
                                                            {(trip.status === "in_transit" || trip.status === "departed") && (
                                                                <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-error" onClick={() => { setSelectedTrip(trip); setIsBreakdownOpen(true); }}>
                                                                    <Wrench className="h-4 w-4" />Mark Breakdown
                                                                </DropdownMenuItem>
                                                            )}
                                                            {trip.status === "breakdown" && (
                                                                <>
                                                                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-success" onClick={() => { setSelectedTrip(trip); setIsReassignOpen(true); }}>
                                                                        <RefreshCw className="h-4 w-4" />Reassign Vehicle
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg" onClick={() => { setSelectedTrip(trip); setIsTransferOpen(true); }}>
                                                                        <ArrowRightLeft className="h-4 w-4" />Transfer Manifests
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                            {trip.status !== "completed" && trip.status !== "cancelled" && (
                                                                <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-error" onClick={() => handleAction("cancel", trip, { reason: "Cancelled by user" })}>
                                                                    <Ban className="h-4 w-4" />Cancel Trip
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

            {/* Create Trip Dialog */}
            <CreateTripDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onCreated={fetchTrips} />

            {/* Breakdown Dialog */}
            <BreakdownDialog
                open={isBreakdownOpen}
                onOpenChange={setIsBreakdownOpen}
                trip={selectedTrip}
                loading={actionLoading}
                onConfirm={(reason) => {
                    if (selectedTrip) handleAction("breakdown", selectedTrip, { reason });
                    setIsBreakdownOpen(false);
                }}
            />

            {/* Reassign Vehicle Dialog */}
            <ReassignDialog
                open={isReassignOpen}
                onOpenChange={setIsReassignOpen}
                trip={selectedTrip}
                loading={actionLoading}
                onConfirm={(vehicleId, driverId) => {
                    if (selectedTrip) handleAction("reassign", selectedTrip, { vehicleId, driverId });
                    setIsReassignOpen(false);
                }}
            />

            {/* Transfer Manifests Dialog */}
            <TransferDialog
                open={isTransferOpen}
                onOpenChange={setIsTransferOpen}
                trip={selectedTrip}
                loading={actionLoading}
                onConfirm={(destinationTripId) => {
                    if (selectedTrip) handleAction("transfer", selectedTrip, { destinationTripId });
                    setIsTransferOpen(false);
                }}
            />
        </div>
    );
};

// ─── Create Trip Dialog ───────────────────────────────────────────

function CreateTripDialog({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (v: boolean) => void; onCreated: () => void }) {
    const [formData, setFormData] = useState({
        originBranchId: "",
        destinationBranchId: "",
        vehicleId: "",
        driverId: "",
        remarks: "",
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.originBranchId === formData.destinationBranchId) {
            toast.error("Origin and destination branches must be different");
            return;
        }
        setSubmitting(true);
        try {
            await tripApi.create({
                originBranchId: formData.originBranchId,
                destinationBranchId: formData.destinationBranchId,
                vehicleId: formData.vehicleId,
                driverId: formData.driverId || undefined,
                remarks: formData.remarks || undefined,
            });
            toast.success("Trip created successfully");
            onOpenChange(false);
            onCreated();
            setFormData({ originBranchId: "", destinationBranchId: "", vehicleId: "", driverId: "", remarks: "" });
        } catch (error: any) {
            toast.error(error.message || "Failed to create trip");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Trip</DialogTitle>
                    <DialogDescription>Schedule a line-haul trip between two branches.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="originBranchId">Origin Branch ID *</Label>
                            <Input id="originBranchId" placeholder="Enter origin branch ID" value={formData.originBranchId} onChange={(e) => setFormData({ ...formData, originBranchId: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="destinationBranchId">Destination Branch ID *</Label>
                            <Input id="destinationBranchId" placeholder="Enter destination branch ID" value={formData.destinationBranchId} onChange={(e) => setFormData({ ...formData, destinationBranchId: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vehicleId">Vehicle ID *</Label>
                            <Input id="vehicleId" placeholder="Enter vehicle ID" value={formData.vehicleId} onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="driverId">Driver ID</Label>
                            <Input id="driverId" placeholder="Enter driver ID (optional)" value={formData.driverId} onChange={(e) => setFormData({ ...formData, driverId: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="remarks">Remarks</Label>
                            <Textarea id="remarks" placeholder="Any special instructions..." value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} rows={2} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Create Trip
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// ─── Breakdown Dialog ────────────────────────────────────────────

function BreakdownDialog({ open, onOpenChange, trip, loading, onConfirm }: { open: boolean; onOpenChange: (v: boolean) => void; trip: Trip | null; loading: boolean; onConfirm: (reason: string) => void }) {
    const [reason, setReason] = useState("");
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><Wrench className="h-5 w-5 text-error" />Mark Vehicle Breakdown</DialogTitle>
                    <DialogDescription>
                        Trip <span className="font-mono font-semibold">{trip?.tripId}</span> will be marked as breakdown. All linked manifests will be set to "delayed" status and an exception will be created.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="breakdownReason">Breakdown Reason *</Label>
                        <Textarea id="breakdownReason" placeholder="e.g., Engine failure, tire puncture, accident..." value={reason} onChange={(e) => setReason(e.target.value)} rows={3} required />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
                    <Button type="button" variant="destructive" disabled={loading || !reason.trim()} onClick={() => onConfirm(reason)}>
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Confirm Breakdown
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── Reassign Vehicle Dialog ─────────────────────────────────────

function ReassignDialog({ open, onOpenChange, trip, loading, onConfirm }: { open: boolean; onOpenChange: (v: boolean) => void; trip: Trip | null; loading: boolean; onConfirm: (vehicleId: string, driverId: string) => void }) {
    const [vehicleId, setVehicleId] = useState("");
    const [driverId, setDriverId] = useState("");
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><RefreshCw className="h-5 w-5 text-success" />Reassign Vehicle</DialogTitle>
                    <DialogDescription>
                        Assign a new vehicle to trip <span className="font-mono font-semibold">{trip?.tripId}</span>. Linked manifests will be restored to "in_transit" status.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="newVehicleId">New Vehicle ID *</Label>
                        <Input id="newVehicleId" placeholder="Enter new vehicle ID" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newDriverId">New Driver ID</Label>
                        <Input id="newDriverId" placeholder="Enter new driver ID (optional)" value={driverId} onChange={(e) => setDriverId(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
                    <Button type="button" disabled={loading || !vehicleId.trim()} onClick={() => onConfirm(vehicleId, driverId)}>
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Reassign Vehicle
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── Transfer Manifests Dialog ───────────────────────────────────

function TransferDialog({ open, onOpenChange, trip, loading, onConfirm }: { open: boolean; onOpenChange: (v: boolean) => void; trip: Trip | null; loading: boolean; onConfirm: (destinationTripId: string) => void }) {
    const [destinationTripId, setDestinationTripId] = useState("");
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><ArrowRightLeft className="h-5 w-5 text-primary" />Transfer Manifests</DialogTitle>
                    <DialogDescription>
                        Transfer all manifests from trip <span className="font-mono font-semibold">{trip?.tripId}</span> to a new trip. The destination trip must be in "planned" or "loading" status.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="destinationTripId">Destination Trip ID *</Label>
                        <Input id="destinationTripId" placeholder="Enter destination trip ID" value={destinationTripId} onChange={(e) => setDestinationTripId(e.target.value)} required />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
                    <Button type="button" disabled={loading || !destinationTripId.trim()} onClick={() => onConfirm(destinationTripId)}>
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Transfer Manifests
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default TripsManagement;
