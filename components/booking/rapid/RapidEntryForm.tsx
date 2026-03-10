"use client";

import { useState, useRef, useEffect } from "react";
import {
    Calculator,
    Printer,
    RefreshCcw,
    Search,
    MapPin,
    User,
    Package,
    CreditCard,
    Truck,
    ArrowRight,
    ChevronDown,
    ChevronUp,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

import { BookingFormData } from "@/components/booking/(create)/types";
import { mockCustomers } from "@/components/booking/(create)/mockData";
import { calculateBookingCharges, searchProducts } from "./BookingCalculations";

interface RapidEntryFormProps {
    onSuccess: (bookingId: string) => void;
}

const RapidEntryForm = ({ onSuccess }: RapidEntryFormProps) => {
    // Refs
    const senderPhoneRef = useRef<HTMLInputElement>(null);
    const receiverPhoneRef = useRef<HTMLInputElement>(null);
    const weightRef = useRef<HTMLInputElement>(null);
    const submitBtnRef = useRef<HTMLButtonElement>(null);

    // State
    const [isForwardingOpen, setIsForwardingOpen] = useState(false);
    const [productSearchOpen, setProductSearchOpen] = useState(false);
    const [senderQuery, setSenderQuery] = useState("");
    const [receiverQuery, setReceiverQuery] = useState("");
    const [availableReceivers, setAvailableReceivers] = useState<any[]>([]); // New State

    const [formData, setFormData] = useState<BookingFormData>({
        documentNo: "",
        sender: null,
        receiver: null,
        pickupLocation: null,
        contents: "",
        mode: "SURFACE",
        paymentMode: "PREPAID",
        forwardTo: "",
        thru: "",
        forwardingWeight: "",
        weight: "",
        length: "",
        breadth: "",
        height: "",
        volumetricWeight: "",
        chargeableWeight: "",
        invoiceValue: "",
        fovAmt: "",
        baseFreight: "",
        rate: "",
        charges: "",
        otherAddLess: "",
        netCharges: "",
        disc: "",
        fuelPercent: "",
        taxPercent: "18",
        taxAmount: "",
        tax: "",
        netAmount: "",
        ewayBillNo: "",
        ewayValidityStart: "",
        ewayValidityEnd: "",
        remark: "",
        bookingSource: "BRANCH",
        status: "BOOKED",
        distanceZone: "ZONE_A",
        serviceType: "STANDARD",
        packagingType: "REGULAR",
        insuranceRequired: false,
        declaredValue: "",
        codAmount: "",
    });

    // Calculate Charges Effect
    useEffect(() => {
        const result = calculateBookingCharges({
            weight: parseFloat(formData.weight) || 0,
            length: parseFloat(formData.length),
            breadth: parseFloat(formData.breadth),
            height: parseFloat(formData.height),
            serviceType: formData.mode,
            sourceCity: formData.sender?.city || "Delhi", // Default source
            destCity: formData.receiver?.city || "Mumbai", // Default dest
            declaredValue: parseFloat(formData.invoiceValue)
        });

        setFormData(prev => ({
            ...prev,
            baseFreight: result.baseFreight.toString(),
            fuelPercent: "0",
            taxAmount: result.taxAmount.toString(),
            netAmount: result.netAmount.toString(),
            fovAmt: result.fovCharge.toString(),
            chargeableWeight: result.chargeableWeight.toString(),
            volumetricWeight: result.chargeableWeight.toString(), // Simplified sync
            rate: result.rateApplied.toString()
        }));
    }, [
        formData.weight,
        formData.length,
        formData.breadth,
        formData.height,
        formData.mode,
        formData.invoiceValue,
        formData.sender,
        formData.receiver
    ]);


    // Handlers
    const handleSenderSearch = (val: string) => {
        setSenderQuery(val);
        const found = mockCustomers.find(c => c.mobileNo.includes(val) || c.code.toLowerCase().includes(val.toLowerCase()));
        if (found) {
            setFormData(prev => ({
                ...prev,
                sender: found,
                pickupLocation: found.pickupLocations?.[0] || null
            }));
            // Populate Receivers
            setAvailableReceivers(found.receivers || []);
        } else {
            setAvailableReceivers([]);
        }
    };

    const handleReceiverSelect = (receiver: any) => {
        setFormData(prev => ({
            ...prev,
            receiver: receiver
        }));
        setReceiverQuery(receiver.mobileNo);
    };

    // Auto-search saved receiver when typing mobile no
    const handleReceiverQueryChange = (val: string) => {
        setReceiverQuery(val);
        const saved = availableReceivers.find(r => r.mobileNo === val);
        if (saved) {
            setFormData(prev => ({ ...prev, receiver: saved }));
        } else {
            // If manual entry, just update mobile no in form data if not found
            // But keep other fields open for edit
            setFormData(prev => ({ ...prev, receiver: { ...prev.receiver, mobileNo: val } as any }));
        }
    };

    const handleProductSelect = (product: any) => {
        setFormData(prev => ({
            ...prev,
            contents: product.name,
            weight: product.weight.toString(),
            invoiceValue: product.value.toString(),
            // Parse "10 x 20 x 30" logic if needed, for now simplified
            length: "10",
            breadth: "10",
            height: "10"
        }));
        setProductSearchOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const bookingId = `BKG-${Date.now().toString().slice(-4)}`;
        onSuccess(bookingId);

        // Partial Reset
        setFormData(prev => ({
            ...prev,
            weight: "", length: "", breadth: "", height: "",
            invoiceValue: "", contents: "",
            receiver: null, remark: "",
            codAmount: "",
            ewayBillNo: ""
        }));
        setReceiverQuery("");
        receiverPhoneRef.current?.focus();
    };

    const searchedProducts = searchProducts(formData.contents || "");

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 h-full pb-10">
            {/* 1. Parties Section (Sender & Receiver) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Sender - Smart Lookup */}
                <Card className="rounded-2xl shadow-sm border-border/50 bg-card/50">
                    <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600">
                                <User className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-semibold">Sender Details</span>
                            {formData.sender && (
                                <Badge variant="secondary" className="ml-auto text-xs bg-green-500/10 text-green-700">
                                    Verified
                                </Badge>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div>
                                <Label className="text-xs text-muted-foreground">Mobile / Code</Label>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        ref={senderPhoneRef}
                                        placeholder="Search sender..."
                                        className="pl-9 h-9 bg-background focus:ring-blue-500/20"
                                        value={senderQuery}
                                        onChange={(e) => handleSenderSearch(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Name</Label>
                                    <Input value={formData.sender?.name || ""} readOnly className="h-8 bg-muted/20 border-none text-xs" />
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">GSTIN</Label>
                                    <Input value={formData.sender?.gstin || ""} readOnly className="h-8 bg-muted/20 border-none text-xs" />
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">Address</Label>
                                <Input value={formData.sender ? `${formData.sender.address1}, ${formData.sender.city}` : ""} readOnly className="h-8 bg-muted/20 border-none text-xs" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Receiver - Manual Entry */}
                <Card className="rounded-2xl shadow-sm border-border/50 bg-card/50">
                    <CardContent className="p-4 space-y-3">

                        <span className="text-sm font-semibold">Receiver Details</span>
                        {availableReceivers.length > 0 && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm" className="ml-auto h-6 text-xs gap-1">
                                        <User className="w-3 h-3" /> Select Saved ({availableReceivers.length})
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0" align="end">
                                    <Command>
                                        <CommandInput placeholder="Search saved receiver..." />
                                        <CommandList>
                                            <CommandEmpty>No receiver found.</CommandEmpty>
                                            <CommandGroup heading="Saved Receivers">
                                                {availableReceivers.map((rec) => (
                                                    <CommandItem key={rec.id} onSelect={() => handleReceiverSelect(rec)}>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{rec.name}</span>
                                                            <span className="text-xs text-muted-foreground">{rec.city} - {rec.mobileNo}</span>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        )}


                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Mobile No *</Label>
                                    <Input
                                        ref={receiverPhoneRef}
                                        value={receiverQuery}
                                        onChange={(e) => handleReceiverQueryChange(e.target.value)}
                                        placeholder="98765..."
                                        className="h-9 bg-background"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Pincode *</Label>
                                    <Input
                                        placeholder="e.g. 110001"
                                        className="h-9 bg-background"
                                        value={formData.receiver?.pincode || ""}
                                        onChange={(e) => setFormData(prev => ({ ...prev, receiver: { ...prev.receiver!, pincode: e.target.value } as any }))}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">Receiver Name</Label>
                                <Input
                                    placeholder="Enter name"
                                    className="h-9 bg-background"
                                    value={formData.receiver?.name || ""}
                                    onChange={(e) => setFormData(prev => ({ ...prev, receiver: { ...prev.receiver!, name: e.target.value } as any }))}
                                />
                            </div>
                            {/* Intelligent Tip */}
                            {formData.receiver?.pincode && (
                                <div className="flex items-center gap-1.5 p-1 px-2 rounded bg-green-500/5 text-green-700 text-xs">
                                    <Truck className="w-3 h-3" />
                                    Services Available: Standard, Express
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card >
            </div >

            {/* 2. Shipment Details (Enhanced) */}
            < Card className="rounded-2xl shadow-sm border-border/50" >
                <CardContent className="p-4 grid grid-cols-12 gap-6">
                    <div className="col-span-12 md:col-span-8 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600">
                                <Package className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-semibold">Shipment Info</span>
                        </div>

                        {/* Dimensions Row */}
                        <div className="flex gap-4 items-end">
                            <div className="w-32 space-y-1.5">
                                <Label className="text-xs font-semibold">Weight (Kg)</Label>
                                <Input
                                    ref={weightRef}
                                    type="number"
                                    className="h-10 text-lg font-bold font-mono bg-background shadow-sm"
                                    placeholder="0.0"
                                    value={formData.weight}
                                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                                />
                            </div>
                            <div className="flex items-center gap-2 pb-2 text-muted-foreground">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                            <div className="grid grid-cols-3 gap-2 flex-1">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground">Len (cm)</Label>
                                    <Input
                                        className="h-9 bg-background text-sm"
                                        placeholder="L"
                                        value={formData.length}
                                        onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground">Bre (cm)</Label>
                                    <Input
                                        className="h-9 bg-background text-sm"
                                        placeholder="B"
                                        value={formData.breadth}
                                        onChange={(e) => setFormData(prev => ({ ...prev, breadth: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground">Hgt (cm)</Label>
                                    <Input
                                        className="h-9 bg-background text-sm"
                                        placeholder="H"
                                        value={formData.height}
                                        onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="w-24 space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Vol. Wt</Label>
                                <Input value={formData.volumetricWeight} readOnly className="h-9 bg-muted/20 text-sm font-mono" />
                            </div>
                        </div>

                        <Separator className="my-2" />

                        {/* Product & Services Row */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Content (SKU Search)</Label>
                                <Popover open={productSearchOpen} onOpenChange={setProductSearchOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={productSearchOpen}
                                            className="w-full justify-between h-9 text-sm font-normal bg-background"
                                        >
                                            {formData.contents || "Select product..."}
                                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search SKU..." />
                                            <CommandList>
                                                <CommandEmpty>No product found.</CommandEmpty>
                                                <CommandGroup>
                                                    {/* Real Product Search Results */}
                                                    <CommandItem onSelect={() => handleProductSelect({ name: "Generic Package", weight: 0, value: 0 })}>
                                                        Generic Package
                                                    </CommandItem>
                                                    {/* This would be populated dynamically */}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Service Mode</Label>
                                <Select
                                    value={formData.mode}
                                    onValueChange={(v) => setFormData(prev => ({ ...prev, mode: v }))}
                                >
                                    <SelectTrigger className="h-9 bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SURFACE">Surface (Standard)</SelectItem>
                                        <SelectItem value="AIR">Air Express</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Declared Value (₹)</Label>
                                <Input
                                    type="number"
                                    className="h-9 bg-background"
                                    placeholder="0"
                                    value={formData.invoiceValue}
                                    onChange={(e) => setFormData(prev => ({ ...prev, invoiceValue: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* Extras, E-Way, Remarks */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs">E-Way Bill No</Label>
                                <Input
                                    className="h-9 bg-background text-sm"
                                    placeholder="Optional"
                                    value={formData.ewayBillNo}
                                    onChange={(e) => setFormData(prev => ({ ...prev, ewayBillNo: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-1.5 col-span-2">
                                <Label className="text-xs">Remarks</Label>
                                <Input
                                    className="h-9 bg-background text-sm"
                                    placeholder="Any special handling instructions..."
                                    value={formData.remark}
                                    onChange={(e) => setFormData(prev => ({ ...prev, remark: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* Collapsible: Forwarding Details */}
                        <Collapsible
                            open={isForwardingOpen}
                            onOpenChange={setIsForwardingOpen}
                            className="border rounded-xl bg-muted/10"
                        >
                            <div className="flex items-center justify-between px-4 py-2">
                                <h4 className="text-xs font-semibold flex items-center gap-2">
                                    <Truck className="w-3 h-3" />
                                    Forwarding & Vendor Details
                                </h4>
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                        {isForwardingOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent className="px-4 py-3 space-y-3">
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Forward To</Label>
                                        <Input
                                            className="h-8 text-xs"
                                            placeholder="Vendor Name"
                                            value={formData.forwardTo}
                                            onChange={(e) => setFormData(prev => ({ ...prev, forwardTo: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Docket No (Thru)</Label>
                                        <Input
                                            className="h-8 text-xs"
                                            placeholder="Vendor Docket"
                                            value={formData.thru}
                                            onChange={(e) => setFormData(prev => ({ ...prev, thru: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Forwarding Wt.</Label>
                                        <Input
                                            className="h-8 text-xs"
                                            placeholder="Weight"
                                            value={formData.forwardingWeight}
                                            onChange={(e) => setFormData(prev => ({ ...prev, forwardingWeight: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>

                    {/* Right Panel: Calculations & Payment */}
                    <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
                        {/* Payment Card */}
                        <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                            <div className="flex items-center gap-2 mb-3">
                                <CreditCard className="w-4 h-4 text-primary" />
                                <span className="text-sm font-semibold">Payment</span>
                            </div>
                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs">Payment Mode</Label>
                                    <Select
                                        value={formData.paymentMode}
                                        onValueChange={(v) => setFormData(prev => ({ ...prev, paymentMode: v }))}
                                    >
                                        <SelectTrigger className="h-9 bg-background"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PREPAID">Prepaid</SelectItem>
                                            <SelectItem value="COD">Topay / COD</SelectItem>
                                            <SelectItem value="CREDIT">Credit</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {formData.paymentMode === "COD" && (
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">COD Amount to Collect</Label>
                                        <Input
                                            type="number"
                                            className="h-9 bg-background border-primary/30"
                                            value={formData.codAmount}
                                            onChange={(e) => setFormData(prev => ({ ...prev, codAmount: e.target.value }))}
                                        />
                                    </div>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                    <Checkbox
                                        id="insurance"
                                        checked={formData.insuranceRequired}
                                        onCheckedChange={(c) => setFormData(prev => ({ ...prev, insuranceRequired: !!c }))}
                                    />
                                    <Label htmlFor="insurance" className="text-xs cursor-pointer">Add Insurance (2%)</Label>
                                </div>
                            </div>
                        </div>

                        {/* Live Totals - Sticky Bottom on Mobile */}
                        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-sm flex-1 flex flex-col justify-end">
                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Base Freight</span>
                                    <span>₹{formData.baseFreight || "0.00"}</span>
                                </div>
                                {Number(formData.fovAmt) > 0 && (
                                    <div className="flex justify-between text-muted-foreground text-xs">
                                        <span>FOV Charges</span>
                                        <span>+ ₹{formData.fovAmt}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Tax (18%)</span>
                                    <span>₹{formData.taxAmount || "0.00"}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between font-bold text-2xl text-primary">
                                    <span>Total</span>
                                    <span>₹{formData.netAmount || "0.00"}</span>
                                </div>
                            </div>

                            <Button
                                ref={submitBtnRef}
                                type="submit"
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base shadow-lg shadow-primary/20"
                            >
                                <Printer className="w-4 h-4 mr-2" />
                                Book & Print
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card >
        </form >
    );
};

export default RapidEntryForm;
