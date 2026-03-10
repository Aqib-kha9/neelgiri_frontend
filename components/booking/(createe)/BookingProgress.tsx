"use client";

import { Progress } from "@/components/ui/progress";

const BookingProgress = () => {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
      <p className="text-xs font-medium text-muted-foreground mb-2">
        Booking Progress: 25% Completed
      </p>
      <Progress value={25} className="h-2" />
    </div>
  );
};

export default BookingProgress;
