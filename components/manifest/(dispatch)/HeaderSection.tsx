// app/dashboard/manifest/dispatch/components/HeaderSection.tsx
import { Truck, Plus, Download, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderSectionProps {
  onExport?: () => void;
  onRoutePlan?: () => void;
  onNewDispatch?: () => void;
}

const HeaderSection = ({ onExport, onRoutePlan, onNewDispatch }: HeaderSectionProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-red-100 p-2">
            <Truck className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Dispatch Management
            </h1>
            <p className="text-muted-foreground">
              Manage vehicle dispatch and route assignments
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="gap-2 rounded-xl border-border/70"
          onClick={onExport}
        >
          <Download className="h-4 w-4" />
          Export Dispatch
        </Button>
        <Button
          variant="outline"
          className="gap-2 rounded-xl border-border/70"
          onClick={onRoutePlan}
        >
          <MapPin className="h-4 w-4" />
          Route Planner
        </Button>
        <Button
          className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand"
          onClick={onNewDispatch}
        >
          <Plus className="h-4 w-4" />
          New Dispatch
        </Button>
      </div>
    </div>
  );
};

export default HeaderSection;
