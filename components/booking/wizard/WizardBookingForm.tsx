import { useState, useEffect } from "react";
import {
    User, MapPin, Package, CreditCard, CheckCircle2,
    ChevronRight, ChevronLeft, Truck, Search, Calculator,
    Plane, Store, AlertCircle, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { BookingFormData } from "@/components/booking/(create)/types";
import { mockCustomers } from "@/components/booking/(create)/mockData";
import { calculateBookingCharges, validateBookingRules } from "../rapid/BookingCalculations";

interface WizardBookingFormProps {
    onSuccess: (bookingId: string) => void;
}

const steps = [
    { id: 1, title: "Who & Where", icon: User },
    { id: 2, title: "Parcel Details", icon: Package },
    { id: 3, title: "Service & Pay", icon: CreditCard },
    { id: 4, title: "Review", icon: CheckCircle2 },
];

export default function WizardBookingForm({ onSuccess }: WizardBookingFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [senderQuery, setSenderQuery] = useState("");
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<BookingFormData>({
        documentNo: "",
        sender: null,
        receiver: null,
        pickupLocation: null,
        contents: "",
        mode: "SURFACE",
        paymentMode: "PREPAID",
        weight: "", length: "", breadth: "", height: "",
        volumetricWeight: "", chargeableWeight: "",
        invoiceValue: "", fovAmt: "", baseFreight: "",
        fuelPercent: "0", taxAmount: "", netAmount: "0.00",
        ewayBillNo: "", remark: "",
        bookingSource: "WIZARD",
        status: "BOOKED",
        serviceType: "STANDARD",
        distanceZone: "ZONE_A",
        packagingType: "BOX",
        insuranceRequired: false,
        declaredValue: "",
        codAmount: "",
        rate: "0", // Added missing field

        forwardTo: "", thru: "", charges: "", otherAddLess: "", netCharges: "", disc: "", taxPercent: "18", tax: "", ewayValidityStart: "", ewayValidityEnd: ""
    });

    const handleNext = () => {
        setError(null);
        // Validation Logic
        if (currentStep === 1) {
            if (!formData.sender) {
                setError("Please select a Sender to proceed.");
                return;
            }
            if (!formData.receiver?.name || !formData.receiver?.pincode) {
                setError("Please enter complete Receiver details.");
                return;
            }
        }
        if (currentStep === 2) {
            if (!formData.weight || parseFloat(formData.weight) <= 0) {
                setError("Please enter a valid weight.");
                return;
            }
        }

        // Auto-calculate on transition to Step 4 if needed, but doing it on Step 3 is better
        setCurrentStep(prev => Math.min(prev + 1, 4));
    };

    const handleBack = () => {
        setError(null);
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    // Auto-Calculator Effect for Step 3
    useEffect(() => {
        if (currentStep === 3) {
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
                taxAmount: result.taxAmount.toString(),
                netAmount: result.netAmount.toString(),
                chargeableWeight: result.chargeableWeight.toString(),
                volumetricWeight: result.chargeableWeight.toString(),
                rate: result.rateApplied.toString()
            }));
        }
    }, [currentStep, formData.mode, formData.weight, formData.length, formData.breadth, formData.height, formData.paymentMode]);


    return (
        <div className="h-full flex flex-col max-w-5xl mx-auto py-6">
            {/* Stepper Header */}
            <div className="flex items-center justify-between mb-8 px-8 relative">
                {/* Connecting Line */}
                <div className="absolute left-10 right-10 top-4 h-0.5 bg-muted -z-10" />

                {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-2 z-10 transition-all duration-300">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                            ${step.id === currentStep ? "border-primary bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30" :
                                    step.id < currentStep ? "border-primary bg-primary/20 text-primary" : "border-muted-foreground/30 bg-muted text-muted-foreground"}`}
                        >
                            <step.icon className="w-5 h-5" />
                        </div>
                        <span className={`text-xs font-semibold uppercase tracking-wider ${step.id === currentStep ? "text-primary" : "text-muted-foreground"}`}>
                            {step.title}
                        </span>
                    </div>
                ))}
            </div>

            {/* Error Banner */}
            {error && (
                <div className="mx-8 mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg flex items-center gap-2 text-sm animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto px-8 pb-8">
                {currentStep === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Sender Card */}
                            <Card className="border-none shadow-lg shadow-blue-500/5 ring-1 ring-border/50">
                                <CardHeader className="bg-blue-50/50 pb-4 border-b border-blue-100">
                                    <CardTitle className="flex items-center gap-2 text-blue-700">
                                        <div className="p-2 bg-blue-100 rounded-lg"><User className="w-5 h-5" /></div>
                                        Sender Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="relative">
                                        <Label className="text-xs text-muted-foreground mb-1.5 block">Search Client</Label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Enter Mobile, Code or Name..."
                                                className="pl-9 h-11 bg-muted/20"
                                                value={senderQuery}
                                                onChange={(e) => {
                                                    setSenderQuery(e.target.value);
                                                    const found = mockCustomers.find(c => c.mobileNo.includes(e.target.value) || c.code.toLowerCase().includes(e.target.value));
                                                    if (found) setFormData({ ...formData, sender: found });
                                                }}
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    {formData.sender ? (
                                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-lg text-blue-900">{formData.sender.name}</h3>
                                                    <p className="text-sm text-blue-700/80">{formData.sender.mobileNo}</p>
                                                </div>
                                                <Badge variant="outline" className="bg-white text-blue-700 border-blue-200">Active</Badge>
                                            </div>
                                            <div className="flex items-start gap-2 text-sm text-blue-600/80 mt-2">
                                                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                                <span>{formData.sender.address1}, {formData.sender.city} - {formData.sender.pincode}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
                                            <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                            <p>Search and select a sender to proceed</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Receiver Card */}
                            <Card className="border-none shadow-lg shadow-orange-500/5 ring-1 ring-border/50">
                                <CardHeader className="bg-orange-50/50 pb-4 border-b border-orange-100">
                                    <CardTitle className="flex items-center gap-2 text-orange-700">
                                        <div className="p-2 bg-orange-100 rounded-lg"><MapPin className="w-5 h-5" /></div>
                                        Receiver Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs text-muted-foreground">Mobile Number</Label>
                                            <Input
                                                className="h-10 bg-muted/20"
                                                placeholder="98765..."
                                                value={formData.receiver?.mobileNo || ""}
                                                onChange={e => setFormData({ ...formData, receiver: { ...formData.receiver!, mobileNo: e.target.value } as any })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs text-muted-foreground">Pincode</Label>
                                            <Input
                                                className="h-10 bg-muted/20"
                                                placeholder="e.g. 110001"
                                                value={formData.receiver?.pincode || ""}
                                                onChange={e => setFormData({ ...formData, receiver: { ...formData.receiver!, pincode: e.target.value } as any })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Receiver Name</Label>
                                        <Input
                                            className="h-10 bg-muted/20"
                                            placeholder="Enter Full Name"
                                            value={formData.receiver?.name || ""}
                                            onChange={e => setFormData({ ...formData, receiver: { ...formData.receiver!, name: e.target.value } as any })}
                                        />
                                    </div>
                                    <div className="pt-2">
                                        {formData.receiver?.pincode ? (
                                            <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded border border-green-100">
                                                <CheckCircle2 className="w-3 h-3" /> Serviceable Area
                                            </div>
                                        ) : (
                                            <div className="text-xs text-muted-foreground italic">Enter pincode to check serviceability</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="border-none shadow-lg ring-1 ring-border/50">
                                    <CardHeader>
                                        <CardTitle>Parcel Specification</CardTitle>
                                        <CardDescription>Enter physical details of the shipment</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <Label>Actual Weight (Kg)</Label>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        className="h-12 text-xl font-bold pl-4 pr-8"
                                                        value={formData.weight}
                                                        onChange={e => setFormData({ ...formData, weight: e.target.value })}
                                                    />
                                                    <span className="absolute right-3 top-3.5 text-muted-foreground text-sm font-medium">Kg</span>
                                                </div>
                                            </div>
                                            <div className="col-span-2 space-y-2">
                                                <Label>Dimensions (L x B x H) cm</Label>
                                                <div className="flex gap-3">
                                                    <Input className="h-12 text-center" placeholder="L" value={formData.length} onChange={e => setFormData({ ...formData, length: e.target.value })} />
                                                    <span className="self-center text-muted-foreground">x</span>
                                                    <Input className="h-12 text-center" placeholder="B" value={formData.breadth} onChange={e => setFormData({ ...formData, breadth: e.target.value })} />
                                                    <span className="self-center text-muted-foreground">x</span>
                                                    <Input className="h-12 text-center" placeholder="H" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Contents Description</Label>
                                            <Input
                                                className="h-11"
                                                placeholder="e.g. Electronics, Documents, Garments..."
                                                value={formData.contents}
                                                onChange={e => setFormData({ ...formData, contents: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Declared Value (₹)</Label>
                                            <Input
                                                className="h-11"
                                                type="number"
                                                placeholder="0.00"
                                                value={formData.invoiceValue}
                                                onChange={e => setFormData({ ...formData, invoiceValue: e.target.value })}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Helper Sidebar */}
                            <div className="space-y-6">
                                <Card className="bg-primary/5 border-primary/20">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-bold text-primary flex items-center gap-2">
                                            <Calculator className="w-4 h-4" /> Calculated Weight
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Volumetric Wt:</span>
                                            <span className="font-mono font-medium">
                                                {(parseFloat(formData.length || "0") * parseFloat(formData.breadth || "0") * parseFloat(formData.height || "0") / 5000).toFixed(2)} Kg
                                            </span>
                                        </div>
                                        <Separator className="bg-primary/20" />
                                        <div className="space-y-1">
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Chargeable Weight</span>
                                            <div className="text-3xl font-bold text-primary">
                                                {Math.max(parseFloat(formData.weight || "0"), (parseFloat(formData.length || "0") * parseFloat(formData.breadth || "0") * parseFloat(formData.height || "0") / 5000)).toFixed(2)} <span className="text-sm font-normal text-muted-foreground">Kg</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Service Selection */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold flex items-center gap-2"><Truck className="w-5 h-5 text-primary" /> Select Service Mode</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div
                                        className={`p-6 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01]
                                        ${formData.mode === "SURFACE" ? "border-primary bg-primary/5 shadow-md" : "border-muted hover:border-primary/50"}`}
                                        onClick={() => setFormData({ ...formData, mode: "SURFACE" })}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${formData.mode === "SURFACE" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                                                <Truck className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg">Surface Standard</h4>
                                                <p className="text-sm text-muted-foreground">Reliable ground transport</p>
                                            </div>
                                        </div>
                                        {formData.mode === "SURFACE" && <CheckCircle2 className="w-6 h-6 text-primary" />}
                                    </div>

                                    <div
                                        className={`p-6 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01]
                                        ${formData.mode === "AIR" ? "border-primary bg-primary/5 shadow-md" : "border-muted hover:border-primary/50"}`}
                                        onClick={() => setFormData({ ...formData, mode: "AIR" })}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${formData.mode === "AIR" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                                                <Plane className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg">Air Express</h4>
                                                <p className="text-sm text-muted-foreground">Fastest delivery option</p>
                                            </div>
                                        </div>
                                        {formData.mode === "AIR" && <CheckCircle2 className="w-6 h-6 text-primary" />}
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-muted-foreground">Additional Options</h3>
                                    <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted/30 cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, insuranceRequired: !prev.insuranceRequired }))}>
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.insuranceRequired ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground"}`}>
                                            {formData.insuranceRequired && <CheckCircle2 className="w-3 h-3" />}
                                        </div>
                                        <span className="text-sm font-medium">Add Transit Insurance (2%)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <Card className="h-fit shadow-lg shadow-green-500/5 ring-1 ring-border/50">
                                <CardHeader className="bg-muted/20 border-b">
                                    <CardTitle className="text-lg">Billing Details</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-2">
                                        <Label>Payment Method</Label>
                                        <select
                                            className="w-full h-11 px-3 rounded-md border bg-background"
                                            value={formData.paymentMode}
                                            onChange={e => setFormData({ ...formData, paymentMode: e.target.value })}
                                        >
                                            <option value="PREPAID">Prepaid (Cash/Online)</option>
                                            <option value="COD">To-Pay / COD</option>
                                            <option value="CREDIT">Credit Account</option>
                                        </select>
                                    </div>

                                    <div className="bg-primary/5 rounded-xl p-6 space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Base Freight</span>
                                            <span className="font-medium">₹{formData.baseFreight}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Tax (18%)</span>
                                            <span className="font-medium">₹{formData.taxAmount}</span>
                                        </div>
                                        <Separator className="bg-primary/10 my-2" />
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-foreground">Total Payable</span>
                                            <span className="text-2xl font-bold text-primary">₹{formData.netAmount}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300 max-w-2xl mx-auto">
                        <div className="text-center space-y-2">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold">Review Booking</h2>
                            <p className="text-muted-foreground">Please verify all details before generating the docket.</p>
                        </div>

                        <Card className="overflow-hidden border-t-4 border-t-primary shadow-xl">
                            <div className="grid grid-cols-2 divide-x divide-border">
                                <div className="p-6 space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">From</span>
                                    <p className="font-semibold text-lg">{formData.sender?.name}</p>
                                    <p className="text-muted-foreground text-sm">{formData.sender?.city}</p>
                                </div>
                                <div className="p-6 space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">To</span>
                                    <p className="font-semibold text-lg">{formData.receiver?.name}</p>
                                    <p className="text-muted-foreground text-sm">{formData.receiver?.city} - {formData.receiver?.pincode}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="p-6 bg-muted/20 grid grid-cols-3 gap-6">
                                <div>
                                    <span className="text-xs text-muted-foreground uppercase font-bold">Service</span>
                                    <p className="font-medium flex items-center gap-2 mt-1">
                                        {formData.mode === "AIR" ? <Plane className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                                        {formData.mode === "AIR" ? "Air Express" : "Surface"}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground uppercase font-bold">Weight</span>
                                    <p className="font-medium mt-1">{formData.weight} Kg</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-muted-foreground uppercase font-bold">Amount</span>
                                    <p className="font-bold text-xl text-primary mt-1">₹{formData.netAmount}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            {/* Sticky Footer */}
            <div className="flex justify-between items-center mt-auto pt-6 border-t px-8 bg-background sticky bottom-0 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <Button
                    variant="ghost"
                    size="lg"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <ChevronLeft className="w-5 h-5 mr-2" /> Back
                </Button>

                {currentStep === 4 ? (
                    <Button
                        size="lg"
                        onClick={() => onSuccess("WIZ-" + Date.now().toString().slice(-4))}
                        className="bg-green-600 hover:bg-green-700 h-12 px-8 text-base shadow-lg shadow-green-600/20"
                    >
                        Confirm Booking <CheckCircle2 className="w-5 h-5 ml-2" />
                    </Button>
                ) : (
                    <Button
                        size="lg"
                        onClick={handleNext}
                        className="h-12 px-8 text-base shadow-lg shadow-primary/20"
                    >
                        Next Step <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                )}
            </div>
        </div>
    );
}
