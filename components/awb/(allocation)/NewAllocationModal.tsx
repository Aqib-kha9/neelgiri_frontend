import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface NewAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableSeries: any[];
  branchesPartners: any[];
}

export const NewAllocationModal = ({
  isOpen,
  onClose,
  availableSeries,
  branchesPartners,
}: NewAllocationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl rounded-2xl border-border/70 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            New AWB Allocation
          </CardTitle>
          <CardDescription>
            Allocate AWB series to branches or partners
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">
                  Available Series
                </h4>
                <div className="space-y-3">
                  {availableSeries.map((series) => (
                    <Card
                      key={series.id}
                      className="rounded-xl border-border/60 cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">
                              {series.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {series.prefix}
                              {series.seriesCode} • {series.available} available
                            </p>
                          </div>
                          <Badge variant="outline" className="rounded-full">
                            Select
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-foreground">
                  Branches & Partners
                </h4>
                <div className="space-y-3">
                  {branchesPartners.map((entity) => (
                    <Card
                      key={entity.id}
                      className="rounded-xl border-border/60 cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">
                              {entity.name}
                            </p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {entity.type} • {entity.city}, {entity.state}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Capacity: {entity.capacity.daily}/day •
                              Allocations: {entity.currentAllocations}
                            </p>
                          </div>
                          <Badge variant="outline" className="rounded-full">
                            Select
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border/70">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-xl bg-primary text-primary-foreground"
                onClick={onClose}
              >
                Create Allocation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
