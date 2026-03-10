"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Clock, CheckCircle2, Circle } from "lucide-react";

interface PublicTimelineProps {
    timeline: any;
    status: string;
}

const PublicTimeline = ({ timeline, status }: PublicTimelineProps) => {
    const steps = [
        {
            label: "Shipment Created",
            date: timeline.shipped,
            completed: true,
        },
        {
            label: "In Transit",
            date: timeline.lastUpdate, // Simplified logic
            completed: status === "in_transit" || status === "out_for_delivery" || status === "delivered",
        },
        {
            label: "Out for Delivery",
            date: status === "out_for_delivery" ? timeline.lastUpdate : null,
            completed: status === "out_for_delivery" || status === "delivered",
        },
        {
            label: "Delivered",
            date: timeline.actualDelivery,
            completed: status === "delivered",
        },
    ];

    return (
        <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="h-5 w-5 text-primary" />
                    Shipment Progress
                </CardTitle>
                <CardDescription>
                    Tracking events for this package
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative space-y-0 pl-2">
                    {/* Timeline Line */}
                    <div className="absolute top-2 bottom-4 left-[21px] w-0.5 bg-border/60" />

                    {steps.map((step, index) => (
                        <div key={index} className="relative flex gap-4 pb-8 last:pb-0 group">
                            <div className="relative z-10 flex h-11 w-11 items-center justify-center">
                                <div className={`
                            h-3 w-3 rounded-full border-2 ring-4 ring-background transition-all
                            ${step.completed
                                        ? "bg-primary border-primary"
                                        : "bg-muted border-muted-foreground/30"
                                    }
                        `} />
                            </div>
                            <div className="flex flex-col pt-2.5">
                                <p className={`text-sm font-medium leading-none ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                                    {step.label}
                                </p>
                                {step.date && (
                                    <p className="text-xs text-muted-foreground mt-1.5 font-mono">
                                        {new Date(step.date).toLocaleString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default PublicTimeline;
