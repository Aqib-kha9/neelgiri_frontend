import {
  Signature,
  QrCode,
  MoreHorizontal,
  Eye,
  Download,
  Share2,
  Edit3,
  Trash2,
  PhoneCall,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StatusBadge from "./StatusBadge";
import DeliveryStatusBadge from "./DeliveryStatusBadge";
import ReceiverInfo from "./ReceiverInfo";
import PackageInfo from "./PackageInfo";
import DeliveryAgent from "./DeliveryAgent";
import VerificationStatus from "./VerificationStatus";

interface PODSummaryProps {
  selectedPOD: any;
  setCaptureMode: (mode: "signature" | "photo" | "id" | null) => void;
}

const PODSummary = ({ selectedPOD, setCaptureMode }: PODSummaryProps) => {
  const handleDeletePOD = (id: string) => {
    console.log("Delete POD:", id);
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-0">
        <div className="p-6 border-b border-border/70">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-2">
                  <Signature className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-bold text-lg text-foreground">
                      {selectedPOD.awbNumber}
                    </p>
                    <QrCode className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Proof of Delivery •{" "}
                    {new Date(selectedPOD.timestamp).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              <StatusBadge status={selectedPOD.status} />
              <DeliveryStatusBadge status={selectedPOD.deliveryStatus} />
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-lg border-border/70"
                onClick={() => setCaptureMode("signature")}
              >
                <Signature className="h-3 w-3" />
                Capture
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-border/70"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <Eye className="h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <Download className="h-4 w-4" />
                    Download POD
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <Share2 className="h-4 w-4" />
                    Share Proof
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <Edit3 className="h-4 w-4" />
                    Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 rounded-lg text-red-600"
                    onClick={() => handleDeletePOD(selectedPOD.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete POD
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ReceiverInfo selectedPOD={selectedPOD} />
              <PackageInfo selectedPOD={selectedPOD} />
            </div>

            <div className="space-y-4">
              <DeliveryAgent selectedPOD={selectedPOD} />
              <VerificationStatus selectedPOD={selectedPOD} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PODSummary;
