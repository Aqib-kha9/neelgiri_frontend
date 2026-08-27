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
    const [todayCount, setTodayCount] = useState(0);

    const handleBookingSuccess = (bookingId: string) => {
        // Show toast or sound effect here
        setTodayCount(prev => prev + 1);
    };

    return (
        <div className="min-h-[calc(100vh-6rem)] p-3 sm:p-6">
            {/* Main Work Area */}
            <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-1 flex-col">
                <header className="mb-4 flex flex-none flex-col gap-4 rounded-2xl border bg-card/70 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight">Booking Desk</h1>
                            <Badge variant="outline" className="gap-1 bg-primary/5 text-primary border-primary/20">
                                <Zap className="w-3 h-3" /> {activeMode === "rapid" ? "High-volume mode" : "Guided mode"}
                            </Badge>
                            <Badge variant="secondary" className="font-mono">{todayCount} this session</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Rapid entry is optimized for repetitive booking. Keep the sender locked and change only receiver and parcel details.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start bg-muted/30 p-1 rounded-lg border border-border/40 sm:self-auto">
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
