"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Package, Calendar, Search, Filter, History, Download, Eye, Clock, Tag, User, Truck, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { TrackingDialog } from "@/components/shared/TrackingDialog";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function InwardProcessingPage() {
    const { session } = useAuth();
    const [manifests, setManifests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("all");
    const [statusFilter, setStatusFilter] = useState("in_transit"); // Default to pending inward
    const [trackingOpen, setTrackingOpen] = useState(false);
    const [trackingShipment, setTrackingShipment] = useState<any>(null);

    useEffect(() => {
        console.log('🔍 [INWARD] Component mounted, statusFilter:', statusFilter);
        fetchIncomingManifests();
    }, [statusFilter]); // Refetch when filter changes

    const fetchIncomingManifests = async () => {
        console.log('🔍 [INWARD] fetchIncomingManifests CALLED');
        console.log('🔍 [INWARD] statusFilter:', statusFilter);
        setLoading(true);
        try {
            // Fetch manifests. We request 'all' if user wants history, or 'in_transit' for active.
            // Using logic: if statusFilter is 'active', fetch 'in_transit', else fetch 'received' (completed)?
            // User requirements: "Show manifest list structure". 
            // We should likely fetch ALL relevant statuses and filter client side or API side.
            // Let's fetch all relevant for Inward: in_transit (coming) and received (history).

            const statusParam = statusFilter === 'all' ? '' : `&status=${statusFilter}`;
            const url = `/api/manifests?type=inward${statusParam}`;
            console.log('🔍 [INWARD] API URL:', url);
            console.log('🔍 [INWARD] Token:', localStorage.getItem('token') ? 'EXISTS' : 'MISSING');

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            console.log('🔍 [INWARD] Response status:', res.status);

            if (res.ok) {
                const data = await res.json();
                console.log("✅ [INWARD] API Response:", data);
                console.log("✅ [INWARD] Count:", data.length);
                console.log("✅ [INWARD] Current User Branch ID:", session?.user?.branchId);
                setManifests(data);
            } else {
                console.error("❌ [INWARD] API Error:", res.status);
            }
        } catch (error) {
            console.error("❌ [INWARD] Fetch Error:", error);
            toast.error("Error loading inward manifests");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmInward = async (shipmentId: string, manifestId: string) => {
        try {
            const res = await fetch('/api/shipments/confirm-inward', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ shipmentId })
            });

            if (res.ok) {
                toast.success("Shipment Inward Confirmed");
                const data = await res.json();

                // Update Local State immediately
                setManifests(prev => prev.map(m => {
                    if (m._id === manifestId) {
                        const updatedShipments = m.shipments.map((s: any) => {
                            if (s._id === shipmentId) {
                                return { ...s, status: 'not_scheduled' }; // Mark as ready
                            }
                            return s;
                        });
                        return { ...m, shipments: updatedShipments };
                    }
                    return m;
                }));
            } else {
                toast.error("Failed to confirm inward");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network Error");
        }
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
            time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        };
    };

    const filteredManifests = manifests.filter(m => {
        const matchesSearch = m.manifestId?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSource = selectedBranch === "all" || m.sourceBranch?._id === selectedBranch;
        return matchesSearch && matchesSource;
    });

    // Unique sources for filter
    const sourceBranches = Array.from(new Map(manifests.map(m => [m.sourceBranch?._id, m.sourceBranch])).values()).filter(Boolean);

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inward Processing</h1>
                    <p className="text-muted-foreground">Receive and process incoming manifests.</p>
                </div>
                <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="in_transit">Incoming (In Transit)</SelectItem>
                            <SelectItem value="received">Received (History)</SelectItem>
                            <SelectItem value="all">All Records</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3 border-b bg-muted/5">
                    {/* DEBUG BANNER */}
                    <div className="bg-destructive/10 text-destructive text-xs p-2 mb-2 rounded border border-destructive/20 font-mono">
                        DEBUG: My Branch ID: {session?.user?.branchId} | Role: {session?.user?.role}
                        | Record Count: {manifests.length}
                    </div>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Truck className="h-5 w-5 text-primary" />
                            Incoming Manifests
                        </CardTitle>
                        <div className="flex gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search Manifest ID..."
                                    className="pl-9 h-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                                <SelectTrigger className="w-[180px] h-9">
                                    <SelectValue placeholder="Source Branch" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sources</SelectItem>
                                    {sourceBranches.map((b: any) => (
                                        <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30">
                                <TableHead>Manifest ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>From Branch</TableHead>
                                <TableHead>Contents</TableHead>
                                <TableHead>State</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Loading...</TableCell>
                                </TableRow>
                            ) : filteredManifests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        No manifests found matching criteria
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredManifests.map((m) => {
                                    const dateTime = formatDateTime(m.createdAt);

                                    // Calculate progress
                                    const total = m.shipments?.length || 0;
                                    const received = m.shipments?.filter((s: any) => s.status !== 'in_transit' && s.status !== 'forwarded').length || 0;
                                    const isFullyReceived = total > 0 && total === received;

                                    return (
                                        <TableRow key={m._id} className="group hover:bg-muted/10">
                                            <TableCell className="font-mono font-medium text-primary">
                                                {m.manifestId}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-sm">
                                                    <span>{dateTime.date}</span>
                                                    <span className="text-xs text-muted-foreground">{dateTime.time}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="font-normal bg-background">
                                                        {m.sourceBranch?.code || "SRC"}
                                                    </Badge>
                                                    <span className="text-sm font-medium">{m.sourceBranch?.name || "Unknown"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {/* DROPDOWN */}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="secondary" size="sm" className="h-8 gap-2 border shadow-sm px-3 w-auto bg-background hover:bg-muted">
                                                            <Package className="h-3.5 w-3.5" />
                                                            <span className="font-medium">{received} / {total}</span>
                                                            <span className="text-muted-foreground hidden sm:inline">Received</span>
                                                            <Filter className="h-3 w-3 opacity-50 ml-1" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start" className="w-[380px] z-50">
                                                        <div className="p-3 border-b bg-muted/10 flex justify-between items-center">
                                                            <span className="font-semibold text-sm">Shipment Contents</span>
                                                            <Badge variant={isFullyReceived ? "success" : "secondary"}>
                                                                {isFullyReceived ? "All Received" : "Processing"}
                                                            </Badge>
                                                        </div>
                                                        <ScrollArea className="h-[300px]">
                                                            <div className="p-2 space-y-2">
                                                                {m.shipments?.map((s: any) => {
                                                                    const isConfirmed = s.status !== 'in_transit' && s.status !== 'forwarded';
                                                                    return (
                                                                        <div key={s._id} className={cn("flex items-center justify-between p-2 rounded-lg border text-sm transition-all", isConfirmed ? "bg-green-50/50 border-green-100" : "bg-background hover:border-primary/50")}>
                                                                            <div className="flex flex-col">
                                                                                <span className="font-mono font-medium">{s.awb}</span>
                                                                                <span className="text-xs text-muted-foreground">{s.weight}kg • {isConfirmed ? "Received" : "In Transit"}</span>
                                                                            </div>

                                                                            <div className="flex items-center gap-2">
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        e.stopPropagation();
                                                                                        setTrackingShipment(s);
                                                                                        setTrackingOpen(true);
                                                                                    }}
                                                                                    title="Track Shipment"
                                                                                >
                                                                                    <Eye className="h-4 w-4" />
                                                                                </Button>

                                                                                {isConfirmed ? (
                                                                                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 gap-1 pl-1.5">
                                                                                        <CheckCircle className="h-3 w-3" /> Done
                                                                                    </Badge>
                                                                                ) : (
                                                                                    <Button
                                                                                        size="sm"
                                                                                        className="h-7 px-3 gap-1 bg-primary hover:bg-primary/90 shadow-sm"
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            handleConfirmInward(s._id, m._id);
                                                                                        }}
                                                                                    >
                                                                                        Confirm Inward
                                                                                    </Button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </ScrollArea>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                            <TableCell>
                                                {isFullyReceived ? (
                                                    <Badge className="bg-green-600 hover:bg-green-700">Received</Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="animate-pulse">In Transit</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <TrackingDialog
                open={trackingOpen}
                onOpenChange={setTrackingOpen}
                shipment={trackingShipment}
            />
        </div>
    );
}
