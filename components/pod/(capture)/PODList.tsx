import { Signature, Image, IdCard, QrCode } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "./StatusBadge";
import DeliveryStatusBadge from "./DeliveryStatusBadge";

interface PODListProps {
  filteredPODs: any[];
  selectedPOD: any;
  setSelectedPOD: (pod: any) => void;
}

const PODList = ({
  filteredPODs,
  selectedPOD,
  setSelectedPOD,
}: PODListProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-6">
        <div className="space-y-3">
          {filteredPODs.map((pod) => (
            <Card
              key={pod.id}
              className={`cursor-pointer transition-all border-2 ${
                selectedPOD.id === pod.id
                  ? "border-primary shadow-lg"
                  : "border-border/70 hover:border-primary/50"
              } rounded-xl`}
              onClick={() => setSelectedPOD(pod)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-semibold text-foreground">
                        {pod.awbNumber}
                      </p>
                      <QrCode className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <StatusBadge status={pod.status} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Receiver:</span>
                      <span className="font-medium">{pod.receiver.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Delivery:</span>
                      <DeliveryStatusBadge status={pod.deliveryStatus} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">
                        {new Date(pod.timestamp).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {pod.receiver.signature === "captured" && (
                        <Badge
                          variant="outline"
                          className="rounded-full text-xs"
                        >
                          <Signature className="h-3 w-3 mr-1" />
                          Signed
                        </Badge>
                      )}
                      {pod.capture.photos.length > 0 && (
                        <Badge
                          variant="outline"
                          className="rounded-full text-xs"
                        >
                          <Image className="h-3 w-3 mr-1" />
                          {pod.capture.photos.length}
                        </Badge>
                      )}
                      {pod.receiver.idVerified && (
                        <Badge
                          variant="outline"
                          className="rounded-full text-xs"
                        >
                          <IdCard className="h-3 w-3 mr-1" />
                          ID
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(pod.timestamp).toLocaleDateString("en-IN")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredPODs.length === 0 && (
            <div className="text-center py-8">
              <Signature className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No POD records found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PODList;
