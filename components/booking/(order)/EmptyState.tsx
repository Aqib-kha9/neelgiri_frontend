import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";

interface EmptyStateProps {
  searchTerm: string;
  statusFilter: string;
  onCreateBooking: () => void;
}

export const EmptyState = ({
  searchTerm,
  statusFilter,
  onCreateBooking,
}: EmptyStateProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-12 text-center">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No orders found
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {searchTerm || statusFilter !== "all"
            ? "No orders match your current search criteria. Try adjusting your filters."
            : "Start managing your delivery operations by creating your first booking."}
        </p>
        <Button
          className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand"
          onClick={onCreateBooking}
        >
          <Plus className="h-4 w-4" />
          Create New Booking
        </Button>
      </CardContent>
    </Card>
  );
};
