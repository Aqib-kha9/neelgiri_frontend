import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  progress: number;
  total: number;
  processed: number;
  failed: number;
}

export const ProgressBar = ({
  progress,
  total,
  processed,
  failed,
}: ProgressBarProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium">
          {processed}/{total} shipments
        </span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Success: {processed - failed}</span>
        <span>Failed: {failed}</span>
      </div>
    </div>
  );
};
