"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AddCustomerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AddCustomerDialog = ({ open, onOpenChange }: AddCustomerDialogProps) => {
    const [formData, setFormData] = useState({
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        alternatePhone: "",
        businessType: "",
        gstNumber: "",
        address: "",
        city: "",
        pincode: "",
        creditLimit: "",
        paymentTerms: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Customer Data:", formData);
        onOpenChange(false);
        setFormData({
            companyName: "",
            contactPerson: "",
            email: "",
            phone: "",
            alternatePhone: "",
            businessType: "",
            gstNumber: "",
            address: "",
            city: "",
            pincode: "",
            creditLimit: "",
            paymentTerms: "",
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                    <DialogDescription>
                        Register a new business customer. Fill in all required information.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name *</Label>
                                <Input
                                    id="companyName"
                                    placeholder="Enter company name"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactPerson">Contact Person *</Label>
                                <Input
                                    id="contactPerson"
                                    placeholder="Primary contact name"
                                    value={formData.contactPerson}
                                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="customer@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                <Label htmlFor="alternatePhone">Alternate Phone</Label>
                                <Input
                                    id="alternatePhone"
                                    type="tel"
                                    placeholder="+91 XXXXX XXXXX"
                                    value={formData.alternatePhone}
                                    onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="businessType">Business Type *</Label>
                                <Select value={formData.businessType} onValueChange={(value) => setFormData({ ...formData, businessType: value })}>
                                    <SelectTrigger id="businessType">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                                        <SelectItem value="Retail">Retail</SelectItem>
                                        <SelectItem value="Wholesale">Wholesale</SelectItem>
                                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                        <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                                        <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gstNumber">GST Number</Label>
                            <Input
                                id="gstNumber"
                                placeholder="22AAAAA0000A1Z5"
                                value={formData.gstNumber}
                                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Business Address *</Label>
                            <Textarea
                                id="address"
                                placeholder="Enter complete address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                rows={3}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">City *</Label>
                                <Input
                                    id="city"
                                    placeholder="Enter city"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pincode">Pincode *</Label>
                                <Input
                                    id="pincode"
                                    placeholder="110001"
                                    value={formData.pincode}
                                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="creditLimit">Credit Limit (₹)</Label>
                                <Input
                                    id="creditLimit"
                                    type="number"
                                    placeholder="50000"
                                    value={formData.creditLimit}
                                    onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="paymentTerms">Payment Terms *</Label>
                                <Select value={formData.paymentTerms} onValueChange={(value) => setFormData({ ...formData, paymentTerms: value })}>
                                    <SelectTrigger id="paymentTerms">
                                        <SelectValue placeholder="Select terms" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="COD">Cash on Delivery</SelectItem>
                                        <SelectItem value="Prepaid">Prepaid</SelectItem>
                                        <SelectItem value="Net 7">Net 7 Days</SelectItem>
                                        <SelectItem value="Net 15">Net 15 Days</SelectItem>
                                        <SelectItem value="Net 30">Net 30 Days</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Add Customer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
