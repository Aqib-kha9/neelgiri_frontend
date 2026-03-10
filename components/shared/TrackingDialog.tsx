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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, Truck, MapPin, Calendar, User, ArrowRight, Circle, CheckCircle2, ArrowDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

interface TrackingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    shipment: any; // Can be a partial object with just { awb: ... }
}

export function TrackingDialog({ open, onOpenChange, shipment }: TrackingDialogProps) {
    const [fullShipment, setFullShipment] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Identify AWB from the passed prop (handle different naming conventions if any)
    const awbNumber = shipment?.awb || shipment?.awbNumber;

    useEffect(() => {
        if (open && awbNumber) {
            fetchTrackingDetails();
        } else {
            setFullShipment(null); // Reset on close
        }
    }, [open, awbNumber]);

    const fetchTrackingDetails = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/shipments/${awbNumber}/tracking`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setFullShipment(res.data);
        } catch (err) {
            console.error("Failed to fetch tracking:", err);
            setError("Failed to load tracking details.");
        } finally {
            setLoading(false);
        }
    };

    // Helper to format date and time separartely
    const formatDateTime = (dateString: string) => {
        if (!dateString) return { date: "N/A", time: "" };
        const dateObj = new Date(dateString);
        return {
            date: dateObj.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
            time: dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
        };
    };

    if (!shipment && !awbNumber) return null;

    // Use fullShipment if available (populated), else fallback to passed shipment (might be partial)
    const data = fullShipment || shipment;

    // Helper to clean remarks (remove ObjectIDs)
    const cleanRemark = (text: string) => {
        if (!text) return "";
        // Replace 24-char hex strings (ObjectIDs) with "Branch" or empty
        return text.replace(/\b[0-9a-fA-F]{24}\b/g, "Branch");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-background border-border shadow-2xl rounded-xl">
                {/* Header - Compact & Clean */}
                <div className="bg-primary/5 border-b border-border px-6 py-4 flex items-center justify-between">
                    <div>
                        <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
                            <Truck className="h-5 w-5 text-primary" />
                            Tracking Details
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            AWB: <span className="font-mono text-foreground font-semibold">{awbNumber || "N/A"}</span>
                        </p>
                    </div>
                    <Badge
                        variant={data.status === 'completed' || data.status === 'delivered' ? 'success' : 'secondary'}
                        className="px-3 py-0.5 text-xs uppercase tracking-wider font-semibold"
                    >
                        {data.status?.replace('_', ' ') || 'Unknown'}
                    </Badge>
                </div>

                {/* Receiver Info Bar */}
                <div className="bg-muted/30 border-b border-border px-6 py-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider block">Receiver</span>
                        <span className="font-medium text-foreground">{data.receiver?.name || "N/A"}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider block">Location/Branch</span>
                        <span className="font-medium text-foreground">
                            {data.destinationBranch?.name || data.currentBranch?.name || "In Transit"}
                        </span>
                    </div>
                </div>

                {/* Timeline Body */}
                <div className="flex-1 overflow-y-auto bg-background p-6">
                    {loading ? (
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex gap-4 animate-pulse">
                                    <div className="w-16 h-4 bg-muted rounded"></div>
                                    <div className="w-4 h-4 rounded-full bg-muted"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-3/4 bg-muted rounded"></div>
                                        <div className="h-3 w-1/2 bg-muted rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-10 text-destructive">{error}</div>
                    ) : (
                        <div className="relative">
                            {/* Vertical Connecting Line */}
                            <div className="absolute left-[87px] top-2 bottom-2 w-0.5 bg-border/60" />

                            <div className="space-y-8">
                                {data.history?.slice().reverse().map((event: any, index: number) => {
                                    const { date, time } = formatDateTime(event.timestamp);

                                    // Status Logic
                                    const isCompleted = ['complete', 'delivered'].includes(event.status);
                                    const isInward = event.status.includes('inward') || event.status === 'received';
                                    const isTransit = event.status.includes('transit') || event.status === 'forwarded';

                                    let icon = <Circle className="h-2.5 w-2.5 fill-current" />;
                                    let colorClass = "text-muted-foreground bg-background border-muted-foreground";
                                    let titleColor = "text-foreground";

                                    if (isCompleted) {
                                        icon = <CheckCircle2 className="h-4 w-4 text-white" />;
                                        colorClass = "bg-green-600 border-green-600 z-10";
                                        titleColor = "text-green-700 dark:text-green-400";
                                    } else if (isInward) {
                                        icon = <ArrowDown className="h-3.5 w-3.5 text-white" />;
                                        colorClass = "bg-blue-600 border-blue-600 z-10";
                                        titleColor = "text-blue-700 dark:text-blue-400";
                                    } else if (isTransit) {
                                        icon = <Truck className="h-3.5 w-3.5 text-white" />;
                                        colorClass = "bg-orange-500 border-orange-500 z-10";
                                        titleColor = "text-orange-700 dark:text-orange-400";
                                    } else {
                                        // Default/Created
                                        colorClass = "bg-slate-400 border-slate-400 text-white z-10";
                                        icon = <Package className="h-3.5 w-3.5" />;
                                    }

                                    return (
                                        <div key={index} className="relative flex gap-4 group">
                                            {/* Left: Time */}
                                            <div className="w-[70px] flex flex-col items-end text-right pt-0.5">
                                                <span className="text-xs font-bold text-foreground">{date.split(',')[0]}</span>
                                                <span className="text-[10px] font-medium text-muted-foreground">{time}</span>
                                            </div>

                                            {/* Center: Node */}
                                            <div className={cn(
                                                "relative flex-none w-9 h-9 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110",
                                                colorClass
                                            )}>
                                                {icon}
                                            </div>

                                            {/* Right: Content */}
                                            <div className="flex-1 pt-0.5 min-w-0">
                                                <h4 className={cn("text-sm font-bold capitalize leading-none mb-1.5", titleColor)}>
                                                    {event.status.replace(/_/g, ' ')}
                                                </h4>

                                                {/* Cleaned Remark */}
                                                <p className="text-sm text-foreground/80 leading-snug mb-2">
                                                    {cleanRemark(event.remark)}
                                                </p>

                                                {/* Meta Info Box */}
                                                <div className="flex flex-wrap gap-2 text-xs">
                                                    {event.branchId && (
                                                        <div className="flex items-center gap-1 text-muted-foreground bg-muted/60 px-2 py-1 rounded">
                                                            <MapPin className="h-3 w-3" />
                                                            <span className="font-medium">
                                                                {typeof event.branchId === 'object' ? event.branchId.name : "Branch"}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {event.updatedBy && (
                                                        <div className="flex items-center gap-1 text-muted-foreground bg-muted/60 px-2 py-1 rounded">
                                                            <User className="h-3 w-3" />
                                                            <span className="font-medium">
                                                                {typeof event.updatedBy === 'object' ? event.updatedBy.name : "System"}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-4 border-t border-border bg-muted/10">
                    <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Close Lookup</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
