"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AddServiceAgreementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AddServiceAgreementDialog = ({ open, onOpenChange }: AddServiceAgreementDialogProps) => {
    const [formData, setFormData] = useState({
        customerName: "",
        agreementType: "",
        startDate: "",
        endDate: "",
        monthlyVolume: "",
        ratePerDelivery: "",
        billingCycle: "",
        paymentTerms: "",
        specialTerms: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Service Agreement Data:", formData);
        onOpenChange(false);
        setFormData({
            customerName: "",
            agreementType: "",
            startDate: "",
            endDate: "",
            monthlyVolume: "",
            ratePerDelivery: "",
            billingCycle: "",
            paymentTerms: "",
            specialTerms: "",
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Service Agreement</DialogTitle>
                    <DialogDescription>
                        Set up a new service agreement with a customer. Define terms and pricing.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="customerName">Customer/Company Name *</Label>
                            <Input
                                id="customerName"
                                placeholder="Enter customer name"
                                value={formData.customerName}
                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="agreementType">Agreement Type *</Label>
                            <Select value={formData.agreementType} onValueChange={(value) => setFormData({ ...formData, agreementType: value })}>
                                <SelectTrigger id="agreementType">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Standard">Standard Service Agreement</SelectItem>
                                    <SelectItem value="Premium">Premium Service Agreement</SelectItem>
                                    <SelectItem value="Enterprise">Enterprise Agreement</SelectItem>
                                    <SelectItem value="Custom">Custom Agreement</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date *</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">End Date *</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="monthlyVolume">Expected Monthly Volume *</Label>
                                <Input
                                    id="monthlyVolume"
                                    type="number"
                                    placeholder="Number of deliveries"
                                    value={formData.monthlyVolume}
                                    onChange={(e) => setFormData({ ...formData, monthlyVolume: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ratePerDelivery">Rate per Delivery (₹) *</Label>
                                <Input
                                    id="ratePerDelivery"
                                    type="number"
                                    step="0.01"
                                    placeholder="50.00"
                                    value={formData.ratePerDelivery}
                                    onChange={(e) => setFormData({ ...formData, ratePerDelivery: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="billingCycle">Billing Cycle *</Label>
                                <Select value={formData.billingCycle} onValueChange={(value) => setFormData({ ...formData, billingCycle: value })}>
                                    <SelectTrigger id="billingCycle">
                                        <SelectValue placeholder="Select cycle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Weekly">Weekly</SelectItem>
                                        <SelectItem value="Bi-Weekly">Bi-Weekly</SelectItem>
                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="paymentTerms">Payment Terms *</Label>
                                <Select value={formData.paymentTerms} onValueChange={(value) => setFormData({ ...formData, paymentTerms: value })}>
                                    <SelectTrigger id="paymentTerms">
                                        <SelectValue placeholder="Select terms" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Net 7">Net 7 Days</SelectItem>
                                        <SelectItem value="Net 15">Net 15 Days</SelectItem>
                                        <SelectItem value="Net 30">Net 30 Days</SelectItem>
                                        <SelectItem value="Advance">Advance Payment</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="specialTerms">Special Terms & Conditions</Label>
                            <Textarea
                                id="specialTerms"
                                placeholder="Any special clauses, discounts, or conditions..."
                                value={formData.specialTerms}
                                onChange={(e) => setFormData({ ...formData, specialTerms: e.target.value })}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Create Agreement</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
