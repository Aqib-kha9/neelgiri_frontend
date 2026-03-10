// app/dashboard/manifest/history/components/HistoryList.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  MapPin,
  Clock,
  AlertCircle,
  Package,
  Calendar,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import PerformanceBadge from "./PerformanceBadge";

interface HistoryListProps {
  history: any[];
  selectedHistory: any;
  setSelectedHistory: (history: any) => void;
}

const HistoryList = ({
  history,
  selectedHistory,
  setSelectedHistory,
}: HistoryListProps) => {
  const getDeliveryTimeColor = (history: any) => {
    if (history.performance.deliveryTime === "early") return "text-green-600";
    if (history.performance.deliveryTime === "late") return "text-red-600";
    return "text-blue-600";
  };

  const getDeliveryTimeIcon = (history: any) => {
    if (history.performance.deliveryTime === "early") return "↑";
    if (history.performance.deliveryTime === "late") return "↓";
    return "→";
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-6">
        <div className="space-y-3">
          {history.map((historyItem) => (
            <Card
              key={historyItem.id}
              className={`cursor-pointer transition-all border-2 ${
                selectedHistory.id === historyItem.id
                  ? "border-primary shadow-lg"
                  : "border-border/70 hover:border-primary/50"
              } rounded-xl`}
              onClick={() => setSelectedHistory(historyItem)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-semibold text-foreground">
                        {historyItem.manifestNumber}
                      </p>
                      <Truck className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <PerformanceBadge
                      performance={historyItem.performance.rating}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Route:</span>
                      <span className="font-medium">
                        {historyItem.origin.code} →{" "}
                        {historyItem.destination.code}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Vehicle:</span>
                      <span className="font-medium">
                        {historyItem.vehicleNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Delivery:</span>
                      <span
                        className={`font-medium ${getDeliveryTimeColor(
                          historyItem
                        )}`}
                      >
                        {getDeliveryTimeIcon(historyItem)}{" "}
                        {historyItem.performance.timeDifference}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <StatusBadge status={historyItem.status} />
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(historyItem.deliveredTime).toLocaleDateString(
                        "en-IN"
                      )}
                    </div>
                  </div>

                  {historyItem.issues.length > 0 && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-600">
                        {historyItem.issues.length} issues
                      </span>
                    </div>
                  )}

                  {historyItem.performance.rating === "excellent" && (
                    <div className="flex items-center gap-2">
                      <Badge variant="success" className="rounded-full text-xs">
                        Excellent Performance
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {history.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">
                No historical records found
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryList;
