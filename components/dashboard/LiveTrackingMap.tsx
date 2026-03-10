import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export function LiveTrackingMap() {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <MapPin className="h-4 w-4" /> Live Tracking Map
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Real-time shipment locations
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/20">
          {/* Placeholder map frame - replace with dynamic map (e.g. Leaflet or Google Maps) */}
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            📍 Live map integration coming soon
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
