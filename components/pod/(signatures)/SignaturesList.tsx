import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, QrCode } from "lucide-react";

interface SignaturesListProps {
  signatures: any[];
  selectedSignature: any;
  onSignatureSelect: (signature: any) => void;
}

const SignaturesList = ({
  signatures,
  selectedSignature,
  onSignatureSelect,
}: SignaturesListProps) => {
  const StatusBadge = ({ status }: { status: string }) => {
    const config = {
      verified: {
        label: "Verified",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      pending: {
        label: "Pending",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      review_required: {
        label: "Review Required",
        color: "bg-orange-100 text-orange-800 border-orange-200",
      },
      in_progress: {
        label: "In Progress",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      },
    }[status];

     if (!config) {
       return (
         <Badge className="rounded-full border bg-gray-100 text-gray-800 border-gray-200 px-2 py-1 text-xs">
           Unknown
         </Badge>
       );
     }

    return (
      <Badge
        className={`rounded-full border ${config.color} px-2 py-1 text-xs`}
      >
        {config.label}
      </Badge>
    );
  };

  const PriorityBadge = ({ priority }: { priority: string }) => {
    const config = {
      high: { label: "High", color: "bg-red-100 text-red-800 border-red-200" },
      medium: {
        label: "Medium",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      low: {
        label: "Low",
        color: "bg-green-100 text-green-800 border-green-200",
      },
    }[priority];

     if (!config) {
       return (
         <Badge className="rounded-full border bg-gray-100 text-gray-800 border-gray-200 px-2 py-1 text-xs">
           Unknown
         </Badge>
       );
     }

    return (
      <Badge
        className={`rounded-full border ${config.color} px-2 py-1 text-xs`}
      >
        {config.label}
      </Badge>
    );
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-6">
        <div className="space-y-3">
          {signatures.map((signature) => (
            <Card
              key={signature.id}
              className={`cursor-pointer transition-all border-2 ${
                selectedSignature.id === signature.id
                  ? "border-primary shadow-lg"
                  : "border-border/70 hover:border-primary/50"
              } rounded-xl`}
              onClick={() => onSignatureSelect(signature)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-semibold text-foreground">
                        {signature.awbNumber}
                      </p>
                      <QrCode className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <PriorityBadge priority={signature.priority} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Receiver:</span>
                      <span className="font-medium">
                        {signature.receiver.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Quality:</span>
                      <span className="font-medium">
                        {signature.signature.quality}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">
                        {signature.delivery.timestamp
                          ? new Date(
                              signature.delivery.timestamp
                            ).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <StatusBadge status={signature.status} />
                    <div className="text-xs text-muted-foreground">
                      {signature.delivery.timestamp
                        ? new Date(
                            signature.delivery.timestamp
                          ).toLocaleDateString("en-IN")
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {signatures.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No signatures found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SignaturesList;
