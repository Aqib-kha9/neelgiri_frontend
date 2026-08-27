"use client";

import { Wallet, Shield } from "lucide-react";

interface WizardHeaderProps {
    session: any;
}

export function WizardHeader({ session }: WizardHeaderProps) {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border bg-card/80 p-4 shadow-sm sm:p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                    <Shield className="h-5 w-5" />
                </div>
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                            Create a shipment
                        </h1>
                        <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-700">
                            Secure booking
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Add pickup, delivery and parcel details. Your live quote updates as you go.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 px-3 py-2.5 md:min-w-[150px]">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Wallet className="h-4 w-4" />
                </div>
                <div>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        Billing account
                    </p>
                    <p className="text-sm font-semibold">
                        {session?.user?.billingType || 'SME'}
                    </p>
                </div>
            </div>
        </div>
    );
}
