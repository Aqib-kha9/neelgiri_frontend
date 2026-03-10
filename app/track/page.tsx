"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ArrowRight, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/layout/PublicLayout";
import PublicTrackingSummary from "@/components/tracking/(public)/PublicTrackingSummary";
import PublicTimeline from "@/components/tracking/(public)/PublicTimeline";
import { customerTrackingData } from "@/components/tracking/(portal)/data/mockData";

export default function PublicTrackingPage() {
    const [awbInput, setAwbInput] = useState("");
    const [trackingResult, setTrackingResult] = useState<any>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const searchParams = useSearchParams();

    useEffect(() => {
        const awbParam = searchParams.get("awb");
        if (awbParam) {
            setAwbInput(awbParam);
            setTimeout(() => {
                const data = customerTrackingData.find(
                    (t) => t.awbNumber.toLowerCase() === awbParam.toLowerCase().trim()
                );
                setTrackingResult(data || null);
                setHasSearched(true);
            }, 500);
        }
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!awbInput.trim()) return;

        // Simulate API delay
        setTimeout(() => {
            const data = customerTrackingData.find(
                (t) => t.awbNumber.toLowerCase() === awbInput.toLowerCase().trim()
            );
            setTrackingResult(data || null);
            setHasSearched(true);
        }, 500);
    };

    return (
        <PublicLayout>
            <div className="min-h-screen bg-muted/30">
                {/* Hero Search Section */}
                <div className="bg-primary/5 pb-12 pt-12 md:pt-20 px-6">
                    {/* ... existing content ... */}
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
                            <Truck className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                            Track Your Shipment
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                            Enter your AWB number to get real-time status updates of your package.
                        </p>

                        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto relative mt-8">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Enter AWB Number (e.g. HJD292412510)"
                                    className="pl-9 h-12 text-lg rounded-xl shadow-sm border-primary/20 focus-visible:ring-primary/30"
                                    value={awbInput}
                                    onChange={(e) => setAwbInput(e.target.value)}
                                />
                            </div>
                            <Button size="lg" className="h-12 px-6 rounded-xl text-base shadow-md transition-all hover:shadow-lg">
                                Track
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>

                        <div className="flex gap-4 justify-center text-xs text-muted-foreground pt-4">
                            <span>Examples:</span>
                            <button onClick={() => setAwbInput("HJD292412510")} className="hover:text-primary hover:underline font-medium">HJD292412510</button>
                            <span className="opacity-30">|</span>
                            <button onClick={() => setAwbInput("HJD292412511")} className="hover:text-primary hover:underline font-medium">HJD292412511</button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="max-w-5xl mx-auto px-6 py-12">
                    {hasSearched && !trackingResult && (
                        <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border/60">
                            <div className="inline-flex items-center justify-center p-4 bg-muted mb-4 rounded-full">
                                <Search className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">Order Not Found</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                                We couldn't find any shipment with AWB <strong>{awbInput}</strong>. Please check the number and try again.
                            </p>
                        </div>
                    )}

                    {hasSearched && trackingResult && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <PublicTrackingSummary tracking={trackingResult} />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <PublicTimeline timeline={trackingResult.timeline} status={trackingResult.status} />
                                </div>
                                <div>
                                    {/* Additional Info / CTAs could go here */}
                                    <div className="bg-card rounded-2xl border border-border/60 p-6 space-y-4">
                                        <h4 className="font-semibold text-sm">Need Help?</h4>
                                        <p className="text-sm text-muted-foreground">
                                            If you have issues with your delivery, our support team is here to help.
                                        </p>
                                        <Button variant="outline" className="w-full">
                                            Contact Support
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
