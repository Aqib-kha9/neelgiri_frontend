"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Package,
    Truck,
    MapPin,
    Clock,
    Calendar,
    User,
    Tag,
    ArrowRight,
    CheckCircle2,
    Info,
    Eye
} from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { TrackingDialog } from "@/components/shared/TrackingDialog";
import { Button } from "@/components/ui/button";

interface ManifestDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    manifest: any;
}

export function ManifestDetailsDialog({ open, onOpenChange, manifest }: ManifestDetailsDialogProps) {
    const [trackingOpen, setTrackingOpen] = useState(false);
    const [trackingShipment, setTrackingShipment] = useState<any>(null);

    if (!manifest) return null;

    const formatDate = (date: string) => {
        try {
            return format(new Date(date), "dd MMM yyyy, hh:mm a");
        } catch (e) {
            return "N/A";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-4 border-b bg-muted/20">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <DialogTitle className="text-2xl font-mono text-primary flex items-center gap-2">
                                <HistoryIcon className="h-6 w-6" />
                                {manifest.manifestId}
                            </DialogTitle>
                            <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(manifest.status)}>
                                    {manifest.status?.toUpperCase()}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                    Created on {formatDate(manifest.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-8">
                        {/* Route Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 text-center">
                                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wider mb-1">Origin</p>
                                <p className="font-bold text-lg">{manifest.sourceBranch?.name || "N/A"}</p>
                                <p className="text-xs text-muted-foreground font-mono">{manifest.sourceBranch?.code}</p>
                            </div>

                            <div className="flex flex-col items-center justify-center text-muted-foreground p-2">
                                <ArrowRight className="h-6 w-6" />
                                <Badge variant="outline" className="mt-2 text-[10px]">IN TRANSIT</Badge>
                            </div>

                            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/30 text-center">
                                <p className="text-xs text-green-600 dark:text-green-400 font-medium uppercase tracking-wider mb-1">Destination</p>
                                <p className="font-bold text-lg">{manifest.destinationBranch?.name || "N/A"}</p>
                                <p className="text-xs text-muted-foreground font-mono">{manifest.destinationBranch?.code}</p>
                            </div>
                        </div>

                        <Separator className="opacity-50" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Stats & Info */}
                            <div className="space-y-6">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Info className="h-4 w-4 text-primary" />
                                    Manifest Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-muted/40 rounded-lg border">
                                        <p className="text-xs text-muted-foreground">Shipments</p>
                                        <p className="text-xl font-bold">{manifest.stats?.totalShipments || 0}</p>
                                    </div>
                                    <div className="p-3 bg-muted/40 rounded-lg border">
                                        <p className="text-xs text-muted-foreground">Total Weight</p>
                                        <p className="text-xl font-bold">{manifest.stats?.totalWeight || 0} <small className="text-xs font-normal">kg</small></p>
                                    </div>
                                    <div className="p-3 bg-muted/40 rounded-lg border">
                                        <p className="text-xs text-muted-foreground">Created By</p>
                                        <p className="text-sm font-medium truncate">{manifest.createdBy?.name || "System"}</p>
                                    </div>
                                    <div className="p-3 bg-muted/40 rounded-lg border">
                                        <p className="text-xs text-muted-foreground">Transport Mode</p>
                                        <p className="text-sm font-medium uppercase">{manifest.transportDetails?.mode || "Surface"}</p>
                                    </div>
                                </div>

                                {manifest.bagTags && manifest.bagTags.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-medium flex items-center gap-2">
                                            <Tag className="h-4 w-4 text-primary" />
                                            Bag Tags
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {manifest.bagTags.map((tag: string, idx: number) => (
                                                <Badge key={idx} variant="outline" className="px-3 py-1 font-mono text-sm">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Timeline Section */}
                            <div className="space-y-6">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                    Movement History
                                </h3>
                                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
                                    {manifest.history?.map((event: any, idx: number) => (
                                        <div key={idx} className="relative">
                                            <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold uppercase tracking-wide">{event.status}</p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(event.timestamp)}
                                                </p>
                                                {event.remark && (
                                                    <p className="text-xs p-2 bg-muted/50 rounded italic border-l-2 border-primary/30 mt-1">
                                                        {event.remark}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Shipments Table */}
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Package className="h-4 w-4 text-primary" />
                                Shipments in this Manifest
                            </h3>
                            <div className="border rounded-xl overflow-hidden">
                                {manifest.shipments && manifest.shipments.length > 0 ? (
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="px-4 py-3 text-left">AWB Number</th>
                                                <th className="px-4 py-3 text-left">Consignee</th>
                                                <th className="px-4 py-3 text-left">Weight</th>
                                                <th className="px-4 py-3 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {manifest.shipments.map((s: any, idx: number) => (
                                                <tr key={idx} className="hover:bg-muted/20">
                                                    <td className="px-4 py-3 font-mono text-primary font-medium">{typeof s === 'string' ? s : s.awb}</td>
                                                    <td className="px-4 py-3">{s.receiver?.name || "N/A"}</td>
                                                    <td className="px-4 py-3 font-mono">{s.weight || 0} kg</td>
                                                    <td className="px-4 py-3 text-right">
                                                        {typeof s !== 'string' && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                                onClick={() => {
                                                                    setTrackingShipment(s);
                                                                    setTrackingOpen(true);
                                                                }}
                                                                title="Track Shipment"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                                        <Package className="h-8 w-8 opacity-20" />
                                        <p>No shipment details available in this record</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <TrackingDialog
                    open={trackingOpen}
                    onOpenChange={setTrackingOpen}
                    shipment={trackingShipment}
                />
            </DialogContent >
        </Dialog >
    );
}

function HistoryIcon({ className }: { className?: string }) {
    return (
        <div className={className}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M12 8v4l3 3" />
                <path d="M3.05 11a9 9 0 1 1 .45 4m-.51.5h4.51c.3 0 .5-.2.5-.5v-4.5" />
            </svg>
        </div>
    );
}

function getStatusColor(status: string) {
    switch (status?.toLowerCase()) {
        case 'received': return 'bg-green-600';
        case 'in_transit': return 'bg-blue-600';
        case 'cancelled': return 'bg-red-600';
        default: return 'bg-slate-700';
    }
}
