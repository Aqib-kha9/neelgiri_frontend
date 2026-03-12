"use client";

import { Badge } from "@/components/ui/badge";
import { Wallet, Shield, ChevronRight } from "lucide-react";

interface WizardHeaderProps {
    session: any;
}

export function WizardHeader({ session }: WizardHeaderProps) {
    return (
        <section className="rounded-3xl border border-border/70 bg-card p-8 shadow-sm">
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-6">
                <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-2">
                        <Badge className="rounded-full bg-primary/10 px-3 py-1 text-primary border-none font-bold text-[10px] tracking-widest uppercase">
                            Enterprise Booking Portal
                        </Badge>
                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Shipment Protocol</span>
                    </div>
                    
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tighter text-foreground">
                            Create <span className="text-primary">New Booking</span>
                        </h1>
                        <p className="max-w-xl text-sm text-muted-foreground font-medium">
                            Efficiently register shipments with real-time rate validation and automated master data recall.
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 p-3 pr-6 transition-all hover:bg-muted/50">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Wallet className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Account Type</p>
                            <p className="text-sm font-bold text-foreground">Verified Corporate - {session?.user?.billingType || 'SME'}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 p-3 pr-6 transition-all hover:bg-muted/50">
                        <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
                            <Shield className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Rate Plan</p>
                            <p className="text-sm font-bold text-foreground">Tier 1 SME Gold</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
