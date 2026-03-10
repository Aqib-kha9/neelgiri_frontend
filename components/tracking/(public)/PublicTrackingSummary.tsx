"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Clock,
    Package,
    Truck,
    CheckCircle2,
    AlertCircle,
    XCircle,
    QrCode,
    CreditCard,
    Ruler,
    Zap
} from "lucide-react";

interface PublicTrackingSummaryProps {
    tracking: any;
}

const statusConfig: any = {
    pending: {
        label: "Pending",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: Clock,
    },
    in_transit: {
        label: "In Transit",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Truck,
    },
    out_for_delivery: {
        label: "Out for Delivery",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Package,
    },
    delivered: {
        label: "Delivered",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle2,
    },
    exception: {
        label: "Exception",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: AlertCircle,
    },
    returned: {
        label: "Returned",
        color: "bg-orange-100 text-orange-800 border-orange-200",
        icon: XCircle,
    },
};

const PublicTrackingSummary = ({ tracking }: PublicTrackingSummaryProps) => {
    const status = statusConfig[tracking.status] || statusConfig.pending;
    const StatusIcon = status.icon;

    return (
        <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
            <CardContent className="p-0">
                {/* Header */}
                <div className="p-6 border-b border-border/70">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-primary/10 p-2.5">
                                <StatusIcon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">
                                    Tracking Number
                                </p>
                                <div className="flex items-center gap-2">
                                    <p className="font-mono font-bold text-xl text-foreground tracking-tight">
                                        {tracking.awbNumber}
                                    </p>
                                    <QrCode className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-2 w-fit ${status.color}`}>
                            {status.label}
                        </div>
                    </div>
                </div>

                {/* Info Grid - Masked Data */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Column 1: Package & Service Details */}
                    <div className="space-y-6">
                        {/* Package Type & Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Package className="h-4 w-4 text-primary" />
                                Package Details
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/50">
                                <div>
                                    <p className="text-muted-foreground text-xs uppercase tracking-wider">Type</p>
                                    <p className="font-medium">{tracking.package.type}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs uppercase tracking-wider">Weight</p>
                                    <p className="font-medium">{tracking.package.weight}</p>
                                </div>
                                {tracking.package.dimensions && (
                                    <div className="col-span-2 flex items-center gap-2">
                                        <Ruler className="h-3 w-3 text-muted-foreground" />
                                        <span>{tracking.package.dimensions}</span>
                                    </div>
                                )}
                                <div className="col-span-2 pt-2 border-t border-border/50">
                                    <p className="text-muted-foreground text-xs uppercase tracking-wider">Contents</p>
                                    <p className="font-medium">{tracking.package.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Service & Payment */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider">
                                    <Zap className="h-3 w-3" /> Service
                                </div>
                                <Badge variant="outline" className={tracking.package.serviceType === 'Express' ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-blue-50 text-blue-700 border-blue-200"}>
                                    {tracking.package.serviceType || "Standard"}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider">
                                    <CreditCard className="h-3 w-3" /> Payment
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{tracking.package.paymentMode || "Prepaid"}</span>
                                    {tracking.package.codAmount && tracking.package.codAmount !== '-' && (
                                        <Badge variant="secondary" className="text-xs h-5 px-1.5">{tracking.package.codAmount}</Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Status & Location */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                Delivery Status
                            </h3>
                            <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border/50">
                                <div className="relative pl-6 border-l-2 border-primary/20 space-y-4 pb-1">
                                    <div className="relative">
                                        <span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Destination</p>
                                        <p className="font-medium text-base">
                                            {tracking.customer.city}, {tracking.customer.pincode}
                                        </p>
                                        <p className="text-xs text-muted-foreground bg-muted w-fit px-1.5 py-0.5 rounded mt-1">
                                            Full Address Masked for Privacy
                                        </p>
                                    </div>

                                    <div className="relative pt-4">
                                        <span className="absolute -left-[29px] top-5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Current Location</p>
                                                <p className="font-medium text-base">{tracking.location.current}</p>
                                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" /> Updated: {tracking.location.lastScan}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expected Delivery */}
                                    <div className="relative pt-4 border-t border-border/40 mt-4 border-dashed">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Clock className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Expected Delivery</p>
                                                <p className="font-medium text-base text-primary">
                                                    {new Date(tracking.timeline.expectedDelivery).toLocaleDateString('en-IN', {
                                                        weekday: 'long',
                                                        day: 'numeric',
                                                        month: 'long'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PublicTrackingSummary;
