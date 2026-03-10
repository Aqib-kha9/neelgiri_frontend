import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { cn } from "@/lib/utils";
import {
    MoreHorizontal,
    Eye,
    MapPin,
    Package,
    CheckCircle2,
    Zap
} from "lucide-react";
import { TrackingDialog } from "@/components/shared/TrackingDialog";

interface ShipmentTableProps {
    shipments: any[];
    title: string;
    description?: string;
    selectedShipments?: any[];
    onToggleShipment?: (shipment: any) => void;
    onViewDetails?: (shipment: any) => void;
    onActionComplete?: () => void;
}

export const ShipmentTable = ({
    shipments,
    title,
    description,
    selectedShipments = [],
    onToggleShipment,
    onViewDetails,
    onActionComplete
}: ShipmentTableProps) => {

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'not_scheduled':
                return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Not Scheduled</Badge>;
            case 'scheduled':
                return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Scheduled</Badge>;
            case 'in_progress':
                return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">In Progress</Badge>;
            case 'complete':
                return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
            case 'paused':
                return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">Paused</Badge>;
            default:
                return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
        }
    };

    const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
    const [shipmentToComplete, setShipmentToComplete] = useState<any>(null);
    const [completing, setCompleting] = useState(false);

    // Tracking State
    const [trackingOpen, setTrackingOpen] = useState(false);
    const [trackingShipment, setTrackingShipment] = useState<any>(null);

    const handleViewTracking = (shipment: any) => {
        setTrackingShipment(shipment);
        setTrackingOpen(true);
    };

    const handleDirectApprove = async (shipment: any) => {
        if (!confirm(`Directly approve shipment ${shipment.awb || shipment.awbNumber}? This will bypass rider delivery.`)) return;
        try {
            const awb = shipment.awb || shipment.awbNumber;
            const res = await fetch(`/api/shipments/${awb}/complete`, { // Re-using completion endpoint but logic needs to handle 'branch_direct'
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ completedVia: 'branch_direct' }) // Send flag
            });

            if (res.ok) {
                toast.success(`Shipment ${awb} directly approved`);
                onActionComplete?.();
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to approve");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error");
        }
    };

    const handleCompleteClick = (shipment: any) => {
        // STRICT RULE: Only 'not_scheduled' status can be completed
        if (shipment.status !== 'not_scheduled') {
            toast.error("You cannot complete this shipment because it is already scheduled or in progress.");
            return;
        }

        setShipmentToComplete(shipment);
        setCompleteDialogOpen(true);
    };

    const confirmComplete = async () => {
        if (!shipmentToComplete) return;
        setCompleting(true);
        try {
            const awb = shipmentToComplete.awb || shipmentToComplete.awbNumber;
            const res = await fetch(`/api/shipments/${awb}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ completedVia: 'manual' }) // Explicitly manual
            });

            if (res.ok) {
                toast.success(`Shipment ${awb} marked as completed`);
                onActionComplete?.(); // Refresh data
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to complete shipment");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error");
        } finally {
            setCompleting(false);
            setCompleteDialogOpen(false);
            setShipmentToComplete(null);
        }
    };

    const getInwardDate = (shipment: any) => {
        if (!shipment.history || !Array.isArray(shipment.history)) return 'N/A';
        // Find latest event that signifies arrival/inward
        // 'not_scheduled' (current standard), 'inwarded' (legacy), 'forwarded' (legacy)
        const event = [...shipment.history].reverse().find((h: any) =>
            ['not_scheduled', 'inwarded', 'forwarded', 'counter_inward'].includes(h.status)
        );
        return event ? new Date(event.timestamp).toLocaleString() : 'N/A';
    };

    return (
        <>
            <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                            {title}
                            <Badge variant="secondary" className="rounded-full">
                                {shipments.length}
                            </Badge>
                        </CardTitle>
                        {description && <CardDescription>{description}</CardDescription>}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30">
                                <TableHead className="w-[150px]">AWB</TableHead>
                                <TableHead>Consignee Details</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Inward Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {shipments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Package className="h-8 w-8 opacity-20" />
                                            <p>No shipments available</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                shipments.map((shipment) => (
                                    <TableRow key={shipment.awb || shipment.awbNumber} className="group hover:bg-muted/20">
                                        <TableCell className="font-mono font-medium text-primary">
                                            {shipment.awb || shipment.awbNumber}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-semibold">{shipment.receiver?.name || "N/A"}</span>
                                                <span className="text-xs text-muted-foreground">{shipment.receiver?.phone}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 status-badge">
                                                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span>{shipment.receiver?.pincode || "N/A"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-foreground">
                                                {getInwardDate(shipment)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(shipment.status || 'not_scheduled')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                {/* Eye Icon for Tracking */}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    onClick={() => handleViewTracking(shipment)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>

                                                {/* Direct Approve - Visible if NOT complete/delivered */}
                                                {(shipment.status !== 'complete' && shipment.status !== 'delivered') && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        title="Direct Approve"
                                                        onClick={() => handleDirectApprove(shipment)}
                                                    >
                                                        <Zap className="h-4 w-4" />
                                                    </Button>
                                                )}

                                                {onToggleShipment && (
                                                    <Button
                                                        variant={selectedShipments.some(s => (s.awb || s.awbNumber) === (shipment.awb || shipment.awbNumber)) ? "destructive" : "secondary"}
                                                        size="sm"
                                                        className="h-8 text-xs"
                                                        onClick={() => onToggleShipment(shipment)}
                                                    >
                                                        {selectedShipments.some(s => (s.awb || s.awbNumber) === (shipment.awb || shipment.awbNumber)) ? "Remove" : "Add to DRS"}
                                                    </Button>
                                                )}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => onViewDetails?.(shipment)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        {shipment.status !== 'complete' && (
                                                            <DropdownMenuItem
                                                                className={cn(
                                                                    "focus:bg-green-50",
                                                                    shipment.status !== 'not_scheduled'
                                                                        ? "text-muted-foreground cursor-not-allowed opacity-70"
                                                                        : "text-green-600 focus:text-green-700"
                                                                )}
                                                                onClick={(e) => {
                                                                    if (shipment.status !== 'not_scheduled') {
                                                                        e.preventDefault();
                                                                        toast.error("You cannot complete this shipment because it is already scheduled or in progress.");
                                                                        return;
                                                                    }
                                                                    handleCompleteClick(shipment);
                                                                }}
                                                            >
                                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                Mark Completed
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
                </CardContent>
            </Card>

            <AlertDialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Complete Shipment?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to mark shipment <strong>{shipmentToComplete?.awb || shipmentToComplete?.awbNumber}</strong> as completed?
                            This action indicates the shipment has been manually delivered or processed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={completing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => { e.preventDefault(); confirmComplete(); }}
                            disabled={completing}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {completing ? "Completing..." : "Confirm Complete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <TrackingDialog
                open={trackingOpen}
                onOpenChange={setTrackingOpen}
                shipment={trackingShipment}
            />
        </>
    );
};
