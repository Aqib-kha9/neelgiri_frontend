import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, User, Truck, Package, Scan, Plus, X, Calendar, Eye, Clock, MoreHorizontal, CheckCircle2, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

interface EditDRSDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    drs: any;
    onSuccess?: () => void;
    readOnly?: boolean;
}

export const EditDRSDialog = ({ open, onOpenChange, drs, onSuccess, readOnly = false }: EditDRSDialogProps) => {
    const [editingDRS, setEditingDRS] = useState<any>(null);
    const [availableRiders, setAvailableRiders] = useState<any[]>([]);
    const [availableShipments, setAvailableShipments] = useState<any[]>([]);
    const [scanInput, setScanInput] = useState("");
    const [shipmentSearchTerm, setShipmentSearchTerm] = useState("");
    const [openShipmentSelect, setOpenShipmentSelect] = useState(false);

    // Complete Dialog State
    const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
    const [shipmentToComplete, setShipmentToComplete] = useState<string | null>(null);

    // Initialize editing state when DRS changes or dialog opens
    useEffect(() => {
        if (drs && open) {
            setEditingDRS(JSON.parse(JSON.stringify(drs))); // Deep copy
        }
    }, [drs, open]);

    // Fetch Riders & Available Shipments
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Riders
                const ridersRes = await fetch('/api/rbac/users', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (ridersRes.ok) {
                    const data = await ridersRes.json();
                    const riders = data.filter((u: any) => u.role?.name?.toLowerCase() === 'rider');
                    setAvailableRiders(riders);
                }

                // Fetch Available Shipments (only if not readOnly)
                // Fix: Include 'inwarded' shipments as they are also available to be added
                if (!readOnly) {
                    const shipmentsRes = await fetch('/api/shipments?status=not_scheduled,inwarded', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    if (shipmentsRes.ok) {
                        const data = await shipmentsRes.json();
                        setAvailableShipments(data);
                    }
                }
            } catch (e) {
                console.error("Data fetch error", e);
            }
        };
        if (open) fetchData();
    }, [open, readOnly]);

    const handleSaveEdit = async () => {
        if (!editingDRS) return;
        try {
            const payload = {
                riderId: editingDRS.rider?._id || editingDRS.rider?.id,
                vehicleMode: editingDRS.vehicleMode,
                pincodes: editingDRS.pincodes,
                scheduledDate: editingDRS.scheduledDate,
                shipments: editingDRS.shipments
            };

            const drsId = editingDRS.id || editingDRS._id;
            const res = await fetch(`/api/drs/${drsId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success("DRS updated successfully");
                if (onSuccess) onSuccess();
                onOpenChange(false);
            } else {
                toast.error("Failed to update DRS");
            }
        } catch (e) {
            toast.error("Network error updating DRS");
            console.error(e);
        }
    };

    const handleAddShipment = (awbToAdd: string) => {
        if (awbToAdd && editingDRS) {
            const exists = editingDRS.shipments.some((s: any) =>
                (typeof s === 'string' ? s : s.awb) === awbToAdd
            );

            if (!exists) {
                setEditingDRS((prev: any) => ({
                    ...prev,
                    shipments: [...prev.shipments, awbToAdd],
                    stats: {
                        ...prev.stats,
                        totalShipments: (prev.stats?.totalShipments || 0) + 1
                    }
                }));
                setScanInput("");
                // Keep popover open for multi-select
                toast.success(`Added ${awbToAdd}`);
            } else {
                toast.error("Already added");
            }
        }
    };

    const handleRemoveShipment = (awb: string) => {
        if (editingDRS) {
            setEditingDRS({
                ...editingDRS,
                shipments: editingDRS.shipments.filter((s: any) => (typeof s === 'string' ? s : s.awb) !== awb),
                stats: {
                    ...editingDRS.stats,
                    totalShipments: (editingDRS.stats?.totalShipments || 0) - 1
                }
            });
        }
    };

    const handleAddPincode = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const input = e.currentTarget;
            const pincode = input.value.trim();
            if (pincode.length === 6 && /^\d+$/.test(pincode)) {
                if (!editingDRS?.pincodes.includes(pincode)) {
                    setEditingDRS({
                        ...editingDRS,
                        pincodes: [...editingDRS.pincodes, pincode]
                    });
                    input.value = "";
                    toast.success(`Pincode ${pincode} added`);
                } else {
                    toast.error("Pincode already exists");
                }
            } else {
                toast.error("Please enter a valid 6-digit pincode");
            }
        }
    };

    const handleCompleteShipment = async () => {
        if (!shipmentToComplete) return;

        try {
            const res = await fetch(`/api/shipments/${shipmentToComplete}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.ok) {
                toast.success(`Shipment ${shipmentToComplete} completed successfully`);
                // Update local state to reflect completion
                const updatedShipments = editingDRS.shipments.map((s: any) => {
                    const awb = typeof s === 'string' ? s : s.awb;
                    if (awb === shipmentToComplete) {
                        return typeof s === 'string' ? { awb: s, status: 'completed' } : { ...s, status: 'completed' };
                    }
                    return s;
                });
                setEditingDRS({ ...editingDRS, shipments: updatedShipments });
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to complete shipment");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error");
        } finally {
            setCompleteDialogOpen(false);
            setShipmentToComplete(null);
        }
    };

    if (!editingDRS) return null;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {readOnly ? <Eye className="h-5 w-5 text-primary" /> : <Edit className="h-5 w-5 text-primary" />}
                            {readOnly ? "DRS Details" : "Edit DRS"} - {editingDRS.drsNumber || editingDRS.drsId}
                        </DialogTitle>
                        <DialogDescription>
                            {readOnly ? "View detailed information for this completed delivery run sheet" : "Edit rider, vehicle, pincodes, and shipments"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="max-h-[60vh] overflow-y-auto pr-4">
                        <div className="space-y-6 py-4">
                            {/* Rider & Vehicle Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        {readOnly ? "Assigned Rider" : "Select Rider"}
                                    </label>
                                    {readOnly ? (
                                        <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                                            {editingDRS.rider?.name || "Unknown"}
                                        </div>
                                    ) : (
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            value={editingDRS.rider?._id || editingDRS.rider?.id || ""}
                                            onChange={(e) => {
                                                const selected = availableRiders.find(r => r._id === e.target.value);
                                                if (selected) {
                                                    setEditingDRS({ ...editingDRS, rider: selected });
                                                }
                                            }}
                                        >
                                            <option value="" disabled>Select a rider</option>
                                            {availableRiders.map((rider) => (
                                                <option key={rider._id} value={rider._id}>
                                                    {rider.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Truck className="h-4 w-4 text-muted-foreground" />
                                        Vehicle Mode
                                    </label>
                                    {readOnly ? (
                                        <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm capitalize">
                                            {editingDRS.vehicleMode || "Bike"}
                                        </div>
                                    ) : (
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            value={editingDRS.vehicleMode || "bike"}
                                            onChange={(e) => setEditingDRS({ ...editingDRS, vehicleMode: e.target.value })}
                                        >
                                            <option value="bike">Bike</option>
                                            <option value="delivery_van">Delivery Van</option>
                                            <option value="walk_in">Walk-in</option>
                                        </select>
                                    )}
                                </div>
                            </div>

                            {/* Scheduled Date */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    Scheduled Date
                                </label>
                                <Input
                                    type="date"
                                    disabled={readOnly}
                                    className={readOnly ? "bg-muted" : ""}
                                    value={editingDRS.scheduledDate ? new Date(editingDRS.scheduledDate).toISOString().split('T')[0] : ''}
                                    onChange={(e) => setEditingDRS({ ...editingDRS, scheduledDate: e.target.value })}
                                />
                            </div>

                            {/* Pincode Management */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                    Delivery Pincodes
                                </label>
                                {!readOnly && (
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Enter 6-digit pincode and press Enter"
                                            maxLength={6}
                                            onKeyPress={handleAddPincode}
                                        />
                                    </div>
                                )}
                                {editingDRS.pincodes && editingDRS.pincodes.length > 0 && (
                                    <div className={`flex flex-wrap gap-2 mt-2 p-3 rounded-lg ${readOnly ? 'bg-muted' : 'bg-muted/50'}`}>
                                        {editingDRS.pincodes.map((pincode: string) => (
                                            <Badge key={pincode} variant="secondary" className="gap-1">
                                                {pincode}
                                                {!readOnly && (
                                                    <X
                                                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                                                        onClick={() => {
                                                            setEditingDRS({
                                                                ...editingDRS,
                                                                pincodes: editingDRS.pincodes.filter((p: string) => p !== pincode)
                                                            });
                                                        }}
                                                    />
                                                )}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Scan/Select New Shipment (Hidden in ReadOnly) */}
                            {!readOnly && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Scan className="h-4 w-4 text-muted-foreground" />
                                        Add Shipments
                                    </label>

                                    <Popover open={openShipmentSelect} onOpenChange={setOpenShipmentSelect}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openShipmentSelect}
                                                className="w-full justify-between"
                                            >
                                                {scanInput ? scanInput : "Select or Scan AWB..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[450px] p-0" align="start">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Scan or type AWB..."
                                                    value={scanInput}
                                                    onValueChange={setScanInput}
                                                />
                                                <CommandList>
                                                    <CommandEmpty>
                                                        {scanInput ? (
                                                            <div
                                                                className="p-2 text-center text-sm cursor-pointer hover:bg-muted text-primary"
                                                                onClick={() => handleAddShipment(scanInput)}
                                                            >
                                                                Add "{scanInput}" manually
                                                            </div>
                                                        ) : "No available shipments found"}
                                                    </CommandEmpty>
                                                    <CommandGroup heading="Available Shipments">
                                                        {availableShipments
                                                            .filter(s => {
                                                                const searchLower = scanInput.toLowerCase();
                                                                const awbMatch = (s.awb || s.awbNumber || "").toLowerCase().includes(searchLower);
                                                                const nameMatch = (s.receiver?.name || "").toLowerCase().includes(searchLower);
                                                                // Exclude already added shipments
                                                                const alreadyInDRS = editingDRS.shipments.some((existing: any) =>
                                                                    (typeof existing === 'string' ? existing : existing.awb) === (s.awb || s.awbNumber)
                                                                );
                                                                return (awbMatch || nameMatch) && !alreadyInDRS;
                                                            })
                                                            .slice(0, 10) // Limit display
                                                            .map((s) => (
                                                                <CommandItem
                                                                    key={s._id || s.awb}
                                                                    value={s.awb || s.awbNumber}
                                                                    onSelect={(val) => handleAddShipment(val)}
                                                                >
                                                                    <div className="flex flex-col w-full">
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="font-medium">{s.awb || s.awbNumber}</span>
                                                                                <Badge variant="outline" className="text-[10px] h-5">{s.status}</Badge>
                                                                            </div>
                                                                            <span className="text-xs font-mono">{s.receiver?.pincode}</span>
                                                                        </div>
                                                                        <span className="text-xs text-muted-foreground">{s.receiver?.name} • {s.receiver?.phone}</span>
                                                                    </div>
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-2 h-4 w-4",
                                                                            editingDRS.shipments.some((ex: any) => (typeof ex === 'string' ? ex : ex.awb) === (s.awb || s.awbNumber)) ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            )}

                            {/* Scanned Shipments List */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">
                                        {readOnly ? "Completed Shipments" : "Shipments in DRS"} ({editingDRS.shipments.length || 0})
                                    </label>
                                </div>
                                <Input
                                    placeholder="Search shipments in list..."
                                    value={shipmentSearchTerm}
                                    onChange={(e) => setShipmentSearchTerm(e.target.value)}
                                    className="h-9"
                                />
                                <div className="border rounded-lg p-3 bg-card">
                                    <div className="h-[300px] overflow-y-auto pr-2">
                                        <div className="space-y-2">
                                            {editingDRS.shipments
                                                .filter((s: any) => {
                                                    const awb = typeof s === 'string' ? s : s.awb;
                                                    return awb.toLowerCase().includes(shipmentSearchTerm.toLowerCase());
                                                })
                                                .map((s: any, index: number) => {
                                                    const awb = typeof s === 'string' ? s : s.awb;
                                                    const status = typeof s === 'string' ? 'pending' : s.status;
                                                    const deliveredAt = typeof s !== 'string' && s.deliveredAt ? new Date(s.deliveredAt) : null;
                                                    const isCompleted = status === 'completed' || status === 'delivered';

                                                    return (
                                                        <div
                                                            key={awb}
                                                            className="flex flex-col gap-1 p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                                                                        #{index + 1}
                                                                    </span>
                                                                    <span className="font-mono text-sm">{awb}</span>
                                                                </div>
                                                                {readOnly ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <Badge variant={isCompleted ? 'success' : 'secondary'} className="text-[10px] capitalize">
                                                                            {status}
                                                                        </Badge>
                                                                        {!isCompleted && (
                                                                            <DropdownMenu>
                                                                                <DropdownMenuTrigger asChild>
                                                                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                                                                        <MoreHorizontal className="h-3 w-3" />
                                                                                    </Button>
                                                                                </DropdownMenuTrigger>
                                                                                <DropdownMenuContent align="end">
                                                                                    <DropdownMenuItem
                                                                                        onClick={() => {
                                                                                            setShipmentToComplete(awb);
                                                                                            setCompleteDialogOpen(true);
                                                                                        }}
                                                                                        className="text-green-600 focus:text-green-700 bg-green-50 focus:bg-green-100"
                                                                                    >
                                                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                                        Complete
                                                                                    </DropdownMenuItem>
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleRemoveShipment(awb)}
                                                                        className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </Button>
                                                                )}
                                                            </div>

                                                            {readOnly && deliveredAt && (
                                                                <div className="flex items-center gap-2 text-xs text-muted-foreground ml-9">
                                                                    <Clock className="h-3 w-3" />
                                                                    Completed: {deliveredAt.toLocaleDateString()} at {deliveredAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="border-t pt-4">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            {readOnly ? "Close" : "Cancel"}
                        </Button>
                        {!readOnly && (
                            <Button onClick={handleSaveEdit}>
                                Save Changes
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Force Complete Shipment?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will manually mark shipment {shipmentToComplete} as Completed.
                            The rider will see that this was completed by the branch.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCompleteShipment} className="bg-green-600 hover:bg-green-700">
                            Confirm Complete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
