import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface DRSData {
  status: string;
  progress: {
    delivered: number;
  };
  issues: Array<{
    type: string;
    description: string;
  }>;
}

interface IssuesResolutionsProps {
  selectedDRS: DRSData;
}

const IssuesResolutions = ({ selectedDRS }: IssuesResolutionsProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertCircle className="h-5 w-5 text-primary" />
          Issues & Resolutions
        </CardTitle>
        <CardDescription>
          Problems encountered and their resolutions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {selectedDRS.issues.length > 0 ? (
            selectedDRS.issues.map((issue, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200"
              >
                <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground capitalize">
                    {issue.type.replace("_", " ")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {issue.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No issues reported
              </p>
              <p className="text-xs text-muted-foreground">
                This DRS was completed successfully
              </p>
            </div>
          )}

          {selectedDRS.status === "cancelled" && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm font-medium text-red-700">
                DRS Cancellation
              </p>
              <p className="text-sm text-red-600">
                This delivery run was cancelled before completion.{" "}
                {selectedDRS.progress.delivered} shipments were delivered before
                cancellation.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IssuesResolutions;
