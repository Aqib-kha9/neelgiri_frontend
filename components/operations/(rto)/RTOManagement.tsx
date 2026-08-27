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
import { RotateCcw, RefreshCw, Search, X, MoreHorizontal, Eye, CheckCircle, Ban, Package, Clock, AlertCircle, Truck, Loader2 } from "lucide-react";
import { rtoApi, type RTOShipment } from "@/lib/api-services";
import { toast } from "sonner";

const statusVariantMap: Record<string, "success" | "warning" | "secondary" | "error" | "default"> = {
    none: "secondary",
    initiated: "warning",
    in_transit: "default",
    received_at_origin: "default",
    completed: "success",
    cancelled: "error",
};

const statusLabelMap: Record<string, string> = {
    none: "None",
    initiated: "Initiated",
    in_transit: "In Transit",
    received_at_origin: "Received at Origin",
    completed: "Completed",
    cancelled: "Cancelled",
};

const RTOManagement = () => {
    const [shipments, setShipments] = useState<RTOShipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [stats, setStats] = useState({ total: 0, initiated: 0, inTransit: 0, receivedAtOrigin: 0, completed: 0, cancelled: 0 });
    const [isInitiateOpen, setIsInitiateOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchShipments = useCallback(async () => {
        setLoading(true);
        try {
            const [listRes, statsRes] = await Promise.all([
                rtoApi.list({ page: 1, limit: 100 }),
                rtoApi.stats().catch(() => ({ total: 0, initiated: 0, inTransit: 0, receivedAtOrigin: 0, completed: 0, cancelled: 0 })),
            ]);
            setShipments(listRes.data || []);
            setStats(statsRes);
        } catch (error) {
            console.error("Failed to fetch RTO shipments:", error);
            toast.error("Failed to load RTO shipments");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchShipments();
    }, [fetchShipments]);

    const handleComplete = async (awb: string) => {
        setActionLoading(true);
        try {
            await rtoApi.complete(awb);
            toast.success("RTO completed successfully");
            fetchShipments();
        } catch (error: any) {
            toast.error(error.message || "Failed to complete RTO");
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async (awb: string) => {
        const reason = window.prompt("Enter cancellation reason:") || "Cancelled by user";
        setActionLoading(true);
        try {
            await rtoApi.cancel(awb, reason);
            toast.success("RTO cancelled");
            fetchShipments();
        } catch (error: any) {
            toast.error(error.message || "Failed to cancel RTO");
        } finally {
            setActionLoading(false);
        }
    };

    const filteredData = shipments.filter((s) => {
        const matchesSearch = s.awb?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all-status" || s.rtoStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const rtoStats = [
        { title: "Total RTO", value: String(stats.total || 0), icon: RotateCcw, color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Initiated", value: String(stats.initiated || 0), icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-50" },
        { title: "In Transit", value: String(stats.inTransit || 0), icon: Truck, color: "text-purple-600", bg: "bg-purple-50" },
        { title: "Completed", value: String(stats.completed || 0), icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    ];

    return (
        <div className="space-y-7">
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">Returns Management</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">RTO Management</h1>
                            <p className="max-w-2xl text-body">Manage Return-to-Origin shipments. Initiate RTO, track return transit, and complete returns at origin branch.</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button className="gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand" onClick={() => setIsInitiateOpen(true)}>
                            <RotateCcw className="h-4 w-4" />Initiate RTO
                        </Button>
                        <Button variant="outline" className="gap-2 rounded-lg border-border/70" onClick={fetchShipments}>
                            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh
                        </Button>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {rtoStats.map((stat, index) => (
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
                        <Input placeholder="Search by AWB number..." className="h-10 w-full rounded-xl bg-background/50 pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-10 w-[200px] rounded-xl">
                            <SelectValue placeholder="RTO Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-status">All Status</SelectItem>
                            <SelectItem value="initiated">Initiated</SelectItem>
                            <SelectItem value="in_transit">In Transit</SelectItem>
                            <SelectItem value="received_at_origin">Received at Origin</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
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
                    <CardTitle className="text-base font-semibold">RTO Shipments</CardTitle>
                    <p className="text-xs text-muted-foreground">Return-to-Origin tracking</p>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>AWB</TableHead>
                                    <TableHead>Sender</TableHead>
                                    <TableHead>Receiver</TableHead>
                                    <TableHead>RTO Reason</TableHead>
                                    <TableHead>Initiated</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground animate-pulse">Loading RTO shipments...</TableCell></TableRow>
                                ) : filteredData.length === 0 ? (
                                    <TableRow><TableCell colSpan={7} className="h-24 text-center">No RTO shipments found.</TableCell></TableRow>
                                ) : (
                                    filteredData.map((s) => (
                                        <TableRow key={s._id} className="group hover:bg-muted/20">
                                            <TableCell><span className="font-mono font-medium text-primary">{s.awb}</span></TableCell>
                                            <TableCell><span className="text-sm">{s.shipment?.sender?.name || "—"}</span></TableCell>
                                            <TableCell><span className="text-sm">{s.shipment?.receiver?.name || "—"}</span></TableCell>
                                            <TableCell><span className="text-sm text-muted-foreground">{s.rtoReason || "—"}</span></TableCell>
                                            <TableCell><span className="text-sm">{s.rtoInitiatedAt ? new Date(s.rtoInitiatedAt).toLocaleDateString("en-IN") : "—"}</span></TableCell>
                                            <TableCell>
                                                <Badge variant={statusVariantMap[s.rtoStatus] || "secondary"} className="rounded-full">
                                                    {statusLabelMap[s.rtoStatus] || s.rtoStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Eye className="h-4 w-4" />View Details</DropdownMenuItem>
                                                            {(s.rtoStatus === "received_at_origin" || s.rtoStatus === "in_transit") && (
                                                                <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-success" onClick={() => handleComplete(s.awb)} disabled={actionLoading}>
                                                                    <CheckCircle className="h-4 w-4" />Complete RTO
                                                                </DropdownMenuItem>
                                                            )}
                                                            {s.rtoStatus !== "completed" && s.rtoStatus !== "cancelled" && (
                                                                <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-error" onClick={() => handleCancel(s.awb)} disabled={actionLoading}>
                                                                    <Ban className="h-4 w-4" />Cancel RTO
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

            <InitiateRTODialog open={isInitiateOpen} onOpenChange={setIsInitiateOpen} onCreated={fetchShipments} />
        </div>
    );
};

// ─── Initiate RTO Dialog ─────────────────────────────────────────

function InitiateRTODialog({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (v: boolean) => void; onCreated: () => void }) {
    const [awb, setAwb] = useState("");
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await rtoApi.initiate(awb, reason);
            toast.success("RTO initiated successfully");
            onOpenChange(false);
            onCreated();
            setAwb("");
            setReason("");
        } catch (error: any) {
            toast.error(error.message || "Failed to initiate RTO");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><RotateCcw className="h-5 w-5 text-primary" />Initiate RTO</DialogTitle>
                    <DialogDescription>Start the Return-to-Origin process for a shipment.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="awb">AWB Number *</Label>
                            <Input id="awb" placeholder="Enter AWB number" value={awb} onChange={(e) => setAwb(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reason">RTO Reason *</Label>
                            <Textarea id="reason" placeholder="e.g., Customer refused delivery, Address not found, Undeliverable..." value={reason} onChange={(e) => setReason(e.target.value)} rows={3} required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Initiate RTO
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default RTOManagement;
