"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Building, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface CreateBranchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: (newBranch: any) => void;
}

export function CreateBranchDialog({ open, onOpenChange, onSuccess }: CreateBranchDialogProps) {
    const { session } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
        code: "", // Optional or auto-gen
        type: "partner", // Default for Partner Admins
    });

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const branchCode = formData.code || `BR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

            const res = await fetch('/api/branches', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    code: branchCode,
                    partnerId: session?.user?._id // Explicitly passing, though backend handles it for Partners
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to create branch');
            }

            toast.success("Branch created successfully");
            onSuccess(data);
            onOpenChange(false);
            // Reset form
            setFormData({
                name: "",
                address: "",
                city: "",
                state: "",
                pincode: "",
                phone: "",
                code: "",
                type: "partner"
            });

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-primary" />
                        Add New Branch
                    </DialogTitle>
                    <DialogDescription>
                        Quickly add a branch to assign users to it.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="branch-name">Branch Name *</Label>
                        <Input
                            id="branch-name"
                            placeholder="e.g. Downtown Hub"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="branch-address">Address *</Label>
                        <Textarea
                            id="branch-address"
                            placeholder="Full address"
                            value={formData.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            required
                            rows={2}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="branch-city">City *</Label>
                            <Input
                                id="branch-city"
                                placeholder="City"
                                value={formData.city}
                                onChange={(e) => handleChange("city", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="branch-pincode">Pincode *</Label>
                            <Input
                                id="branch-pincode"
                                placeholder="123456"
                                value={formData.pincode}
                                onChange={(e) => handleChange("pincode", e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="branch-phone">Phone</Label>
                        <Input
                            id="branch-phone"
                            placeholder="Contact number"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create & Select
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
