// app/dashboard/manifest/bag-tags/components/BagList.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, QrCode, AlertCircle, Weight, MapPin } from "lucide-react";
import StatusBadge from "./StatusBadge";
import TypeBadge from "./TypeBadge";

interface BagListProps {
  bags: any[];
  selectedBag: any;
  setSelectedBag: (bag: any) => void;
}

const BagList = ({ bags, selectedBag, setSelectedBag }: BagListProps) => {
  const getUtilizationPercentage = (bag: any) => {
    return Math.min(
      (bag.shipments.current / bag.shipments.capacity) * 100,
      100
    );
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-6">
        <div className="space-y-3">
          {bags.map((bag) => (
            <Card
              key={bag.id}
              className={`cursor-pointer transition-all border-2 ${
                selectedBag.id === bag.id
                  ? "border-primary shadow-lg"
                  : "border-border/70 hover:border-primary/50"
              } rounded-xl`}
              onClick={() => setSelectedBag(bag)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-semibold text-foreground">
                        {bag.bagNumber}
                      </p>
                      <QrCode className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <TypeBadge type={bag.type} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Route:</span>
                      <span className="font-medium">
                        {bag.origin.code} → {bag.destination.code}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Shipments:</span>
                      <span className="font-medium">
                        {bag.shipments.current}/{bag.shipments.capacity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Weight:</span>
                      <span className="font-medium">
                        {bag.weight.current}/{bag.weight.capacity} kg
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${getUtilizationPercentage(bag)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <StatusBadge status={bag.status} />
                      <div className="text-xs text-muted-foreground">
                        {Math.round(getUtilizationPercentage(bag))}% full
                      </div>
                    </div>
                  </div>

                  {bag.issues.length > 0 && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-600">
                        {bag.issues.length} issues
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {bags.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No bag tags found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BagList;
