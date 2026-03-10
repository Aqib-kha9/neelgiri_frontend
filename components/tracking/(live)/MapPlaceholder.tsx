import { MapPin, Truck } from "lucide-react";

interface MapPlaceholderProps {
  location: any;
}

const MapPlaceholder = ({ location }: MapPlaceholderProps) => {
  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl h-64 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Current Location
            </p>
            <p className="text-xs text-muted-foreground">{location.address}</p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            Live Tracking Active
          </p>
          <p className="text-xs text-muted-foreground">
            Updated {location.timestamp}
          </p>
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="animate-pulse">
          <Truck className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );
};

export default MapPlaceholder;
