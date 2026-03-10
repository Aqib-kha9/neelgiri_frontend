// components/master/locations/LocationsList.tsx
import {
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Building,
  Warehouse,
  Store,
  Settings,
  Play,
  Pause,
  BadgeCheck,
  XCircle,
  Wrench,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Location } from "./types";

interface LocationsListProps {
  locations: Location[];
  onEditLocation: (location: Location) => void;
  onDeleteLocation: (locationId: string) => void;
  onToggleStatus: (locationId: string) => void;
}

const LocationsList = ({
  locations,
  onEditLocation,
  onDeleteLocation,
  onToggleStatus,
}: LocationsListProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "hub":
        return <Building className="h-5 w-5 text-blue-600" />;
      case "warehouse":
        return <Warehouse className="h-5 w-5 text-green-600" />;
      case "counter":
        return <Store className="h-5 w-5 text-orange-600" />;
      case "office":
        return <Settings className="h-5 w-5 text-purple-600" />;
      case "processing_center":
        return <Settings className="h-5 w-5 text-red-600" />;
      default:
        return <MapPin className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "hub":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "warehouse":
        return "bg-green-100 text-green-800 border-green-200";
      case "counter":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "office":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "processing_center":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <BadgeCheck className="h-3 w-3" />;
      case "inactive":
        return <XCircle className="h-3 w-3" />;
      case "maintenance":
        return <Wrench className="h-3 w-3" />;
      default:
        return <XCircle className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      case "maintenance":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Locations List
          <Badge variant="secondary" className="rounded-full">
            {locations.length} locations
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {locations.map((location) => (
            <Card key={location.id} className="rounded-xl border-border/70">
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="rounded-xl bg-primary/10 p-3">
                      {getTypeIcon(location.type)}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {location.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-sm font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                              {location.code}
                            </code>
                            <Badge
                              className={`rounded-full border ${getTypeColor(
                                location.type
                              )} px-2 py-1 text-xs flex items-center gap-1`}
                            >
                              {getTypeIcon(location.type)}
                              {location.type.replace("_", " ").toUpperCase()}
                            </Badge>
                            <Badge
                              variant={getStatusColor(location.status) as any}
                              className="rounded-full text-xs flex items-center gap-1"
                            >
                              {getStatusIcon(location.status)}
                              {location.status.toUpperCase()}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="rounded-full text-xs"
                            >
                              {location.ownershipType || "COCO"}
                            </Badge>
                            {location.parentHubId && (
                              <Badge
                                variant="outline"
                                className="rounded-full text-xs"
                              >
                                Parent: {location.parentHubId}
                              </Badge>
                            )}
                            {location.isOperational && (
                              <Badge
                                variant="success"
                                className="rounded-full text-xs"
                              >
                                Operational
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className="rounded-full text-xs"
                            >
                              Security: {location.securityLevel}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {location.address}, {location.city} -{" "}
                              {location.pincode}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{location.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{location.email}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <span className="text-muted-foreground">
                              Manager:{" "}
                            </span>
                            <span className="font-medium">
                              {location.manager}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Contact:{" "}
                            </span>
                            <span className="font-medium">
                              {location.contactPerson}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Hours:{" "}
                            </span>
                            <span className="font-medium">
                              {location.operatingHours.open} -{" "}
                              {location.operatingHours.close}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Capacity:{" "}
                          </span>
                          <span className="font-medium">
                            {location.capacity.shipments} shipments
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Storage:{" "}
                          </span>
                          <span className="font-medium">
                            {location.capacity.storage} sq ft
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Vehicles:{" "}
                          </span>
                          <span className="font-medium">
                            {location.capacity.vehicles}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {location.facilities
                          .slice(0, 3)
                          .map((facility, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="rounded-full text-xs"
                            >
                              {facility}
                            </Badge>
                          ))}
                        {location.facilities.length > 3 && (
                          <Badge
                            variant="outline"
                            className="rounded-full text-xs"
                          >
                            +{location.facilities.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>
                          Last Audit:{" "}
                          {new Date(location.lastAudit).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>
                          Next Audit:{" "}
                          {new Date(location.nextAudit).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>
                          Updated:{" "}
                          {new Date(location.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-lg"
                      onClick={() => onEditLocation(location)}
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`gap-2 rounded-lg ${location.status === "active"
                        ? "text-orange-600 border-orange-500 hover:bg-orange-50"
                        : "text-green-600 border-green-500 hover:bg-green-50"
                        }`}
                      onClick={() => onToggleStatus(location.id)}
                    >
                      {location.status === "active" ? (
                        <>
                          <Pause className="h-4 w-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Activate
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDeleteLocation(location.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {locations.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-muted/30">
              <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2">No locations found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search criteria or add a new location
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card >
  );
};

export default LocationsList;
