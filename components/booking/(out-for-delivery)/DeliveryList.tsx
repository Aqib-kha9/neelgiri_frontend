import { Navigation, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DeliveryCard from "./DeliveryCard";
import { Delivery } from "./types/index";

interface DeliveryListProps {
  deliveries: readonly Delivery[];
  searchTerm: string;
  statusFilter: string;
  priorityFilter: string;
}

const DeliveryList = ({
  deliveries,
  searchTerm,
  statusFilter,
  priorityFilter,
}: DeliveryListProps) => {
  return (
    <div className="space-y-4">
      {deliveries.map((delivery) => (
        <DeliveryCard key={delivery.id} delivery={delivery} />
      ))}

      {deliveries.length === 0 && (
        <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
          <CardContent className="p-12 text-center">
            <Navigation className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No deliveries found
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                ? "No deliveries match your current search criteria. Try adjusting your filters."
                : "All deliveries have been completed for now. Great work!"}
            </p>
            <Button className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand">
              <RefreshCw className="h-4 w-4" />
              Refresh Status
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeliveryList;
