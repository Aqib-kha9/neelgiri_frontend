import { Progress } from "@/components/ui/progress";

interface RouteProgressProps {
  route: {
    origin: string;
    destination: string;
    totalDistance: string;
    distanceCovered: string;
    distanceRemaining: string;
  };
}

const RouteProgress = ({ route }: RouteProgressProps) => {
  const progress =
    (parseInt(route.distanceCovered) / parseInt(route.totalDistance)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Route Progress</span>
        <span className="font-medium">
          {route.distanceCovered}/{route.totalDistance} km
        </span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{route.distanceRemaining} km remaining</span>
        <span>{Math.round(progress)}% completed</span>
      </div>
    </div>
  );
};

export default RouteProgress;
