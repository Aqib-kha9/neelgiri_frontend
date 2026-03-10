import { Navigation, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface HeaderSectionProps {
  autoRefresh: boolean;
  setAutoRefresh: (value: boolean) => void;
  lastUpdated: Date;
}

const HeaderSection = ({ autoRefresh, setAutoRefresh }: HeaderSectionProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-green-100 p-2">
            <Navigation className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Live Tracking
            </h1>
            <p className="text-muted-foreground">
              Real-time shipment tracking with live location updates and ETA
              predictions
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Switch
            checked={autoRefresh}
            onCheckedChange={setAutoRefresh}
            className="data-[state=checked]:bg-green-500"
          />
          <span className="text-sm text-muted-foreground">Auto Refresh</span>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl border-border/70">
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand">
          <Plus className="h-4 w-4" />
          Track New
        </Button>
      </div>
    </div>
  );
};

export default HeaderSection;
