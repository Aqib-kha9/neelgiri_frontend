import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
    MoreHorizontal,
    Eye,
    FileText,
    AlertCircle,
    User,
    Calendar,
    MapPin,
    Truck,
    Package,
    Edit,
    ChevronDown,
    CheckCircle2,
    Zap
} from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState, Fragment } from "react";
import { TrackingDialog } from "@/components/shared/TrackingDialog";

interface DRSTableProps {
    data: any[];
    title?: string;
    onEdit?: (drs: any) => void;
    onViewDetails?: (drs: any) => void;
    onRefresh?: () => void;
}

import { toast } from "sonner"; // Ensure toast is imported

export const DRSTable = ({ data, title = "DRS List", onEdit, onViewDetails, onRefresh }: DRSTableProps) => {
    const [expandedDRS, setExpandedDRS] = useState<string | null>(null);

    // Tracking Dialog
    const [trackingOpen, setTrackingOpen] = useState(false);
    const [trackingShipment, setTrackingShipment] = useState<any>(null);

    const handleViewTracking = (shipment: any) => {
        setTrackingShipment(shipment);
        setTrackingOpen(true);
    };

    const handleApproveDelivery = async (drsId: string, awb: string, type: string = 'standard') => {
        try {
            const payload = { awb, type };
            const res = await fetch(`/api/drs/${drsId}/approve-delivery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success(type === 'direct' ? "Directly Completed" : "Delivery Approved");
                if (onRefresh) onRefresh();
            } else {
                toast.error("Failed to approve");
            }
        } catch (error) {
            toast.error("Error approving delivery");
        }
    };

    const handleApproveAll = async (drsId: string, type: 'standard' | 'direct' = 'standard') => {
        const actionText = type === 'direct' ? "Force Complete ALL shipments?" : "Approve all RIDER DELIVERED shipments?";
        if (!confirm(actionText)) return;

        try {
            const res = await fetch(`/api/drs/${drsId}/approve-all`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ type })
            });

            if (res.ok) {
                const data = await res.json();
                toast.success(data.message);
                if (onRefresh) onRefresh();
            } else {
                toast.error("Failed to approve all");
            }
        } catch (error) {
            toast.error("Error approving deliveries");
        }
    };

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-center text-lg font-semibold">
                    {title}
                    <Badge variant="outline">{data?.length || 0} Records</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>DRS ID</TableHead>
                            <TableHead>Rider</TableHead>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Pincodes</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Shipments</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.map((drs, idx) => {
                            const pendingCount = drs.shipments?.filter((s: any) => s.status === 'pending_for_branch_approval' || s.status === 'pending_approval' || s.status === 'undelivered').length || 0;
                            return (
                                <Fragment key={drs.id || drs._id || idx}>
                                    <TableRow className="group hover:bg-muted/50 transition-colors">
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                onClick={() => setExpandedDRS(expandedDRS === (drs.id || drs._id) ? null : (drs.id || drs._id))}
                                            >
                                                <ChevronDown className={`h-4 w-4 transition-transform ${expandedDRS === (drs.id || drs._id) ? 'rotate-180' : ''}`} />
                                            </Button>
                                        </TableCell>
                                        <TableCell className="font-mono font-medium text-primary">
                                            {drs.drsNumber || drs.drsId || drs.id || drs._id?.substring(0, 8)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm">
                                                <User className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                                                <span className="font-medium">{drs.rider?.name || "Unassigned"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize text-[10px] h-5">
                                                {drs.vehicleMode || '-'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1 max-w-[120px]">
                                                {drs.pincodes?.slice(0, 1).map((pin: string) => (
                                                    <Badge key={pin} variant="secondary" className="text-[10px] h-4">
                                                        {pin}
                                                    </Badge>
                                                ))}
                                                {drs.pincodes?.length > 1 && (
                                                    <Badge variant="secondary" className="text-[10px] h-4">
                                                        +{drs.pincodes.length - 1}
                                                    </Badge>
                                                )}
                                                {(!drs.pincodes || drs.pincodes.length === 0) && '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    drs.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        drs.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''
                                                }
                                            >
                                                {drs.status?.replace('_', ' ').toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-xs font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {drs.date || (drs.createdAt ? new Date(drs.createdAt).toLocaleDateString() : '-')}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                <Package className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span className="font-medium">{drs.shipments?.length || 0}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent align="end" className="rounded-xl">
                                                        {pendingCount > 0 && (
                                                            <DropdownMenuItem
                                                                className="flex items-center gap-2 rounded-lg text-blue-600 focus:text-blue-700 font-medium"
                                                                onClick={() => handleApproveAll(drs.id || drs._id, 'standard')}
                                                            >
                                                                <CheckCircle2 className="h-4 w-4" />
                                                                Approve Delivered
                                                            </DropdownMenuItem>
                                                        )}
                                                        {/* Direct Force Complete All */}
                                                        {drs.status !== 'completed' && (
                                                            <DropdownMenuItem
                                                                className="flex items-center gap-2 rounded-lg text-red-600 focus:text-red-700 font-medium mt-1 bg-red-50 hover:bg-red-100"
                                                                onClick={() => handleApproveAll(drs.id || drs._id, 'direct')}
                                                            >
                                                                <Zap className="h-4 w-4" />
                                                                Direct Force Complete
                                                            </DropdownMenuItem>
                                                        )}

                                                        <DropdownMenuItem
                                                            className="flex items-center gap-2 rounded-lg"
                                                            onClick={() => setExpandedDRS(expandedDRS === (drs.id || drs._id) ? null : (drs.id || drs._id))}
                                                        >
                                                            <Package className="h-4 w-4" />
                                                            View Shipments
                                                        </DropdownMenuItem>
                                                        {onViewDetails && (
                                                            <DropdownMenuItem
                                                                className="flex items-center gap-2 rounded-lg"
                                                                onClick={() => onViewDetails(drs)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                View Full Details
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                                                            <FileText className="h-4 w-4" />
                                                            Download PDF
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                    {/* COLLAPSIBLE ROW FOR SHIPMENT DETAILS */}
                                    {
                                        expandedDRS === (drs.id || drs._id) && (
                                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                                <TableCell colSpan={10} className="p-4">
                                                    <div className="rounded-lg border bg-card p-4 shadow-sm animate-in fade-in slide-in-from-top-2">
                                                        <div className="mb-3 flex items-center justify-between">
                                                            <h4 className="text-sm font-semibold text-foreground">Shipment Details ({drs.shipments?.length || 0})</h4>
                                                            <div className="flex gap-2">
                                                                {drs.status !== 'completed' && (
                                                                    <Button size="sm" onClick={() => handleApproveAll(drs.id || drs._id, 'direct')} variant="outline" className="h-8 border-red-200 text-red-700 hover:bg-red-50 gap-2">
                                                                        <Zap className="h-3 w-3" />
                                                                        Force Complete All
                                                                    </Button>
                                                                )}
                                                                {pendingCount > 0 && (
                                                                    <Button size="sm" onClick={() => handleApproveAll(drs.id || drs._id, 'standard')} variant="outline" className="h-8 border-blue-200 text-blue-700 hover:bg-blue-50">
                                                                        Approve Pending ({pendingCount})
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="max-h-[300px] overflow-y-auto">
                                                            <Table>
                                                                <TableHeader className="bg-muted/50">
                                                                    <TableRow>
                                                                        <TableHead className="h-8 text-xs">AWB</TableHead>
                                                                        <TableHead className="h-8 text-xs">Pincode</TableHead>
                                                                        <TableHead className="h-8 text-xs">Status</TableHead>
                                                                        <TableHead className="h-8 text-xs">Inward Date</TableHead>
                                                                        <TableHead className="h-8 text-xs">Completed At</TableHead>
                                                                        <TableHead className="h-8 text-xs text-right">Action</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {drs.shipments?.map((ship: any, idx: number) => {
                                                                        const isPending = ship.status === 'pending_for_branch_approval' || ship.status === 'pending_approval';
                                                                        return (
                                                                            <TableRow key={idx} className="h-10 hover:bg-transparent">
                                                                                <TableCell className="text-sm font-medium">{ship.awb}</TableCell>
                                                                                <TableCell className="text-xs">{ship.receiver?.pincode || '-'}</TableCell>
                                                                                <TableCell>
                                                                                    <Badge
                                                                                        variant={ship.status === 'completed' ? 'success' : isPending ? 'outline' : ship.status === 'paused' ? 'destructive' : 'secondary'}
                                                                                        className={`text-[10px] h-5 ${isPending ? 'border-blue-500 text-blue-600 bg-blue-50' : ''}`}
                                                                                    >
                                                                                        {isPending ? 'Pending Approval' : ship.status === 'paused' && drs.status === 'paused' ? 'Paused' : (ship.status === 'completed' ? 'Delivered' : ship.status || 'pending')}
                                                                                    </Badge>
                                                                                </TableCell>
                                                                                <TableCell className="text-xs text-muted-foreground">
                                                                                    {ship.createdAt ? new Date(ship.createdAt).toLocaleString() : '-'}
                                                                                </TableCell>
                                                                                <TableCell className="text-xs text-muted-foreground">
                                                                                    {ship.deliveredAt ? new Date(ship.deliveredAt).toLocaleString() : '-'}
                                                                                </TableCell>
                                                                                <TableCell className="text-right">
                                                                                    <div className="flex gap-2 justify-end">
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="icon"
                                                                                            className="h-6 w-6 text-blue-600"
                                                                                            onClick={() => handleViewTracking(ship)}
                                                                                        >
                                                                                            <Eye className="h-3.5 w-3.5" />
                                                                                        </Button>

                                                                                        {isPending ? (
                                                                                            <Button
                                                                                                size="sm"
                                                                                                className="h-6 text-[10px] bg-blue-600 hover:bg-blue-700 text-white"
                                                                                                onClick={() => handleApproveDelivery(drs.id || drs._id, ship.awb, 'standard')}
                                                                                            >
                                                                                                Approve
                                                                                            </Button>
                                                                                        ) : (ship.status !== 'completed' && ship.status !== 'delivered') && (
                                                                                            <Button
                                                                                                variant="ghost"
                                                                                                size="icon"
                                                                                                className="h-6 w-6 text-green-600"
                                                                                                title="Direct Complete"
                                                                                                onClick={() => handleApproveDelivery(drs.id || drs._id, ship.awb, 'direct')}
                                                                                            >
                                                                                                <Zap className="h-3.5 w-3.5" />
                                                                                            </Button>
                                                                                        )}
                                                                                    </div>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        );
                                                                    })}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                        {pendingCount > 0 && (
                                                            <div className="mt-4 flex justify-end">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-9 border-blue-200 text-blue-700 hover:bg-blue-50 gap-2 px-4"
                                                                    onClick={() => handleApproveAll(drs.id || drs._id, 'standard')}
                                                                >
                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                    Approve All Pending ({pendingCount})
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                </Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>

            <TrackingDialog
                open={trackingOpen}
                onOpenChange={setTrackingOpen}
                shipment={trackingShipment}
            />
        </Card>
    );
};
