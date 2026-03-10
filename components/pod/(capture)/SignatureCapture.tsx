import { Signature } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SignatureCaptureProps {
  selectedPOD: any;
  setCaptureMode: (mode: "signature" | "photo" | "id" | null) => void;
}

const SignatureCapture = ({
  selectedPOD,
  setCaptureMode,
}: SignatureCaptureProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Signature className="h-5 w-5 text-primary" />
          Signature
        </CardTitle>
        <CardDescription>
          Receiver's signature for proof of delivery
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {selectedPOD.capture.signature ? (
            <div className="text-center space-y-3">
              <div className="border-2 border-dashed border-border rounded-xl p-4 bg-muted/30">
                <img
                  src={selectedPOD.capture.signature}
                  alt="Receiver Signature"
                  className="max-h-32 mx-auto"
                />
              </div>
              <p className="text-sm text-green-600 font-medium">
                Signature Captured
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(selectedPOD.timestamp).toLocaleString("en-IN")}
              </p>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="border-2 border-dashed border-border rounded-xl p-8 bg-muted/30">
                <Signature className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  No signature captured
                </p>
              </div>
              <Button
                className="w-full gap-2 rounded-lg"
                onClick={() => setCaptureMode("signature")}
              >
                <Signature className="h-4 w-4" />
                Capture Signature
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SignatureCapture;
