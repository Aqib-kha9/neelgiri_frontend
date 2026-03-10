"use client";

import { Badge } from "@/components/ui/badge";
import { CalendarDays, Truck, ClipboardList } from "lucide-react";

const BookingHeader = () => {
  return (
    <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
      <div className="space-y-3">
        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">
          Booking Management
        </Badge>
        <div className="space-y-2">
          <h1 className="text-display-1 leading-tight">Create a New Booking</h1>
          <p className="max-w-2xl text-body">
            Manage all shipment details, pickup, and delivery addresses, and
            generate AWB labels instantly.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
            <CalendarDays className="h-3.5 w-3.5 text-primary" /> Same-day
            scheduling
          </span>
          <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
            <Truck className="h-3.5 w-3.5 text-success" /> Auto-route
            optimization
          </span>
          <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
            <ClipboardList className="h-3.5 w-3.5 text-warning" /> Smart invoice
            generation
          </span>
        </div>
      </div>
    </section>
  );
};

export default BookingHeader;
