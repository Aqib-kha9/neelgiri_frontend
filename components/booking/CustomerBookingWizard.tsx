"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    User,
    MapPin,
    Package,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Truck,
    Weight,
    CreditCard,
    ShieldCheck,
    AlertTriangle,
    Loader2,
    Info,
    ChevronRight,
    ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { calculateBookingCharges } from "./rapid/BookingCalculations";

const STEPS = [
    { id: 1, label: "Receiver Details", icon: MapPin },
    { id: 2, label: "Parcel Details", icon: Package },
    { id: 3, label: "Service & Review", icon: CreditCard },
];

export default function CustomerBookingWizard() {
    const { session } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState<null | string>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        // Receiver
        receiverName: "",
        receiverPhone: "",
        receiverPincode: "",
        receiverAddressLine1: "",
        receiverAddressLine2: "",
        receiverCity: "",
        receiverState: "",

        // Package
        weight: "",
        length: "",
        breadth: "",
        height: "",
        contents: "",
        declaredValue: "",
        insuranceRequired: false,

        // Service
        mode: "SURFACE", // SURFACE | AIR
        paymentMode: "PREPAID",
        agreedToTerms: false
    });

    const [pricing, setPricing] = useState({
        baseFreight: 0,
        taxAmount: 0,
        netAmount: 0,
        chargeableWeight: 0
    });

    // Update pricing when dimensions or weight change
    useEffect(() => {
        const result = calculateBookingCharges({
            weight: parseFloat(formData.weight) || 0,
            length: parseFloat(formData.length),
            breadth: parseFloat(formData.breadth),
            height: parseFloat(formData.height),
            serviceType: formData.mode,
            sourceCity: session?.user?.city || "Local", // Fallback
            destCity: formData.receiverCity || "Destination",
            declaredValue: parseFloat(formData.declaredValue)
        });

        setPricing({
            baseFreight: result.baseFreight,
            taxAmount: result.taxAmount,
            netAmount: result.netAmount,
            chargeableWeight: result.chargeableWeight
        });
    }, [formData.weight, formData.length, formData.breadth, formData.height, formData.mode, formData.declaredValue, formData.receiverCity, session]);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (validationError) setValidationError(null);
    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            if (!formData.receiverName || !formData.receiverPhone || !formData.receiverPincode || !formData.receiverAddressLine1) {
                setValidationError("Please fill in all required receiver details.");
                return;
            }
        }
        if (currentStep === 2) {
            if (!formData.weight || parseFloat(formData.weight) <= 0) {
                setValidationError("Please enter a valid weight.");
                return;
            }
        }
        setValidationError(null);
        setCurrentStep(prev => Math.min(prev + 1, 3));
    };

    const handleBack = () => {
        setValidationError(null);
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        if (!formData.agreedToTerms) return;
        setIsSubmitting(true);
        setValidationError(null);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/shipments/book", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    receiver: {
                        name: formData.receiverName,
                        phone: formData.receiverPhone,
                        address: `${formData.receiverAddressLine1}${formData.receiverAddressLine2 ? ', ' + formData.receiverAddressLine2 : ''}`,
                        pincode: formData.receiverPincode,
                        city: formData.receiverCity,
                        state: formData.receiverState
                    },
                    weight: parseFloat(formData.weight),
                    dimensions: {
                        length: parseFloat(formData.length) || 0,
                        width: parseFloat(formData.breadth) || 0,
                        height: parseFloat(formData.height) || 0
                    },
                    contents: formData.contents,
                    paymentMode: formData.paymentMode,
                    codAmount: 0,
                    declaredValue: parseFloat(formData.declaredValue) || 0,
                    mode: formData.mode
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create booking");
            }

            setBookingSuccess(data.awb);
        } catch (error: any) {
            setValidationError(error.message || "Failed to create booking. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (bookingSuccess) {
        return (
            <div className="space-y-6">
                <section className="rounded-3xl border border-border/70 bg-card/95 p-10 shadow-card text-center">
                    <div className="mx-auto w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6 border-4 border-background shadow-brand">
                        <CheckCircle2 className="h-10 w-10 text-success" />
                    </div>
                    <h1 className="text-display-1 mb-2">Booking Confirmed!</h1>
                    <p className="text-body max-w-md mx-auto mb-8">
                        Your shipment has been successfully registered. You can track it using the AWB number below.
                    </p>

                    <div className="bg-muted/30 p-8 rounded-3xl border border-border/50 inline-block text-left w-full max-w-sm mx-auto shadow-inner">
                        <div className="flex justify-between items-center mb-4">
                            <Badge variant="outline" className="rounded-full px-3 py-1 bg-background">AWB NUMBER</Badge>
                            <Badge className="bg-success/15 text-success hover:bg-success/20 border-none rounded-full px-3 py-1">Ready for Pickup</Badge>
                        </div>
                        <p className="text-4xl font-mono font-bold text-primary tracking-tighter mb-4">{bookingSuccess}</p>
                        <Separator className="my-4 opacity-50" />
                        <div className="flex justify-between text-sm items-center font-medium">
                            <span className="text-muted-foreground">Estimated Total:</span>
                            <span className="text-2xl text-foreground">₹{pricing.netAmount}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
                        <Button className="rounded-xl h-12 px-8 font-bold shadow-brand gap-2" onClick={() => router.push(`/dashboard/tracking?awb=${bookingSuccess}`)}>
                            Track Shipment <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="rounded-xl h-12 px-8 border-border/70 font-bold" onClick={() => window.location.reload()}>
                            New Booking
                        </Button>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Standard Dashboard Page Header */}
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">
                            Member Booking Portal
                        </Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">
                                Book Your Shipment
                            </h1>
                            <p className="max-w-2xl text-body">
                                Hello <strong>{session?.user?.name}</strong>, send packages anywhere in India with our direct member portal. Secure, fast, and reliable.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-2">
                            <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                                <MapPin className="h-3.5 w-3.5 text-primary" />
                                {session?.user?.city || "Local"} Branch
                            </span>
                            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                                <Truck className="h-3.5 w-3.5 text-success" />
                                Standard & Express
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stepper & Main Form Area */}
            <div className="grid lg:grid-cols-12 gap-6 items-start">
                {/* Fixed Stepper Sidebar on Large Screens */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="rounded-3xl border border-border/70 bg-card/95 p-5 shadow-card sticky top-20">
                        <div className="space-y-1 mb-6">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground/70 px-2">Progress</h3>
                        </div>
                        <div className="space-y-2">
                            {STEPS.map((step) => {
                                const StepIcon = step.icon;
                                const isActive = step.id === currentStep;
                                const isCompleted = step.id < currentStep;

                                return (
                                    <div
                                        key={step.id}
                                        className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${isActive ? 'bg-primary/10 text-primary border border-primary/20 ring-4 ring-primary/5' : isCompleted ? 'text-success hover:bg-muted/30' : 'text-muted-foreground/60'}`}
                                    >
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? 'border-primary bg-primary text-white scale-110 shadow-brand' : isCompleted ? 'border-success bg-success/10 text-success' : 'border-current opacity-30'}`}>
                                            {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
                                        </div>
                                        <span className="text-sm font-bold tracking-tight">{step.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Summary Quick View */}
                    {currentStep > 1 && (
                        <div className="rounded-3xl border border-border/70 bg-primary/5 p-5 shadow-card animate-in slide-in-from-left duration-500">
                            <h3 className="font-bold text-xs uppercase tracking-widest text-primary/70 px-2 mb-4">Live Quote</h3>
                            <div className="space-y-3 px-2">
                                <div className="flex justify-between text-xs font-semibold">
                                    <span className="opacity-60">Freight</span>
                                    <span>₹{pricing.baseFreight}</span>
                                </div>
                                <div className="flex justify-between text-xs font-semibold">
                                    <span className="opacity-60">GST (18%)</span>
                                    <span>₹{pricing.taxAmount}</span>
                                </div>
                                <Separator className="bg-primary/10" />
                                <div className="flex justify-between items-baseline pt-1">
                                    <span className="text-[10px] uppercase font-bold text-primary">Total</span>
                                    <span className="text-xl font-bold tracking-tighter">₹{pricing.netAmount}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9">
                    <Card className="rounded-[2rem] border-border/70 shadow-card bg-card/95 overflow-hidden">
                        <CardHeader className="p-8 border-b border-border/50 bg-muted/10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/15 rounded-2xl text-primary shadow-inner ring-1 ring-primary/20">
                                    {(() => {
                                        const Icon = STEPS[currentStep - 1].icon;
                                        return <Icon className="h-6 w-6" />
                                    })()}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight">{STEPS[currentStep - 1].label}</h2>
                                    <p className="text-sm text-body">
                                        {currentStep === 1 && "Complete the delivery destination details."}
                                        {currentStep === 2 && "Physical attributes of your package."}
                                        {currentStep === 3 && "Finalize shipping speed and confirm."}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-8 min-h-[450px]">
                            {validationError && (
                                <Alert variant="destructive" className="mb-8 rounded-2xl border-none bg-destructive/10 text-destructive animate-in shake-1">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription className="font-semibold">{validationError}</AlertDescription>
                                </Alert>
                            )}

                            {currentStep === 1 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 px-1">Receiver Full Name *</Label>
                                            <Input
                                                placeholder="Enter recipient name"
                                                className="h-12 rounded-xl border-border/70 focus:ring-primary/20 shadow-sm"
                                                value={formData.receiverName}
                                                onChange={(e) => handleInputChange("receiverName", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 px-1">Receiver Mobile *</Label>
                                            <Input
                                                placeholder="10 digit mobile number"
                                                className="h-12 rounded-xl border-border/70 focus:ring-primary/20 shadow-sm"
                                                type="tel"
                                                value={formData.receiverPhone}
                                                onChange={(e) => handleInputChange("receiverPhone", e.target.value.replace(/\D/g, ''))}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6 pt-2">
                                        <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide">
                                            <MapPin className="h-4 w-4" /> RECIPIENT ADDRESS
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 px-1">Pincode *</Label>
                                                <Input
                                                    placeholder="6 digit pincode"
                                                    className="h-12 rounded-xl border-border/70 focus:ring-primary/20 shadow-sm"
                                                    maxLength={6}
                                                    value={formData.receiverPincode}
                                                    onChange={(e) => handleInputChange("receiverPincode", e.target.value.replace(/\D/g, ''))}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 px-1">City *</Label>
                                                <Input
                                                    placeholder="City"
                                                    className="h-12 rounded-xl border-border/70 focus:ring-primary/20 shadow-sm"
                                                    value={formData.receiverCity}
                                                    onChange={(e) => handleInputChange("receiverCity", e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 px-1">State *</Label>
                                                <Input
                                                    placeholder="State"
                                                    className="h-12 rounded-xl border-border/70 focus:ring-primary/20 shadow-sm"
                                                    value={formData.receiverState}
                                                    onChange={(e) => handleInputChange("receiverState", e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 px-1">House, Plot, Building, Area *</Label>
                                            <Textarea
                                                placeholder="Complete delivery address..."
                                                className="min-h-[100px] rounded-xl border-border/70 focus:ring-primary/20 shadow-sm"
                                                value={formData.receiverAddressLine1}
                                                onChange={(e) => handleInputChange("receiverAddressLine1", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div className="space-y-8">
                                            <div className="space-y-3 p-6 rounded-3xl bg-muted/40 border border-border/50">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                                                    <Weight className="h-4 w-4 text-primary" /> Actual Weight (KG)
                                                </Label>
                                                <Input
                                                    type="number"
                                                    className="h-16 text-4xl font-bold rounded-2xl bg-background border-border/70 focus:ring-primary/20 text-center tracking-tighter"
                                                    placeholder="0.0"
                                                    value={formData.weight}
                                                    onChange={(e) => handleInputChange("weight", e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 px-1">Box Dimensions (CM)</Label>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="space-y-1">
                                                        <Input placeholder="Length" className="h-12 text-center rounded-xl border-border/70" type="number" value={formData.length} onChange={(e) => handleInputChange("length", e.target.value)} />
                                                        <span className="text-[10px] text-center block font-bold opacity-40">L</span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Input placeholder="Breadth" className="h-12 text-center rounded-xl border-border/70" type="number" value={formData.breadth} onChange={(e) => handleInputChange("breadth", e.target.value)} />
                                                        <span className="text-[10px] text-center block font-bold opacity-40">B</span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Input placeholder="Height" className="h-12 text-center rounded-xl border-border/70" type="number" value={formData.height} onChange={(e) => handleInputChange("height", e.target.value)} />
                                                        <span className="text-[10px] text-center block font-bold opacity-40">H</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 px-1">Parcel Contents</Label>
                                                <Input
                                                    placeholder="e.g. Garments, Electronics"
                                                    className="h-12 rounded-xl border-border/70 focus:ring-primary/20 shadow-sm"
                                                    value={formData.contents}
                                                    onChange={(e) => handleInputChange("contents", e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-4 pt-2">
                                                <div className="flex justify-between items-center px-1">
                                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Declared Value (₹)</Label>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold text-muted-foreground italic">Add Insurance</span>
                                                        <Switch
                                                            checked={formData.insuranceRequired}
                                                            onCheckedChange={(v) => handleInputChange("insuranceRequired", v)}
                                                            className="data-[state=checked]:bg-success"
                                                        />
                                                    </div>
                                                </div>
                                                <Input
                                                    type="number"
                                                    placeholder="₹ 0.00"
                                                    className="h-12 rounded-xl border-border/70 focus:ring-primary/20 shadow-sm font-bold"
                                                    value={formData.declaredValue}
                                                    onChange={(e) => handleInputChange("declaredValue", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 px-1">Shipping Speed</Label>

                                            <div
                                                className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex items-center gap-4 group ${formData.mode === 'SURFACE' ? 'border-primary bg-primary/5 shadow-inner' : 'border-border/50 opacity-60 grayscale'}`}
                                                onClick={() => handleInputChange("mode", "SURFACE")}
                                            >
                                                <div className={`p-4 rounded-2xl ${formData.mode === 'SURFACE' ? 'bg-primary text-white' : 'bg-muted'}`}>
                                                    <Truck className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold">Surface (Standard)</p>
                                                    <p className="text-xs text-muted-foreground">3-7 business days transit</p>
                                                </div>
                                                {formData.mode === 'SURFACE' && <CheckCircle2 className="h-6 w-6 text-primary" />}
                                            </div>

                                            <div
                                                className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex items-center gap-4 group ${formData.mode === 'AIR' ? 'border-amber-500 bg-amber-50/50 shadow-inner' : 'border-border/50 opacity-60 grayscale'}`}
                                                onClick={() => handleInputChange("mode", "AIR")}
                                            >
                                                <div className={`p-4 rounded-2xl ${formData.mode === 'AIR' ? 'bg-amber-500 text-white' : 'bg-muted'}`}>
                                                    <Truck className="h-6 w-6 -rotate-12" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-amber-700">Premium Air (Fast)</p>
                                                    <p className="text-xs text-muted-foreground">1-3 business days transit</p>
                                                </div>
                                                {formData.mode === 'AIR' && <CheckCircle2 className="h-6 w-6 text-amber-500" />}
                                            </div>
                                        </div>

                                        <div className="rounded-3xl bg-zinc-900 p-8 text-white shadow-2xl ring-1 ring-white/10 flex flex-col justify-between">
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary font-mono flex items-center gap-2 italic">
                                                        <ShieldCheck className="h-4 w-4" /> Cargo Invoice
                                                    </h3>
                                                    <Badge variant="outline" className="text-white/40 border-white/20 uppercase text-[10px]">Portal Direct</Badge>
                                                </div>

                                                <div className="space-y-3 font-medium">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="opacity-50">Chargeable Wt.</span>
                                                        <span>{pricing.chargeableWeight} KG</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="opacity-50">Base Freight</span>
                                                        <span>₹{pricing.baseFreight}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="opacity-50">IGST (18%)</span>
                                                        <span>₹{pricing.taxAmount}</span>
                                                    </div>
                                                    <Separator className="bg-white/10" />
                                                    <div className="flex justify-between items-end pt-4">
                                                        <div>
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Total Payable</p>
                                                            <p className="text-5xl font-bold tracking-tighter">₹{pricing.netAmount}</p>
                                                        </div>
                                                        <div className="text-[10px] opacity-40 italic text-right">
                                                            Taxes Included
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className="mt-10 flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all"
                                                onClick={() => handleInputChange("agreedToTerms", !formData.agreedToTerms)}
                                            >
                                                <div className={`h-6 w-6 rounded-lg flex items-center justify-center transition-colors ${formData.agreedToTerms ? 'bg-success text-white' : 'bg-white/10 border border-white/20'}`}>
                                                    {formData.agreedToTerms && <CheckCircle2 className="h-4 w-4" />}
                                                </div>
                                                <p className="text-[11px] leading-tight opacity-70">I agree to the <strong>Nexgen Shipping Terms</strong> & privacy policy.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="p-8 bg-muted/20 border-t border-border/50 flex flex-col sm:flex-row justify-between gap-4">
                            <Button
                                variant="outline"
                                className="h-14 rounded-2xl gap-2 font-bold px-10 border-border/70 hover:bg-card"
                                onClick={handleBack}
                                disabled={currentStep === 1 || isSubmitting}
                            >
                                <ChevronLeft className="h-5 w-5" /> Previous
                            </Button>

                            <div className="w-full sm:w-[320px]">
                                {currentStep < 3 ? (
                                    <Button
                                        className="w-full h-14 rounded-2xl gap-2 font-bold shadow-brand text-lg"
                                        onClick={handleNextStep}
                                    >
                                        Next Stage <ChevronRight className="h-5 w-5" />
                                    </Button>
                                ) : (
                                    <Button
                                        className={`w-full h-14 rounded-2xl gap-2 font-bold shadow-brand text-lg ${formData.agreedToTerms ? "bg-success hover:bg-success/90" : "bg-primary"}`}
                                        onClick={handleSubmit}
                                        disabled={!formData.agreedToTerms || isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <>Confirm Booking <CheckCircle2 className="h-5 w-5" /></>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            <footer className="text-center py-10 opacity-40 text-[10px] font-bold uppercase tracking-[0.3em]">
                <p>Support Access: 1800-NEXGEN-LOGS • Built for Business</p>
            </footer>
        </div>
    );
}
