import { Shield, Eye, Edit3, Copy, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ServiceTypeBadge from "./ServiceTypeBadge";

interface RestrictionsActionsProps {
  series: any;
}

const RestrictionsActions = ({ series }: RestrictionsActionsProps) => {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            Restrictions & Financial
          </span>
        </div>
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Service Types:</span>
              <div className="flex gap-1">
                {series.restrictions.serviceType
                  .slice(0, 2)
                  .map((type: string) => (
                    <ServiceTypeBadge key={type} type={type} />
                  ))}
                {series.restrictions.serviceType.length > 2 && (
                  <Badge variant="secondary" className="rounded-full text-xs">
                    +{series.restrictions.serviceType.length - 2}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Max Weight:</span>
              <span className="font-medium">
                {series.restrictions.maxWeight}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Rate/Shipment:</span>
              <span className="font-medium text-green-600">
                {series.financial.ratePerShipment}
              </span>
            </div>
            {series.financial.creditLimit !== "₹0" && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Credit Used:</span>
                <span className="font-medium">
                  {series.financial.usedCredit}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          size="sm"
          className="gap-2 rounded-lg bg-primary text-primary-foreground"
        >
          <Eye className="h-3 w-3" />
          View Usage Report
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-2 rounded-lg border-border/70"
        >
          <Edit3 className="h-3 w-3" />
          Modify Series
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-2 rounded-lg border-border/70"
        >
          <Copy className="h-3 w-3" />
          Generate More
        </Button>
        {series.usage.percentage >= 80 && (
          <Button
            size="sm"
            variant="outline"
            className="gap-2 rounded-lg border-yellow-200 bg-yellow-50 text-yellow-700"
          >
            <AlertCircle className="h-3 w-3" />
            Low Numbers Alert
          </Button>
        )}
      </div>
    </div>
  );
};

export default RestrictionsActions;
