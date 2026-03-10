import { Truck, QrCode, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import StatusBadge from "./StatusBadge";
import ConnectivityBadge from "./ConnectivityBadge";

interface DRSListProps {
  filteredDRS: any[];
  selectedDRS: any;
  setSelectedDRS: (drs: any) => void;
}

const DRSList = ({
  filteredDRS,
  selectedDRS,
  setSelectedDRS,
}: DRSListProps) => {
  const getTimeRemaining = (expectedEnd: string) => {
    const now = new Date();
    const end = new Date(expectedEnd);
    const diffMs = end.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffMs < 0)
      return `Overdue by ${Math.abs(diffHrs)}h ${Math.abs(diffMins)}m`;
    return `${diffHrs}h ${diffMins}m remaining`;
  };

  return (
    <div className="xl:col-span-1 space-y-4">
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-6">
          <div className="space-y-3">
            {filteredDRS.map((drs) => (
              <Card
                key={drs.id}
                className={`transition-all border-2 ${selectedDRS.id === drs.id
                  ? "border-primary shadow-lg"
                  : "border-border/70 hover:border-primary/50"
                  } rounded-xl overflow-hidden`}
              >
                <div onClick={() => setSelectedDRS(drs)} className="cursor-pointer">
                  <CardContent className="p-4 pb-2">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="font-mono font-semibold text-foreground">
                            {drs.drsNumber}
                          </p>
                          <QrCode className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <StatusBadge status={drs.status} />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Rider:</span>
                          <span className="font-medium">{drs.rider.name}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress:</span>
                          <span className="font-medium">
                            {drs.progress.completion}%
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Progress
                          value={drs.progress.completion}
                          className="h-2"
                        />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {drs.progress.delivered}/{drs.progress.totalShipments}{" "}
                            delivered
                          </span>
                          {/* Only show time remaining if active */}
                          <span>
                            {drs.status === 'in_progress' ? getTimeRemaining(drs.timeline.expectedEnd) : drs.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>

                {/* Collapsible Details Dropdown - ONLY for Valid Statuses */}
                {['scheduled', 'in_progress', 'paused', 'completed', 'delivered'].includes(drs.status) && (
                  <div className="bg-muted/30 border-t border-border/50">
                    <details className="group">
                      <summary className="flex items-center justify-center p-2 cursor-pointer hover:bg-muted/50 transition-colors text-xs font-medium text-muted-foreground select-none list-none">
                        <div className="flex items-center gap-1">
                          <span>Show Shipment Details</span>
                          <div className="transition-transform group-open:rotate-180">▼</div>
                        </div>
                      </summary>
                      <div className="p-3 pt-0 space-y-3 animate-in slide-in-from-top-2 duration-200">
                        <div className="grid grid-cols-2 gap-2 text-xs mb-2 pt-2 border-t">
                          <div>
                            <span className="text-muted-foreground">Assigned To:</span>
                            <p className="font-medium">{drs.rider.name}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Date:</span>
                            <p className="font-medium">{drs.date}</p>
                          </div>
                        </div>

                        <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">Shipment List</p>
                          {drs.shipments && drs.shipments.map((s: any, idx: number) => {
                            const awb = typeof s === 'string' ? s : s.awb;
                            const status = typeof s === 'string' ? 'pending' : s.status;
                            // Whitelist 'not_scheduled' and 'inwarded' as completed for display purposes
                            const isDone = ['delivered', 'completed', 'not_scheduled', 'inwarded'].includes(status);

                            return (
                              <div key={idx} className="flex items-center justify-between text-xs p-1.5 rounded bg-background border">
                                <span className="font-mono text-muted-foreground">{awb}</span>
                                <span className={`px-1.5 py-0.5 rounded capitalize ${isDone ? 'bg-green-100 text-green-700' : 'bg-secondary text-secondary-foreground'
                                  }`}>
                                  {status.replace('_', ' ')}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </details>
                  </div>
                )}
              </Card>
            ))}

            {filteredDRS.length === 0 && (
              <div className="text-center py-8">
                <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No active DRS found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DRSList;
