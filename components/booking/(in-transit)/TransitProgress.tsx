import { Progress } from "@/components/ui/progress";
import { TransitRoute } from "./types";

interface TransitProgressProps {
  route: TransitRoute[];
  currentLocation: string;
}

export const TransitProgress = ({
  route,
  currentLocation,
}: TransitProgressProps) => {
  const currentIndex = route.findIndex(
    (step) => step.location === currentLocation
  );
  const progress = ((currentIndex + 1) / route.length) * 100;

  return (
    <div className="space-y-2">
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{route[0]?.location}</span>
        <span>{route[route.length - 1]?.location}</span>
      </div>
    </div>
  );
};
