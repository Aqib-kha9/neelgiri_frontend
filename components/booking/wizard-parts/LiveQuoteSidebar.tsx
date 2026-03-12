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
        <Card className="h-full border-2 border-primary/20 bg-card shadow-xl overflow-hidden flex flex-col relative group">
            {/* Loading Overlay */}
            {isPricingLoading && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        <p className="text-[10px] uppercase font-black tracking-widest text-primary">Live Pricing Update</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="p-6 bg-primary text-white space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <Receipt className="h-4 w-4" /> Booking Summary
                    </h3>
                    <Badge variant="outline" className="border-white/30 text-white text-[9px] font-black uppercase tracking-widest">
                        Draft
                    </Badge>
                </div>
                <div className="pt-2">
                    <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Route Analysis</p>
                    <p className="text-sm font-black truncate">{formData.senderCity || 'Origin'} → {formData.receiverCity || 'Destination'}</p>
                </div>
            </div>

            {/* Price Breakdown */}
            <div className="flex-1 p-6 space-y-5">
                <div className="space-y-4">
                    <div className="flex justify-between items-center group/item cursor-help">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Base Freight</span>
                            <Info className="h-3 w-3 text-muted-foreground/30 group-hover/item:text-primary transition-colors" />
                        </div>
                        <span className="text-sm font-bold tabular-nums">₹{pricing.baseFreight}</span>
                    </div>
                    
                    <div className="flex justify-between items-center group/item cursor-help">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Fuel Surcharge</span>
                        <span className="text-sm font-bold tabular-nums">₹{pricing.fuelSurcharge}</span>
                    </div>

                    {pricing.odaSurcharge > 0 && (
                        <div className="flex justify-between items-center p-2 rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-600">
                            <span className="text-[10px] font-black uppercase tracking-widest">ODA Surcharge</span>
                            <span className="text-sm font-bold tabular-nums">₹{pricing.odaSurcharge}</span>
                        </div>
                    )}

                    {pricing.codCharge > 0 && (
                        <div className="flex justify-between items-center text-primary">
                            <span className="text-[10px] font-black uppercase tracking-widest">COD Charge</span>
                            <span className="text-sm font-bold tabular-nums">₹{pricing.codCharge}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center text-success">
                        <span className="text-[10px] font-black uppercase tracking-widest">Transit Insurance</span>
                        <span className="text-sm font-bold tabular-nums">₹{pricing.insuranceAmount}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">GST ({pricing.gstRate}%)</span>
                        <span className="text-sm font-bold tabular-nums">₹{pricing.taxAmount}</span>
                    </div>
                </div>

                <div className="py-2">
                    <Separator className="bg-border/60" />
                </div>

                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Consolidated Total</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black tracking-tighter tabular-nums text-foreground">₹{pricing.netAmount}</span>
                        <span className="text-xs font-bold text-muted-foreground uppercase">Inc. Tax</span>
                    </div>
                </div>
            </div>

            {/* Footer Metrics */}
            <div className="p-6 bg-muted/50 border-t border-border/60 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[9px] font-black text-muted-foreground/70 uppercase tracking-widest mb-1">Billing Type</p>
                        <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest bg-background border-border">
                            {session?.user?.billingType || 'Unknown'}
                        </Badge>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black text-muted-foreground/70 uppercase tracking-widest mb-1">Billable Load</p>
                        <p className="text-lg font-black text-primary tabular-nums">{pricing.chargeableWeight.toFixed(1)} KG</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
