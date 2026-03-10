import {
  Shield,
  FileText,
  MoreHorizontal,
  Eye,
  Download,
  MessageCircle,
  Flag,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  FileText as FileTextIcon,
  Signature,
  Camera,
  IdCard,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "./StatusBadge";
import RiskBadge from "./RiskBadge";
import ConfidenceBadge from "./ConfidenceBadge";

interface VerificationDetailsProps {
  selectedVerification: any;
  verificationComment: string;
  setVerificationComment: (comment: string) => void;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onApprove: (verification: any) => void;
  onReject: (verification: any) => void;
  onRequestReview: (verification: any) => void;
}

const VerificationDetails = ({
  selectedVerification,
  verificationComment,
  setVerificationComment,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onApprove,
  onReject,
  onRequestReview,
}: VerificationDetailsProps) => {
  return (
    <>
      {/* Verification Summary */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-0">
          <div className="p-6 border-b border-border/70">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-green-100 p-2">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-bold text-lg text-foreground">
                        {selectedVerification.awbNumber}
                      </p>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      POD Verification • {selectedVerification.receiver.name}
                    </p>
                  </div>
                </div>
                <StatusBadge status={selectedVerification.status} />
                <RiskBadge risk={selectedVerification.risk.level} />
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    Confidence: {selectedVerification.verification.confidence}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Verification Score
                  </p>
                </div>
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
                      View Full POD
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <Download className="h-4 w-4" />
                      Download Evidence
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <MessageCircle className="h-4 w-4" />
                      Contact Receiver
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <Flag className="h-4 w-4" />
                      Flag Issue
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Verification Status */}
              <div className="space-y-4">
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Verification Status
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Status
                      </span>
                      <StatusBadge status={selectedVerification.status} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Confidence Score:
                      </span>
                      <ConfidenceBadge
                        confidence={
                          selectedVerification.verification.confidence
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Automated Check:
                      </span>
                      <Switch
                        checked={selectedVerification.verification.automated}
                        className="data-[state=checked]:bg-green-500"
                        disabled
                      />
                    </div>
                    {selectedVerification.verification.verifiedBy && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Verified By:
                        </span>
                        <span className="font-medium">
                          {selectedVerification.verification.verifiedBy}
                        </span>
                      </div>
                    )}
                    {selectedVerification.verification.verifiedAt && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Verified At:
                        </span>
                        <span className="font-medium">
                          {new Date(
                            selectedVerification.verification.verifiedAt
                          ).toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Risk Assessment
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Risk Level
                      </span>
                      <RiskBadge risk={selectedVerification.risk.level} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Risk Score:</span>
                      <span className="font-medium">
                        {selectedVerification.risk.score}/100
                      </span>
                    </div>

                    {selectedVerification.risk.factors.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">
                          Risk Factors
                        </p>
                        <div className="space-y-1">
                          {selectedVerification.risk.factors.map(
                            (factor: string, index: number) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 text-sm"
                              >
                                <AlertCircle className="h-3 w-3 text-red-500" />
                                <span className="capitalize">
                                  {factor.replace(/_/g, " ")}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Verification Evidence */}
              <div className="space-y-4">
                {/* Quality Scores */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Evidence Quality
                    </span>
                  </div>
                  <div className="space-y-3">
                    {selectedVerification.capture.signature && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Signature Quality:
                        </span>
                        <span className="font-medium">
                          {selectedVerification.capture.signature.quality}%
                        </span>
                      </div>
                    )}
                    {selectedVerification.capture.photos.length > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Average Photo Quality:
                        </span>
                        <span className="font-medium">
                          {Math.round(
                            selectedVerification.capture.photos.reduce(
                              (sum: number, photo: any) => sum + photo.quality,
                              0
                            ) / selectedVerification.capture.photos.length
                          )}
                          %
                        </span>
                      </div>
                    )}
                    {selectedVerification.capture.idVerification && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          ID Verification Confidence:
                        </span>
                        <span className="font-medium">
                          {
                            selectedVerification.capture.idVerification
                              .confidence
                          }
                          %
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verification Flags */}
                {selectedVerification.verification.flags.length > 0 && (
                  <div className="rounded-xl border border-yellow-200 bg-yellow-50/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Flag className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-semibold text-foreground">
                        Verification Flags
                      </span>
                    </div>
                    <div className="space-y-2">
                      {selectedVerification.verification.flags.map(
                        (flag: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <AlertCircle className="h-3 w-3 text-yellow-500" />
                            <span className="capitalize">
                              {flag.replace(/_/g, " ")}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Verification Comments */}
                {selectedVerification.verification.comments && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileTextIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-semibold text-foreground">
                        Verification Comments
                      </span>
                    </div>
                    <p className="text-sm text-foreground">
                      {selectedVerification.verification.comments}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evidence Review */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Eye className="h-5 w-5 text-primary" />
            Evidence Review
          </CardTitle>
          <CardDescription>
            Review captured proof of delivery evidence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Signature Evidence */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Signature className="h-4 w-4 text-blue-600" />
                  Signature
                </span>
                {selectedVerification.capture.signature && (
                  <Badge variant="success" className="rounded-full text-xs">
                    {selectedVerification.capture.signature.quality}% Quality
                  </Badge>
                )}
              </div>

              {selectedVerification.capture.signature ? (
                <div className="border-2 border-border rounded-xl p-4 bg-muted/30">
                  <img
                    src={selectedVerification.capture.signature.url}
                    alt="Receiver Signature"
                    className="w-full h-32 object-contain mx-auto"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-xl p-8 bg-muted/30 text-center">
                  <Signature className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    No signature captured
                  </p>
                </div>
              )}
            </div>

            {/* Photo Evidence */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Camera className="h-4 w-4 text-green-600" />
                  Photo Evidence
                </span>
                <Badge variant="outline" className="rounded-full text-xs">
                  {selectedVerification.capture.photos.length} photos
                </Badge>
              </div>

              {selectedVerification.capture.photos.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {selectedVerification.capture.photos.map((photo: any) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.url}
                        alt={photo.description}
                        className="w-full h-24 object-cover rounded-lg"
                        style={{ transform: `scale(${zoomLevel})` }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Eye className="h-4 w-4 text-white" />
                      </div>
                      {photo.flags.length > 0 && (
                        <div className="absolute top-1 right-1">
                          <AlertCircle className="h-3 w-3 text-yellow-500" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-xl p-8 bg-muted/30 text-center">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    No photos captured
                  </p>
                </div>
              )}
            </div>

            {/* ID Verification */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <IdCard className="h-4 w-4 text-purple-600" />
                  ID Verification
                </span>
                {selectedVerification.capture.idVerification && (
                  <Badge variant="success" className="rounded-full text-xs">
                    {selectedVerification.capture.idVerification.confidence}%
                    Confidence
                  </Badge>
                )}
              </div>

              {selectedVerification.capture.idVerification ? (
                <div className="border-2 border-border rounded-xl p-4 bg-muted/30">
                  <img
                    src={selectedVerification.capture.idVerification.photo}
                    alt="ID Verification"
                    className="w-full h-32 object-contain mx-auto"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium text-foreground">
                      {selectedVerification.capture.idVerification.type}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedVerification.capture.idVerification.number}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-xl p-8 bg-muted/30 text-center">
                  <IdCard className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    No ID verification
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center justify-center gap-2 mt-6 p-3 bg-muted/30 rounded-xl">
            <Button variant="outline" size="sm" onClick={onZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground mx-2">
              {Math.round(zoomLevel * 100)}%
            </span>
            <Button variant="outline" size="sm" onClick={onZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onResetZoom}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Verification Actions */}
      {selectedVerification.status !== "verified" &&
        selectedVerification.status !== "rejected" && (
          <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Verification Actions
              </CardTitle>
              <CardDescription>
                Take action on this proof of delivery verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Add verification comments or notes..."
                  value={verificationComment}
                  onChange={(e) => setVerificationComment(e.target.value)}
                  className="rounded-lg"
                />

                <div className="flex gap-3">
                  <Button
                    className="flex-1 gap-2 rounded-lg bg-green-600 hover:bg-green-700"
                    onClick={() => onApprove(selectedVerification)}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Approve Verification
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1 gap-2 rounded-lg border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                    onClick={() => onRequestReview(selectedVerification)}
                  >
                    <Flag className="h-4 w-4" />
                    Request Review
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1 gap-2 rounded-lg border-red-500 text-red-600 hover:bg-red-50"
                    onClick={() => onReject(selectedVerification)}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
    </>
  );
};

export default VerificationDetails;
