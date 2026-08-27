"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

interface SimpleUser {
    _id: string;
    name: string;
    email: string;
    role?: { name: string };
}

interface AddPartnerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onPartnerAdded?: () => void;
}

export const AddPartnerDialog = ({ open, onOpenChange, onPartnerAdded }: AddPartnerDialogProps) => {
    const [users, setUsers] = useState<SimpleUser[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        userId: "",
        companyName: "",
        businessType: "retail",
        contactPerson: "",
        email: "",
        phone: "",
        gstin: "",
        pan: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        deliveryRadius: "",
        notes: "",
    });

    const fetchUsers = useCallback(async () => {
        setLoadingUsers(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_BASE}/api/rbac/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const list = Array.isArray(res.data) ? res.data : [];
            setUsers(list.map((u: any) => ({
                _id: u._id,
                name: u.name || "Unknown",
                email: u.email || "",
                role: u.role ? { name: u.role.name } : undefined,
            })));
        } catch {
            setUsers([]);
        } finally {
            setLoadingUsers(false);
        }
    }, []);

    useEffect(() => {
        if (open) {
            fetchUsers();
        }
    }, [open, fetchUsers]);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setForm({
            userId: "",
            companyName: "",
            businessType: "retail",
            contactPerson: "",
            email: "",
            phone: "",
            gstin: "",
            pan: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            pincode: "",
            country: "India",
            deliveryRadius: "",
            notes: "",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.userId) {
            toast.error("Please select a linked user account.");
            return;
        }
        if (!form.companyName) {
            toast.error("Business name is required.");
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const payload: any = {
                userId: form.userId,
                companyName: form.companyName,
                contactPerson: form.contactPerson || undefined,
                email: form.email || undefined,
                phone: form.phone || undefined,
                gstin: form.gstin || undefined,
                pan: form.pan || undefined,
                address: {
                    line1: form.addressLine1 || undefined,
                    line2: form.addressLine2 || undefined,
                    city: form.city || undefined,
                    state: form.state || undefined,
                    pincode: form.pincode || undefined,
                    country: form.country || "India",
                },
                type: form.businessType,
                deliveryRadius: form.deliveryRadius ? Number(form.deliveryRadius) : undefined,
                notes: form.notes || undefined,
                agreementStartDate: new Date().toISOString(),
            };

            await axios.post(`${API_BASE}/api/partners`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success(`Partner "${form.companyName}" created successfully!`);
            resetForm();
            onOpenChange(false);
            if (onPartnerAdded) onPartnerAdded();
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Failed to create partner. Please try again.";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Partner</DialogTitle>
                    <DialogDescription>
                        Enter the details for the new partner.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="userId">Linked User Account *</Label>
                            <Select
                                value={form.userId}
                                onValueChange={(v) => handleChange("userId", v)}
                                required
                            >
                                <SelectTrigger id="userId">
                                    <SelectValue placeholder={loadingUsers ? "Loading users..." : "Select a user"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((user) => (
                                        <SelectItem key={user._id} value={user._id}>
                                            {user.name} {user.email ? `(${user.email})` : ""}
                                            {user.role?.name ? ` — ${user.role.name}` : ""}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="partnerName">Business Name *</Label>
                            <Input
                                id="partnerName"
                                placeholder="e.g., Spice Garden Restaurant"
                                value={form.companyName}
                                onChange={(e) => handleChange("companyName", e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="partnerType">Business Type *</Label>
                                <Select
                                    value={form.businessType}
                                    onValueChange={(v) => handleChange("businessType", v)}
                                    required
                                >
                                    <SelectTrigger id="partnerType">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="restaurant">Restaurant</SelectItem>
                                        <SelectItem value="grocery">Grocery</SelectItem>
                                        <SelectItem value="pharmacy">Pharmacy</SelectItem>
                                        <SelectItem value="retail">Retail</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="city">City *</Label>
                                <Input
                                    id="city"
                                    placeholder="e.g., Delhi"
                                    value={form.city}
                                    onChange={(e) => handleChange("city", e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="location">Full Address *</Label>
                            <Input
                                id="location"
                                placeholder="e.g., Sector 18, Noida"
                                value={form.addressLine1}
                                onChange={(e) => handleChange("addressLine1", e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="contactPerson">Contact Person *</Label>
                            <Input
                                id="contactPerson"
                                placeholder="e.g., Rajesh Kumar"
                                value={form.contactPerson}
                                onChange={(e) => handleChange("contactPerson", e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone *</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    value={form.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="contact@example.com"
                                    value={form.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="gstin">GSTIN</Label>
                                <Input
                                    id="gstin"
                                    placeholder="e.g., 27ABCDE1234F1Z5"
                                    value={form.gstin}
                                    onChange={(e) => handleChange("gstin", e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="pan">PAN</Label>
                                <Input
                                    id="pan"
                                    placeholder="e.g., ABCDE1234F"
                                    value={form.pan}
                                    onChange={(e) => handleChange("pan", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="deliveryRadius">Delivery Radius (km) *</Label>
                            <Input
                                id="deliveryRadius"
                                type="number"
                                placeholder="5"
                                value={form.deliveryRadius}
                                onChange={(e) => handleChange("deliveryRadius", e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                placeholder="Additional information..."
                                rows={3}
                                value={form.notes}
                                onChange={(e) => handleChange("notes", e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Add Partner"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
