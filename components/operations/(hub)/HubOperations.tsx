"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Warehouse,
    PackageCheck,
    PackageOpen,
    ArrowDownToLine,
    ArrowUpFromLine,
    ScanLine,
    RefreshCw,
    Loader2,
    MoreVertical,
    Inbox,
    History,
    Package,
    Truck,
    Building2,
    Plus,
} from "lucide-react";
import { hubApi, type HubDashboard as HubDashboardType } from "@/lib/api-services";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────

type HubDashboard = HubDashboardType;

interface PendingSortShipment {
    _id: string;
    awb: string;
    sender?: { name: string; phone?: string };
    receiver?: { name: string; phone?: string; address?: string };
    weight?: number;
    status: string;
    createdAt: string;
    destinationBranch?: { _id: string; name: string; code?: string };
    routingInfo?: { nextHub?: string; routeType?: string };
}

interface SortEvent {
    awb: string;
    receiver?: { name: string; phone?: string };
    sortedAt: string;
    fromBranch: string;
    toBranch: string;
    remark?: string;
    shipmentStatus: string;
}

// ─── Status Helpers ──────────────────────────────────────────────

const manifestStatusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    open: "secondary",
    closed: "default",
    vehicle_assigned: "default",
    in_transit: "default",
    arrived: "outline",
    received: "outline",
    complete: "default",
    cancelled: "destructive",
    delayed: "destructive",
};

const bagStatusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    open: "secondary",
    sealed: "default",
    arrived: "outline",
    opened: "secondary",
    manifested: "default",
    in_transit: "default",
    delivered: "default",
};

// ─── Component ────────────────────────────────────────────────────

