import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Truck, Package, User, Calendar, History as HistoryIcon, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ShipmentDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    shipment: any;
}

export const ShipmentDetailsDialog = ({
    open,
    onOpenChange,
    shipment,
}: ShipmentDetailsDialogProps) => {
    if (!shipment) return null;

    const getStatusConfig = (status: string) => {
        const s = (status || "").toLowerCase().trim();
        switch (s) {
            case 'forwarded':
            case 'inwarded':
                return { label: "Not Scheduled", variant: "bg-yellow-100 text-yellow-800 border-yellow-200" };
            case 'scheduled':
                return { label: "Scheduled", variant: "bg-blue-100 text-blue-800 border-blue-200" };
            case 'out_for_delivery':
                return { label: "In Progress", variant: "bg-purple-100 text-purple-800 border-purple-200" };
            case 'delivered':
            case 'completed':
                return { label: "Completed", variant: "bg-green-100 text-green-800 border-green-200" };
            case 'paused':
                return { label: "Paused", variant: "bg-orange-100 text-orange-800 border-orange-200" };
            default:
                return { label: status, variant: "bg-gray-100 text-gray-800 border-gray-200" };
        }
    };

    const statusConfig = getStatusConfig(shipment.status);
    const isCompleted = ['delivered', 'completed'].includes(shipment.status?.toLowerCase());
    const isScheduled = ['scheduled', 'out_for_delivery', 'delivered', 'completed'].includes(shipment.status?.toLowerCase());

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Package className="h-5 w-5 text-primary" />
                        Shipment Details
                    </DialogTitle>
                    <DialogDescription>
                        Full information about AWB: <span className="font-mono font-bold text-foreground">{shipment.awb || shipment.awbNumber}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 pt-2">
                    {/* Status Banner */}
                    <div className={cn("p-4 rounded-lg border flex items-center gap-3", statusConfig.variant)}>
                        {isCompleted ? (
                            <CheckCircle2 className="h-6 w-6" />
                        ) : (
                            <Truck className="h-6 w-6" />
                        )}
                        <div>
                            <h4 className="font-semibold text-sm uppercase tracking-wide">Current Status</h4>
                            <p className="text-lg font-bold">{statusConfig.label}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-1">Receiver Info</h4>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">Name</p>
                                    <p className="font-medium">{shipment.receiver?.name || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Phone</p>
                                    <p className="font-medium">{shipment.receiver?.phone || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Address</p>
                                    <p className="text-sm">{shipment.receiver?.address || "N/A"}</p>
                                    <p className="text-sm border-t mt-1 pt-1 font-mono">{shipment.receiver?.pincode}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-1">Scheduling Info</h4>
                            {isScheduled || isCompleted ? (
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <User className="h-4 w-4 text-muted-foreground mt-1" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Assigned Rider</p>
                                            <p className="font-medium">
                                                {shipment.drs?.rider?.name || shipment.rider?.name || "Rider Assigned"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Scheduled Date</p>
                                            <p className="font-medium">
                                                {shipment.scheduledDate ? format(new Date(shipment.scheduledDate), 'dd MMM yyyy') : "Date Assigned"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-4 bg-muted/10 rounded-lg border border-dashed">
                                    <Calendar className="h-8 w-8 mb-2 opacity-20" />
                                    <p className="text-sm font-medium">Not Scheduled Yet</p>
                                    <p className="text-xs">Add to a DRS to schedule delivery.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-1">Package Details</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground">Weight</p>
                                <p className="font-medium">{shipment.weight} kg</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Payment Mode</p>
                                <Badge variant="outline">{shipment.paymentMode || "Prepaid"}</Badge>
                            </div>
                        </div>
                    </div>

                    {/* MOVEMENT HISTORY */}
                    <div className="space-y-4 pt-4 border-t">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pb-1 flex items-center gap-2">
                            <HistoryIcon className="h-4 w-4" /> Movement History
                        </h4>
                        <div className="relative border-l-2 border-muted ml-3 space-y-6 pb-2">
                            {shipment.history && shipment.history.length > 0 ? (
                                [...shipment.history].reverse().map((event: any, idx: number) => (
                                    <div key={idx} className="relative pl-6">
                                        <div className={cn("absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-background flex items-center justify-center", idx === 0 ? "border-primary" : "border-muted")}>
                                            {idx === 0 && <div className="h-2 w-2 rounded-full bg-primary" />}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm capitalize">
                                                    {event.status?.replace('_', ' ') || "Update"}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {format(new Date(event.timestamp), "d MMM, h:mm a")}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {event.remark || "Status updated"}
                                            </p>
                                            {event.branchId && (
                                                <div className="flex items-center gap-1 text-xs text-primary/80 mt-0.5 font-medium bg-primary/5 w-fit px-2 py-0.5 rounded">
                                                    <MapPin className="h-3 w-3" />
                                                    {event.branchId.name || "Branch"}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground pl-6">No history available</p>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Close Details</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
