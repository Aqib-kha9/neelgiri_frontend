import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  FileSpreadsheet,
  QrCode,
  MoreHorizontal,
  FileText,
  BarChart3,
  Package,
  AlertCircle,
  Eye,
  Edit3,
  Copy,
  Download,
  Trash2,
  Upload,
  RefreshCw,
  Zap,
} from "lucide-react";
import { BulkShipment } from "./types";
import {
  StatusBadge,
  ServiceTypeBadge,
  PaymentTypeBadge,
} from "./QuickBookingBadges";
import { ProgressBar } from "./ProgressBar";

interface BatchCardProps {
  batch: BulkShipment;
  onDelete: (id: string) => void;
  onDuplicate: (batch: BulkShipment) => void;
}

export const BatchCard = ({ batch, onDelete, onDuplicate }: BatchCardProps) => {
  return (
    <Card
      key={batch.id}
      className="rounded-2xl border-border/70 bg-card/95 shadow-card hover:shadow-lg transition-all duration-300"
    >
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="p-6 border-b border-border/70">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-2">
                  <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-lg text-foreground">
                      {batch.name}
                    </p>
                    <QrCode className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ID: {batch.id} • Created by {batch.createdBy}
                  </p>
                </div>
              </div>
              <StatusBadge status={batch.status} />
              <ServiceTypeBadge type={batch.serviceType as any} />
              <PaymentTypeBadge type={batch.paymentType as any} />
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {batch.processed}/{batch.totalShipments}
                </p>
                <p className="text-xs text-muted-foreground">Processed</p>
              </div>
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
                    <Edit3 className="h-4 w-4" />
                    Edit Batch
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 rounded-lg"
                    onClick={() => onDuplicate(batch)}
                  >
                    <Copy className="h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <Download className="h-4 w-4" />
                    Export Data
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 rounded-lg text-red-600"
                    onClick={() => onDelete(batch.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Batch
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Batch Information */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Batch Information
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Template</p>
                      <p className="font-medium">{batch.template}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">AWB Prefix</p>
                      <p className="font-mono font-medium">{batch.awbPrefix}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium">
                        {new Date(batch.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Updated</p>
                      <p className="font-medium">
                        {new Date(batch.updatedAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Processing Progress
                  </span>
                </div>
                <div className="space-y-3">
                  <ProgressBar
                    progress={batch.progress}
                    total={batch.totalShipments}
                    processed={batch.processed}
                    failed={batch.failed}
                  />

                  {batch.failed > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {batch.failed} shipments failed
                        </span>
                      </div>
                      <p className="text-xs text-red-600 mt-1">
                        Check the errors and retry processing
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions & Quick Tools */}
            <div className="space-y-4">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Quick Actions
                  </span>
                </div>
                <div className="space-y-2">
                  {batch.status === "draft" && (
                    <>
                      <Button
                        size="sm"
                        className="w-full gap-2 rounded-lg bg-primary text-primary-foreground"
                      >
                        <Upload className="h-3 w-3" />
                        Start Processing
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full gap-2 rounded-lg border-border/70"
                      >
                        <Edit3 className="h-3 w-3" />
                        Edit Shipments
                      </Button>
                    </>
                  )}
                  {batch.status === "processing" && (
                    <>
                      <Button
                        size="sm"
                        className="w-full gap-2 rounded-lg bg-primary text-primary-foreground"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Resume Processing
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full gap-2 rounded-lg border-border/70"
                      >
                        <AlertCircle className="h-3 w-3" />
                        Pause Batch
                      </Button>
                    </>
                  )}
                  {batch.status === "completed" && (
                    <>
                      <Button
                        size="sm"
                        className="w-full gap-2 rounded-lg bg-primary text-primary-foreground"
                      >
                        <Download className="h-3 w-3" />
                        Download Labels
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full gap-2 rounded-lg border-border/70"
                      >
                        <Copy className="h-3 w-3" />
                        Reuse Template
                      </Button>
                    </>
                  )}
                  {batch.status === "failed" && (
                    <>
                      <Button
                        size="sm"
                        className="w-full gap-2 rounded-lg bg-primary text-primary-foreground"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Retry Failed
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full gap-2 rounded-lg border-border/70"
                      >
                        <Eye className="h-3 w-3" />
                        View Errors
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full gap-2 rounded-lg border-border/70"
                  >
                    <BarChart3 className="h-3 w-3" />
                    View Report
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Shipments Preview */}
          {batch.shipments.length > 0 && (
            <div className="mt-6 rounded-xl border border-border/60 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Package className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-foreground">
                  Sample Shipments
                </span>
                <Badge variant="secondary" className="rounded-full text-xs">
                  {batch.shipments.length} sample records
                </Badge>
              </div>
              <div className="space-y-3">
                {batch.shipments.slice(0, 2).map((shipment) => (
                  <div
                    key={shipment.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="font-mono font-medium text-sm">
                        {shipment.awbNumber}
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">{shipment.receiver.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {shipment.receiver.city} - {shipment.receiver.pincode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        {shipment.package.weight}
                      </span>
                      <Badge
                        variant="default"
                        className="rounded-full text-xs bg-green-100 text-green-800"
                      >
                        {shipment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {batch.shipments.length > 2 && (
                  <div className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground"
                    >
                      + {batch.shipments.length - 2} more shipments
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
