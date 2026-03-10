// components/manifest/counter/bulk/components/BulkManifestContent.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  FileText,
  Download,
  Eye,
  Trash2,
  Clock,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Manifest {
  id: string;
  manifestNumber: string;
  status: string;
  type: string;
  totalShipments: number;
  processed: number;
  failed: number;
  createdAt: string;
  createdBy: string;
  hub: string;
  progress: number;
  fileInfo: {
    name: string;
    size: string;
    rows: number;
  };
}

interface BulkManifestContentProps {
  manifests: Manifest[];
}

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: RefreshCw,
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
};

const typeConfig = {
  inward: {
    label: "Inward",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  weight_update: {
    label: "Weight Update",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  drs_creation: {
    label: "DRS Creation",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
};

const BulkManifestContent = ({ manifests }: BulkManifestContentProps) => {
  const StatusBadge = ({ status }: { status: keyof typeof statusConfig }) => {
    const config = statusConfig[status];
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

  const TypeBadge = ({ type }: { type: keyof typeof typeConfig }) => {
    const config = typeConfig[type];

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
        <div className="space-y-4">
          {manifests.map((manifest) => (
            <Card key={manifest.id} className="rounded-xl border-border/70">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-mono font-bold text-lg text-foreground">
                              {manifest.manifestNumber}
                            </p>
                            <TypeBadge
                              type={manifest.type as keyof typeof typeConfig}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {manifest.fileInfo.name} • {manifest.fileInfo.size}{" "}
                            • {manifest.fileInfo.rows} rows
                          </p>
                        </div>
                      </div>
                      <StatusBadge
                        status={manifest.status as keyof typeof statusConfig}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Created By</p>
                        <p className="font-medium">{manifest.createdBy}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Hub</p>
                        <p className="font-medium">{manifest.hub}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Created At</p>
                        <p className="font-medium">
                          {new Date(manifest.createdAt).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Progress</p>
                        <p className="font-medium">
                          {manifest.processed}/{manifest.totalShipments}{" "}
                          shipments
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Processing Progress
                        </span>
                        <span className="font-medium">
                          {manifest.progress}%
                        </span>
                      </div>
                      <Progress value={manifest.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Processed: {manifest.processed}</span>
                        <span>Failed: {manifest.failed}</span>
                        <span>Total: {manifest.totalShipments}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-border/70"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                          <Download className="h-4 w-4" />
                          Download Report
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-red-600">
                          <Trash2 className="h-4 w-4" />
                          Delete Batch
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {manifests.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2">
                No bulk manifests found
              </p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search filters or create a new bulk upload
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkManifestContent;
