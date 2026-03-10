import {
  FileText,
  QrCode,
  MoreHorizontal,
  User,
  MapPin,
  Package,
  RefreshCw,
  AlertCircle,
  IndianRupee,
  Calendar,
  PhoneCall,
  MessageCircle,
  Zap,
  ThumbsUp,
  User as UserIcon,
  Flag,
  Eye,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";

interface CaseDetailsProps {
  pod: any;
  statusConfig: any;
  priorityConfig: any;
  riskConfig: any;
  investigationConfig: any;
  onResolve: (pod: any) => void;
}

const CaseDetails = ({
  pod,
  statusConfig,
  priorityConfig,
  riskConfig,
  investigationConfig,
  onResolve,
}: CaseDetailsProps) => {
  const StatusBadge = ({ status }: { status: string }) => {
    const config = statusConfig[status];

      if (!config || !config.icon) {
        return (
          <Badge className="rounded-full border bg-gray-100 text-gray-800 border-gray-200 px-3 py-1.5 flex items-center gap-1.5">
            Unknown
          </Badge>
        );
      }

    const IconComponent = config.icon;

    return (
      <Badge
        className={`rounded-full border ${config.color} px-3 py-1.5 flex items-center gap-1.5`}
      >
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const RiskBadge = ({ risk }: { risk: string }) => {
    const config = riskConfig[risk];
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

  const InvestigationBadge = ({ status }: { status: string }) => {
    const config = investigationConfig[status];
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

 const SLABadge = ({ sla }: { sla: string }) => {
   const now = new Date();
   const slaDate = new Date(sla);
   const timeDiff = slaDate.getTime() - now.getTime();
   const hoursDiff = timeDiff / (1000 * 3600);

   let status = "normal";
   if (hoursDiff < 0) status = "breached";
   else if (hoursDiff < 24) status = "warning";

   const config = {
     breached: {
       label: "SLA Breached",
       color: "bg-red-100 text-red-800 border-red-200",
     },
     warning: {
       label: "SLA Warning",
       color: "bg-yellow-100 text-yellow-800 border-yellow-200",
     },
     normal: {
       label: "On Track",
       color: "bg-green-100 text-green-800 border-green-200",
     },
   }[status];

   // Null check add karo
   if (!config) {
     return (
       <Badge className="rounded-full border bg-gray-100 text-gray-800 border-gray-200 px-2 py-1 text-xs">
         Unknown
       </Badge>
     );
   }

   return (
     <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
       {config.label}
     </Badge>
   );
 };

  const handleAssignInvestigation = () => {
    console.log("Assign investigation:", pod.id);
  };

  const handleContactReceiver = () => {
    console.log("Contact receiver:", pod.receiver.name);
  };

  const handleEscalate = () => {
    console.log("Escalate case:", pod.id);
  };

  return (
    <>
      {/* Case Summary */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-0">
          <div className="p-6 border-b border-border/70">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-red-100 p-2">
                    <FileText className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-bold text-lg text-foreground">
                        {pod.awbNumber}
                      </p>
                      <QrCode className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Missing POD Case • {pod.receiver.name}
                    </p>
                  </div>
                </div>
                <StatusBadge status={pod.status} />
                <RiskBadge risk={pod.risk.level} />
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    Risk Score: {pod.risk.score}/100
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Financial Impact
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
                      View Full Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <Download className="h-4 w-4" />
                      Download Case
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <MessageCircle className="h-4 w-4" />
                      Contact Team
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <Flag className="h-4 w-4" />
                      Flag Case
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Case Information */}
              <div className="space-y-4">
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
                        {pod.receiver.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {pod.receiver.phone}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{pod.receiver.address}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {pod.receiver.city} - {pod.receiver.pincode}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-2 rounded-lg border-border/70"
                        onClick={handleContactReceiver}
                      >
                        <PhoneCall className="h-3 w-3" />
                        Call
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-2 rounded-lg border-border/70"
                      >
                        <MessageCircle className="h-3 w-3" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Package Information */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Package Information
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Type</p>
                        <p className="font-medium">{pod.package.type}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Weight</p>
                        <p className="font-medium">{pod.package.weight}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">COD Amount</p>
                        <p className="font-medium text-green-600">
                          {pod.package.codAmount}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Declared Value</p>
                        <p className="font-medium">
                          {pod.package.declaredValue}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">Description</p>
                      <p className="font-medium">{pod.package.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Investigation & Risk */}
              <div className="space-y-4">
                {/* Investigation Status */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <RefreshCw className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Investigation Status
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Status
                      </span>
                      <InvestigationBadge status={pod.investigation.status} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Assigned To:
                      </span>
                      <span className="font-medium">
                        {pod.investigation.assignedTo || "Unassigned"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Contact Attempts:
                      </span>
                      <span className="font-medium">
                        {pod.investigation.attempts}
                      </span>
                    </div>
                    {pod.investigation.lastAttempt && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Last Attempt:
                        </span>
                        <span className="font-medium">
                          {new Date(
                            pod.investigation.lastAttempt
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
                      <RiskBadge risk={pod.risk.level} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Risk Score:</span>
                      <span className="font-medium">{pod.risk.score}/100</span>
                    </div>

                    {pod.risk.factors.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">
                          Risk Factors
                        </p>
                        <div className="space-y-1">
                          {pod.risk.factors.map(
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

                {/* Financial Impact */}
                <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <IndianRupee className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Financial Impact
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Potential Loss:
                      </span>
                      <span className="font-medium text-red-600">
                        {pod.financial.potentialLoss}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Insurance Covered:
                      </span>
                      <span className="font-medium text-green-600">
                        {pod.financial.insuranceCovered}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Resolution Cost:
                      </span>
                      <span className="font-medium">
                        {pod.financial.resolutionCost}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline & Investigation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-5 w-5 text-primary" />
              Case Timeline
            </CardTitle>
            <CardDescription>
              Important dates and SLA information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Shipment Date:</span>
                <span className="font-medium">
                  {new Date(pod.shipmentDate).toLocaleDateString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Delivery Date:</span>
                <span className="font-medium">
                  {new Date(pod.deliveryDate).toLocaleDateString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Reported:</span>
                <span className="font-medium">
                  {new Date(pod.timeline.reported).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-medium">
                  {new Date(pod.timeline.lastUpdated).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">SLA Deadline:</span>
                <div className="text-right">
                  <span className="font-medium">
                    {new Date(pod.timeline.sla).toLocaleString("en-IN")}
                  </span>
                  <SLABadge sla={pod.timeline.sla} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investigation Notes */}
        <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5 text-primary" />
              Investigation Notes
            </CardTitle>
            <CardDescription>
              Updates and findings from the investigation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pod.investigation.notes ? (
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm text-foreground">
                    {pod.investigation.notes}
                  </p>
                  {pod.investigation.lastAttempt && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Last updated:{" "}
                      {new Date(pod.investigation.lastAttempt).toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-xl p-8 bg-muted/30 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    No investigation notes yet
                  </p>
                </div>
              )}

              <Textarea
                placeholder="Add investigation notes or updates..."
                className="rounded-lg"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investigation Actions */}
      {pod.status !== "resolved" && (
        <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-5 w-5 text-primary" />
              Investigation Actions
            </CardTitle>
            <CardDescription>
              Take action to resolve this missing POD case
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                className="gap-2 rounded-lg bg-green-600 hover:bg-green-700"
                onClick={() => onResolve(pod)}
              >
                <ThumbsUp className="h-4 w-4" />
                Resolve Case
              </Button>

              <Button
                variant="outline"
                className="gap-2 rounded-lg border-blue-500 text-blue-600 hover:bg-blue-50"
                onClick={handleAssignInvestigation}
              >
                <UserIcon className="h-4 w-4" />
                Assign to Me
              </Button>

              <Button
                variant="outline"
                className="gap-2 rounded-lg border-orange-500 text-orange-600 hover:bg-orange-50"
                onClick={handleContactReceiver}
              >
                <PhoneCall className="h-4 w-4" />
                Contact Receiver
              </Button>

              <Button
                variant="outline"
                className="gap-2 rounded-lg border-red-500 text-red-600 hover:bg-red-50"
                onClick={handleEscalate}
              >
                <Flag className="h-4 w-4" />
                Escalate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default CaseDetails;
