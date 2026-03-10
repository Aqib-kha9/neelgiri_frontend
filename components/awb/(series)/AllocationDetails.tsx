import { User, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface AllocationDetailsProps {
  series: any;
}

const AllocationDetails = ({ series }: AllocationDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/60 p-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="h-4 w-4 text-green-600" />
          <span className="text-sm font-semibold text-foreground">
            Allocation Details
          </span>
        </div>
        <div className="space-y-3">
          {series.allocatedTo ? (
            <>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {series.allocatedTo.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {series.allocatedTo.type}
                </p>
                <p className="text-xs text-muted-foreground">
                  {series.allocatedTo.contact}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Allocated:</span>
                  <span className="font-medium">
                    {series.allocation.date
                      ? new Date(series.allocation.date).toLocaleDateString(
                          "en-IN"
                        )
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Valid Until:</span>
                  <span
                    className={`font-medium ${
                      series.allocation.validUntil &&
                      new Date(series.allocation.validUntil) < new Date()
                        ? "text-red-600"
                        : "text-foreground"
                    }`}
                  >
                    {series.allocation.validUntil
                      ? new Date(
                          series.allocation.validUntil
                        ).toLocaleDateString("en-IN")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Auto Renew:</span>
                  <Switch
                    checked={series.allocation.autoRenew}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <Ban className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">Not Allocated</p>
              <Button size="sm" variant="outline" className="mt-2 rounded-lg">
                Allocate Now
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllocationDetails;
