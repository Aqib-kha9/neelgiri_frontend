import { Progress } from "@/components/ui/progress";
import { Exception } from "./types";

interface ResolutionProgressProps {
  exception: Exception;
}

export const ResolutionProgress = ({ exception }: ResolutionProgressProps) => {
  const steps = exception.resolution.actions || [];
  const completedSteps =
    exception.status === "resolved"
      ? steps.length
      : Math.floor(steps.length / 2);
  const progress = steps.length > 0 ? (completedSteps / steps.length) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Resolution Progress</span>
        <span className="font-medium">
          {completedSteps}/{steps.length} steps
        </span>
      </div>
      <Progress value={progress} className="h-2" />
      {exception.resolution.deadline && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Deadline:</span>
          <span>
            {new Date(exception.resolution.deadline).toLocaleDateString(
              "en-IN"
            )}
          </span>
        </div>
      )}
    </div>
  );
};
