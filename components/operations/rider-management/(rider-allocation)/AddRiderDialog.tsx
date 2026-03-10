"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddRiderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AddRiderDialog = ({ open, onOpenChange }: AddRiderDialogProps) => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        zone: "",
        vehicleType: "",
        vehicleNumber: "",
        licenseNumber: "",
        shift: "",
        emergencyContact: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Rider Data:", formData);
        onOpenChange(false);
        // Reset form
        setFormData({
            name: "",
            phone: "",
            email: "",
            zone: "",
            vehicleType: "",
            vehicleNumber: "",
            licenseNumber: "",
            shift: "",
            emergencyContact: "",
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Rider</DialogTitle>
                    <DialogDescription>
                        Register a new delivery rider. Fill in all required information.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter rider name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+91 XXXXX XXXXX"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="rider@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="zone">Assigned Zone *</Label>
                                <Select value={formData.zone} onValueChange={(value) => setFormData({ ...formData, zone: value })}>
                                    <SelectTrigger id="zone">
                                        <SelectValue placeholder="Select zone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="north">North Zone</SelectItem>
                                        <SelectItem value="south">South Zone</SelectItem>
                                        <SelectItem value="east">East Zone</SelectItem>
                                        <SelectItem value="west">West Zone</SelectItem>
                                        <SelectItem value="central">Central Zone</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="vehicleType">Vehicle Type *</Label>
                                <Select value={formData.vehicleType} onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}>
                                    <SelectTrigger id="vehicleType">
                                        <SelectValue placeholder="Select vehicle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bike">Bike</SelectItem>
                                        <SelectItem value="scooter">Scooter</SelectItem>
                                        <SelectItem value="bicycle">Bicycle</SelectItem>
                                        <SelectItem value="van">Van</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                                <Input
                                    id="vehicleNumber"
                                    placeholder="DL01AB1234"
                                    value={formData.vehicleNumber}
                                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="licenseNumber">License Number *</Label>
                                <Input
                                    id="licenseNumber"
                                    placeholder="DL-XXXXXXXXXX"
                                    value={formData.licenseNumber}
                                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="shift">Shift *</Label>
                                <Select value={formData.shift} onValueChange={(value) => setFormData({ ...formData, shift: value })}>
                                    <SelectTrigger id="shift">
                                        <SelectValue placeholder="Select shift" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="morning">Morning (6 AM - 2 PM)</SelectItem>
                                        <SelectItem value="afternoon">Afternoon (2 PM - 10 PM)</SelectItem>
                                        <SelectItem value="night">Night (10 PM - 6 AM)</SelectItem>
                                        <SelectItem value="flexible">Flexible</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="emergencyContact">Emergency Contact Number *</Label>
                            <Input
                                id="emergencyContact"
                                type="tel"
                                placeholder="+91 XXXXX XXXXX"
                                value={formData.emergencyContact}
                                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Add Rider</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
