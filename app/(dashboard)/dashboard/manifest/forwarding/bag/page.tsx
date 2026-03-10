"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Package2, Scan, X, Search, Briefcase, Check, ChevronsUpDown, ArrowRight, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function BagTagPage() {
    const { session } = useAuth();
    const [bags, setBags] = useState<any[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [branches, setBranches] = useState<any[]>([]);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [openBranch, setOpenBranch] = useState(false);
    const [sealNumber, setSealNumber] = useState("");
    const [weight, setWeight] = useState("");
    const [awbInput, setAwbInput] = useState("");
    const [scannedShipments, setScannedShipments] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const [partnerBranches, setPartnerBranches] = useState<any[]>([]);
    const [sourceBranch, setSourceBranch] = useState("");
    const [openSourceBranch, setOpenSourceBranch] = useState(false);

    const userRole = session?.user?.role;
    const showFromBranch = userRole === 'super_admin' || userRole === 'partner_admin' || userRole === 'partner';

    const currentBranchId = sourceBranch || session?.user?.branchId;
    const currentBranchObj = branches.find(b => b._id === currentBranchId);
    const currentBranchName = currentBranchObj?.name || session?.user?.branchName || "Current Branch";

    useEffect(() => {
        fetchBags();
    }, []);

    useEffect(() => {
        if (dialogOpen) {
            fetchBranches();
        }
    }, [dialogOpen]);

    const fetchBags = async () => {
        try {
            const res = await fetch('/api/bags', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                const data = await res.json();
                setBags(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchBranches = async () => {
        try {
            const res = await fetch('/api/branches?purpose=dropdown', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                const data = await res.json();
                setBranches(data);
            }

            // Fetch partner's branches for partner admin
            const partnerRes = await fetch('/api/branches?scope=partner', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (partnerRes.ok) {
                const partnerData = await partnerRes.json();
                setPartnerBranches(partnerData);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleScanAWB = async () => {
        if (!awbInput.trim()) return;

        if (scannedShipments.includes(awbInput)) {
            toast.error("AWB already scanned for this bag");
            setAwbInput("");
            return;
        }

        // Verify shipment exists and belongs to current branch
        try {
            const res = await fetch(`/api/shipments/${awbInput}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                setScannedShipments([...scannedShipments, awbInput]);
                setAwbInput("");
                toast.success(`Shipment ${awbInput} added to scanning list`);
            } else {
                toast.error("Shipment not found or not available at branch");
            }
        } catch (error) {
            toast.error("Error verifying shipment");
        }
    };

    const handleCreateBag = async () => {
        if (!selectedBranch || scannedShipments.length === 0) {
            toast.error("Please select branch and add shipments");
            return;
        }

        setLoading(true);
        try {
            const payload: any = {
                destinationBranchId: selectedBranch,
                sealNumber,
                weight: parseFloat(weight) || 0,
                awbs: scannedShipments
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
                toast.success("Bag created and sealed successfully");
                setDialogOpen(false);
                resetForm();
                fetchBags();
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

    const resetForm = () => {
        setSelectedBranch("");
        setSourceBranch("");
        setSealNumber("");
        setWeight("");
        setScannedShipments([]);
        setAwbInput("");
    };

    const sourceBranchList = userRole === 'super_admin' ? branches : partnerBranches;
    const availableBranches = branches.filter(b => b._id !== currentBranchId && b._id !== sourceBranch);

    // Sync source and destination to prevent same selection
    useEffect(() => {
        if (sourceBranch === selectedBranch && sourceBranch !== "") {
            setSelectedBranch("");
        }
    }, [sourceBranch]);

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bag Tag Management</h1>
                    <p className="text-muted-foreground">Group multiple shipments into secure bags for transit.</p>
                </div>
                <Button onClick={() => setDialogOpen(true)} size="lg" className="gap-2 shadow-lg shadow-primary/20">
                    <Plus className="h-5 w-5" />
                    CREATE NEW BAG
                </Button>
            </div>

            <Card className="border-muted/40 shadow-sm">
                <CardHeader className="pb-3 border-b bg-muted/5">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            Sealed Bags
                        </CardTitle>
                        <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">{bags.length} Total Bags</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {bags.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/5">
                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Package2 className="h-8 w-8 opacity-50" />
                            </div>
                            <p className="text-lg font-medium text-foreground">No bags found</p>
                            <p className="text-sm">Start by creating a new bag and adding shipments.</p>
                            <Button variant="outline" className="mt-6" onClick={() => setDialogOpen(true)}>Create First Bag</Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-muted/30">
                                    <TableHead className="pl-6">Bag ID</TableHead>
                                    <TableHead>Destination</TableHead>
                                    <TableHead>Shipments</TableHead>
                                    <TableHead>Seal #</TableHead>
                                    <TableHead>Weight</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bags.map((bag) => (
                                    <TableRow key={bag._id} className="hover:bg-primary/5 transition-colors cursor-pointer">
                                        <TableCell className="pl-6 font-mono font-medium text-primary">{bag.bagId}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{bag.destinationBranch?.name || "N/A"}</span>
                                                <span className="text-xs text-muted-foreground">{bag.destinationBranch?.code}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="gap-1.5 bg-background">
                                                <Package2 className="h-3 w-3 text-muted-foreground" />
                                                {bag.shipments?.length || 0}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">{bag.sealNumber || "N/A"}</TableCell>
                                        <TableCell><span className="font-mono">{bag.weight}</span> <span className="text-xs text-muted-foreground">kg</span></TableCell>
                                        <TableCell>
                                            <Badge className="bg-blue-600 uppercase text-[10px] tracking-wider shadow-sm">{bag.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
                    <DialogHeader className="p-6 pb-4 shrink-0 border-b bg-muted/20">
                        <DialogTitle className="text-2xl flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Plus className="h-6 w-6 text-primary" />
                            </div>
                            {selectedBranch ? `Create Bag to ${branches.find(b => b._id === selectedBranch)?.name}` : "Create New Bag"}
                        </DialogTitle>
                        <DialogDescription className="text-base pt-1">
                            Group shipments for a specific destination branch.
                        </DialogDescription>

                        {/* From -> To Visual Header */}
                        <div className="flex items-center gap-4 mt-6 p-3 bg-background border rounded-xl shadow-sm">
                            <div className="flex-1 flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <MapPin className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">From</span>
                                    <span className="font-semibold text-sm truncate max-w-[150px]">{currentBranchName}</span>
                                </div>
                            </div>

                            <div className="flex items-center text-muted-foreground/50">
                                <div className="h-[1px] w-8 bg-current"></div>
                                <ArrowRight className="h-4 w-4 mx-1" />
                                <div className="h-[1px] w-8 bg-current"></div>
                            </div>

                            <div className="flex-1 flex items-center gap-3 justify-end text-right">
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">To</span>
                                    <span className={cn("font-semibold text-sm truncate max-w-[150px]", !selectedBranch && "text-muted-foreground italic")}>
                                        {selectedBranch ? branches.find(b => b._id === selectedBranch)?.name : "Select Destination"}
                                    </span>
                                </div>
                                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", selectedBranch ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-muted text-muted-foreground")}>
                                    <MapPin className="h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    </DialogHeader>

                    <ScrollArea className="flex-1 px-6 bg-muted/5">
                        <div className="space-y-8 py-6">
                            {/* Source Branch Selection - For Super Admin and Partner Admin */}
                            {showFromBranch && (
                                <div className="space-y-4">
                                    <Label className="text-base font-semibold flex items-center gap-2">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-inset ring-primary/20">1</span>
                                        Select Source Branch (From)
                                    </Label>
                                    <Popover open={openSourceBranch} onOpenChange={setOpenSourceBranch}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openSourceBranch}
                                                className="w-full justify-between h-12 text-base px-4 border-muted-foreground/30 hover:border-primary/50 transition-colors"
                                            >
                                                {sourceBranch
                                                    ? branches.find((b) => b._id === sourceBranch)?.name
                                                    : "Search and select source branch..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                                            <Command>
                                                <CommandInput placeholder="Search branch name, city..." className="h-11" />
                                                <CommandList>
                                                    <CommandEmpty>No branch found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {sourceBranchList.map((branch) => (
                                                            <CommandItem
                                                                key={branch._id}
                                                                value={branch.name}
                                                                onSelect={() => {
                                                                    setSourceBranch(branch._id);
                                                                    setOpenSourceBranch(false);
                                                                }}
                                                                className="py-3"
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4 text-primary",
                                                                        sourceBranch === branch._id ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">{branch.name}</span>
                                                                    <span className="text-xs text-muted-foreground">{branch.city} • {branch.pincode}</span>
                                                                </div>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            )}

                            <div className="space-y-4">
                                <Label className="text-base font-semibold flex items-center gap-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-inset ring-primary/20">{showFromBranch ? "2" : "1"}</span>
                                    Select Destination Branch (To)
                                </Label>
                                <Popover open={openBranch} onOpenChange={setOpenBranch}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openBranch}
                                            className="w-full justify-between h-12 text-base px-4 border-muted-foreground/30 hover:border-primary/50 transition-colors"
                                        >
                                            {selectedBranch
                                                ? branches.find((b) => b._id === selectedBranch)?.name
                                                : "Search and select destination branch..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search branch name, city..." className="h-11" />
                                            <CommandList>
                                                <CommandEmpty>No branch found.</CommandEmpty>
                                                <CommandGroup>
                                                    {availableBranches.map((branch) => (
                                                        <CommandItem
                                                            key={branch._id}
                                                            value={branch.name}
                                                            onSelect={() => {
                                                                setSelectedBranch(branch._id);
                                                                setOpenBranch(false);
                                                            }}
                                                            className="py-3"
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4 text-primary",
                                                                    selectedBranch === branch._id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{branch.name}</span>
                                                                <span className="text-xs text-muted-foreground">{branch.city} • {branch.pincode}</span>
                                                            </div>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground/80">Seal Number</Label>
                                    <Input
                                        placeholder="Optional Seal ID"
                                        className="h-11 bg-background"
                                        value={sealNumber}
                                        onChange={(e) => setSealNumber(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground/80">Bag Weight (kg)</Label>
                                    <Input
                                        type="number"
                                        className="h-11 bg-background"
                                        placeholder="0.0"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-dashed">
                                <Label className="text-base font-semibold flex items-center gap-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-inset ring-primary/20">{showFromBranch ? "3" : "2"}</span>
                                    Scan Shipments
                                </Label>
                                <div className="flex gap-3">
                                    <Input
                                        className="h-12 font-mono text-lg uppercase tracking-wide"
                                        placeholder="Scan AWB Number..."
                                        value={awbInput}
                                        onChange={(e) => setAwbInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleScanAWB()}
                                    />
                                    <Button size="lg" className="h-12 w-14 px-0 shrink-0" onClick={handleScanAWB}>
                                        <Scan className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            {scannedShipments.length > 0 && (
                                <Card className="bg-background border-primary/20 shadow-sm animate-in fade-in-50 slide-in-from-bottom-2">
                                    <CardHeader className="py-3 px-4 border-b bg-muted/30">
                                        <CardTitle className="text-sm flex items-center justify-between">
                                            <span>Scanned Shipments ({scannedShipments.length})</span>
                                            <Badge variant="outline" className="text-[10px] font-mono font-normal">
                                                TOTAL ITEMS
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-2">
                                        <ScrollArea className="h-[120px] w-full pr-4">
                                            <div className="grid grid-cols-2 gap-2 pt-2">
                                                {scannedShipments.map(awb => (
                                                    <div key={awb} className="group flex justify-between items-center text-xs p-2 pl-3 bg-muted/30 border rounded-md hover:bg-muted/50 transition-colors">
                                                        <span className="font-mono font-medium">{awb}</span>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-6 w-6 p-0 hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => setScannedShipments(prev => prev.filter(x => x !== awb))}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </ScrollArea>

                    <DialogFooter className="p-6 pt-4 border-t bg-background shrink-0">
                        <Button variant="outline" size="lg" onClick={() => setDialogOpen(false)} className="flex-1">Cancel</Button>
                        <Button
                            onClick={handleCreateBag}
                            disabled={loading || scannedShipments.length === 0 || !selectedBranch}
                            size="lg"
                            className="flex-[2] gap-2 shadow-lg shadow-primary/25"
                        >
                            {loading ? "Creating..." : (
                                <>
                                    <Package2 className="h-5 w-5" />
                                    SEAL & SAVE BAG
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
