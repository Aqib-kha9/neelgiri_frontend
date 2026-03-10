"use client";

import { PackagePlus } from "lucide-react";
import PublicBookingForm from "@/components/booking/PublicBookingForm";

import PublicLayout from "@/components/layout/PublicLayout";

export default function BookingPage() {
    return (
        <PublicLayout>
            <div className="min-h-screen bg-muted/30">
                {/* Hero Header */}
                <div className="bg-primary/5 pb-16 pt-12 md:pt-20 px-6">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
                            <PackagePlus className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                            Book a Shipment
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                            Send packages anywhere in the country. Simple, fast, and secure.
                        </p>
                    </div>
                </div>

                {/* Form Container */}
                <div className="max-w-4xl mx-auto px-6 -mt-8 pb-20">
                    <PublicBookingForm />
                </div>
            </div>
        </PublicLayout>
    );
}