const HubOperations = () => {
    const [dashboard, setDashboard] = useState<HubDashboard | null>(null);
    const [pendingSort, setPendingSort] = useState<PendingSortShipment[]>([]);
    const [sortHistory, setSortHistory] = useState<SortEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("dashboard");

    // Dialog states
    const [receiveManifestId, setReceiveManifestId] = useState("");
    const [openBagId, setOpenBagId] = useState("");
    const [sortAwb, setSortAwb] = useState("");
    const [sortDestBranch, setSortDestBranch] = useState("");
    const [outboundBagDest, setOutboundBagDest] = useState("");
    const [outboundBagAwbs, setOutboundBagAwbs] = useState("");
    const [outboundManifestBagIds, setOutboundManifestBagIds] = useState("");
    const [outboundManifestDest, setOutboundManifestDest] = useState("");
    const [convertBranchId, setConvertBranchId] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    // Dialog open states
    const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
    const [openBagDialogOpen, setOpenBagDialogOpen] = useState(false);
    const [sortDialogOpen, setSortDialogOpen] = useState(false);
    const [outboundBagDialogOpen, setOutboundBagDialogOpen] = useState(false);
    const [outboundManifestDialogOpen, setOutboundManifestDialogOpen] = useState(false);
    const [convertDialogOpen, setConvertDialogOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [dashRes, pendingRes, historyRes] = await Promise.all([
                hubApi.dashboard().catch(() => null),
                hubApi.pendingSort().catch(() => null),
                hubApi.sortHistory().catch(() => null),
            ]);

            if (dashRes) {
                setDashboard(dashRes);
            }
            setPendingSort(pendingRes?.shipments || []);
            setSortHistory(historyRes?.sortEvents || []);
        } catch (error) {
            console.error("Failed to fetch hub data:", error);
            toast.error("Failed to load hub operations data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // ─── Actions ──────────────────────────────────────────────────

    const handleReceiveManifest = async () => {
        if (!receiveManifestId.trim()) {
            toast.error("Please enter a manifest ID");
            return;
        }
        setActionLoading(true);
        try {
            const result = await hubApi.receiveManifest(receiveManifestId.trim());
            toast.success(result.message || "Manifest received successfully");
            setReceiveManifestId("");
            setReceiveDialogOpen(false);
            fetchData();
        } catch (error: any) {
            toast.error(error.message || "Failed to receive manifest");
        } finally {
            setActionLoading(false);
        }
    };

    const handleOpenBag = async () => {
        if (!openBagId.trim()) {
            toast.error("Please enter a bag ID");
            return;
        }
        setActionLoading(true);
        try {
            const result = await hubApi.openBag(openBagId.trim());
            toast.success(result.message || "Bag opened successfully");
            setOpenBagId("");
            setOpenBagDialogOpen(false);
            fetchData();
        } catch (error: any) {
            toast.error(error.message || "Failed to open bag");
        } finally {
            setActionLoading(false);
        }
    };

    const handleSortParcel = async () => {
        if (!sortAwb.trim() || !sortDestBranch.trim()) {
            toast.error("Please enter AWB and destination branch ID");
            return;
        }
        setActionLoading(true);
        try {
            const result = await hubApi.sortParcel({
                awb: sortAwb.trim(),
                destinationBranchId: sortDestBranch.trim(),
            });
            toast.success(result.message || "Parcel sorted successfully");
            setSortAwb("");
            setSortDestBranch("");
            setSortDialogOpen(false);
            fetchData();
        } catch (error: any) {
            toast.error(error.message || "Failed to sort parcel");
        } finally {
            setActionLoading(false);
        }
    };

    const handleCreateOutboundBag = async () => {
        if (!outboundBagDest.trim() || !outboundBagAwbs.trim()) {
            toast.error("Please enter destination branch and AWBs");
            return;
        }
        setActionLoading(true);
        try {
            const awbs = outboundBagAwbs
                .split(/[\n,]/)
                .map((a) => a.trim())
                .filter(Boolean);
            const result = await hubApi.createOutboundBag({
                destinationBranchId: outboundBagDest.trim(),
                awbs,
            });
            toast.success(result.message || "Outbound bag created successfully");
            setOutboundBagDest("");
            setOutboundBagAwbs("");
            setOutboundBagDialogOpen(false);
            fetchData();
        } catch (error: any) {
            toast.error(error.message || "Failed to create outbound bag");
        } finally {
            setActionLoading(false);
        }
    };

    const handleCreateOutboundManifest = async () => {
        if (!outboundManifestBagIds.trim() || !outboundManifestDest.trim()) {
            toast.error("Please enter bag IDs and destination branch");
            return;
        }
        setActionLoading(true);
        try {
            const bagIds = outboundManifestBagIds
                .split(/[\n,]/)
                .map((a) => a.trim())
                .filter(Boolean);
            const result = await hubApi.createOutboundManifest({
                bagIds,
                destinationBranchId: outboundManifestDest.trim(),
                originBranchId: dashboard?.hub?._id || "",
            });
            toast.success(result.message || "Outbound manifest created successfully");
            setOutboundManifestBagIds("");
            setOutboundManifestDest("");
            setOutboundManifestDialogOpen(false);
            fetchData();
        } catch (error: any) {
            toast.error(error.message || "Failed to create outbound manifest");
        } finally {
            setActionLoading(false);
        }
    };

    const handleConvertToHub = async () => {
        if (!convertBranchId.trim()) {
            toast.error("Please enter a branch ID");
            return;
        }
        setActionLoading(true);
        try {
            const result = await hubApi.convertToHub(convertBranchId.trim());
            toast.success(result.message || "Branch converted to hub successfully");
            setConvertBranchId("");
            setConvertDialogOpen(false);
            fetchData();
        } catch (error: any) {
            toast.error(error.message || "Failed to convert branch to hub");
        } finally {
            setActionLoading(false);
        }
    };

    // ─── Stats Cards ──────────────────────────────────────────────

    const stats = dashboard?.stats;
    const statCards = [
        {
            title: "Inbound Pending",
            value: String(stats?.inboundPending || 0),
            icon: ArrowDownToLine,
            color: "text-orange-600",
            bg: "bg-orange-50",
        },
        {
            title: "Inbound Arrived",
            value: String(stats?.inboundArrived || 0),
            icon: Inbox,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            title: "Parcels Awaiting Sort",
            value: String(stats?.parcelsAwaitingSort || 0),
            icon: PackageOpen,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
        {
            title: "Bags at Hub",
            value: String(stats?.bagsAtHub || 0),
            icon: Package,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
        },
        {
            title: "Outbound Open",
            value: String(stats?.outboundOpen || 0),
            icon: PackageCheck,
            color: "text-cyan-600",
            bg: "bg-cyan-50",
        },
        {
            title: "Outbound In Transit",
            value: String(stats?.outboundInTransit || 0),
            icon: ArrowUpFromLine,
            color: "text-green-600",
            bg: "bg-green-50",
        },
    ];

    return (
        <div className="space-y-7">
            {/* Header */}
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">Transit Hub Operations</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">Hub Operations Console</h1>
                            <p className="max-w-2xl text-body">
                                Manage transit hub operations: receive inbound manifests, open bags, sort parcels by destination,
                                create outbound bags and manifests for the next leg of the journey.
                            </p>
                        </div>
                        {dashboard?.hub && (
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                                    <Building2 className="h-3.5 w-3.5" />
                                    {dashboard.hub.name}
                                    {dashboard.hub.code && ` (${dashboard.hub.code})`}
                                </span>
                                {dashboard.isDedicatedHub && (
                                    <span className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary">
                                        <Warehouse className="h-3.5 w-3.5" />
                                        Dedicated Hub
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
                            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                        <Dialog open={receiveDialogOpen} onOpenChange={setReceiveDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <ArrowDownToLine className="mr-2 h-4 w-4" />
                                    Receive Manifest
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Receive Inbound Manifest</DialogTitle>
                                    <DialogDescription>
                                        Enter the manifest ID to receive it at this hub. The manifest must be in transit or arrived status.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="manifest-id">Manifest ID</Label>
                                        <Input
                                            id="manifest-id"
                                            placeholder="e.g., MNF-2024-001234"
                                            value={receiveManifestId}
                                            onChange={(e) => setReceiveManifestId(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setReceiveDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleReceiveManifest} disabled={actionLoading}>
                                        {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Receive Manifest
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </section>

            {/* Stats Cards */}
            <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {statCards.map((stat) => (
                    <Card key={stat.title} className="border-border/60 shadow-sm">
                        <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="text-xs text-muted-foreground">{stat.title}</div>
                        </CardContent>
                    </Card>
                ))}
            </section>

            {/* Quick Action Buttons */}
            <section className="flex flex-wrap gap-2">
                <Dialog open={openBagDialogOpen} onOpenChange={setOpenBagDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <PackageOpen className="mr-2 h-4 w-4" />
                            Open Bag
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Open Bag for Sorting</DialogTitle>
                            <DialogDescription>
                                Enter the bag ID to open it for sorting. The bag must have arrived at this hub.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label htmlFor="bag-id">Bag ID</Label>
                                <Input
                                    id="bag-id"
                                    placeholder="e.g., BAG-2024-001234"
                                    value={openBagId}
                                    onChange={(e) => setOpenBagId(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpenBagDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleOpenBag} disabled={actionLoading}>
                                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Open Bag
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={sortDialogOpen} onOpenChange={setSortDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <ScanLine className="mr-2 h-4 w-4" />
                            Sort Parcel
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Sort Parcel to Destination</DialogTitle>
                            <DialogDescription>
                                Scan or enter the AWB and select the destination branch to sort this parcel.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label htmlFor="sort-awb">AWB Number</Label>
                                <Input
                                    id="sort-awb"
                                    placeholder="e.g., AWB1234567890"
                                    value={sortAwb}
                                    onChange={(e) => setSortAwb(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sort-dest">Destination Branch ID</Label>
                                <Input
                                    id="sort-dest"
                                    placeholder="e.g., 665a1b2c3d4e5f6a7b8c9d0e"
                                    value={sortDestBranch}
                                    onChange={(e) => setSortDestBranch(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setSortDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSortParcel} disabled={actionLoading}>
                                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sort Parcel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={outboundBagDialogOpen} onOpenChange={setOutboundBagDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Outbound Bag
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Outbound Bag</DialogTitle>
                            <DialogDescription>
                                Create a new bag for sorted parcels destined for a specific branch.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label htmlFor="outbound-dest">Destination Branch ID</Label>
                                <Input
                                    id="outbound-dest"
                                    placeholder="e.g., 665a1b2c3d4e5f6a7b8c9d0e"
                                    value={outboundBagDest}
                                    onChange={(e) => setOutboundBagDest(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="outbound-awbs">AWB Numbers (one per line or comma-separated)</Label>
                                <Textarea
                                    id="outbound-awbs"
                                    placeholder={"AWB1234567890\nAWB1234567891\nAWB1234567892"}
                                    value={outboundBagAwbs}
                                    onChange={(e) => setOutboundBagAwbs(e.target.value)}
                                    rows={5}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOutboundBagDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateOutboundBag} disabled={actionLoading}>
                                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Bag
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={outboundManifestDialogOpen} onOpenChange={setOutboundManifestDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Truck className="mr-2 h-4 w-4" />
                            Create Outbound Manifest
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Outbound Manifest</DialogTitle>
                            <DialogDescription>
                                Create a manifest for outbound bags destined for a specific branch.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label htmlFor="manifest-bag-ids">Bag IDs (one per line or comma-separated)</Label>
                                <Textarea
                                    id="manifest-bag-ids"
                                    placeholder={"BAG-2024-001234\nBAG-2024-001235"}
                                    value={outboundManifestBagIds}
                                    onChange={(e) => setOutboundManifestBagIds(e.target.value)}
                                    rows={4}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="manifest-dest">Destination Branch ID</Label>
                                <Input
                                    id="manifest-dest"
                                    placeholder="e.g., 665a1b2c3d4e5f6a7b8c9d0e"
                                    value={outboundManifestDest}
                                    onChange={(e) => setOutboundManifestDest(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOutboundManifestDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateOutboundManifest} disabled={actionLoading}>
                                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Manifest
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Building2 className="mr-2 h-4 w-4" />
                            Convert to Hub
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Convert Branch to Hub</DialogTitle>
                            <DialogDescription>
                                Convert a regular branch to a transit hub type. This enables hub operations for that branch.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label htmlFor="convert-branch">Branch ID</Label>
                                <Input
                                    id="convert-branch"
                                    placeholder="e.g., 665a1b2c3d4e5f6a7b8c9d0e"
                                    value={convertBranchId}
                                    onChange={(e) => setConvertBranchId(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setConvertDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleConvertToHub} disabled={actionLoading}>
                                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Convert to Hub
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </section>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                    <TabsTrigger value="dashboard">
                        <Warehouse className="mr-2 h-4 w-4" />
                        Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="pending-sort">
                        <PackageOpen className="mr-2 h-4 w-4" />
                        Pending Sort ({pendingSort.length})
                    </TabsTrigger>
                    <TabsTrigger value="inbound">
                        <ArrowDownToLine className="mr-2 h-4 w-4" />
                        Inbound Manifests
                    </TabsTrigger>
                    <TabsTrigger value="history">
                        <History className="mr-2 h-4 w-4" />
                        Sort History
                    </TabsTrigger>
                </TabsList>

                {/* Dashboard Tab */}
                <TabsContent value="dashboard" className="space-y-6">
                    {/* Inbound Manifests */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ArrowDownToLine className="h-5 w-5 text-blue-600" />
                                Inbound Manifests
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : dashboard?.inboundManifests?.length ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Manifest ID</TableHead>
                                            <TableHead>Source Branch</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Shipments</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {dashboard.inboundManifests.map((m: any) => (
                                            <TableRow key={m._id}>
                                                <TableCell className="font-mono text-sm">{m.manifestId}</TableCell>
                                                <TableCell>{m.sourceBranch?.name || "—"}</TableCell>
                                                <TableCell>
                                                    <Badge variant={manifestStatusVariant[m.status] || "secondary"}>{m.status}</Badge>
                                                </TableCell>
                                                <TableCell>{m.shipments?.length || 0}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(m.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {["in_transit", "arrived"].includes(m.status) && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={async () => {
                                                                try {
                                                                    await hubApi.receiveManifest(m._id);
                                                                    toast.success("Manifest received");
                                                                    fetchData();
                                                                } catch (err: any) {
                                                                    toast.error(err.message || "Failed to receive manifest");
                                                                }
                                                            }}
                                                        >
                                                            <ArrowDownToLine className="mr-1 h-3.5 w-3.5" />
                                                            Receive
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="py-8 text-center text-sm text-muted-foreground">No inbound manifests at this hub</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Outbound Manifests */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ArrowUpFromLine className="h-5 w-5 text-green-600" />
                                Outbound Manifests
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : dashboard?.outboundManifests?.length ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Manifest ID</TableHead>
                                            <TableHead>Destination Branch</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Shipments</TableHead>
                                            <TableHead>Created</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {dashboard.outboundManifests.map((m: any) => (
                                            <TableRow key={m._id}>
                                                <TableCell className="font-mono text-sm">{m.manifestId}</TableCell>
                                                <TableCell>{m.destinationBranch?.name || "—"}</TableCell>
                                                <TableCell>
                                                    <Badge variant={manifestStatusVariant[m.status] || "secondary"}>{m.status}</Badge>
                                                </TableCell>
                                                <TableCell>{m.shipments?.length || 0}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(m.createdAt).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="py-8 text-center text-sm text-muted-foreground">No outbound manifests from this hub</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Bags at Hub */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Package className="h-5 w-5 text-indigo-600" />
                                Bags at Hub
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : dashboard?.bagsAtHub?.length ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Bag ID</TableHead>
                                            <TableHead>Destination</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Shipments</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {dashboard.bagsAtHub.map((b: any) => (
                                            <TableRow key={b._id}>
                                                <TableCell className="font-mono text-sm">{b.bagId || b._id}</TableCell>
                                                <TableCell>{b.destinationBranch?.name || "—"}</TableCell>
                                                <TableCell>
                                                    <Badge variant={bagStatusVariant[b.status] || "secondary"}>{b.status}</Badge>
                                                </TableCell>
                                                <TableCell>{b.shipments?.length || 0}</TableCell>
                                                <TableCell className="text-right">
                                                    {["arrived", "sealed"].includes(b.status) && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={async () => {
                                                                try {
                                                                    await hubApi.openBag(b._id);
                                                                    toast.success("Bag opened for sorting");
                                                                    fetchData();
                                                                } catch (err: any) {
                                                                    toast.error(err.message || "Failed to open bag");
                                                                }
                                                            }}
                                                        >
                                                            <PackageOpen className="mr-1 h-3.5 w-3.5" />
                                                            Open
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="py-8 text-center text-sm text-muted-foreground">No bags at this hub</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Pending Sort Tab */}
                <TabsContent value="pending-sort">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <PackageOpen className="h-5 w-5 text-purple-600" />
                                Parcels Pending Sort ({pendingSort.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : pendingSort.length ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>AWB</TableHead>
                                            <TableHead>Receiver</TableHead>
                                            <TableHead>Destination</TableHead>
                                            <TableHead>Weight</TableHead>
                                            <TableHead>Arrived</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pendingSort.map((s) => (
                                            <TableRow key={s._id}>
                                                <TableCell className="font-mono text-sm">{s.awb}</TableCell>
                                                <TableCell>
                                                    <div className="text-sm font-medium">{s.receiver?.name || "—"}</div>
                                                    <div className="text-xs text-muted-foreground">{s.receiver?.phone || ""}</div>
                                                </TableCell>
                                                <TableCell>{s.destinationBranch?.name || "—"}</TableCell>
                                                <TableCell>{s.weight ? `${s.weight} kg` : "—"}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(s.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setSortAwb(s.awb);
                                                                    setSortDestBranch(s.destinationBranch?._id || "");
                                                                    setSortDialogOpen(true);
                                                                }}
                                                            >
                                                                <ScanLine className="mr-2 h-4 w-4" />
                                                                Sort to Destination
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    No parcels pending sort. All caught up!
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Inbound Manifests Tab (same as dashboard section but standalone) */}
                <TabsContent value="inbound">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ArrowDownToLine className="h-5 w-5 text-blue-600" />
                                Inbound Manifests at Hub
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : dashboard?.inboundManifests?.length ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Manifest ID</TableHead>
                                            <TableHead>Source Branch</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Shipments</TableHead>
                                            <TableHead>Weight</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {dashboard.inboundManifests.map((m: any) => (
                                            <TableRow key={m._id}>
                                                <TableCell className="font-mono text-sm">{m.manifestId}</TableCell>
                                                <TableCell>{m.sourceBranch?.name || "—"}</TableCell>
                                                <TableCell>
                                                    <Badge variant={manifestStatusVariant[m.status] || "secondary"}>{m.status}</Badge>
                                                </TableCell>
                                                <TableCell>{m.shipments?.length || 0}</TableCell>
                                                <TableCell>{m.totalWeight ? `${m.totalWeight} kg` : "—"}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(m.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {["in_transit", "arrived"].includes(m.status) && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={async () => {
                                                                try {
                                                                    await hubApi.receiveManifest(m._id);
                                                                    toast.success("Manifest received");
                                                                    fetchData();
                                                                } catch (err: any) {
                                                                    toast.error(err.message || "Failed to receive manifest");
                                                                }
                                                            }}
                                                        >
                                                            <ArrowDownToLine className="mr-1 h-3.5 w-3.5" />
                                                            Receive
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="py-8 text-center text-sm text-muted-foreground">No inbound manifests at this hub</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Sort History Tab */}
                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <History className="h-5 w-5 text-muted-foreground" />
                                Sort History ({sortHistory.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : sortHistory.length ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>AWB</TableHead>
                                            <TableHead>Receiver</TableHead>
                                            <TableHead>Sorted At</TableHead>
                                            <TableHead>Remark</TableHead>
                                            <TableHead>Shipment Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sortHistory.map((event, idx) => (
                                            <TableRow key={`${event.awb}-${idx}`}>
                                                <TableCell className="font-mono text-sm">{event.awb}</TableCell>
                                                <TableCell>{event.receiver?.name || "—"}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(event.sortedAt).toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-sm">{event.remark || "—"}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{event.shipmentStatus}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="py-8 text-center text-sm text-muted-foreground">No sort history available</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default HubOperations;
