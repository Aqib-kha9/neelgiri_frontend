import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RefreshCw } from "lucide-react";

interface EmptyStateProps {
  searchTerm: string;
  typeFilter: string;
  severityFilter: string;
  statusFilter: string;
  onRefresh: () => void;
}

export const EmptyState = ({
  searchTerm,
  typeFilter,
  severityFilter,
  statusFilter,
  onRefresh,
}: EmptyStateProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-12 text-center">
        <CheckCircle2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No exceptions found
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {searchTerm ||
          typeFilter !== "all" ||
          severityFilter !== "all" ||
          statusFilter !== "all"
            ? "No exceptions match your current search criteria. Try adjusting your filters."
            : "All exceptions have been resolved. Great work!"}
        </p>
        <Button
          onClick={onRefresh}
          className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </CardContent>
    </Card>
  );
};
