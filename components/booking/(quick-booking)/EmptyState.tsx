import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Plus } from "lucide-react";

interface EmptyStateProps {
  searchTerm: string;
  statusFilter: string;
  onNewBulkShipment: () => void;
}

export const EmptyState = ({
  searchTerm,
  statusFilter,
  onNewBulkShipment,
}: EmptyStateProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-12 text-center">
        <FileSpreadsheet className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No bulk shipments found
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {searchTerm || statusFilter !== "all"
            ? "No bulk shipments match your current search criteria. Try adjusting your filters."
            : "Get started by creating your first bulk shipment batch using a template."}
        </p>
        <Button
          className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand"
          onClick={onNewBulkShipment}
        >
          <Plus className="h-4 w-4" />
          Create Bulk Shipment
        </Button>
      </CardContent>
    </Card>
  );
};
