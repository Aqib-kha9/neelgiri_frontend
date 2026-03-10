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
import { Loader2, Scan, X } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CreateBagDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function CreateBagDialog({ open, onOpenChange, onSuccess }: CreateBagDialogProps) {
    const [allBranches, setAllBranches] = useState<any[]>([]);
    const [partnerBranches, setPartnerBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState<string>("");

    // Form State
    const [sourceBranch, setSourceBranch] = useState("");
    const [destinationBranch, setDestinationBranch] = useState("");
    const [sealNumber, setSealNumber] = useState("");
    const [weight, setWeight] = useState("");
    const [scanInput, setScanInput] = useState("");
    const [scannedShipments, setScannedShipments] = useState<string[]>([]);
    const [scannedMap, setScannedMap] = useState<Record<string, string>>({}); // AWB -> ID

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

    const handleScan = async () => {
        if (!scanInput.trim()) return;

        if (scannedShipments.includes(scanInput)) {
            toast.error("Already scanned");
            setScanInput("");
            return;
        }

        try {
            const res = await fetch(`/api/shipments/${scanInput}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                const shipment = await res.json();
                if (shipment) {
                    setScannedMap(prev => ({ ...prev, [shipment.awb]: shipment._id }));
                    setScannedShipments([...scannedShipments, shipment.awb]);
                    setScanInput("");
                    toast.success("Shipment added");
                }
            } else {
                toast.error("Shipment not found");
            }
        } catch (e) {
            console.error(e);
            toast.error("Error verifying shipment");
        }
    };

    const handleCreate = async () => {
        if (!destinationBranch) {
            toast.error("Select destination branch");
            return;
        }

        if (showFromBranch && !sourceBranch) {
            toast.error("Select source branch");
            return;
        }

        if (scannedShipments.length === 0) {
            toast.error("Please scan at least one shipment");
            return;
        }

        setLoading(true);
        try {
            const payload: any = {
                destinationBranchId: destinationBranch,
                sealNumber,
                weight: parseFloat(weight) || 0,
                shipmentIds: scannedShipments.map(awb => scannedMap[awb])
            };

            if (showFromBranch && sourceBranch) {
                payload.sourceBranchId = sourceBranch;
            }

            const res = await fetch('/api/bags/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success("Bag created successfully");
                onOpenChange(false);
                onSuccess();
                // Reset
                setScannedShipments([]);
                setScannedMap({});
                setSourceBranch("");
                setDestinationBranch("");
                setSealNumber("");
                setWeight("");
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to create bag");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    // Get appropriate branches for "From" dropdown
    // Strict Scoping: Partner Admins only see their own branches
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
        ? `Create Bag ${selectedSourceName ? `from ${selectedSourceName} ` : ""}to ${selectedDestName}`
        : "Create New Bag";

    // Determine if user should see From Branch dropdown
    const showFromBranch = userRole === 'super_admin' || userRole === 'partner_admin' || userRole === 'partner';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{headerTitle}</DialogTitle>
                    <DialogDescription>Scan shipments to add to bag.</DialogDescription>
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

                    <div className="space-y-2">
                        <Label>To Branch (Destination)</Label>
                        <Select value={destinationBranch} onValueChange={setDestinationBranch}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Destination" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                                {destinationBranchList.map(b => (
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Seal Number</Label>
                            <Input value={sealNumber} onChange={(e) => setSealNumber(e.target.value)} placeholder="Optional" />
                        </div>
                        <div className="space-y-2">
                            <Label>Weight (kg)</Label>
                            <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="0.0" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Scan Shipments</Label>
                        <div className="flex gap-2">
                            <Input
                                value={scanInput}
                                onChange={(e) => setScanInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                                placeholder="Scan AWB"
                            />
                            <Button onClick={handleScan} variant="secondary">
                                <Scan className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {scannedShipments.length > 0 && (
                        <Card className="p-2 max-h-[150px] overflow-y-auto">
                            {scannedShipments.map(awb => (
                                <div key={awb} className="flex justify-between items-center text-sm p-1 border-b last:border-0">
                                    <span>{awb}</span>
                                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => {
                                        setScannedShipments(prev => prev.filter(x => x !== awb));
                                    }}>
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </Card>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleCreate} disabled={loading || !destinationBranch || (showFromBranch && !sourceBranch)}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Bag"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
