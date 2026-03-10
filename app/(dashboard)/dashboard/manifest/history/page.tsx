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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Package, Calendar, Search, Filter, History, Download, Eye, Clock, Tag, User, Truck } from "lucide-react";
import { toast } from "sonner";
import { ManifestDetailsDialog } from "@/components/manifest/history/ManifestDetailsDialog";
import { TrackingDialog } from "@/components/shared/TrackingDialog";
import { useAuth } from "@/contexts/AuthContext";

export default function ManifestHistoryPage() {
    const { session } = useAuth();
    const [manifests, setManifests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("all");
    const [selectedSource, setSelectedSource] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedBagTag, setSelectedBagTag] = useState("all");

    // Details View State
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedManifest, setSelectedManifest] = useState<any>(null);

    // Tracking Dialog State
    const [trackingOpen, setTrackingOpen] = useState(false);
    const [trackingShipment, setTrackingShipment] = useState<any>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const manifestsRes = await fetch('/api/manifests', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (manifestsRes.ok) {
                const data = await manifestsRes.json();
                setManifests(data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error loading manifest history");
        } finally {
            setLoading(false);
        }
    };

    // Get unique destination branches from manifests
    const destinationBranches = Array.from(
        new Map(
            manifests
                .filter(m => m.destinationBranch)
                .map(m => [m.destinationBranch._id, m.destinationBranch])
        ).values()
    );

    // Get unique source branches from manifests
    const sourceBranches = Array.from(
        new Map(
            manifests
                .filter(m => m.sourceBranch)
                .map(m => [m.sourceBranch._id, m.sourceBranch])
        ).values()
    );

    // Get unique bag tags
    const allBagTags = Array.from(
        new Set(manifests.flatMap(m => m.bagTags || []).filter(Boolean))
    );

    const filteredManifests = manifests.filter(m => {
        const matchesSearch = m.manifestId?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBranch = selectedBranch === "all" || m.destinationBranch?._id === selectedBranch;
        const matchesSource = selectedSource === "all" || m.sourceBranch?._id === selectedSource;
        const matchesStatus = selectedStatus === "all" || m.status === selectedStatus;
        const matchesBagTag = selectedBagTag === "all" || (m.bagTags || []).includes(selectedBagTag);
        return matchesSearch && matchesBranch && matchesSource && matchesStatus && matchesBagTag;
    });

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        };
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manifest History</h1>
                    <p className="text-muted-foreground">Complete archive of all forwarding and bag manifests.</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export All Records
                </Button>
            </div>

            <Card className="bg-muted/30">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by Manifest ID (MF...)"
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto flex-wrap">
                            <Select value={selectedSource} onValueChange={setSelectedSource}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <Filter className="h-4 w-4 mr-2 opacity-50" />
                                    <SelectValue placeholder="Source Branch" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sources</SelectItem>
                                    {sourceBranches.map((b: any) => (
                                        <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <Filter className="h-4 w-4 mr-2 opacity-50" />
                                    <SelectValue placeholder="Destination" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Destinations</SelectItem>
                                    {destinationBranches.map((b: any) => (
                                        <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="w-full md:w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="created">Created</SelectItem>
                                    <SelectItem value="in_transit">In Transit</SelectItem>
                                    <SelectItem value="received">Received</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                            {allBagTags.length > 0 && (
                                <Select value={selectedBagTag} onValueChange={setSelectedBagTag}>
                                    <SelectTrigger className="w-full md:w-[150px]">
                                        <Tag className="h-4 w-4 mr-2 opacity-50" />
                                        <SelectValue placeholder="Bag Tag" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Bag Tags</SelectItem>
                                        {allBagTags.map(tag => (
                                            <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <History className="h-5 w-5 text-primary" />
                            Manifest Records
                        </CardTitle>
                        <Badge variant="outline">{filteredManifests.length} Matches</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="text-center py-20 text-muted-foreground animate-pulse">Loading archive...</div>
                    ) : filteredManifests.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No records match your filters</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Manifest ID</TableHead>
                                    <TableHead>Origin → Destination</TableHead>
                                    <TableHead>Shipments</TableHead>
                                    <TableHead>Bag Tags</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Processed On</TableHead>
                                    <TableHead>Created By</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredManifests.map((m) => {
                                    // Date Logic: Prioritize 'forwarded' event timestamp from history
                                    // User Requirement: "ACTUAL FORWARD DATE"
                                    const historyEvents = m.history || [];
                                    const forwardedEvent = historyEvents.find((h: any) => h.status === 'complete');

                                    const validDate = forwardedEvent?.forwarded_at || forwardedEvent?.timestamp || m.createdAt;
                                    const dateTime = formatDateTime(validDate);

                                    // Shipment Count Logic
                                    // If shipments array exists, use length. Else use stats. Else 0.
                                    // Some old records might have empty array but valid stats.
                                    let count = 0;
                                    if (m.shipments && Array.isArray(m.shipments) && m.shipments.length > 0) {
                                        count = m.shipments.length;
                                    } else if (m.stats && m.stats.totalShipments) {
                                        count = m.stats.totalShipments;
                                    }

                                    // All manifests in history are 'complete' - always show green
                                    const statusLabel = 'Successful';
                                    const badgeClass = 'bg-green-600 hover:bg-green-700 border-transparent text-white';

                                    return (
                                        <TableRow key={m._id} className="hover:bg-primary/5 transition-colors group">
                                            <TableCell className="font-mono font-medium text-primary">
                                                {m.manifestId}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-sm">
                                                    <span className="font-medium">{m.sourceBranch?.name || "N/A"}</span>
                                                    <span className="text-muted-foreground text-xs">→ {m.destinationBranch?.name || "N/A"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {/* Shipment Count & Dropdown */}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" size="sm" className="h-7 gap-1 font-mono">
                                                            {count} <span className="text-xs text-muted-foreground">items</span>
                                                            <Filter className="h-3 w-3 opacity-50" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start" className="w-[300px]">
                                                        <div className="p-2 text-xs font-semibold text-muted-foreground border-b mb-1">
                                                            Shipment Contents
                                                        </div>
                                                        <ScrollArea className="h-[200px] p-2">
                                                            {/* Show Bag Tags if any */}
                                                            {m.bagTags && m.bagTags.length > 0 && (
                                                                <div className="mb-3">
                                                                    <p className="text-xs font-medium mb-1 flex items-center gap-1">
                                                                        <Tag className="h-3 w-3" /> Bag Tags ({m.bagTags.length})
                                                                    </p>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {m.bagTags.map((tag: any) => (
                                                                            <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Show Shipment AWBs */}
                                                            {m.shipments && m.shipments.length > 0 ? (
                                                                <div>
                                                                    <p className="text-xs font-medium mb-1 flex items-center gap-1">
                                                                        <Package className="h-3 w-3" /> Shipments ({m.shipments.length})
                                                                    </p>
                                                                    <div className="space-y-1">
                                                                        {m.shipments.map((s: any) => (
                                                                            <div key={s._id || s} className="flex items-center justify-between text-xs bg-muted/50 p-1.5 rounded group/item hover:bg-muted transition-colors">
                                                                                <span className="font-mono">{typeof s === 'string' ? s : s.awb}</span>
                                                                                <div className="flex items-center gap-2">
                                                                                    <Badge variant="outline" className="text-[10px] h-5">
                                                                                        {typeof s === 'string' ? 'Linked' : (s.weight ? `${s.weight}kg` : 'Standard')}
                                                                                    </Badge>
                                                                                    {typeof s !== 'string' && (
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="icon"
                                                                                            className="h-5 w-5 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                setTrackingShipment(s);
                                                                                                setTrackingOpen(true);
                                                                                            }}
                                                                                            title="Track Shipment"
                                                                                        >
                                                                                            <Eye className="h-3 w-3" />
                                                                                        </Button>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="text-xs text-muted-foreground text-center py-2">
                                                                    No individual shipments listed (Bulk)
                                                                </div>
                                                            )}
                                                        </ScrollArea>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                            <TableCell>
                                                {m.bagTags && m.bagTags.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {m.bagTags.slice(0, 1).map((tag: string, idx: number) => (
                                                            <Badge key={idx} variant="outline" className="text-[10px] font-mono">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                        {m.bagTags.length > 1 && (
                                                            <Badge variant="outline" className="text-[10px]">
                                                                +{m.bagTags.length - 1}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs font-mono">Direct</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`uppercase text-[10px] shadow-sm ${badgeClass}`}>
                                                    {statusLabel}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-sm">
                                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        <span>{dateTime.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{dateTime.time}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-1.5 font-medium">
                                                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span>
                                                            {m.createdBy?._id === session?.user?.id || m.createdBy === session?.user?.id
                                                                ? "Created by You"
                                                                : m.createdBy?.name || "System"}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground ml-5 truncate max-w-[100px]">
                                                        {m.createdBy?.email}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="gap-2 h-8"
                                                    onClick={() => {
                                                        setSelectedManifest(m);
                                                        setDetailsOpen(true);
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" /> View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <ManifestDetailsDialog
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                manifest={selectedManifest}
            />

            <TrackingDialog
                open={trackingOpen}
                onOpenChange={setTrackingOpen}
                shipment={trackingShipment}
            />
        </div>
    );
}
