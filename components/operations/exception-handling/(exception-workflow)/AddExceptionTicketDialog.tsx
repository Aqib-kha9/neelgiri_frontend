"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AddExceptionTicketDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AddExceptionTicketDialog = ({ open, onOpenChange }: AddExceptionTicketDialogProps) => {
    const [formData, setFormData] = useState({
        orderId: "",
        type: "",
        severity: "",
        description: "",
        customerName: "",
        customerPhone: "",
        riderName: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Exception Ticket Data:", formData);
        onOpenChange(false);
        setFormData({
            orderId: "",
            type: "",
            severity: "",
            description: "",
            customerName: "",
            customerPhone: "",
            riderName: "",
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Exception Ticket</DialogTitle>
                    <DialogDescription>
                        Log a new delivery exception. Provide detailed information for quick resolution.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="orderId">Order ID *</Label>
                                <Input
                                    id="orderId"
                                    placeholder="ORD-XXXX"
                                    value={formData.orderId}
                                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Exception Type *</Label>
                                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Package Damaged">Package Damaged</SelectItem>
                                        <SelectItem value="Wrong Address">Wrong Address</SelectItem>
                                        <SelectItem value="Late Delivery">Late Delivery</SelectItem>
                                        <SelectItem value="Customer Refused">Customer Refused</SelectItem>
                                        <SelectItem value="Missing Item">Missing Item</SelectItem>
                                        <SelectItem value="Vehicle Breakdown">Vehicle Breakdown</SelectItem>
                                        <SelectItem value="Weather Delay">Weather Delay</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="severity">Severity Level *</Label>
                            <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
                                <SelectTrigger id="severity">
                                    <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="critical">Critical - Immediate Action Required</SelectItem>
                                    <SelectItem value="high">High - Urgent</SelectItem>
                                    <SelectItem value="medium">Medium - Normal Priority</SelectItem>
                                    <SelectItem value="low">Low - Can Wait</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the issue in detail..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="customerName">Customer Name</Label>
                                <Input
                                    id="customerName"
                                    placeholder="Enter customer name"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="customerPhone">Customer Phone</Label>
                                <Input
                                    id="customerPhone"
                                    type="tel"
                                    placeholder="+91 XXXXX XXXXX"
                                    value={formData.customerPhone}
                                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="riderName">Assigned Rider (if any)</Label>
                            <Input
                                id="riderName"
                                placeholder="Rider name or ID"
                                value={formData.riderName}
                                onChange={(e) => setFormData({ ...formData, riderName: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Create Ticket</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
