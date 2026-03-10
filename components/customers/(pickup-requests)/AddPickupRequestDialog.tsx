"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AddPickupRequestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AddPickupRequestDialog = ({ open, onOpenChange }: AddPickupRequestDialogProps) => {
    const [formData, setFormData] = useState({
        customerName: "",
        customerPhone: "",
        pickupAddress: "",
        pickupDate: "",
        pickupTime: "",
        packageType: "",
        weight: "",
        dimensions: "",
        specialInstructions: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Pickup Request Data:", formData);
        onOpenChange(false);
        setFormData({
            customerName: "",
            customerPhone: "",
            pickupAddress: "",
            pickupDate: "",
            pickupTime: "",
            packageType: "",
            weight: "",
            dimensions: "",
            specialInstructions: "",
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Pickup Request</DialogTitle>
                    <DialogDescription>
                        Schedule a new pickup. Provide pickup location and package details.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="customerName">Customer Name *</Label>
                                <Input
                                    id="customerName"
                                    placeholder="Enter customer name"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="customerPhone">Phone Number *</Label>
                                <Input
                                    id="customerPhone"
                                    type="tel"
                                    placeholder="+91 XXXXX XXXXX"
                                    value={formData.customerPhone}
                                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pickupAddress">Pickup Address *</Label>
                            <Textarea
                                id="pickupAddress"
                                placeholder="Enter complete pickup address"
                                value={formData.pickupAddress}
                                onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                                rows={3}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pickupDate">Pickup Date *</Label>
                                <Input
                                    id="pickupDate"
                                    type="date"
                                    value={formData.pickupDate}
                                    onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pickupTime">Preferred Time Slot *</Label>
                                <Select value={formData.pickupTime} onValueChange={(value) => setFormData({ ...formData, pickupTime: value })}>
                                    <SelectTrigger id="pickupTime">
                                        <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="9-12">9 AM - 12 PM</SelectItem>
                                        <SelectItem value="12-3">12 PM - 3 PM</SelectItem>
                                        <SelectItem value="3-6">3 PM - 6 PM</SelectItem>
                                        <SelectItem value="6-9">6 PM - 9 PM</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="packageType">Package Type *</Label>
                                <Select value={formData.packageType} onValueChange={(value) => setFormData({ ...formData, packageType: value })}>
                                    <SelectTrigger id="packageType">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Document">Document</SelectItem>
                                        <SelectItem value="Parcel">Parcel</SelectItem>
                                        <SelectItem value="Fragile">Fragile</SelectItem>
                                        <SelectItem value="Perishable">Perishable</SelectItem>
                                        <SelectItem value="Electronics">Electronics</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="weight">Approx Weight (kg) *</Label>
                                <Input
                                    id="weight"
                                    type="number"
                                    step="0.1"
                                    placeholder="0.5"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dimensions">Dimensions (L x W x H cm)</Label>
                            <Input
                                id="dimensions"
                                placeholder="e.g., 30 x 20 x 10"
                                value={formData.dimensions}
                                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="specialInstructions">Special Instructions</Label>
                            <Textarea
                                id="specialInstructions"
                                placeholder="Any special handling requirements..."
                                value={formData.specialInstructions}
                                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                                rows={2}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Create Request</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
