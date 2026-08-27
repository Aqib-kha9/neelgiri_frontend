"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

type Branch = {
    _id: string;
    name: string;
    code: string;
    isActive?: boolean;
};

interface CreateSeriesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated: () => Promise<void> | void;
}

const initialForm = {
    prefix: "",
    startNumber: "",
    endNumber: "",
    branchId: "",
    status: "ACTIVE",
};

const CreateSeriesDialog = ({
    open,
    onOpenChange,
    onCreated,
}: CreateSeriesDialogProps) => {
    const [form, setForm] = useState(initialForm);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loadingBranches, setLoadingBranches] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!open) return;

        const loadBranches = async () => {
            setLoadingBranches(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Authentication is required");
                const { data } = await axios.get(`${API_BASE}/api/branches`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const branchData = Array.isArray(data) ? data : data?.data || [];
                setBranches(
                    branchData.filter((branch: Branch) => branch.isActive !== false),
                );
            } catch (error: any) {
                toast.error(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to load branches",
                );
            } finally {
                setLoadingBranches(false);
            }
        };

        loadBranches();
    }, [open]);

    const preview = useMemo(() => {
        const prefix = form.prefix.trim().toUpperCase();
        const start = Number(form.startNumber);
        const end = Number(form.endNumber);
        if (
            !prefix ||
            !Number.isSafeInteger(start) ||
            !Number.isSafeInteger(end) ||
            start < 0 ||
            end < start
        ) {
            return null;
        }
        const width = Math.max(form.startNumber.length, form.endNumber.length);
        return {
            first: `${prefix}${String(start).padStart(width, "0")}`,
            last: `${prefix}${String(end).padStart(width, "0")}`,
            count: end - start + 1,
        };
    }, [form.endNumber, form.prefix, form.startNumber]);

    const updateField = (field: keyof typeof initialForm, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const prefix = form.prefix.trim().toUpperCase();
        const startNumber = Number(form.startNumber);
        const endNumber = Number(form.endNumber);

        if (!/^[A-Z0-9]+$/.test(prefix)) {
            toast.error("Prefix may contain only letters and numbers");
            return;
        }
        if (
            !Number.isSafeInteger(startNumber) ||
            !Number.isSafeInteger(endNumber) ||
            startNumber < 0 ||
            endNumber < startNumber
        ) {
            toast.error("Enter a valid inclusive numeric range");
            return;
        }
        if (!form.branchId) {
            toast.error("Select the branch that will receive this AWB range");
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authentication is required");
            await axios.post(
                `${API_BASE}/api/awb-series`,
                {
                    prefix,
                    startNumber,
                    endNumber,
                    branchId: form.branchId,
                    status: form.status,
                },
                { headers: { Authorization: `Bearer ${token}` } },
            );
            toast.success(
                `Created ${prefix}${form.startNumber}–${prefix}${form.endNumber} and allocated it to the selected branch`,
            );
            setForm(initialForm);
            onOpenChange(false);
            await onCreated();
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to create AWB series",
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <DialogHeader>
                        <DialogTitle>Create AWB series</DialogTitle>
                        <DialogDescription>
                            Create a persistent number range and allocate the full range to an
                            active branch.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="awb-prefix">Prefix</Label>
                            <Input
                                id="awb-prefix"
                                value={form.prefix}
                                onChange={(event) =>
                                    updateField("prefix", event.target.value.toUpperCase())
                                }
                                placeholder="e.g. LF"
                                maxLength={12}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="awb-start">Start number</Label>
                            <Input
                                id="awb-start"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]+"
                                value={form.startNumber}
                                onChange={(event) =>
                                    updateField("startNumber", event.target.value)
                                }
                                placeholder="1000000000"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="awb-end">End number</Label>
                            <Input
                                id="awb-end"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]+"
                                value={form.endNumber}
                                onChange={(event) =>
                                    updateField("endNumber", event.target.value)
                                }
                                placeholder="1000009999"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Branch</Label>
                            <Select
                                value={form.branchId}
                                onValueChange={(value) => updateField("branchId", value)}
                                disabled={loadingBranches}
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={
                                            loadingBranches ? "Loading branches…" : "Select branch"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {branches.map((branch) => (
                                        <SelectItem key={branch._id} value={branch._id}>
                                            {branch.code} — {branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                value={form.status}
                                onValueChange={(value) => updateField("status", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {preview && (
                        <div className="rounded-xl border bg-muted/40 p-4 text-sm">
                            <p className="font-medium">Range preview</p>
                            <p className="mt-1 text-muted-foreground">
                                {preview.first} through {preview.last}
                            </p>
                            <p className="mt-1 text-muted-foreground">
                                Inclusive total: {preview.count.toLocaleString()} AWBs
                            </p>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting || loadingBranches}>
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create and allocate
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateSeriesDialog;
