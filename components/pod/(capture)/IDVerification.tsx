import { IdCard } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface IDVerificationProps {
  selectedPOD: any;
  setCaptureMode: (mode: "signature" | "photo" | "id" | null) => void;
}

const IDVerification = ({
  selectedPOD,
  setCaptureMode,
}: IDVerificationProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <IdCard className="h-5 w-5 text-primary" />
          ID Verification
        </CardTitle>
        <CardDescription>Receiver identification proof</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {selectedPOD.capture.idVerification ? (
            <div className="text-center space-y-3">
              <div className="border-2 border-dashed border-border rounded-xl p-4 bg-muted/30">
                <img
                  src={selectedPOD.capture.idVerification.photo}
                  alt="ID Verification"
                  className="max-h-24 mx-auto"
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {selectedPOD.capture.idVerification.type}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedPOD.capture.idVerification.number}
                </p>
                <Badge variant="success" className="rounded-full text-xs">
                  Verified
                </Badge>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="border-2 border-dashed border-border rounded-xl p-8 bg-muted/30">
                <IdCard className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  No ID verification
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full gap-2 rounded-lg"
                onClick={() => setCaptureMode("id")}
              >
                <IdCard className="h-4 w-4" />
                Verify ID
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IDVerification;
