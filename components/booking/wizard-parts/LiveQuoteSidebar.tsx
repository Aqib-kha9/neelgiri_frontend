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
    const money = (value: number) => value.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return (
        <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl border-border/70 shadow-sm">
            {isPricingLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            )}

            <div className="space-y-3 border-b bg-muted/20 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                    <h3 className="flex items-center gap-2 font-semibold">
                        <Receipt className="h-4 w-4 text-primary" /> Live quote
                    </h3>
                    <Badge variant="outline" className="text-[10px] font-normal">
                        Estimate
                    </Badge>
                </div>
                <div className="rounded-xl border bg-background p-3">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Route</p>
                    <p className="mt-1 truncate text-sm font-semibold">
                        {formData.senderCity || 'Pickup location'}
                        <span className="px-1 text-muted-foreground">→</span>
                        {formData.receiverCity || 'Delivery location'}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {formData.mode === 'AIR' ? 'Air service' : 'Surface service'}
                        {' · '}{pricing.chargeableWeight.toFixed(1)} kg chargeable
                    </p>
                </div>
            </div>

            <div className="flex-1 space-y-5 p-4 sm:p-5">
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Base freight</span>
                        <span className="font-medium">₹{money(pricing.baseFreight)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Fuel surcharge</span>
                        <span className="font-medium">₹{money(pricing.fuelSurcharge)}</span>
                    </div>
                    {pricing.odaSurcharge > 0 && (
                        <div className="flex items-center justify-between text-sm text-amber-600">
                            <span>ODA surcharge</span>
                            <span className="font-medium">₹{money(pricing.odaSurcharge)}</span>
                        </div>
                    )}
                    {pricing.codCharge > 0 && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">COD charge</span>
                            <span className="font-medium">₹{money(pricing.codCharge)}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Transit insurance</span>
                        <span className="font-medium">₹{money(pricing.insuranceAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">GST ({pricing.gstRate}%)</span>
                        <span className="font-medium">₹{money(pricing.taxAmount)}</span>
                    </div>
                </div>

                <Separator />

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <p className="text-sm text-muted-foreground">Estimated total</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-semibold tracking-tight text-foreground">₹{money(pricing.netAmount)}</span>
                        <span className="text-xs text-muted-foreground">Inc. tax</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border bg-muted/20 p-3">
                        <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">Billing type</p>
                        <Badge variant="secondary" className="font-normal">
                            {session?.user?.billingType || 'Unknown'}
                        </Badge>
                    </div>
                    <div className="rounded-lg border bg-muted/20 p-3 text-right">
                        <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">Chargeable weight</p>
                        <p className="text-sm font-semibold">{pricing.chargeableWeight.toFixed(1)} kg</p>
                    </div>
                </div>

                <div className="flex items-start gap-2 rounded-lg border border-dashed bg-background/60 p-3 text-xs text-muted-foreground">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    Final charges are confirmed before the shipment is booked.
                </div>
            </div>
        </Card>
    );
}
