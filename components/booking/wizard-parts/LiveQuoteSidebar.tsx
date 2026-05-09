"use client";

import { Loader2, Info, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface LiveQuoteSidebarProps {
    pricing: any;
    formData: any;
    session: any;
    isPricingLoading: boolean;
}

export function LiveQuoteSidebar({ pricing, formData, session, isPricingLoading }: LiveQuoteSidebarProps) {
    return (
        <Card className="h-full flex flex-col relative">
            {/* Loading Overlay */}
            {isPricingLoading && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center z-50">
                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                </div>
            )}

            {/* Header */}
            <div className="p-6 border-b space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-muted-foreground" /> Booking Summary
                    </h3>
                </div>
                <div className="pt-2">
                    <p className="text-sm text-muted-foreground">Route</p>
                    <p className="text-base font-medium truncate">{formData.senderCity || 'Origin'} → {formData.receiverCity || 'Destination'}</p>
                </div>
            </div>

            {/* Price Breakdown */}
            <div className="flex-1 p-6 space-y-5">
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Base Freight</span>
                        <span className="font-medium">₹{pricing.baseFreight}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Fuel Surcharge</span>
                        <span className="font-medium">₹{pricing.fuelSurcharge}</span>
                    </div>

                    {pricing.odaSurcharge > 0 && (
                        <div className="flex justify-between items-center text-sm text-amber-600">
                            <span>ODA Surcharge</span>
                            <span className="font-medium">₹{pricing.odaSurcharge}</span>
                        </div>
                    )}

                    {pricing.codCharge > 0 && (
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">COD Charge</span>
                            <span className="font-medium">₹{pricing.codCharge}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Transit Insurance</span>
                        <span className="font-medium">₹{pricing.insuranceAmount}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">GST ({pricing.gstRate}%)</span>
                        <span className="font-medium">₹{pricing.taxAmount}</span>
                    </div>
                </div>

                <Separator />

                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-semibold tracking-tight text-foreground">₹{pricing.netAmount}</span>
                        <span className="text-xs text-muted-foreground">Inc. Tax</span>
                    </div>
                </div>
            </div>

            {/* Footer Metrics */}
            <div className="p-6 bg-muted/20 border-t space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Billing Type</p>
                        <Badge variant="secondary" className="font-normal">
                            {session?.user?.billingType || 'Unknown'}
                        </Badge>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">Chargeable Weight</p>
                        <p className="text-base font-medium">{pricing.chargeableWeight.toFixed(1)} KG</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
