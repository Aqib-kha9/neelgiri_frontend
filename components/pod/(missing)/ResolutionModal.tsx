import { CheckCircle2, Upload } from "lucide-react";
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

interface ResolutionModalProps {
  onClose: () => void;
  onSubmit: () => void;
}

const ResolutionModal = ({ onClose, onSubmit }: ResolutionModalProps) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl rounded-2xl border-border/70 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Resolve Missing POD Case
          </CardTitle>
          <CardDescription>
            Provide details about how this missing POD case was resolved
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Resolution Type
                </label>
                <Select>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select resolution type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pod_recovered">POD Recovered</SelectItem>
                    <SelectItem value="receiver_confirmed">
                      Receiver Confirmed Delivery
                    </SelectItem>
                    <SelectItem value="agent_verified">
                      Delivery Agent Verified
                    </SelectItem>
                    <SelectItem value="technical_issue">
                      Technical Issue Resolved
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Resolution Date
                </label>
                <Input
                  type="datetime-local"
                  className="rounded-lg"
                  defaultValue={new Date().toISOString().slice(0, 16)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Resolution Details
              </label>
              <Textarea
                placeholder="Describe how the missing POD was resolved..."
                className="rounded-lg min-h-[120px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Attach Supporting Documents (Optional)
              </label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 bg-muted/30 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drop files here or click to upload
                </p>
                <Button variant="outline" className="rounded-lg">
                  Choose Files
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border/70">
              <Button
                variant="outline"
                className="flex-1 rounded-lg"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 gap-2 rounded-lg bg-green-600 hover:bg-green-700"
                onClick={onSubmit}
              >
                <CheckCircle2 className="h-4 w-4" />
                Confirm Resolution
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResolutionModal;
