import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FileText, QrCode, AlertCircle } from "lucide-react";
import StatusBadge from "./StatusBadge";
import PerformanceBadge from "./PerformanceBadge";
import { DRSData } from "./types/drs"; // Common type import karo

interface DRSListProps {
  filteredDRS: DRSData[];
  selectedDRS: DRSData;
  setSelectedDRS: (drs: DRSData) => void;
}

const DRSList = ({
  filteredDRS,
  selectedDRS,
  setSelectedDRS,
}: DRSListProps) => {
  return (
    <div className="xl:col-span-1 space-y-4">
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-6">
          <div className="space-y-3">
            {filteredDRS.map((drs) => (
              <Card
                key={drs.id}
                className={`cursor-pointer transition-all border-2 ${
                  selectedDRS.id === drs.id
                    ? "border-primary shadow-lg"
                    : "border-border/70 hover:border-primary/50"
                } rounded-xl`}
                onClick={() => setSelectedDRS(drs)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-mono font-semibold text-foreground">
                          {drs.drsNumber}
                        </p>
                        <QrCode className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <StatusBadge
                        status={
                          drs.status as "completed" | "cancelled" | "partial"
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Rider:</span>
                        <span className="font-medium">{drs.rider.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">
                          {new Date(drs.date).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Performance:
                        </span>
                        <PerformanceBadge
                          efficiency={drs.performance.efficiency}
                        />
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
                        <span>
                          ₹{drs.financial.collectedCOD.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {drs.issues.length > 0 && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-3 w-3 text-red-500" />
                        <span className="text-xs text-red-600">
                          {drs.issues.length} issue
                          {drs.issues.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredDRS.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No DRS history found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DRSList;
