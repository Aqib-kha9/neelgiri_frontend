"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
    Send,
    Scan,
    Package,
    Check,
    ChevronsUpDown,
    ArrowRight,
    MapPin,
    Plus,
    X,
    MoreHorizontal,
    Trash2,
    ChevronDown,
    Mail,
    Phone,
    Map
} from "lucide-react";
import { AWBAutocompleteInput } from "@/components/shared/AWBAutocompleteInput"; // Import Autocomplete
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface ShipmentData {
    awb: string;
    receiver: {
        name: string;
        address: string;
        pincode: string;
        email: string;
        phone: string;
    };
    weight: string | number;
    dimensions: {
        length: string | number;
        width: string | number;
        height: string | number;
    };
    _id?: string; // If existing shipment
}

export default function CounterManifestPage() {
    const { session } = useAuth();

    // Core State
    const [branches, setBranches] = useState<any[]>([]);
    const [partnerBranches, setPartnerBranches] = useState<any[]>([]);
    const [selectedBranch, setSelectedBranch] = useState(""); // Destination
    const [sourceBranch, setSourceBranch] = useState(""); // Source
    const [openBranch, setOpenBranch] = useState(false);
    const [openSourceBranch, setOpenSourceBranch] = useState(false);

    // Form State
    const [awbInput, setAwbInput] = useState("");
    const [scanning, setScanning] = useState(false);
    const [shipmentData, setShipmentData] = useState<ShipmentData>({
        awb: "",
        receiver: { name: "", address: "", pincode: "", email: "", phone: "" },
        weight: "",
        dimensions: { length: "", width: "", height: "" },
    });

    // Cart State
    const [manifestCart, setManifestCart] = useState<ShipmentData[]>([]);
    const [sending, setSending] = useState(false);

    const userRole = session?.user?.role;
    const showFromBranch = userRole === 'super_admin' || userRole === 'partner_admin' || userRole === 'partner';

    const currentBranchId = sourceBranch || session?.user?.branchId;

    // Initial Fetch
    useEffect(() => {
        fetchBranches();
    }, []);

    // Effect: Sync source branch if partner/super admin
    useEffect(() => {
        if (!sourceBranch && session?.user?.branchId) {
            setSourceBranch(session.user.branchId);
        }
    }, [session]);

    const fetchBranches = async () => {
        try {
            const res = await fetch('/api/branches?purpose=dropdown', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                const data = await res.json();
                setBranches(data);
            }

            if (showFromBranch) {
                const partnerRes = await fetch('/api/branches?scope=partner', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (partnerRes.ok) {
                    const partnerData = await partnerRes.json();
                    setPartnerBranches(partnerData);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load branches");
        }
    };

    const handleScanAWB = async () => {
        if (!awbInput.trim()) {
            toast.error("Please enter AWB number");
            return;
        }

        // Check duplicates in cart
        if (manifestCart.find(s => s.awb === awbInput.trim())) {
            toast.warning("Shipment already in list");
            return;
        }

        setScanning(true);
        try {
            const res = await fetch(`/api/shipments/${awbInput}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (res.ok) {
                const data = await res.json();
                setShipmentData({
                    awb: data.awb || data.awbNumber,
                    receiver: {
                        name: data.receiver?.name || "",
                        address: data.receiver?.address || "",
                        pincode: data.receiver?.pincode || "",
                        phone: data.receiver?.phone || "",
                        email: data.receiver?.email || "",
                    },
                    weight: data.weight || "",
                    dimensions: data.dimensions || { length: "", width: "", height: "" },
                    _id: data._id
                });
                toast.success("Shipment found");
            } else {
                setShipmentData(prev => ({ ...prev, awb: awbInput }));
                toast.info("Shipment not found. Enter details manually.");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error checking AWB");
        } finally {
            setScanning(false);
        }
    };

    const handleAutocompleteSelect = (shipment: any) => {
        setAwbInput(shipment.awb || shipment.awbNumber);
        if (manifestCart.find(s => s.awb === (shipment.awb || shipment.awbNumber))) {
            toast.warning("Shipment already in list");
            return;
        }
        setShipmentData({
            awb: shipment.awb || shipment.awbNumber,
            receiver: {
                name: shipment.receiver?.name || "",
                address: shipment.receiver?.address || "",
                pincode: shipment.receiver?.pincode || "",
                phone: shipment.receiver?.phone || "",
                email: shipment.receiver?.email || "",
            },
            weight: shipment.weight || "",
            dimensions: shipment.dimensions || { length: "", width: "", height: "" },
            _id: shipment._id
        });
        toast.success("Details autofilled!");
    };

    const handleAddToList = () => {
        if (!shipmentData.awb) {
            toast.error("AWB required");
            return;
        }
        if (manifestCart.find(s => s.awb === shipmentData.awb)) {
            toast.error("Already in list");
            return;
        }

        setManifestCart(prev => [...prev, { ...shipmentData }]);

        // Reset Form
        setAwbInput("");
        setShipmentData({
            awb: "",
            receiver: { name: "", address: "", pincode: "", email: "", phone: "" },
            weight: "",
            dimensions: { length: "", width: "", height: "" },
        });
        toast.success("Added to manifest list");
    };

    const handleRemoveFromList = (awb: string) => {
        setManifestCart(prev => prev.filter(s => s.awb !== awb));
    };

    const handleSendManifest = async () => {
        if (!selectedBranch) {
            toast.error("Select Destination Branch");
            return;
        }
        if (manifestCart.length === 0) {
            toast.error("Manifest list is empty");
            return;
        }

        setSending(true);
        try {
            const payload = {
                destinationBranchId: selectedBranch,
                sourceBranchId: sourceBranch,
                shipments: manifestCart, // Send full objects for upsert
                transportDetails: {
                    mode: 'surface',
                    remark: 'Counter Forward'
                }
            };

            const res = await fetch('/api/manifests/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();
                toast.success(`Manifest ${data.manifestId} Sent Successfully!`);
                setManifestCart([]); // Clear list
            } else {
                const err = await res.json();
                toast.error(err.message || "Failed to create manifest");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error");
        } finally {
            setSending(false);
        }
    };

    // Calculate Totals
    const totalWeight = manifestCart.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);
    const destinationName = branches.find(b => b._id === selectedBranch)?.name || "Target Branch";
    const sourceBranchList = userRole === 'super_admin' ? branches : partnerBranches;
    const availableBranches = branches.filter(b => b._id !== currentBranchId);

    return (
        <div className="p-6 h-[calc(100vh-4rem)] flex flex-col gap-6 max-w-[1920px] mx-auto overflow-hidden">
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Forward Manifest</h1>
                    <p className="text-muted-foreground">Consolidate and forward multiple shipments.</p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                {/* LEFT SIDE - FORM */}
                <Card className="lg:col-span-7 flex flex-col border-muted/60 shadow-md h-full overflow-hidden">
                    <CardHeader className="pb-4 border-b bg-muted/5">
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" />
                            Add Shipment Details
                        </CardTitle>
                        <CardDescription>
                            Enter details to add to the forwarding list.
                        </CardDescription>
                    </CardHeader>
                    <ScrollArea className="flex-1">
                        <div className="p-6 space-y-8">
                            {/* Branch Selection Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* From Branch */}
                                {showFromBranch && (
                                    <div className="space-y-2">
                                        <Label>Source Branch (From)</Label>
                                        <Popover open={openSourceBranch} onOpenChange={setOpenSourceBranch}>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" role="combobox" className="w-full justify-between">
                                                    {sourceBranch ? branches.find(b => b._id === sourceBranch)?.name : "Select Source"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[300px] p-0" align="start">
                                                <Command>
                                                    <CommandInput placeholder="Search branch..." />
                                                    <CommandList>
                                                        <CommandEmpty>No branch found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {sourceBranchList.map(b => (
                                                                <CommandItem key={b._id} value={b.name} onSelect={() => { setSourceBranch(b._id); setOpenSourceBranch(false); }}>
                                                                    <Check className={cn("mr-2 h-4 w-4", sourceBranch === b._id ? "opacity-100" : "opacity-0")} />
                                                                    {b.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                )}

                                {/* To Branch */}
                                <div className="space-y-2">
                                    <Label>Destination Branch (To)</Label>
                                    <Popover open={openBranch} onOpenChange={setOpenBranch}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" className="w-full justify-between border-primary/20 bg-primary/5">
                                                {selectedBranch ? branches.find(b => b._id === selectedBranch)?.name : "Select Destination"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[300px] p-0" align="start">
                                            <Command>
                                                <CommandInput placeholder="Search branch..." />
                                                <CommandList>
                                                    <CommandEmpty>No branch found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {availableBranches.map(b => (
                                                            <CommandItem key={b._id} value={b.name} onSelect={() => { setSelectedBranch(b._id); setOpenBranch(false); }}>
                                                                <Check className={cn("mr-2 h-4 w-4", selectedBranch === b._id ? "opacity-100" : "opacity-0")} />
                                                                {b.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            {/* AWB Scan */}
                            <div className="space-y-4 pt-4 border-t border-dashed">
                                <Label className="text-base font-semibold">Scan / Enter AWB</Label>
                                <div className="flex gap-3">
                                    <AWBAutocompleteInput
                                        placeholder="Scan / Type AWB..."
                                        value={awbInput}
                                        onChange={setAwbInput}
                                        onSelectShipment={handleAutocompleteSelect}
                                        onKeyDown={(e) => e.key === 'Enter' && handleScanAWB()}
                                        className="flex-1"
                                    />
                                    <Button size="icon" className="h-12 w-12 shrink-0" onClick={handleScanAWB} disabled={scanning}>
                                        {scanning ? <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" /> : <Scan className="h-5 w-5" />}
                                    </Button>
                                </div>
                            </div>

                            {/* Details Form (Disabled unless data exists) */}
                            <div className={cn("space-y-6 pt-4 border-t border-dashed transition-all", !shipmentData.awb && "opacity-50 pointer-events-none grayscale")}>
                                <div className="flex justify-between items-center">
                                    <Label className="text-base font-semibold">Shipment Details</Label>
                                    <Badge variant="outline">Working on: {shipmentData.awb || "..."}</Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Consignee Name</Label>
                                        <Input value={shipmentData.receiver.name} onChange={e => setShipmentData(p => ({ ...p, receiver: { ...p.receiver, name: e.target.value } }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Phone</Label>
                                        <Input value={shipmentData.receiver.phone} onChange={e => setShipmentData(p => ({ ...p, receiver: { ...p.receiver, phone: e.target.value } }))} />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label className="text-xs text-muted-foreground">Address</Label>
                                        <Input value={shipmentData.receiver.address} onChange={e => setShipmentData(p => ({ ...p, receiver: { ...p.receiver, address: e.target.value } }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Pincode</Label>
                                        <Input value={shipmentData.receiver.pincode} onChange={e => setShipmentData(p => ({ ...p, receiver: { ...p.receiver, pincode: e.target.value } }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Weight (kg)</Label>
                                        <Input type="number" value={shipmentData.weight} onChange={e => setShipmentData(p => ({ ...p, weight: e.target.value }))} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t bg-muted/5 shrink-0">
                        <Button
                            className="w-full h-12 gap-2 text-base shadow-md"
                            onClick={handleAddToList}
                            disabled={!shipmentData.awb}
                        >
                            <Plus className="h-5 w-5" />
                            Add Shipment to List
                        </Button>
                    </div>
                </Card>

                {/* RIGHT SIDE - CART */}
                <Card className="lg:col-span-5 flex flex-col border-primary/20 shadow-lg h-full overflow-hidden bg-muted/10">
                    <CardHeader className="pb-4 border-b bg-background">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Manifest List</CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-1">
                                    <MapPin className="h-3 w-3" />
                                    <span className="text-muted-foreground">From:</span>
                                    <span className="font-semibold text-foreground">{sourceBranch ? (branches.find(b => b._id === sourceBranch)?.name || partnerBranches.find(b => b._id === sourceBranch)?.name) : "Source"}</span>
                                    <ArrowRight className="h-3 w-3" />
                                    <span className="text-muted-foreground">To:</span>
                                    <span className="font-semibold text-primary">{selectedBranch ? branches.find(b => b._id === selectedBranch)?.name : "Select Destination"}</span>
                                </CardDescription>
                            </div>
                            <Badge variant="secondary" className="text-sm px-3 py-1 h-8">
                                {manifestCart.length} Items
                            </Badge>
                        </div>
                    </CardHeader>

                    <div className="flex-1 bg-background/50 overflow-y-auto pr-1 custom-scrollbar">
                        <div className="p-4 space-y-3">
                            <AnimatePresence mode="popLayout">
                                {manifestCart.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-50"
                                    >
                                        <Package className="h-16 w-16 mb-4 stroke-1" />
                                        <p>No shipments added yet</p>
                                    </motion.div>
                                ) : (
                                    manifestCart.map((item, idx) => (
                                        <Collapsible key={item.awb}>
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="group relative flex flex-col p-0 bg-background border rounded-xl shadow-sm hover:shadow-md transition-all hover:border-primary/30"
                                            >
                                                {/* Card Header / Main Row */}
                                                <div className="flex items-center justify-between p-3">
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                            <Package className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-mono font-semibold text-sm truncate">{item.awb}</p>
                                                            <p className="text-xs text-muted-foreground truncate">{item.receiver.name}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        <CollapsibleTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted group-data-[state=open]:rotate-180 transition-transform">
                                                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                            </Button>
                                                        </CollapsibleTrigger>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleRemoveFromList(item.awb)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Expanded Content */}
                                                <CollapsibleContent>
                                                    <div className="px-3 pb-3 pt-0 text-xs space-y-3 border-t bg-muted/5">
                                                        <div className="grid grid-cols-2 gap-3 pt-3">
                                                            <div className="space-y-1">
                                                                <span className="text-muted-foreground flex items-center gap-1">
                                                                    <Mail className="h-3 w-3" /> Email
                                                                </span>
                                                                <p className="font-medium truncate">{item.receiver.email || 'N/A'}</p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <span className="text-muted-foreground flex items-center gap-1">
                                                                    <Phone className="h-3 w-3" /> Phone
                                                                </span>
                                                                <p className="font-medium truncate">{item.receiver.phone || 'N/A'}</p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <span className="text-muted-foreground flex items-center gap-1">
                                                                    <Package className="h-3 w-3" /> Weight
                                                                </span>
                                                                <p className="font-medium">{item.weight} kg</p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <span className="text-muted-foreground flex items-center gap-1">
                                                                    <MapPin className="h-3 w-3" /> Pincode
                                                                </span>
                                                                <p className="font-medium">{item.receiver.pincode}</p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <span className="text-muted-foreground flex items-center gap-1">
                                                                <Map className="h-3 w-3" /> Address
                                                            </span>
                                                            <p className="font-medium break-words leading-relaxed bg-background p-2 rounded border">
                                                                {item.receiver.address || 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div className="flex justify-between items-center bg-background p-2 rounded border">
                                                            <span className="text-muted-foreground">Source: {sourceBranch ? (branches.find(b => b._id === sourceBranch)?.name || partnerBranches.find(b => b._id === sourceBranch)?.name) : "Source"}</span>
                                                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                                            <span className="font-medium text-primary">{selectedBranch ? branches.find(b => b._id === selectedBranch)?.name : "Dest"}</span>
                                                        </div>
                                                    </div>
                                                </CollapsibleContent>
                                            </motion.div>
                                        </Collapsible>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="p-4 border-t bg-background shrink-0 space-y-4">
                        <div className="flex justify-between items-center text-sm font-medium">
                            <span className="text-muted-foreground">Total Shipments:</span>
                            <span>{manifestCart.length}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium">
                            <span className="text-muted-foreground">Total Weight:</span>
                            <span>{totalWeight.toFixed(2)} kg</span>
                        </div>
                        <Button
                            className="w-full h-14 text-lg font-bold gap-2 shadow-lg shadow-primary/25"
                            onClick={handleSendManifest}
                            disabled={sending || manifestCart.length === 0}
                        >
                            {sending ? (
                                "Processing..."
                            ) : (
                                <>
                                    <Send className="h-5 w-5" />
                                    SEND MANIFEST
                                </>
                            )}
                        </Button>
                    </div>
                </Card>
            </div>
        </div >
    );
}
