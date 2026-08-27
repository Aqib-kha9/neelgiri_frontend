"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
    Printer,
    Search,
    User,
    Package,
    CreditCard,
    Truck,
    ArrowRight,
    ChevronDown,
    ChevronUp,
    Loader2,
    CheckCircle2,
    Keyboard,
    LockKeyhole,
    RotateCcw,
    TimerReset
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
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import { shipmentApi } from "@/lib/api-services";

import { BookingFormData, Customer } from "@/components/booking/(create)/types";
import { calculateBookingCharges, searchProducts } from "./BookingCalculations";

// Map backend customer to frontend Customer type
const mapCustomer = (c: any): Customer => ({
    id: c._id || c.id || "",
    code: c.code || "",
    documentNo: c.documentNo || "",
    name: c.name || "",
    contactPerson: c.contactPerson || "",
    address1: c.address1 || "",
    address2: c.address2 || "",
    city: c.city || "",
    station: c.station || "",
    pincode: c.pincode || "",
    gstin: c.gstin || "",
    mobileNo: c.mobileNo || "",
    phoneO: c.phoneO || "",
    phoneR: c.phoneR || "",
    email: c.email || "",
    hasReceiver: c.hasReceiver || false,
    receivers: (c.receivers || []).map((r: any) => ({
        id: r._id || r.id || "",
        name: r.name || "",
        address: r.address || "",
        city: r.city || "",
        pincode: r.pincode || "",
        mobileNo: r.mobileNo || "",
        email: r.email || "",
    })),
    usePickupLocation: c.usePickupLocation || false,
    pickupLocations: (c.pickupLocations || []).map((p: any) => ({
        id: p._id || p.id || "",
        name: p.name || "",
        address: p.address || "",
        city: p.city || "",
        pincode: p.pincode || "",
        contactPerson: p.contactPerson || "",
        mobileNo: p.mobileNo || "",
    })),
    status: c.status || "active",
    fuelCharges: c.fuelCharges,
    fovCharges: c.fovCharges,
    fovPercentage: c.fovPercentage,
    quotationType: c.quotationType,
    awt: c.awt,
    category: c.category,
    paymentMode: c.paymentMode,
    accountGroup: c.accountGroup,
    isInterStateDealer: c.isInterStateDealer,
    bookedBy: c.bookedBy,
    bookedDate: c.bookedDate,
    remark: c.remark,
    billingType: c.billingType,
    creditLimit: c.creditLimit,
    creditDays: c.creditDays,
    defaultPaymentMode: c.defaultPaymentMode,
    kycStatus: c.kycStatus,
    kycDocumentType: c.kycDocumentType,
    kycDocumentNumber: c.kycDocumentNumber,
    allowedServices: c.allowedServices,
    serviceableZones: c.serviceableZones,
});

interface RapidEntryFormProps {
    onSuccess: (bookingId: string) => void;
}

interface RecentBooking {
    awb: string;
    receiverName: string;
    destination: string;
    amount: string;
    createdAt: Date;
}

