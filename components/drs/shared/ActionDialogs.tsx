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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import {
    Scan,
    X,
    Plus,
    User,
    Bike,
    Truck,
    MapPin,
    Package,
    Check,
    ChevronsUpDown
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// --- Quick DRS Dialog ---
interface QuickDRSDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    initialShipments?: string[];
    availableShipments?: any[];
}

export const QuickDRSDialog = ({ open, onOpenChange, onSuccess, initialShipments = [], availableShipments = [] }: QuickDRSDialogProps) => {
    const [selectedRider, setSelectedRider] = useState("");
    const [openRiderSelect, setOpenRiderSelect] = useState(false);
    const [vehicleMode, setVehicleMode] = useState("bike");
    const [pincodes, setPincodes] = useState<string[]>([]);
    const [pincodeInput, setPincodeInput] = useState("");
    const [scannedShipments, setScannedShipments] = useState<string[]>([]);
    const [scanInput, setScanInput] = useState("");
    const [availableRiders, setAvailableRiders] = useState<any[]>([]);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    useEffect(() => {
        if (open && initialShipments.length > 0) {
            setScannedShipments(initialShipments);
        }
    }, [open, initialShipments]);


    useEffect(() => {
        const fetchRiders = async () => {
            try {
                // Check current user role
                const token = localStorage.getItem('token');
                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    // Assuming role name is in token or we fetch profile. 
                    // Better to rely on API data but let's check basic token if available
                    // Or check the user attached to response if we had a /me call here.
                    // Actually, let's just use the returned riders data structure or a separate /me call?
                    // Simpler: The backend /api/rbac/users returns what we need.
                    // We can verify if we are super admin by checking if we see riders from multiple branches
                    // OR just check if the returned data has branch populated
                }

                // Better way: Fetch /api/auth/me to get role reliably
                const meRes = await fetch('/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (meRes.ok) {
                    const me = await meRes.json();
                    setIsSuperAdmin(me.role?.name === 'super_admin');
                }

                const res = await fetch('/api/rbac/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    // Filter for riders
                    const riders = data.filter((u: any) => u.role?.name === 'rider' || u.role?.name === 'Rider');
                    setAvailableRiders(riders);
                }
            } catch (e) {
                console.error("Failed to fetch riders", e);
            }
        };
        if (open) fetchRiders();
    }, [open]);

    // Date State
    const [dateType, setDateType] = useState("single");
    const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleAddPincode = () => {
        if (pincodeInput.trim() && pincodeInput.length === 6 && /^\d+$/.test(pincodeInput)) {
            if (!pincodes.includes(pincodeInput)) {
                setPincodes([...pincodes, pincodeInput]);
                setPincodeInput("");
            } else {
                toast.error("Pincode already added");
            }
        } else {
            toast.error("Please enter a valid 6-digit pincode");
        }
    };

    const handleRemovePincode = (pincode: string) => {
        setPincodes(pincodes.filter(p => p !== pincode));
    };

    const handleScanShipment = () => {
        if (scanInput.trim()) {
            if (!scannedShipments.includes(scanInput)) {
                setScannedShipments([...scannedShipments, scanInput]);
                setScanInput("");
                toast.success(`Shipment ${scanInput} added`);
            } else {
                toast.error("Shipment already scanned");
            }
        }
    };

    const handleRemoveShipment = (awb: string) => {
        setScannedShipments(scannedShipments.filter(s => s !== awb));
    };

    const handleCreateDRS = async () => {
        if (!selectedRider) {
            toast.error("Please select a rider");
            return;
        }
        if (pincodes.length === 0) {
            toast.error("Please add at least one pincode");
            return;
        }
        if (scannedShipments.length === 0) {
            toast.error("Please scan at least one shipment");
            return;
        }

        try {
            const payload = {
                riderId: selectedRider,
                vehicleMode,
                pincodes,
                shipments: scannedShipments,
                scheduledDate: dateType === 'single' ? scheduledDate : undefined,
                startDate: dateType === 'range' ? startDate : undefined,
                endDate: dateType === 'range' ? endDate : undefined
            };

            const res = await fetch('/api/drs/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success(`DRS created with ${scannedShipments.length} shipments`);
                onOpenChange(false);
                if (onSuccess) onSuccess();
                // Reset form
                setSelectedRider("");
                setVehicleMode("bike");
                setPincodes([]);
                setScannedShipments([]);
            } else {
                const err = await res.json();
                toast.error(err.message || "Failed to create DRS");
            }
        } catch (error) {
            console.error("Error creating DRS:", error);
            toast.error("Network error creating DRS");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Quick Create DRS
                    </DialogTitle>
                    <DialogDescription>
                        Quickly create a delivery run sheet by scanning shipments
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[60vh] overflow-y-auto pr-4">
                    <div className="grid gap-6 py-4">
                        {/* Rider Selection */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                Select Rider
                            </Label>
                            <Popover open={openRiderSelect} onOpenChange={setOpenRiderSelect}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openRiderSelect}
                                        className="w-full justify-between"
                                    >
                                        {selectedRider
                                            ? availableRiders.find((rider) => rider._id === selectedRider)?.name || "Select Rider"
                                            : "Select Rider..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder={isSuperAdmin ? "Search rider by name, branch..." : "Search rider..."} />
                                        <CommandList>
                                            <CommandEmpty>No rider found.</CommandEmpty>
                                            <CommandGroup>
                                                {availableRiders.map((rider) => (
                                                    <CommandItem
                                                        key={rider._id}
                                                        value={`${rider.name} ${rider.branchId?.name || ''} ${rider.email}`}
                                                        onSelect={() => {
                                                            setSelectedRider(rider._id === selectedRider ? "" : rider._id);
                                                            setOpenRiderSelect(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedRider === rider._id ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{rider.name}</span>
                                                            <span className="text-xs text-muted-foreground">{rider.phone}</span>
                                                            {isSuperAdmin && (
                                                                <div className="flex flex-col gap-0.5 mt-1 pt-1 border-t border-muted/50">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[10px] font-mono bg-primary/10 text-primary px-1 rounded uppercase">
                                                                            {typeof rider.branchId === 'object' ? rider.branchId?.name : 'Head Office'}
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-[10px] text-muted-foreground">{rider.email}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Vehicle Mode */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Bike className="h-4 w-4 text-muted-foreground" />
                                Vehicle Mode
                            </Label>
                            <Select value={vehicleMode} onValueChange={setVehicleMode}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bike">
                                        <div className="flex items-center gap-2">
                                            <Bike className="h-4 w-4" />
                                            Bike
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="delivery_van">
                                        <div className="flex items-center gap-2">
                                            <Truck className="h-4 w-4" />
                                            Delivery Van
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="walk_in">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Walk-in
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date Selection */}
                        <div className="space-y-4">
                            <Label className="flex items-center gap-2">
                                <span className="h-4 w-4" />
                                Schedule DRS
                            </Label>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Type</Label>
                                    <Select value={dateType} onValueChange={setDateType}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="single">Single Day</SelectItem>
                                            <SelectItem value="range">Date Range</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {dateType === "single" ? (
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Select Date</Label>
                                        <Input
                                            type="date"
                                            className="h-10"
                                            value={scheduledDate}
                                            onChange={(e) => setScheduledDate(e.target.value)}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-2 col-span-2 grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs text-muted-foreground">Start Date</Label>
                                            <Input
                                                type="date"
                                                className="h-10"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs text-muted-foreground">End Date</Label>
                                            <Input
                                                type="date"
                                                className="h-10"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pincode Input */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                Delivery Pincodes
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter 6-digit pincode"
                                    value={pincodeInput}
                                    onChange={(e) => setPincodeInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddPincode()}
                                    maxLength={6}
                                />
                                <Button type="button" onClick={handleAddPincode} size="sm">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            {pincodes.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {pincodes.map((pincode) => (
                                        <Badge key={pincode} variant="secondary" className="gap-1">
                                            {pincode}
                                            <X
                                                className="h-3 w-3 cursor-pointer hover:text-destructive"
                                                onClick={() => handleRemovePincode(pincode)}
                                            />
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Shipment Scanner / Selector */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Scan className="h-4 w-4 text-muted-foreground" />
                                Select or Scan Shipments
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className="w-full justify-between"
                                    >
                                        {scanInput || "Select AWB or Type..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] p-0" align="start">
                                    <Command>
                                        <CommandInput
                                            placeholder="Scan or type AWB..."
                                            value={scanInput}
                                            onValueChange={setScanInput}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && scanInput.trim()) {
                                                    handleScanShipment();
                                                }
                                            }}
                                        />
                                        <CommandList>
                                            <CommandEmpty>
                                                {scanInput ? (
                                                    <div className="p-2 text-center text-sm cursor-pointer hover:bg-muted" onClick={handleScanShipment}>
                                                        Add "{scanInput}" manualy
                                                    </div>
                                                ) : "No available shipments found"}
                                            </CommandEmpty>
                                            <CommandGroup heading="Available Shipments">
                                                {availableShipments
                                                    .filter(s =>
                                                        !scannedShipments.includes(s.awb || s.awbNumber) &&
                                                        (
                                                            (s.awb || s.awbNumber || "").toLowerCase().includes(scanInput.toLowerCase()) ||
                                                            (s.receiver?.name || "").toLowerCase().includes(scanInput.toLowerCase())
                                                        )
                                                    )
                                                    .slice(0, 10) // Limit display
                                                    .map((s) => (
                                                        <CommandItem
                                                            key={s._id || s.awb}
                                                            value={s.awb || s.awbNumber}
                                                            onSelect={(currentValue) => {
                                                                if (!scannedShipments.includes(currentValue)) {
                                                                    setScannedShipments([...scannedShipments, currentValue]);
                                                                    setScanInput("");
                                                                    toast.success(`Shipment ${currentValue} added`);
                                                                }
                                                            }}
                                                        >
                                                            <div className="flex flex-col w-full">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="font-medium">{s.awb || s.awbNumber}</span>
                                                                    <Badge variant="outline" className="text-[10px]">{s.receiver?.pincode}</Badge>
                                                                </div>
                                                                <span className="text-xs text-muted-foreground">{s.receiver?.name}</span>
                                                            </div>
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto h-4 w-4",
                                                                    scannedShipments.includes(s.awb || s.awbNumber) ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            {/* Scanned Shipments List */}
                            {scannedShipments.length > 0 && (
                                <Card className="mt-3 p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">
                                            Scanned Shipments ({scannedShipments.length})
                                        </span>
                                    </div>
                                    <div className="h-[200px] overflow-y-auto pr-2">
                                        <div className="space-y-2">
                                            {scannedShipments.map((awb, index) => (
                                                <div
                                                    key={awb}
                                                    className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                                                            #{index + 1}
                                                        </span>
                                                        <span className="font-mono text-sm">{awb}</span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveShipment(awb)}
                                                        className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="border-t pt-4 flex sm:justify-between items-center bg-gray-50/50 p-4 rounded-b-lg">
                    <div className="text-xs text-muted-foreground hidden sm:block">
                        * Rider, Pincodes, and Shipments are required
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                console.log("Create clicked"); // Debug log
                                handleCreateDRS();
                            }}
                            disabled={!selectedRider || pincodes.length === 0 || scannedShipments.length === 0}
                            className="bg-primary hover:bg-primary/90"
                        >
                            {(!selectedRider || pincodes.length === 0 || scannedShipments.length === 0)
                                ? "Fill Required Fields"
                                : `Create DRS (${scannedShipments.length} shipments)`
                            }
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// --- Import Dialog ---
interface ImportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    type?: string;
}

export const ImportDialog = ({ open, onOpenChange, type = "DRS Data" }: ImportDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Import {type}</DialogTitle>
                    <DialogDescription>
                        Upload a CSV or Excel file to update {type.toLowerCase()}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/5 p-8 text-center transition-colors hover:bg-muted/10">
                        <div className="rounded-full bg-primary/10 p-3 text-primary">
                            <Package className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Click to upload or drag and drop</p>
                            <p className="text-xs text-muted-foreground">
                                CSV, XLS, XLSX (max. 10MB)
                            </p>
                        </div>
                        <Input id="file" type="file" className="hidden" />
                        <Button variant="outline" size="sm">
                            Select File
                        </Button>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => onOpenChange(false)}>Import Data</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// --- Export Dialog ---
interface ExportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onExport?: (format: string) => void;
}

export const ExportDialog = ({ open, onOpenChange, onExport }: ExportDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Export Report</DialogTitle>
                    <DialogDescription>
                        Choose format to export data.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Export Format</Label>
                        <Select defaultValue="csv">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="csv">CSV Format</SelectItem>
                                <SelectItem value="pdf">PDF Format</SelectItem>
                                <SelectItem value="excel">Excel Format</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        onExport?.("csv");
                        onOpenChange(false);
                    }}>Export Report</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
