import { FileText, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import RiskBadge from "./RiskBadge";

interface VerificationListProps {
  filteredVerifications: any[];
  selectedVerification: any;
  setSelectedVerification: (verification: any) => void;
}

const VerificationList = ({
  filteredVerifications,
  selectedVerification,
  setSelectedVerification,
}: VerificationListProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-6">
        <div className="space-y-3">
          {filteredVerifications.map((verification) => (
            <Card
              key={verification.id}
              className={`cursor-pointer transition-all border-2 ${
                selectedVerification.id === verification.id
                  ? "border-primary shadow-lg"
                  : "border-border/70 hover:border-primary/50"
              } rounded-xl`}
              onClick={() => setSelectedVerification(verification)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-semibold text-foreground">
                        {verification.awbNumber}
                      </p>
                      <FileText className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <PriorityBadge priority={verification.priority} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Receiver:</span>
                      <span className="font-medium">
                        {verification.receiver.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Risk:</span>
                      <RiskBadge risk={verification.risk.level} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Confidence:</span>
                      <span className="font-medium">
                        {verification.verification.confidence}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <StatusBadge status={verification.status} />
                    <div className="text-xs text-muted-foreground">
                      {new Date(
                        verification.delivery.timestamp
                      ).toLocaleDateString("en-IN")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredVerifications.length === 0 && (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">
                No verification records found
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationList;
