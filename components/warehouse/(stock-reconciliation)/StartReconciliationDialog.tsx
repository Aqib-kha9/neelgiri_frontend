"use client";

import { useState } from "react";
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

interface StartReconciliationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export const StartReconciliationDialog = ({ open, onOpenChange, onSuccess }: StartReconciliationDialogProps) => {
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        itemName: "",
        sku: "",
        category: "GENERAL",
        expectedQty: "",
        actualQty: "",
        reconciledBy: "",
        notes: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${API_BASE}/api/reconciliations`,
                {
                    itemName: formData.itemName,
                    sku: formData.sku,
                    category: formData.category,
                    expectedQty: parseFloat(formData.expectedQty) || 0,
                    actualQty: formData.actualQty ? parseFloat(formData.actualQty) : null,
                    reconciledBy: formData.reconciledBy,
                    notes: formData.notes,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Reconciliation started successfully");
            setFormData({ itemName: "", sku: "", category: "GENERAL", expectedQty: "", actualQty: "", reconciledBy: "", notes: "" });
            onOpenChange(false);
            onSuccess?.();
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Failed to start reconciliation";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Start Stock Reconciliation</DialogTitle>
                    <DialogDescription>
                        Begin a new stock reconciliation process.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="itemName">Item Name *</Label>
                            <Input
                                id="itemName"
                                placeholder="e.g. Delivery Bags - Large"
                                required
                                value={formData.itemName}
                                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="sku">SKU Code *</Label>
                                <Input
                                    id="sku"
                                    placeholder="e.g. DB-LRG-001"
                                    required
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GENERAL">General</SelectItem>
                                        <SelectItem value="PACKAGING">Packaging</SelectItem>
                                        <SelectItem value="EQUIPMENT">Equipment</SelectItem>
                                        <SelectItem value="CONSUMABLES">Consumables</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="expectedQty">Expected Quantity *</Label>
                                <Input
                                    id="expectedQty"
                                    type="number"
                                    placeholder="0"
                                    required
                                    value={formData.expectedQty}
                                    onChange={(e) => setFormData({ ...formData, expectedQty: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="actualQty">Actual Quantity</Label>
                                <Input
                                    id="actualQty"
                                    type="number"
                                    placeholder="0"
                                    value={formData.actualQty}
                                    onChange={(e) => setFormData({ ...formData, actualQty: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="reconciledBy">Reconciled By *</Label>
                            <Input
                                id="reconciledBy"
                                placeholder="Your name"
                                required
                                value={formData.reconciledBy}
                                onChange={(e) => setFormData({ ...formData, reconciledBy: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="recNotes">Notes</Label>
                            <Textarea
                                id="recNotes"
                                placeholder="Any observations or issues..."
                                rows={3}
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Start Reconciliation
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
