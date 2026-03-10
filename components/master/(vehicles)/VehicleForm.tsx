import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Vehicle, VehicleFormData } from "./types";
import { AlertCircle, Truck, FileCheck, Calendar, MapPin, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VehicleFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: VehicleFormData) => void;
    initialData?: Vehicle | null;
}

const VehicleForm = ({ open, onOpenChange, onSubmit, initialData }: VehicleFormProps) => {
    const [activeTab, setActiveTab] = useState("basic");
    const [formData, setFormData] = useState<VehicleFormData>({
        regNo: "",
        type: "TRUCK_10T",
        make: "",
        model: "",
        driverName: "",
        driverPhone: "",
        capacity: 0,
        status: "AVAILABLE",
        fuelType: "DIESEL",
        currentLocation: "",
        insuranceExpiry: "",
        fitnessExpiry: "",
        pollutionCertExpiry: "",
        ownershipType: "OWNED",
        permitType: "NATIONAL",
        gpsDeviceId: "",
        lastServiceDate: "",
        nextServiceDue: "",
    });

    useEffect(() => {
        if (initialData) {
            // Create a clean object without the id
            const { id, ...rest } = initialData;
            setFormData(rest);
        } else {
            // Reset form
            setFormData({
                regNo: "",
                type: "TRUCK_10T",
                make: "",
                model: "",
                driverName: "",
                driverPhone: "",
                capacity: 0,
                status: "AVAILABLE",
                fuelType: "DIESEL",
                currentLocation: "",
                insuranceExpiry: "",
                fitnessExpiry: "",
                pollutionCertExpiry: "",
                ownershipType: "OWNED",
                permitType: "NATIONAL",
                gpsDeviceId: "",
                lastServiceDate: "",
                nextServiceDue: "",
            });
        }
    }, [initialData, open]);

    const handleChange = (field: keyof VehicleFormData, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[500px] sm:w-[500px] sm:max-w-[500px] flex flex-col h-full">
                <SheetHeader className="flex-none">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Truck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <SheetTitle>{initialData ? "Edit Vehicle" : "Add New Vehicle"}</SheetTitle>
                            <SheetDescription>
                                {initialData ? `Update details for ${initialData.regNo}` : "Register a new vehicle in the fleet."}
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-6 pr-2">
                    <form id="vehicle-form" onSubmit={handleSubmit} className="space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                                <TabsTrigger value="compliance">Compliance</TabsTrigger>
                                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                            </TabsList>

                            <TabsContent value="basic" className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="regNo">Registration Number *</Label>
                                        <Input
                                            id="regNo"
                                            placeholder="e.g. MH-02-AB-1234"
                                            value={formData.regNo}
                                            onChange={(e) => handleChange("regNo", e.target.value.toUpperCase())}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(val: any) => handleChange("status", val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="AVAILABLE">Available</SelectItem>
                                                <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                                                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                                <SelectItem value="BREAKDOWN">Breakdown</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Vehicle Type *</Label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(val: any) => handleChange("type", val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="TRUCK_10T">Truck (10 Ton)</SelectItem>
                                                <SelectItem value="TRUCK_5T">Truck (5 Ton)</SelectItem>
                                                <SelectItem value="PICKUP_VAN">Pickup Van</SelectItem>
                                                <SelectItem value="CONTAINER_32FT">Container (32ft)</SelectItem>
                                                <SelectItem value="BIKE">Bike</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ownership">Ownership *</Label>
                                        <Select
                                            value={formData.ownershipType}
                                            onValueChange={(val: any) => handleChange("ownershipType", val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select ownership" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="OWNED">Company Owned</SelectItem>
                                                <SelectItem value="LEASED">Leased</SelectItem>
                                                <SelectItem value="MARKET">Market / Attached</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="make">Make (Manufacturer)</Label>
                                        <Input
                                            id="make"
                                            placeholder="e.g. Tata, Mahindra"
                                            value={formData.make}
                                            onChange={(e) => handleChange("make", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="model">Model</Label>
                                        <Input
                                            id="model"
                                            placeholder="e.g. Bolero, Signa"
                                            value={formData.model}
                                            onChange={(e) => handleChange("model", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fuelType">Fuel Type</Label>
                                        <Select
                                            value={formData.fuelType}
                                            onValueChange={(val: any) => handleChange("fuelType", val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Fuel" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="DIESEL">Diesel</SelectItem>
                                                <SelectItem value="PETROL">Petrol</SelectItem>
                                                <SelectItem value="CNG">CNG</SelectItem>
                                                <SelectItem value="ELECTRIC">Electric</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="capacity">Payload Capacity (kg)</Label>
                                        <Input
                                            id="capacity"
                                            type="number"
                                            placeholder="e.g. 1500"
                                            value={formData.capacity}
                                            onChange={(e) => handleChange("capacity", parseInt(e.target.value) || 0)}
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium flex items-center gap-2"><MapPin className="h-4 w-4" /> Tracking</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="gpsId">GPS Device ID</Label>
                                            <Input
                                                id="gpsId"
                                                placeholder="IMEI or Device ID"
                                                value={formData.gpsDeviceId || ""}
                                                onChange={(e) => handleChange("gpsDeviceId", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="currLoc">Current Location</Label>
                                            <Input
                                                id="currLoc"
                                                placeholder="Hub or City"
                                                value={formData.currentLocation || ""}
                                                onChange={(e) => handleChange("currentLocation", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="compliance" className="space-y-5 mt-4">
                                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><FileCheck className="h-4 w-4 text-primary" /> Document Expiry Dates</h4>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="permitType">Permit Type</Label>
                                                <Select
                                                    value={formData.permitType}
                                                    onValueChange={(val: any) => handleChange("permitType", val)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Permit Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="NATIONAL">National Permit (All India)</SelectItem>
                                                        <SelectItem value="STATE">State Permit</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <Separator className="bg-border/60" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="insurance">Insurance Expiry</Label>
                                                <Input
                                                    id="insurance"
                                                    type="date"
                                                    value={formData.insuranceExpiry}
                                                    onChange={(e) => handleChange("insuranceExpiry", e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="fitness">Fitness Cert. (FC) Expiry</Label>
                                                <Input
                                                    id="fitness"
                                                    type="date"
                                                    value={formData.fitnessExpiry}
                                                    onChange={(e) => handleChange("fitnessExpiry", e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="puc">Pollution (PUC) Expiry</Label>
                                                <Input
                                                    id="puc"
                                                    type="date"
                                                    value={formData.pollutionCertExpiry}
                                                    onChange={(e) => handleChange("pollutionCertExpiry", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="maintenance" className="space-y-4 mt-4">
                                <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-200/50">
                                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-orange-700"><Wrench className="h-4 w-4" /> Maintenance Schedule</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="lastService">Last Service Date</Label>
                                            <Input
                                                id="lastService"
                                                type="date"
                                                value={formData.lastServiceDate || ""}
                                                onChange={(e) => handleChange("lastServiceDate", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="nextService">Next Service Due</Label>
                                            <Input
                                                id="nextService"
                                                type="date"
                                                value={formData.nextServiceDue || ""}
                                                onChange={(e) => handleChange("nextServiceDue", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <h4 className="text-sm font-semibold">Driver Assignment</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="driverName">Driver Name</Label>
                                            <Input
                                                id="driverName"
                                                placeholder="Name of driver"
                                                value={formData.driverName || ""}
                                                onChange={(e) => handleChange("driverName", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="driverPhone">Driver Phone</Label>
                                            <Input
                                                id="driverPhone"
                                                placeholder="Mobile number"
                                                value={formData.driverPhone || ""}
                                                onChange={(e) => handleChange("driverPhone", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </form>
                </div>

                <SheetFooter className="flex-none border-t border-border/50 p-6 bg-background">
                    <div className="flex gap-2 w-full justify-end">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" form="vehicle-form">
                            {initialData ? "Update Vehicle" : "Add Vehicle"}
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default VehicleForm;
