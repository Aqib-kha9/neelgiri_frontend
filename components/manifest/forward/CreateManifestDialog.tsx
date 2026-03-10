"use client";

import React, { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { MapPin, Truck, User } from "lucide-react";

interface CreateManifestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedShipments: any[];
    onSuccess: () => void;
}

export function CreateManifestDialog({
    open,
    onOpenChange,
    selectedShipments,
    onSuccess
}: CreateManifestDialogProps) {
    const [allBranches, setAllBranches] = useState<any[]>([]);
    const [partnerBranches, setPartnerBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState<string>("");

    // Form State
    const [sourceBranch, setSourceBranch] = useState("");
    const [destinationBranch, setDestinationBranch] = useState("");
    const [transportMode, setTransportMode] = useState("surface");
    const [vehicleNo, setVehicleNo] = useState("");
    const [driverName, setDriverName] = useState("");
    const [driverPhone, setDriverPhone] = useState("");

    useEffect(() => {
        if (open) {
            fetchBranches();
            fetchUserRole();
        }
    }, [open]);

    const fetchUserRole = () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserRole(payload.role || "");
            }
        } catch (error) {
            console.error("Error parsing token:", error);
        }
    };

    const fetchBranches = async () => {
        try {
            // Fetch all branches for "From" dropdown
            const allRes = await fetch('/api/branches?purpose=dropdown', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (allRes.ok) {
                const allData = await allRes.json();
                setAllBranches(allData);
            }

            // Fetch partner's branches for "To" dropdown (for partner admin)
            const partnerRes = await fetch('/api/branches?scope=partner', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (partnerRes.ok) {
                const partnerData = await partnerRes.json();
                setPartnerBranches(partnerData);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load branches");
        }
    };

    const handleCreate = async () => {
        if (!destinationBranch) {
            toast.error("Please select a destination branch");
            return;
        }

        // For super admin and partner admin, source branch is required
        if ((userRole === 'super_admin' || userRole === 'partner_admin' || userRole === 'partner') && !sourceBranch) {
            toast.error("Please select a source branch");
            return;
        }

        setLoading(true);
        try {
            const payload: any = {
                destinationBranchId: destinationBranch,
                shipmentIds: selectedShipments.map(s => s._id),
                transportDetails: {
                    mode: transportMode,
                    vehicleNo,
                    driverName,
                    driverPhone
                }
            };

            // Include sourceBranchId for super admin and partner admin
            if ((userRole === 'super_admin' || userRole === 'partner_admin' || userRole === 'partner') && sourceBranch) {
                payload.sourceBranchId = sourceBranch;
            }

            const res = await fetch('/api/manifests/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success(`Manifest created with ${selectedShipments.length} shipments`);
                onOpenChange(false);
                onSuccess();
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to create manifest");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    // Get appropriate branches for "From" dropdown
    // Strict Scoping: Partner Admins only see their own branches (now populated reliably by backend fix)
    const sourceBranchList = userRole === 'super_admin' ? allBranches : partnerBranches;

    // Get appropriate branches for "To" dropdown, filtering out the selected source branch
    // User requested Global System Visibility for Destination ("System ki sari branches")
    const destinationBranchList = allBranches.filter(b => b._id !== sourceBranch);

    // Effect to clear destination if it becomes invalid (matches source)
    useEffect(() => {
        if (sourceBranch === destinationBranch && sourceBranch !== "") {
            setDestinationBranch("");
        }
    }, [sourceBranch]);

    const findBranchName = (id: string, list: any[]) => list.find(b => b._id === id)?.name || "";

    const selectedSourceName = findBranchName(sourceBranch, allBranches);
    const selectedDestName = findBranchName(destinationBranch, allBranches);

    const headerTitle = selectedDestName
        ? `Create Manifest ${selectedSourceName ? `from ${selectedSourceName} ` : ""}to ${selectedDestName}`
        : "Create Forward Manifest";

    // Determine if user should see From Branch dropdown
    const showFromBranch = userRole === 'super_admin' || userRole === 'partner_admin' || userRole === 'partner';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{headerTitle}</DialogTitle>
                    <DialogDescription>
                        Consolidate {selectedShipments.length} shipments for forwarding.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Source Branch - For Super Admin and Partner Admin */}
                    {showFromBranch && (
                        <div className="space-y-2">
                            <Label>From Branch (Source)</Label>
                            <Select value={sourceBranch} onValueChange={setSourceBranch}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Source Branch" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {sourceBranchList.map((b) => (
                                        <SelectItem key={b._id} value={b._id}>
                                            <div className="flex flex-col text-left">
                                                <span className="font-semibold">{b.name} ({b.code})</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {b.address?.city}, {b.address?.state} - {b.address?.pincode}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Destination Branch */}
                    <div className="space-y-2">
                        <Label>To Branch (Destination)</Label>
                        <Select value={destinationBranch} onValueChange={setDestinationBranch}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Destination" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                                {destinationBranchList.map((b) => (
                                    <SelectItem key={b._id} value={b._id}>
                                        <div className="flex flex-col text-left">
                                            <span className="font-semibold">{b.name} ({b.code})</span>
                                            <span className="text-xs text-muted-foreground">
                                                {b.address?.city}, {b.address?.state} - {b.address?.pincode}
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Transport Details */}
                    <div className="space-y-2">
                        <Label>Transport Mode</Label>
                        <Select value={transportMode} onValueChange={setTransportMode}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="surface">Surface (Truck/Van)</SelectItem>
                                <SelectItem value="air">Air</SelectItem>
                                <SelectItem value="train">Train</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Vehicle Number</Label>
                            <Input
                                placeholder="e.g. DL01AB1234"
                                value={vehicleNo}
                                onChange={(e) => setVehicleNo(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Driver Name</Label>
                            <Input
                                placeholder="Driver Name"
                                value={driverName}
                                onChange={(e) => setDriverName(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} disabled={loading || !destinationBranch || (showFromBranch && !sourceBranch)}>
                        {loading ? "Creating..." : "Create Manifest"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
