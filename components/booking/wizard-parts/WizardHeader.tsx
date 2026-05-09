"use client";

import { Wallet, Shield } from "lucide-react";

interface WizardHeaderProps {
    session: any;
}

export function WizardHeader({ session }: WizardHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    Create Booking
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Enter details to generate a new shipment
                </p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Wallet className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Account</p>
                        <p className="text-sm font-medium">{session?.user?.billingType || 'SME'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
