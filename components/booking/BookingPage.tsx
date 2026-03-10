"use client";

import { useState } from "react";
import { Zap, LayoutGrid, Clock, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RapidEntryForm from "./rapid/RapidEntryForm";
import WizardBookingForm from "./wizard/WizardBookingForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock recent bookings for the sidebar
const recentBookings = [
    { id: "BKG-9921", dest: "Mumbai", amount: "₹450", time: "2 mins ago", status: "Booked" },
    { id: "BKG-9920", dest: "Delhi", amount: "₹1,200", time: "5 mins ago", status: "Manifested" },
    { id: "BKG-9919", dest: "Bangalore", amount: "₹850", time: "12 mins ago", status: "Booked" },
];

const BookingPage = () => {
    const [activeMode, setActiveMode] = useState<"rapid" | "wizard">("rapid");
    const [todayCount, setTodayCount] = useState(42);

    const handleBookingSuccess = (bookingId: string) => {
        // Show toast or sound effect here
        setTodayCount(prev => prev + 1);
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] gap-6 p-6">
            {/* Main Work Area */}
            <div className="flex-1 flex flex-col min-w-0 max-w-5xl mx-auto w-full">
                <header className="flex items-center justify-between mb-6 flex-none">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight">Create Booking</h1>
                            <Badge variant="outline" className="gap-1 bg-primary/5 text-primary border-primary/20">
                                <Zap className="w-3 h-3" /> Rapid Mode Active
                            </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            High-speed entry for branch operations. Press <kbd className="px-1 py-0.5 rounded bg-muted border text-xs font-mono">Tab</kbd> to navigate.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg border border-border/40">
                        <Button
                            variant={activeMode === "rapid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setActiveMode("rapid")}
                            className="h-8 text-xs gap-2"
                        >
                            <Zap className="w-3 h-3" /> Rapid Entry
                        </Button>
                        <Button
                            variant={activeMode === "wizard" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setActiveMode("wizard")}
                            className="h-8 text-xs gap-2"
                        >
                            <LayoutGrid className="w-3 h-3" /> Wizard
                        </Button>
                    </div>
                </header>

                <main className="flex-1 min-h-0">
                    {activeMode === "rapid" ? (
                        <RapidEntryForm onSuccess={handleBookingSuccess} />
                    ) : (
                        <WizardBookingForm onSuccess={handleBookingSuccess} />
                    )}
                </main>
            </div>
        </div>
    );
};

export default BookingPage;
