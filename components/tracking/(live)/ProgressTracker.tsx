import { Progress } from "@/components/ui/progress";

interface ProgressTrackerProps {
  milestones: any[];
}

const ProgressTracker = ({ milestones }: ProgressTrackerProps) => {
  const completedCount = milestones.filter(
    (m) => m.status === "completed"
  ).length;
  const totalCount = milestones.length - 1; // Exclude pending
  const progress = (completedCount / totalCount) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Journey Progress</span>
        <span className="font-medium">
          {completedCount}/{totalCount} steps
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default ProgressTracker;
