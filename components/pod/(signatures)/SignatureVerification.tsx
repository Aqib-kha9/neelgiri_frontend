import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, AlertCircle, BarChart3 } from "lucide-react";

interface SignatureVerificationProps {
  signature: any;
  onVerify: () => void;
  onReject: () => void;
}

const SignatureVerification = ({
  signature,
  onVerify,
  onReject,
}: SignatureVerificationProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Signature Verification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Quality Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/60 p-4 text-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Quality Score</p>
              <p className="text-2xl font-bold text-foreground">
                {signature.signature.quality}%
              </p>
            </div>
            <div className="rounded-xl border border-border/60 p-4 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Confidence</p>
              <p className="text-2xl font-bold text-foreground">
                {signature.signature.confidence}%
              </p>
            </div>
          </div>

          {/* Signature Preview */}
          <div className="border-2 border-dashed border-border rounded-xl p-6 bg-muted/30 text-center">
            {signature.signature.url ? (
              <div className="space-y-4">
                <img
                  src={signature.signature.url}
                  alt="Receiver Signature"
                  className="max-h-32 mx-auto"
                />
                <div className="flex items-center justify-center gap-4">
                  <Badge variant="outline" className="rounded-full">
                    {signature.signature.type}
                  </Badge>
                  <Badge variant="outline" className="rounded-full">
                    {signature.signature.quality}% Quality
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
                <p className="text-muted-foreground">No signature captured</p>
              </div>
            )}
          </div>

          {/* Verification Actions */}
          {signature.status !== "verified" &&
            signature.status !== "rejected" && (
              <div className="space-y-4">
                <Textarea
                  placeholder="Add verification comments..."
                  className="rounded-lg"
                />

                <div className="flex gap-3">
                  <Button
                    className="flex-1 gap-2 rounded-lg bg-green-600 hover:bg-green-700"
                    onClick={onVerify}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve Signature
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1 gap-2 rounded-lg border-red-500 text-red-600 hover:bg-red-50"
                    onClick={onReject}
                  >
                    <XCircle className="h-4 w-4" />
                    Reject Signature
                  </Button>
                </div>
              </div>
            )}

          {/* Verification Status */}
          {signature.verification.verifiedBy && (
            <div className="rounded-xl border border-green-200 bg-green-50/50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-foreground">
                  Verification Details
                </span>
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <p>Verified by: {signature.verification.verifiedBy}</p>
                <p>
                  Verified at:{" "}
                  {new Date(signature.verification.verifiedAt).toLocaleString(
                    "en-IN"
                  )}
                </p>
                <p>Confidence: {signature.verification.confidence}%</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SignatureVerification;
