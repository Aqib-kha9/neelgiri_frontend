"use client";

import { useState } from "react";
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
    Clock,
    Calendar,
    ShieldCheck,
    AlertTriangle,
    Info,
    Loader2,
    Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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

const STEPS = [
    { id: 1, label: "Sender & Pickup", icon: User },
    { id: 2, label: "Receiver", icon: MapPin },
    { id: 3, label: "Parcel Details", icon: Package },
    { id: 4, label: "Review & Pay", icon: CreditCard },
];

export default function PublicBookingForm() {
    // Stage 0: Pincode Check, Stage 1: Booking Form
    const [isPincodeVerified, setIsPincodeVerified] = useState(false);

    // Form State
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState<null | string>(null);

    // Validation State
    const [validationError, setValidationError] = useState<string | null>(null);
    const [isValidating, setIsValidating] = useState(false);

    // Pincode Check Inputs
    const [checkPincodes, setCheckPincodes] = useState({
        pickup: "",
        delivery: ""
    });

    const [formData, setFormData] = useState({
        // Step 1: Sender & Pickup
        senderName: "",
        senderPhone: "",
        senderEmail: "",
        senderAddressLine1: "",
        senderAddressLine2: "",
        senderLandmark: "",
        senderCity: "",
        senderState: "",
        senderPincode: "",
        pickupDate: "",
        pickupTime: "",

        // Step 2: Receiver
        receiverName: "",
        receiverPhone: "",
        receiverEmail: "",
        receiverAddressLine1: "",
        receiverAddressLine2: "",
        receiverLandmark: "",
        receiverCity: "",
        receiverState: "",
        receiverPincode: "",

        // Step 3: Package
        packageType: "box",
        category: "general",
        weight: "",
        length: "",
        width: "",
        height: "",
        contents: "",
        declaredValue: "",
        isFragile: false,
        wantsInsurance: false,

        // Step 4: Service
        serviceType: "standard",
        agreedToTerms: false
    });

    // Mock Serviceable Pincodes (derived from mockData)
    const serviceablePincodes = [
        "400069", "110019", "560034", "600032", "500034",
        "380009", "411001", "302001"
    ];

    const checkServiceability = async (pincode: string) => {
        // Mock API delay
        await new Promise(resolve => setTimeout(resolve, 600));
        return serviceablePincodes.includes(pincode);
    };

    const handleInitialCheck = async () => {
        setValidationError(null);

        if (!checkPincodes.pickup || checkPincodes.pickup.length < 6) {
            setValidationError("Please enter a valid 6-digit Pickup Pincode.");
            return;
        }
        if (!checkPincodes.delivery || checkPincodes.delivery.length < 6) {
            setValidationError("Please enter a valid 6-digit Delivery Pincode.");
            return;
        }

        setIsValidating(true);

        try {
            const [isPickupValid, isDeliveryValid] = await Promise.all([
                checkServiceability(checkPincodes.pickup),
                checkServiceability(checkPincodes.delivery)
            ]);

            setIsValidating(false);

            if (!isPickupValid) {
                setValidationError(`Sorry, Pickup Pincode ${checkPincodes.pickup} is not serviceable.`);
                return;
            }
            if (!isDeliveryValid) {
                setValidationError(`Sorry, Delivery Pincode ${checkPincodes.delivery} is not serviceable.`);
                return;
            }

            // If valid, initialize form data and proceed
            setFormData(prev => ({
                ...prev,
                senderPincode: checkPincodes.pickup,
                receiverPincode: checkPincodes.delivery,
                senderCity: "", // Reset derived fields if we had real logic
                senderState: "",
                receiverCity: "",
                receiverState: ""
            }));
            setIsPincodeVerified(true);

        } catch (error) {
            setIsValidating(false);
            setValidationError("Something went wrong. Please try again.");
        }
    };

    const handleNextStep = async () => {
        // Step validation logic if needed
        setValidationError(null);
        setCurrentStep(prev => Math.min(prev + 1, 4));
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (validationError) setValidationError(null);
    };

    const prevStep = () => {
        setValidationError(null);
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const calculatePrice = () => {
        const weight = parseFloat(formData.weight || "0");
        const basePrice = 100;

        // Volumetric check roughly (L*W*H)/5000
        const volWeight = (parseFloat(formData.length || "0") * parseFloat(formData.width || "0") * parseFloat(formData.height || "0")) / 5000;
        const chargeableWeight = Math.max(weight, volWeight);

        let total = basePrice + (chargeableWeight * 50);

        if (formData.serviceType === 'express') total *= 1.5;
        if (formData.wantsInsurance) total += (parseFloat(formData.declaredValue || "0") * 0.01); // 1% insurance

        return Math.round(total);
    };

    const handleSubmit = () => {
        if (!formData.agreedToTerms) return;
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            const mockAWB = "NGL-" + Math.floor(100000 + Math.random() * 900000);
            setBookingSuccess(mockAWB);
            setIsSubmitting(false);
        }, 1500);
    };

    if (bookingSuccess) {
        return (
            <Card className="max-w-xl mx-auto border-dashed border-2 border-green-500/50 bg-green-50/50 animate-in zoom-in-95 duration-300">
                <CardContent className="pt-10 pb-10 text-center space-y-6">
                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-green-800">Booking Confirmed!</h2>
                        <p className="text-muted-foreground text-lg">
                            Your shipment has been registered successfully.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-green-200 inline-block text-left w-full max-w-sm mx-auto shadow-md">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">AWB Number</p>
                            <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Active</Badge>
                        </div>
                        <p className="text-4xl font-mono font-bold text-green-900 tracking-tight">{bookingSuccess}</p>
                        <Separator className="my-4" />
                        <div className="flex justify-between text-sm items-center">
                            <span className="text-muted-foreground">Total Paid:</span>
                            <span className="font-bold text-xl text-primary">₹ {calculatePrice()}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 max-w-sm mx-auto pt-4">
                        <Button className="w-full h-12 text-base shadow-lg shadow-primary/20" onClick={() => window.location.href = `/track?awb=${bookingSuccess}`}>
                            Track Shipment <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="h-12" onClick={() => window.location.reload()}>
                            Book Another Shipment
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // STAGE 0: Service Availability Check
    if (!isPincodeVerified) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card className="border-border/60 shadow-xl rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
                    <CardHeader className="text-center pb-8 pt-8">
                        <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                            <MapPin className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">Check Service Availability</CardTitle>
                        <CardDescription className="text-base max-w-md mx-auto">
                            Before we proceed, let's verify if we service your route. Enter the pickup and delivery pincodes below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 md:px-12 pb-10">
                        {validationError && (
                            <Alert variant="destructive" className="animate-in fade-in zoom-in-95 bg-red-50 border-red-200">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                <div className="ml-2">
                                    <AlertTitle className="text-red-800">Route Unavailable</AlertTitle>
                                    <AlertDescription className="text-red-600">{validationError}</AlertDescription>
                                </div>
                            </Alert>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-base">Pickup Pincode</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        placeholder="Min 6 digits"
                                        className="pl-10 h-12 text-lg"
                                        maxLength={6}
                                        value={checkPincodes.pickup}
                                        onChange={(e) => setCheckPincodes(prev => ({ ...prev, pickup: e.target.value.replace(/\D/g, '') }))}
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-base">Delivery Pincode</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        placeholder="Min 6 digits"
                                        className="pl-10 h-12 text-lg"
                                        maxLength={6}
                                        value={checkPincodes.delivery}
                                        onChange={(e) => setCheckPincodes(prev => ({ ...prev, delivery: e.target.value.replace(/\D/g, '') }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full h-12 text-lg shadow-lg shadow-primary/20 mt-4 group"
                            onClick={handleInitialCheck}
                            disabled={isValidating || !checkPincodes.pickup || !checkPincodes.delivery}
                        >
                            {isValidating ? (
                                <>Checking Route <Loader2 className="ml-2 h-5 w-5 animate-spin" /></>
                            ) : (
                                <>Check Availability & Proceed <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </Button>

                        <div className="text-center text-sm text-muted-foreground mt-4">
                            Try mock pincodes: <span className="font-mono bg-muted px-1 rounded">400069</span>, <span className="font-mono bg-muted px-1 rounded">110019</span>, <span className="font-mono bg-muted px-1 rounded">560034</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // STAGE 1: Full Booking Form
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            {/* Progress Stepper */}
            <div className="flex items-center justify-between relative px-4 md:px-12">
                <div className="absolute left-10 right-10 top-1/2 h-0.5 bg-border -z-10" />
                {STEPS.map((step) => {
                    const StepIcon = step.icon;
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-3 bg-background px-4 py-2 rounded-lg">
                            <div
                                className={`
                  h-12 w-12 rounded-full flex items-center justify-center border-2 transition-all shadow-sm
                  ${isActive ? "border-primary bg-primary text-primary-foreground scale-110" :
                                        isCompleted ? "border-primary bg-primary/10 text-primary" :
                                            "border-muted bg-background text-muted-foreground"}
                `}
                            >
                                <StepIcon className="h-6 w-6" />
                            </div>
                            <span className={`text-sm font-semibold hidden md:block ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            <Card className="border-border/60 shadow-xl rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
                <div className="h-2 bg-primary/10 w-full mb-0">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${(currentStep / 4) * 100}%` }}
                    />
                </div>

                <CardHeader className="pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            {(() => {
                                const Icon = STEPS[currentStep - 1].icon;
                                return <Icon className="h-6 w-6 text-primary" />
                            })()}
                        </div>
                        <div>
                            <CardTitle className="text-2xl">{STEPS[currentStep - 1].label}</CardTitle>
                            <CardDescription className="text-base">
                                {currentStep === 1 && "Start by telling us who is sending the package and from where."}
                                {currentStep === 2 && "Enter the destination and recipient details for delivery."}
                                {currentStep === 3 && "Provide details about the package dimensions, weight, and contents."}
                                {currentStep === 4 && "Review all details, select service speed, and checkout."}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 md:p-8 pt-0">
                    {currentStep === 1 && (
                        <div className="grid gap-6 animate-in fade-in slide-in-from-right-8 duration-500">
                            {/* Contact Info */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-2 md:col-span-1">
                                    <Label>Sender Name <span className="text-red-500">*</span></Label>
                                    <Input placeholder="Your Name" value={formData.senderName} onChange={(e) => handleInputChange("senderName", e.target.value)} />
                                </div>
                                <div className="space-y-2 md:col-span-1">
                                    <Label>Phone Number <span className="text-red-500">*</span></Label>
                                    <Input placeholder="10-digit Mobile" type="tel" value={formData.senderPhone} onChange={(e) => handleInputChange("senderPhone", e.target.value)} />
                                </div>
                                <div className="space-y-2 md:col-span-1">
                                    <Label>Email ID</Label>
                                    <Input placeholder="name@example.com" type="email" value={formData.senderEmail} onChange={(e) => handleInputChange("senderEmail", e.target.value)} />
                                </div>
                            </div>

                            <Separator />

                            {/* Address Info */}
                            <div className="grid gap-6">
                                <h4 className="font-semibold flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Pickup Address</h4>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Flat / House No. / Building <span className="text-red-500">*</span></Label>
                                        <Input placeholder="e.g. A-102, Sunshine Apts" value={formData.senderAddressLine1} onChange={(e) => handleInputChange("senderAddressLine1", e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Street / Area / Colony <span className="text-red-500">*</span></Label>
                                        <Input placeholder="e.g. MG Road, Indiranagar" value={formData.senderAddressLine2} onChange={(e) => handleInputChange("senderAddressLine2", e.target.value)} />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Pincode <span className="text-red-500">*</span></Label>
                                        <Input
                                            placeholder="110001"
                                            maxLength={6}
                                            value={formData.senderPincode}
                                            onChange={(e) => handleInputChange("senderPincode", e.target.value)}
                                            className="bg-muted"
                                            readOnly
                                        />
                                        <p className="text-[10px] text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Serviceable</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>City <span className="text-red-500">*</span></Label>
                                        <Input placeholder="e.g. New Delhi" value={formData.senderCity} onChange={(e) => handleInputChange("senderCity", e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>State <span className="text-red-500">*</span></Label>
                                        <Select value={formData.senderState} onValueChange={(val) => handleInputChange("senderState", val)}>
                                            <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Delhi">Delhi</SelectItem>
                                                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                                                <SelectItem value="Karnataka">Karnataka</SelectItem>
                                                <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Landmark (Optional)</Label>
                                    <Input placeholder="e.g. Near Metro Station" value={formData.senderLandmark} onChange={(e) => handleInputChange("senderLandmark", e.target.value)} />
                                </div>
                            </div>

                            <Separator />

                            {/* Schedule */}
                            <div className="grid md:grid-cols-2 gap-6 bg-muted/50 p-4 rounded-xl border border-dashed">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Pickup Date</Label>
                                    <Input type="date" value={formData.pickupDate} onChange={(e) => handleInputChange("pickupDate", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Clock className="h-4 w-4" /> Preferred Time Slot</Label>
                                    <Select value={formData.pickupTime} onValueChange={(val) => handleInputChange("pickupTime", val)}>
                                        <SelectTrigger><SelectValue placeholder="Select Slot" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10-1">10:00 AM - 01:00 PM</SelectItem>
                                            <SelectItem value="1-4">01:00 PM - 04:00 PM</SelectItem>
                                            <SelectItem value="4-7">04:00 PM - 07:00 PM</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="grid gap-6 animate-in fade-in slide-in-from-right-8 duration-500">
                            {/* Receiver Contact Info */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-2 md:col-span-1">
                                    <Label>Receiver Name <span className="text-red-500">*</span></Label>
                                    <Input placeholder="Receiver's Name" value={formData.receiverName} onChange={(e) => handleInputChange("receiverName", e.target.value)} />
                                </div>
                                <div className="space-y-2 md:col-span-1">
                                    <Label>Phone Number <span className="text-red-500">*</span></Label>
                                    <Input placeholder="10-digit Mobile" type="tel" value={formData.receiverPhone} onChange={(e) => handleInputChange("receiverPhone", e.target.value)} />
                                </div>
                                <div className="space-y-2 md:col-span-1">
                                    <Label>Email ID (Optional)</Label>
                                    <Input placeholder="receiver@example.com" type="email" value={formData.receiverEmail} onChange={(e) => handleInputChange("receiverEmail", e.target.value)} />
                                </div>
                            </div>

                            <Separator />

                            {/* Receiver Address Info */}
                            <div className="grid gap-6">
                                <h4 className="font-semibold flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Delivery Address</h4>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Flat / House No. / Building <span className="text-red-500">*</span></Label>
                                        <Input placeholder="e.g. B-404, Moonrise Towers" value={formData.receiverAddressLine1} onChange={(e) => handleInputChange("receiverAddressLine1", e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Street / Area / Colony <span className="text-red-500">*</span></Label>
                                        <Input placeholder="e.g. Linking Road, Bandra" value={formData.receiverAddressLine2} onChange={(e) => handleInputChange("receiverAddressLine2", e.target.value)} />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Pincode <span className="text-red-500">*</span></Label>
                                        <Input
                                            placeholder="400050"
                                            maxLength={6}
                                            value={formData.receiverPincode}
                                            onChange={(e) => handleInputChange("receiverPincode", e.target.value)}
                                            className="bg-muted"
                                            readOnly
                                        />
                                        <p className="text-[10px] text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Serviceable</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>City <span className="text-red-500">*</span></Label>
                                        <Input placeholder="e.g. Mumbai" value={formData.receiverCity} onChange={(e) => handleInputChange("receiverCity", e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>State <span className="text-red-500">*</span></Label>
                                        <Select value={formData.receiverState} onValueChange={(val) => handleInputChange("receiverState", val)}>
                                            <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                                                <SelectItem value="Delhi">Delhi</SelectItem>
                                                <SelectItem value="Karnataka">Karnataka</SelectItem>
                                                <SelectItem value="West Bengal">West Bengal</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Landmark (Optional)</Label>
                                    <Input placeholder="e.g. Behind City Mall" value={formData.receiverLandmark} onChange={(e) => handleInputChange("receiverLandmark", e.target.value)} />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="grid gap-6 animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Package Type</Label>
                                    <Select value={formData.packageType} onValueChange={(val) => handleInputChange("packageType", val)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="box">Box / Carton</SelectItem>
                                            <SelectItem value="envelope">Document / Envelope</SelectItem>
                                            <SelectItem value="bag">Bag / Sack</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select value={formData.category} onValueChange={(val) => handleInputChange("category", val)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="general">General Items</SelectItem>
                                            <SelectItem value="electronics">Electronics</SelectItem>
                                            <SelectItem value="clothing">Clothing & Apparel</SelectItem>
                                            <SelectItem value="books">Books & Documents</SelectItem>
                                            <SelectItem value="home">Home & Kitchen</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label>Weight (kg) <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <Weight className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input className="pl-9" type="number" placeholder="0.5" value={formData.weight} onChange={(e) => handleInputChange("weight", e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Length (cm)</Label>
                                    <Input type="number" placeholder="L" value={formData.length} onChange={(e) => handleInputChange("length", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Width (cm)</Label>
                                    <Input type="number" placeholder="W" value={formData.width} onChange={(e) => handleInputChange("width", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Height (cm)</Label>
                                    <Input type="number" placeholder="H" value={formData.height} onChange={(e) => handleInputChange("height", e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Package Contents Description</Label>
                                <Textarea placeholder="Describe items in detail (e.g. 2 Blue Cotton Shirts, 1 Pair of Shoes)" value={formData.contents} onChange={(e) => handleInputChange("contents", e.target.value)} />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 bg-muted/30 p-4 rounded-xl border">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Fragile Shipment</Label>
                                        <p className="text-xs text-muted-foreground">Does it contain glass or breakables?</p>
                                    </div>
                                    <Switch checked={formData.isFragile} onCheckedChange={(val) => handleInputChange("isFragile", val)} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Get Insurance</Label>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <ShieldCheck className="h-3 w-3" />
                                            <span>Protects against loss/damage (1% fee)</span>
                                        </div>
                                    </div>
                                    <Switch checked={formData.wantsInsurance} onCheckedChange={(val) => handleInputChange("wantsInsurance", val)} />
                                </div>
                            </div>

                            {formData.wantsInsurance && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <Label>Declared Value (₹) <span className="text-red-500">*</span></Label>
                                    <Input type="number" placeholder="Enter value for insurance" value={formData.declaredValue} onChange={(e) => handleInputChange("declaredValue", e.target.value)} />
                                    <p className="text-xs text-muted-foreground mt-1">Insurance premium: ₹ {(parseFloat(formData.declaredValue || "0") * 0.01).toFixed(2)}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Details Review */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2"><Info className="h-4 w-4" /> Shipment Summary</h3>

                                    <div className="bg-muted/40 p-4 rounded-xl space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Route:</span>
                                            <span className="font-medium text-right">{formData.senderCity} <ArrowRight className="h-3 w-3 inline mx-1" /> {formData.receiverCity}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Weight:</span>
                                            <span className="font-medium">{formData.weight} kg {formData.length && `(${formData.length}x${formData.width}x${formData.height} cm)`}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Type:</span>
                                            <span className="font-medium capitalize">{formData.packageType} ({formData.category})</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Pickup:</span>
                                            <span className="font-medium">{formData.pickupDate} ({formData.pickupTime})</span>
                                        </div>
                                        {formData.wantsInsurance && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Insured Value:</span>
                                                <span className="font-medium">₹ {formData.declaredValue}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Service Selection */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2"><Truck className="h-4 w-4" /> Select Service</h3>

                                    <div className="space-y-3">
                                        <div
                                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex justify-between items-center ${formData.serviceType === 'standard' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                                            onClick={() => handleInputChange("serviceType", "standard")}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full text-blue-600">
                                                    <Truck className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold">Standard Delivery</p>
                                                    <p className="text-xs text-muted-foreground">3-5 Business Days</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {/* Base calc for standard */}
                                                <p className="font-bold">₹ {Math.round(100 + (parseFloat(formData.weight || "0") * 50) + (formData.wantsInsurance ? parseFloat(formData.declaredValue || "0") * 0.01 : 0))}</p>
                                            </div>
                                        </div>

                                        <div
                                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex justify-between items-center ${formData.serviceType === 'express' ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20' : 'border-border hover:border-orange-500/50'}`}
                                            onClick={() => handleInputChange("serviceType", "express")}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-full text-orange-600">
                                                    <Clock className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-orange-700 dark:text-orange-400">Express Delivery</p>
                                                    <p className="text-xs text-muted-foreground">1-2 Business Days</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {/* 1.5x Multiplier for express */}
                                                <p className="font-bold text-orange-700 dark:text-orange-400">₹ {Math.round((100 + (parseFloat(formData.weight || "0") * 50)) * 1.5 + (formData.wantsInsurance ? parseFloat(formData.declaredValue || "0") * 0.01 : 0))}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Total Block */}
                            <div className="bg-primary text-primary-foreground p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center shadow-lg">
                                <div className="mb-4 md:mb-0">
                                    <p className="text-primary-foreground/80 text-sm">Total Payable Amount</p>
                                    <h2 className="text-3xl font-bold">₹ {calculatePrice()}</h2>
                                    <p className="text-xs opacity-70">Inclusive of all taxes & insurance charges</p>
                                </div>
                                <div className="space-y-3 w-full md:w-auto">
                                    <div className="flex items-center space-x-2 bg-primary-foreground/10 p-3 rounded-lg">
                                        <Checkbox
                                            id="terms"
                                            className="border-white data-[state=checked]:bg-white data-[state=checked]:text-primary"
                                            checked={formData.agreedToTerms}
                                            onCheckedChange={(val) => handleInputChange("agreedToTerms", val)}
                                        />
                                        <label
                                            htmlFor="terms"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            I agree to the Terms & Conditions
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </CardContent>
                <CardFooter className="flex flex-col items-stretch pt-6 border-t bg-muted/20 md:px-8 px-6 pb-6">
                    {validationError && (
                        <Alert variant="destructive" className="mb-4 animate-in fade-in slide-in-from-bottom-2 bg-red-50 border-red-200">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <div className="ml-2">
                                <AlertTitle className="text-red-800">Validation Error</AlertTitle>
                                <AlertDescription className="text-red-600">{validationError}</AlertDescription>
                            </div>
                        </Alert>
                    )}

                    <div className="flex justify-between w-full">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                if (currentStep === 1) {
                                    setIsPincodeVerified(false);
                                } else {
                                    prevStep();
                                }
                            }}
                            disabled={isSubmitting || isValidating}
                            className="gap-2 h-11"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back
                        </Button>

                        {currentStep < 4 ? (
                            <Button onClick={handleNextStep} disabled={isValidating} className="gap-2 h-11 px-8">
                                {isValidating ? (
                                    <>Checking <Loader2 className="h-4 w-4 animate-spin" /></>
                                ) : (
                                    <>Next Step <ArrowRight className="h-4 w-4" /></>
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !formData.agreedToTerms}
                                className="gap-2 bg-green-600 hover:bg-green-700 h-11 px-8 text-base shadow-lg shadow-green-600/20"
                            >
                                {isSubmitting ? "Processing..." : "Confirm & Pay"}
                                {!isSubmitting && <CheckCircle2 className="h-5 w-5" />}
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