const RapidEntryForm = ({ onSuccess }: RapidEntryFormProps) => {
    const { toast } = useToast();

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
    const [availableReceivers, setAvailableReceivers] = useState<any[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customersLoading, setCustomersLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [keepSender, setKeepSender] = useState(true);
    const [sessionBookingCount, setSessionBookingCount] = useState(0);
    const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);

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

    // Fetch customers from API
    const fetchCustomers = useCallback(async () => {
        setCustomersLoading(true);
        try {
            const response = await apiClient.get<unknown[] | { data?: unknown[] }>("/customers");
            const rawCustomers = Array.isArray(response) ? response : (response.data || []);
            setCustomers(rawCustomers.map(mapCustomer));
        } catch (error: any) {
            console.error("Failed to fetch customers:", error);
            toast({
                title: "Warning",
                description: "Could not load saved customers. You can still enter details manually.",
                variant: "destructive",
            });
        } finally {
            setCustomersLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    // Calculate Charges Effect
    useEffect(() => {
        const result = calculateBookingCharges({
            weight: parseFloat(formData.weight) || 0,
            length: parseFloat(formData.length),
            breadth: parseFloat(formData.breadth),
            height: parseFloat(formData.height),
            serviceType: formData.mode,
            sourceCity: formData.sender?.city || "Delhi",
            destCity: formData.receiver?.city || "Mumbai",
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
            volumetricWeight: result.chargeableWeight.toString(),
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


    const resetParcel = useCallback((preserveSender = keepSender) => {
        setFormData(prev => ({
            ...prev,
            sender: preserveSender ? prev.sender : null,
            pickupLocation: preserveSender ? prev.pickupLocation : null,
            receiver: null,
            weight: "",
            length: "",
            breadth: "",
            height: "",
            invoiceValue: "",
            contents: "",
            remark: "",
            codAmount: "",
            ewayBillNo: "",
            baseFreight: "",
            fovAmt: "",
            taxAmount: "",
            netAmount: "",
            chargeableWeight: "",
            volumetricWeight: "",
            rate: "",
        }));
        if (!preserveSender) {
            setSenderQuery("");
            setAvailableReceivers([]);
        }
        setReceiverQuery("");
        window.setTimeout(() => (preserveSender ? receiverPhoneRef : senderPhoneRef).current?.focus(), 0);
    }, [keepSender]);

    useEffect(() => {
        const handleShortcuts = (event: KeyboardEvent) => {
            if (event.key === "F2") {
                event.preventDefault();
                receiverPhoneRef.current?.focus();
            }
            if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                event.preventDefault();
                submitBtnRef.current?.click();
            }
            if (event.key === "Escape" && !submitting) {
                resetParcel();
            }
        };
        window.addEventListener("keydown", handleShortcuts);
        return () => window.removeEventListener("keydown", handleShortcuts);
    }, [resetParcel, submitting]);

    // Handlers
    const handleSenderSearch = (val: string) => {
        setSenderQuery(val);
        const found = customers.find(c => c.mobileNo.includes(val) || c.code.toLowerCase().includes(val.toLowerCase()));
        if (found) {
            setFormData(prev => ({
                ...prev,
                sender: found,
                pickupLocation: found.pickupLocations?.[0] || null
            }));
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

    const handleReceiverQueryChange = (val: string) => {
        setReceiverQuery(val);
        const saved = availableReceivers.find(r => r.mobileNo === val);
        if (saved) {
            setFormData(prev => ({ ...prev, receiver: saved }));
        } else {
            setFormData(prev => ({ ...prev, receiver: { ...prev.receiver, mobileNo: val } as any }));
        }
    };

    const handleProductSelect = (product: any) => {
        setFormData(prev => ({
            ...prev,
            contents: product.name,
            weight: product.weight.toString(),
            invoiceValue: product.value.toString(),
            length: "10",
            breadth: "10",
            height: "10"
        }));
        setProductSearchOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.sender) {
            toast({
                title: "Missing Information",
                description: "Please select a sender before booking.",
                variant: "destructive",
            });
            senderPhoneRef.current?.focus();
            return;
        }
        if (
            !formData.receiver?.mobileNo ||
            !formData.receiver?.pincode ||
            !formData.receiver?.name ||
            !formData.receiver?.city ||
            !formData.receiver?.address
        ) {
            toast({
                title: "Complete receiver details",
                description: "Name, mobile, complete address, city and pincode are required.",
                variant: "destructive",
            });
            receiverPhoneRef.current?.focus();
            return;
        }
        if (!formData.weight || parseFloat(formData.weight) <= 0) {
            toast({
                title: "Missing Information",
                description: "Please enter a valid weight.",
                variant: "destructive",
            });
            weightRef.current?.focus();
            return;
        }

        if (!termsAccepted) {
            toast({
                title: "Terms acceptance required",
                description: "Please accept the booking terms before continuing.",
                variant: "destructive",
            });
            return;
        }

        setSubmitting(true);
        try {
            const bookingMode: "AIR" | "SURFACE" = formData.mode === "AIR" ? "AIR" : "SURFACE";
            const payload = {
                customerId: formData.sender.id,
                sender: {
                    name: formData.sender.name,
                    phone: formData.sender.mobileNo,
                    address: `${formData.sender.address1}, ${formData.sender.city}`,
                    city: formData.sender.city,
                    pincode: formData.sender.pincode,
                    gstin: formData.sender.gstin,
                },
                receiver: {
                    name: formData.receiver?.name || "Unknown",
                    phone: formData.receiver?.mobileNo,
                    address: formData.receiver?.address || "",
                    city: formData.receiver?.city || "",
                    pincode: formData.receiver?.pincode,
                },
                weight: parseFloat(formData.weight),
                dimensions: {
                    length: parseFloat(formData.length) || 0,
                    width: parseFloat(formData.breadth) || 0,
                    height: parseFloat(formData.height) || 0,
                },
                contents: formData.contents || "General Parcel",
                paymentMode: formData.paymentMode.toLowerCase() as "prepaid" | "cod" | "topay" | "credit",
                codAmount: formData.paymentMode === "COD" ? parseFloat(formData.codAmount) || 0 : 0,
                declaredValue: parseFloat(formData.invoiceValue) || 0,
                mode: bookingMode,
                eWayBill: formData.ewayBillNo || undefined,
                termsAccepted,
                termsVersion: "2026-08-21",
            };

            const response = await shipmentApi.book(payload);
            const awb = response.awb;

            toast({
                title: "Booking Successful!",
                description: `AWB ${awb} created. Ready for the next parcel.`,
            });

            setSessionBookingCount(count => count + 1);
            setRecentBookings(current => [{
                awb,
                receiverName: formData.receiver?.name || "Receiver",
                destination: `${formData.receiver?.city || ""} ${formData.receiver?.pincode || ""}`.trim(),
                amount: formData.netAmount || "0.00",
                createdAt: new Date(),
            }, ...current].slice(0, 8));
            onSuccess(awb);
            resetParcel();
        } catch (error: any) {
            console.error("Booking failed:", error);
            const errMsg = error?.response?.data?.message || error?.message || "Failed to create booking. Please try again.";
            toast({
                title: "Booking Failed",
                description: errMsg,
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const searchedProducts = searchProducts(formData.contents || "");

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full pb-24">
            <div className="sticky top-0 z-20 -mx-1 rounded-2xl border border-primary/15 bg-background/95 p-3 shadow-sm backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                            <Keyboard className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Continuous booking desk</p>
                            <p className="text-xs text-muted-foreground">Book, print and immediately continue with the next parcel.</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <Badge variant="secondary" className="h-8 gap-1.5 px-3">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            {sessionBookingCount} booked this session
                        </Badge>
                        <span className="hidden rounded-md border bg-muted/40 px-2 py-1.5 text-muted-foreground md:inline">F2 Receiver</span>
                        <span className="hidden rounded-md border bg-muted/40 px-2 py-1.5 text-muted-foreground md:inline">Ctrl + Enter Book</span>
                        <Button type="button" variant="ghost" size="sm" className="h-8 gap-1.5" onClick={() => resetParcel()}>
                            <RotateCcw className="h-3.5 w-3.5" /> Clear parcel
                        </Button>
                    </div>
                </div>
            </div>

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
                            {customersLoading && (
                                <Loader2 className="w-3 h-3 animate-spin text-muted-foreground ml-1" />
                            )}
                            {formData.sender && (
                                <Badge variant="secondary" className="ml-auto gap-1 text-xs bg-green-500/10 text-green-700">
                                    <LockKeyhole className="h-3 w-3" /> Selected
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
                                        placeholder="Search sender by mobile or code..."
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
                            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed p-2 text-xs text-muted-foreground">
                                <Checkbox checked={keepSender} onCheckedChange={(checked) => setKeepSender(checked === true)} />
                                Keep this sender selected for the next booking
                            </label>
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
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Receiver Name *</Label>
                                    <Input
                                        placeholder="Full name"
                                        className="h-9 bg-background"
                                        value={formData.receiver?.name || ""}
                                        onChange={(e) => setFormData(prev => ({ ...prev, receiver: { ...prev.receiver!, name: e.target.value } as any }))}
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">City *</Label>
                                    <Input
                                        placeholder="Destination city"
                                        className="h-9 bg-background"
                                        value={formData.receiver?.city || ""}
                                        onChange={(e) => setFormData(prev => ({ ...prev, receiver: { ...prev.receiver!, city: e.target.value } as any }))}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">Complete Address *</Label>
                                <Input
                                    placeholder="House/shop, street and landmark"
                                    className="h-9 bg-background"
                                    value={formData.receiver?.address || ""}
                                    onChange={(e) => setFormData(prev => ({ ...prev, receiver: { ...prev.receiver!, address: e.target.value } as any }))}
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
                        <div className="flex flex-col gap-4 items-stretch sm:flex-row sm:items-end">
                            <div className="w-full space-y-1.5 sm:w-32">
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
                            <div className="w-full space-y-1.5 sm:w-24">
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
                                                    <CommandItem onSelect={() => handleProductSelect({ name: "Generic Package", weight: 0, value: 0 })}>
                                                        Generic Package
                                                    </CommandItem>
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
                            <div className="flex items-center gap-2 mt-3">
                                <Checkbox
                                    id="rapid-booking-terms"
                                    checked={termsAccepted}
                                    onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                                />
                                <Label htmlFor="rapid-booking-terms" className="text-xs cursor-pointer">
                                    I agree to the booking terms and conditions.
                                </Label>
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
                                disabled={submitting || !termsAccepted}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base shadow-lg shadow-primary/20"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Booking...
                                    </>
                                ) : (
                                    <>
                                        <Printer className="w-4 h-4 mr-2" />
                                        Book & Print
                                    </>
                                )}
                            </Button>
                            <p className="mt-2 text-center text-[11px] text-muted-foreground">Ctrl + Enter · Sender can remain locked for repeated bookings</p>
                        </div>
                    </div>
                </CardContent>
            </Card >

            {recentBookings.length > 0 && (
                <Card className="rounded-2xl border-emerald-500/20 bg-emerald-500/[0.03]">
                    <CardContent className="p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TimerReset className="h-4 w-4 text-emerald-600" />
                                <h3 className="text-sm font-semibold">Recently booked</h3>
                            </div>
                            <span className="text-xs text-muted-foreground">Latest {recentBookings.length} in this session</span>
                        </div>
                        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                            {recentBookings.map((booking) => (
                                <div key={booking.awb} className="rounded-xl border bg-background p-3 shadow-sm">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-mono text-xs font-bold text-primary">{booking.awb}</span>
                                        <span className="text-[10px] text-muted-foreground">{booking.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                                    </div>
                                    <p className="mt-1 truncate text-xs font-medium">{booking.receiverName}</p>
                                    <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                                        <span className="truncate">{booking.destination}</span>
                                        <span>₹{booking.amount}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </form >
    );
};

export default RapidEntryForm;
