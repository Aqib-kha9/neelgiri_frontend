import { FileText, QrCode } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PODListProps {
  pods: any[];
  selectedPOD: any;
  onSelectPOD: (pod: any) => void;
  statusConfig: any;
  priorityConfig: any;
  riskConfig: any;
}

const PODList = ({
  pods,
  selectedPOD,
  onSelectPOD,
  statusConfig,
  priorityConfig,
  riskConfig,
}: PODListProps) => {
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

  const PriorityBadge = ({ priority }: { priority: string }) => {
    const config = priorityConfig[priority];

    if (!config) {
      return (
        <Badge className="rounded-full border bg-gray-100 text-gray-800 border-gray-200 px-3 py-1.5 flex items-center gap-1.5">
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

  const RiskBadge = ({ risk }: { risk: string }) => {
    const config = riskConfig[risk];
    if (!config) {
      return (
        <Badge className="rounded-full border bg-gray-100 text-gray-800 border-gray-200 px-3 py-1.5 flex items-center gap-1.5">
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

    // YEH NULL CHECK ADD KARO - yeh missing tha
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
          {pods.map((pod) => (
            <Card
              key={pod.id}
              className={`cursor-pointer transition-all border-2 ${
                selectedPOD.id === pod.id
                  ? "border-primary shadow-lg"
                  : "border-border/70 hover:border-primary/50"
              } rounded-xl`}
              onClick={() => onSelectPOD(pod)}
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
                    <PriorityBadge priority={pod.priority} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Receiver:</span>
                      <span className="font-medium">{pod.receiver.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Risk:</span>
                      <RiskBadge risk={pod.risk.level} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">SLA:</span>
                      <SLABadge sla={pod.timeline.sla} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <StatusBadge status={pod.status} />
                    <div className="text-xs text-muted-foreground">
                      {new Date(pod.timeline.reported).toLocaleDateString(
                        "en-IN"
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {pods.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">
                No missing POD cases found
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PODList;
