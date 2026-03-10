import { CheckCircle2, AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const verificationConfig = {
  verified: {
    label: "Verified",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  review_required: {
    label: "Review Required",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  pending: {
    label: "Pending",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
  failed: { label: "Failed", color: "bg-red-100 text-red-800 border-red-200" },
};

interface VerificationStatusProps {
  selectedPOD: any;
}

const VerificationStatus = ({ selectedPOD }: VerificationStatusProps) => {
  const config =
    verificationConfig[
      selectedPOD.verification.status as keyof typeof verificationConfig
    ];

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">
          Verification Status
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <Badge
            className={`rounded-full border ${config.color} px-2 py-1 text-xs`}
          >
            {config.label}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Confidence Score:</span>
          <span className="font-medium">
            {selectedPOD.verification.confidence}%
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Automated Check:</span>
          <Switch
            checked={selectedPOD.verification.automated}
            className="data-[state=checked]:bg-green-500"
            disabled
          />
        </div>
        {selectedPOD.verification.flags.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Verification Flags</span>
            </div>
            <div className="mt-1 space-y-1">
              {selectedPOD.verification.flags.map(
                (flag: string, index: number) => (
                  <p key={index} className="text-xs text-yellow-600 capitalize">
                    • {flag.replace("_", " ")}
                  </p>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationStatus;
