import {
    Edit,
    Trash2,
    Truck,
    User,
    Fuel,
    Gauge,
    Calendar,
    FileCheck,
    AlertCircle,
    CheckCircle2,
    Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Vehicle } from "./types";

interface VehiclesListProps {
    vehicles: Vehicle[];
    onEdit: (vehicle: Vehicle) => void;
    onDelete: (id: string) => void;
}

const VehiclesList = ({ vehicles, onEdit, onDelete }: VehiclesListProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "AVAILABLE":
                return "success";
            case "IN_TRANSIT":
                return "default";
            case "MAINTENANCE":
                return "destructive";
            default:
                return "secondary";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "AVAILABLE":
                return <CheckCircle2 className="h-3 w-3" />;
            case "IN_TRANSIT":
                return <Clock className="h-3 w-3" />;
            case "MAINTENANCE":
                return <AlertCircle className="h-3 w-3" />;
            default:
                return <AlertCircle className="h-3 w-3" />;
        }
    };

    return (
        <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Fleet Directory
                    <Badge variant="secondary" className="rounded-full">
                        {vehicles.length} vehicles
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {vehicles.map((vehicle) => (
                        <Card key={vehicle.id} className="rounded-xl border-border/70 hover:border-primary/50 transition-colors">
                            <CardContent className="p-4">
                                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="rounded-xl bg-primary/10 p-3">
                                            <Truck className="h-8 w-8 text-primary" />
                                        </div>

                                        <div className="flex-1 space-y-3">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="text-lg font-bold text-foreground">
                                                    {vehicle.regNo}
                                                </h3>
                                                <Badge
                                                    variant={getStatusColor(vehicle.status) as any}
                                                    className="rounded-full text-xs flex items-center gap-1"
                                                >
                                                    {getStatusIcon(vehicle.status)}
                                                    {vehicle.status.replace("_", " ")}
                                                </Badge>
                                                <Badge variant="outline" className="rounded-full text-xs">
                                                    {vehicle.make} {vehicle.model}
                                                </Badge>
                                                <Badge variant="outline" className="rounded-full text-xs bg-muted/50">
                                                    {vehicle.type.replace("_", " ")}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6 text-sm">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <User className="h-4 w-4" />
                                                    <span className="font-medium text-foreground">
                                                        {vehicle.driverName || "Unassigned"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Fuel className="h-4 w-4" />
                                                    <span>{vehicle.fuelType}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Gauge className="h-4 w-4" />
                                                    <span>{vehicle.capacity} kg Capacity</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <FileCheck className="h-4 w-4" />
                                                    <span>Ins: {new Date(vehicle.insuranceExpiry).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>FC: {new Date(vehicle.fitnessExpiry).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2 rounded-lg flex-1 md:flex-none border-border/50"
                                            onClick={() => onEdit(vehicle)}
                                        >
                                            <Edit className="h-4 w-4" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2 rounded-lg flex-1 md:flex-none text-destructive border-border/50 hover:bg-destructive/10"
                                            onClick={() => onDelete(vehicle.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {vehicles.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-muted/30">
                            <Truck className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <p className="text-muted-foreground mb-2">No vehicles found</p>
                            <p className="text-sm text-muted-foreground">
                                Add a new vehicle to get started with fleet management
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default VehiclesList;
