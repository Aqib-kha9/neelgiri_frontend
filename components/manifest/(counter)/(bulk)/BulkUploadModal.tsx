// components/manifest/counter/bulk/components/BulkUploadModal.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { X, Upload, FileText, Download } from "lucide-react";

interface BulkUploadModalProps {
  onClose: () => void;
}

const BulkUploadModal = ({ onClose }: BulkUploadModalProps) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border-border/70 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Bulk Upload Manifest
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Upload a CSV file to process multiple shipments in bulk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-muted/30">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2">
                Drag and drop your CSV file here
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse files (Max: 10MB)
              </p>
              <Button variant="outline" className="gap-2 rounded-lg">
                <Upload className="h-4 w-4" />
                Select File
              </Button>
              <div className="mt-4">
                <Button variant="link" className="gap-2 text-sm">
                  <Download className="h-3 w-3" />
                  Download CSV Template
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Upload Type
                </label>
                <Select defaultValue="inward">
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select upload type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inward">Inward Shipments</SelectItem>
                    <SelectItem value="weight_update">
                      Weight Updates
                    </SelectItem>
                    <SelectItem value="drs_creation">DRS Creation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Processing Hub
                </label>
                <Select defaultValue="kolkata">
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select hub" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kolkata">Kolkata Central Hub</SelectItem>
                    <SelectItem value="mumbai">Mumbai Central Hub</SelectItem>
                    <SelectItem value="bangalore">
                      Bangalore Central Hub
                    </SelectItem>
                    <SelectItem value="delhi">Delhi Central Hub</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Processing Options
              </label>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Auto Validate Data
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Validate data before processing
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Skip Failed Rows
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Continue processing on errors
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Send Notifications
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Notify on completion
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Upload Notes
              </label>
              <Textarea
                placeholder="Add any notes or special instructions for this bulk upload..."
                className="rounded-lg min-h-[100px]"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-border/70">
              <Button
                variant="outline"
                className="flex-1 rounded-lg"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button className="flex-1 gap-2 rounded-lg bg-green-600 hover:bg-green-700">
                <Upload className="h-4 w-4" />
                Start Upload
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkUploadModal;
