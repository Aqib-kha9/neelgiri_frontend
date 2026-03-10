import { User, Phone, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReceiverInfoProps {
  selectedPOD: any;
}

const ReceiverInfo = ({ selectedPOD }: ReceiverInfoProps) => {
  return (
    <div className="rounded-xl border border-border/60 p-4">
      <div className="flex items-center gap-2 mb-3">
        <User className="h-4 w-4 text-green-600" />
        <span className="text-sm font-semibold text-foreground">
          Receiver Information
        </span>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-foreground">
            {selectedPOD.receiver.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {selectedPOD.receiver.relation}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span>{selectedPOD.receiver.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span>{selectedPOD.delivery.location.address}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Signature</p>
            <Badge
              variant={
                selectedPOD.receiver.signature === "captured"
                  ? "success"
                  : "secondary"
              }
              className="rounded-full text-xs"
            >
              {selectedPOD.receiver.signature === "captured"
                ? "Captured"
                : "Pending"}
            </Badge>
          </div>
          <div>
            <p className="text-muted-foreground">ID Verified</p>
            <Badge
              variant={
                selectedPOD.receiver.idVerified ? "success" : "secondary"
              }
              className="rounded-full text-xs"
            >
              {selectedPOD.receiver.idVerified ? "Verified" : "Pending"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiverInfo;
