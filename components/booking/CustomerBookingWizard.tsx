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
    AlertTriangle,
    ChevronRight,
    ChevronLeft,
    Truck,
    Loader2,
    Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

// Extracted Wizard Components
import { WizardHeader } from "./wizard-parts/WizardHeader";
import { WizardStepper } from "./wizard-parts/WizardStepper";
import { Step1Sender } from "./wizard-parts/Step1Sender";
import { Step2Receiver } from "./wizard-parts/Step2Receiver";
import { Step3Parcel } from "./wizard-parts/Step3Parcel";
import { Step4Service } from "./wizard-parts/Step4Service";
import { LiveQuoteSidebar } from "./wizard-parts/LiveQuoteSidebar";


const STEPS = [
    { id: 1, label: "Sender & Pickup", icon: User },
    { id: 2, label: "Receiver & Address", icon: MapPin },
    { id: 3, label: "Parcel Characteristics", icon: Package },
    { id: 4, label: "Service & Review", icon: Truck },
];

export default function CustomerBookingWizard() {
    const { session } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState<null | string>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [isPricingLoading, setIsPricingLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Sender details
        senderName: session?.user?.name || "",
        senderPhone: "",
        senderEmail: session?.user?.email || "",
        senderAddressLine1: "",
        senderAddressLine2: "",
        senderLandmark: "",
        senderPincode: session?.user?.pincode || "",
        senderCity: session?.user?.city || "",
        senderState: "",

        // Receiver details
        receiverName: "",
        receiverPhone: "",
        receiverEmail: "",
        receiverAddressLine1: "",
        receiverAddressLine2: "",
        receiverLandmark: "",
        receiverPincode: "",
        receiverCity: "",
        receiverState: "",

        // Parcel details
        weight: "",
        length: "",
        breadth: "",
        height: "",
        contents: "",
        declaredValue: "",
        insuranceRequired: false,
        isFragile: false,
        packageType: "BOX",
        category: "General",

        // Service & Payment
        mode: "SURFACE", // SURFACE | AIR
        paymentMode: "prepaid",
        codAmount: "",
        agreedToTerms: false,
        saveRecipientToMaster: false
    });

    const [pricing, setPricing] = useState({
        baseFreight: 0,
        taxAmount: 0,
        netAmount: 0,
        chargeableWeight: 0,
        fuelSurcharge: 0,
        odaSurcharge: 0,
        insuranceAmount: 0,
        gstRate: 18,
        volumetricWeight: 0
    });

    // 1. Initial Pre-fill from Session
    useEffect(() => {
        if (session?.user) {
            setFormData(prev => ({
                ...prev,
                senderName: session.user.name || prev.senderName,
                senderPhone: session.user.phone || session.user.mobileNo || prev.senderPhone,
                senderEmail: session.user.email || prev.senderEmail,
                senderPincode: session.user.pincode || prev.senderPincode,
                senderCity: session.user.city || prev.senderCity,
                senderAddressLine1: session.user.address || prev.senderAddressLine1,
            }));
        }
    }, [session]);

    // Update pricing when dimensions or weight change
    useEffect(() => {
        const fetchPricing = async () => {
            if (!formData.weight || !formData.receiverPincode || formData.receiverPincode.length < 6 || !formData.senderPincode || formData.senderPincode.length < 6) {
                return;
            }

            // Calculate Volumetric Weight for UI hint
            const length = parseFloat(formData.length) || 0;
            const breadth = parseFloat(formData.breadth) || 0;
            const height = parseFloat(formData.height) || 0;
            const weight = parseFloat(formData.weight) || 0;
            const divisor = session?.user?.volumetricWeightDivisor || 5000;
            const volWeight = (length * breadth * height) / divisor;
            const chargeable = Math.max(weight, volWeight);

            setPricing(p => ({ ...p, volumetricWeight: volWeight, chargeableWeight: chargeable }));

            setIsPricingLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("/api/rates/calculate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        weight: weight,
                        length: length,
                        breadth: breadth,
                        height: height,
                        serviceType: formData.mode,
                        destPincode: formData.receiverPincode,
                        sourcePincode: formData.senderPincode,
                        declaredValue: parseFloat(formData.declaredValue) || 0,
                        insuranceRequested: formData.insuranceRequired,
                        customerType: session?.user?.role === 'customer' ? 'CUSTOMER' : 'WALK-IN'
                    }),
                });

                const data = await response.json();
                if (response.ok) {
                    setPricing({
                        baseFreight: data.baseFreight,
                        taxAmount: data.gstAmount,
                        netAmount: data.totalAmount,
                        chargeableWeight: data.chargeableWeight,
                        fuelSurcharge: data.fuelSurcharge || 0,
                        odaSurcharge: data.odaSurcharge || 0,
                        insuranceAmount: data.insuranceAmount || 0,
                        gstRate: data.gstRate || 18,
                        volumetricWeight: volWeight
                    });
                    setValidationError(null);
                } else {
                    setValidationError(data.message || "Pricing calculation failed");
                }
            } catch (err) {
                console.error("Pricing error:", err);
            } finally {
                setIsPricingLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchPricing();
        }, 800);

        return () => clearTimeout(timer);
    }, [formData.weight, formData.length, formData.breadth, formData.height, formData.mode, formData.declaredValue, formData.receiverPincode, formData.senderPincode, formData.insuranceRequired, session]);

    // Pincode lookup for Sender City/State
    useEffect(() => {
        if (formData.senderPincode.length === 6) {
            const fetchPincodeDetails = async () => {
                try {
                    const response = await fetch(`/api/pincodes/check/${formData.senderPincode}`);
                    if (response.ok) {
                        const data = await response.json();
                        setFormData(prev => ({
                            ...prev,
                            senderCity: data.district || data.city || "",
                            senderState: data.state || ""
                        }));
                    }
                } catch (err) {
                    console.error("Sender Pincode lookup failed:", err);
                }
            };
            fetchPincodeDetails();
        }
    }, [formData.senderPincode]);

    // Pincode lookup for Receiver City/State
    useEffect(() => {
        if (formData.receiverPincode.length === 6) {
            const fetchPincodeDetails = async () => {
                try {
                    const response = await fetch(`/api/pincodes/check/${formData.receiverPincode}`);
                    if (response.ok) {
                        const data = await response.json();
                        setFormData(prev => ({
                            ...prev,
                            receiverCity: data.district || data.city || "",
                            receiverState: data.state || ""
                        }));
                    }
                } catch (err) {
                    console.error("Receiver Pincode lookup failed:", err);
                }
            };
            fetchPincodeDetails();
        }
    }, [formData.receiverPincode]);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (validationError) setValidationError(null);
    };

    const selectSavedPickup = (pickupId: string) => {
        const pickup = session?.user?.pickupLocations?.find(p => p.id === pickupId || p._id === pickupId);
        if (pickup) {
            setFormData(prev => ({
                ...prev,
                senderName: pickup.contactPerson || pickup.name || prev.senderName,
                senderPhone: pickup.mobileNo || prev.senderPhone,
                senderPincode: pickup.pincode || prev.senderPincode,
                senderCity: pickup.city || prev.senderCity,
                senderAddressLine1: pickup.address || prev.senderAddressLine1
            }));
        }
    };

    const selectSavedRecipient = (recipientId: string) => {
        const rc = session?.user?.receivers?.find(r => r.id === recipientId || r._id === recipientId);
        if (rc) {
            setFormData(prev => ({
                ...prev,
                receiverName: rc.name || prev.receiverName,
                receiverPhone: rc.mobileNo || rc.phone || prev.receiverPhone,
                receiverPincode: rc.pincode || prev.receiverPincode,
                receiverCity: rc.city || prev.receiverCity,
                receiverEmail: rc.email || prev.receiverEmail,
                receiverAddressLine1: rc.address || prev.receiverAddressLine1
            }));
        }
    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            if (!formData.senderName || !formData.senderPhone || !formData.senderPincode || !formData.senderAddressLine1) {
                setValidationError("Please fill in all required sender details.");
                return;
            }
        }
        if (currentStep === 2) {
            if (!formData.receiverName || !formData.receiverPhone || !formData.receiverPincode || !formData.receiverAddressLine1) {
                setValidationError("Please fill in all required receiver details.");
                return;
            }
        }
        if (currentStep === 3) {
            if (!formData.weight || parseFloat(formData.weight) <= 0) {
                setValidationError("Please enter a valid weight.");
                return;
            }
        }
        setValidationError(null);
        setCurrentStep(prev => Math.min(prev + 1, 4));
    };

    const handleBack = () => {
        setValidationError(null);
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        if (!formData.agreedToTerms) return;
        
        if (formData.paymentMode === "cod") {
            if (!formData.codAmount || parseFloat(formData.codAmount) <= 0) {
                setValidationError("A valid Collect on Delivery (COD) amount is required.");
                return;
            }
            if (parseFloat(formData.codAmount) > 50000) {
                setValidationError("Maximum allowable COD amount is ₹50,000.");
                return;
            }
        }

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
                    sender: {
                        name: formData.senderName,
                        phone: formData.senderPhone,
                        address: `${formData.senderAddressLine1}${formData.senderAddressLine2 ? ', ' + formData.senderAddressLine2 : ''}${formData.senderLandmark ? ' (Landmark: ' + formData.senderLandmark + ')' : ''}`,
                        pincode: formData.senderPincode,
                        city: formData.senderCity,
                        state: formData.senderState,
                        email: formData.senderEmail
                    },
                    receiver: {
                        name: formData.receiverName,
                        phone: formData.receiverPhone,
                        address: `${formData.receiverAddressLine1}${formData.receiverAddressLine2 ? ', ' + formData.receiverAddressLine2 : ''}${formData.receiverLandmark ? ' (Landmark: ' + formData.receiverLandmark + ')' : ''}`,
                        pincode: formData.receiverPincode,
                        city: formData.receiverCity,
                        state: formData.receiverState,
                        email: formData.receiverEmail
                    },
                    weight: parseFloat(formData.weight),
                    dimensions: {
                        length: parseFloat(formData.length) || 0,
                        width: parseFloat(formData.breadth) || 0,
                        height: parseFloat(formData.height) || 0
                    },
                    contents: formData.contents,
                    paymentMode: formData.paymentMode,
                    codAmount: formData.paymentMode === 'cod' ? (parseFloat(formData.codAmount) || 0) : 0,
                    declaredValue: parseFloat(formData.declaredValue) || 0,
                    mode: formData.mode
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create booking");
            }

            setBookingSuccess(data.awb);
            if (data.pricing) {
                setPricing(data.pricing);
            }

            // Save to Master Data if requested
            if (formData.saveRecipientToMaster && session?.user?.customerId) {
                try {
                    const newReceiver = {
                        name: formData.receiverName,
                        mobileNo: formData.receiverPhone,
                        address: `${formData.receiverAddressLine1}${formData.receiverAddressLine2 ? ', ' + formData.receiverAddressLine2 : ''}`,
                        city: formData.receiverCity,
                        pincode: formData.receiverPincode,
                        email: formData.receiverEmail
                    };

                    await fetch(`/api/customers/${session.user.customerId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            receivers: [...(session.user.receivers || []), newReceiver]
                        }),
                    });
                } catch (err) {
                    console.error("Failed to save recipient to master data:", err);
                }
            }
        } catch (error: any) {
            setValidationError(error.message || "Failed to create booking. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (bookingSuccess) {
        return (
            <div className="space-y-6 animate-in fade-in duration-700">
                <section className="rounded-3xl border border-border/70 bg-card p-10 shadow-card text-center">
                    <div className="mx-auto w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6 border-4 border-background shadow-brand">
                        <CheckCircle2 className="h-10 w-10 text-success" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2 italic">Booking Confirmed!</h1>
                    <p className="text-muted-foreground font-medium max-w-md mx-auto mb-8">
                        Your shipment has been successfully registered. You can track it using the AWB number below.
                    </p>

                    <div className="bg-muted/30 p-8 rounded-3xl border border-border/50 inline-block text-left w-full max-w-sm mx-auto shadow-inner">
                        <div className="flex justify-between items-center mb-4">
                            <Badge variant="outline" className="rounded-full px-3 py-1 bg-background text-[10px] font-black tracking-widest">AWB NUMBER</Badge>
                            <Badge className="bg-success text-white border-none rounded-full px-3 py-1 text-[10px] font-black">Ready for Pickup</Badge>
                        </div>
                        <p className="text-4xl font-mono font-black text-primary tracking-tighter mb-4">{bookingSuccess}</p>
                        <Separator className="my-4 opacity-50" />
                        <div className="flex justify-between text-sm items-center font-bold">
                            <span className="text-muted-foreground uppercase text-[10px] tracking-widest">Estimated Total</span>
                            <span className="text-2xl text-foreground tabular-nums">₹{pricing.netAmount}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
                        <Button className="rounded-xl h-12 px-8 font-black shadow-brand gap-2 uppercase tracking-widest text-[10px]" onClick={() => router.push(`/dashboard/tracking?awb=${bookingSuccess}`)}>
                            Track Shipment <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="rounded-xl h-12 px-8 border-border/70 font-black uppercase tracking-widest text-[10px]" onClick={() => window.location.reload()}>
                            New Booking
                        </Button>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="space-y-6 min-h-screen bg-transparent pb-10">
            {/* Standard Dashboard Page Header */}
            <WizardHeader session={session} />

            {/* Progress Tracker Layer */}
            <WizardStepper 
                currentStep={currentStep} 
                steps={STEPS} 
            />

            {/* Application Core Layout */}
            <div className="grid lg:grid-cols-12 gap-6 items-start">
                
                {/* Workflow Terminal (Primary Form) */}
                <div className="lg:col-span-8">
                    <Card className="rounded-3xl border border-border/70 shadow-card bg-card overflow-hidden min-h-[600px] flex flex-col relative">
                        <CardHeader className="p-8 border-b border-border/50 bg-muted/20">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                                    {(() => {
                                        const Icon = STEPS[currentStep - 1].icon;
                                        return <Icon className="h-6 w-6" />
                                    })()}
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-[.2em] text-primary mb-0.5">Protocol Stage 0{currentStep}</p>
                                    <h2 className="text-2xl font-black tracking-tight text-foreground uppercase">{STEPS[currentStep - 1].label}</h2>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-8 flex-1">
                            {validationError && (
                                <Alert variant="destructive" className="mb-6 rounded-xl border-2 bg-destructive/5 animate-in slide-in-from-top-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle className="font-black text-[10px] uppercase tracking-widest">Entry Error</AlertTitle>
                                    <AlertDescription className="font-bold text-xs">{validationError}</AlertDescription>
                                </Alert>
                            )}

                            {currentStep === 1 && (
                                <Step1Sender 
                                    formData={formData} 
                                    handleInputChange={handleInputChange} 
                                    session={session} 
                                    setFormData={setFormData}
                                    selectSavedPickup={selectSavedPickup}
                                />
                            )}

                            {currentStep === 2 && (
                                <Step2Receiver 
                                    formData={formData} 
                                    handleInputChange={handleInputChange} 
                                    session={session} 
                                    selectSavedRecipient={selectSavedRecipient}
                                />
                            )}

                            {currentStep === 3 && (
                                <Step3Parcel 
                                    formData={formData} 
                                    handleInputChange={handleInputChange} 
                                    pricing={pricing} 
                                    session={session}
                                />
                            )}

                            {currentStep === 4 && (
                                <Step4Service 
                                    formData={formData} 
                                    handleInputChange={handleInputChange} 
                                    session={session} 
                                />
                            )}
                        </CardContent>          

                        <CardFooter className="p-8 bg-muted/30 border-t border-border/50 flex flex-col sm:flex-row justify-between gap-4">
                            <Button
                                variant="outline"
                                className="h-12 rounded-xl gap-2 font-black px-8 border-border/70 bg-background hover:bg-muted text-foreground transition-all uppercase tracking-widest text-[10px] disabled:opacity-30"
                                onClick={handleBack}
                                disabled={currentStep === 1 || isSubmitting}
                            >
                                <ChevronLeft className="h-4 w-4" /> Previous
                            </Button>

                            <div className="flex-1 max-w-sm sm:w-[320px]">
                                {currentStep < 4 ? (
                                    <Button
                                        className="w-full h-12 rounded-xl gap-2 font-black shadow-brand group transition-all duration-300 uppercase tracking-widest text-[11px]"
                                        onClick={handleNextStep}
                                    >
                                        Next Stage <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                ) : (
                                    <Button
                                        className={`w-full h-12 rounded-xl gap-3 font-black shadow-brand group transition-all duration-500 uppercase tracking-widest text-[11px] ${formData.agreedToTerms ? "bg-success hover:bg-success/90 text-white shadow-success/20 ring-4 ring-success/10" : "opacity-50"}`}
                                        onClick={handleSubmit}
                                        disabled={!formData.agreedToTerms || isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Finalizing Booking...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Confirm & Generate</span>
                                                <Sparkles className="h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                {/* Persistent Insights & Live Quote Terminal */}
                <div className="lg:col-span-4 sticky top-6">
                    <LiveQuoteSidebar 
                        pricing={pricing} 
                        formData={formData} 
                        session={session} 
                        isPricingLoading={isPricingLoading} 
                    />
                </div>
            </div>
        </div>
    );
}
