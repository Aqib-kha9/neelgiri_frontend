"use client";

import { useState, useEffect, useRef } from "react";
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
        senderName: "",
        senderPhone: "",
        senderEmail: "",
        senderAddressLine1: "",
        senderAddressLine2: "",
        senderLandmark: "",
        senderPincode: "",
        senderCity: "",
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

    // No auto pre-fill — form starts blank, user fills manually or picks from Address Book

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
            <div className="max-w-md mx-auto mt-12 space-y-6 animate-in fade-in duration-500">
                <Card className="text-center p-8">
                    <div className="mx-auto w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-semibold mb-2">Booking Confirmed</h1>
                    <p className="text-muted-foreground text-sm mb-8">
                        Your shipment has been successfully registered. You can track it using the AWB number below.
                    </p>

                    <div className="bg-muted/50 p-6 rounded-lg mb-8">
                        <p className="text-sm font-medium text-muted-foreground mb-2">AWB NUMBER</p>
                        <p className="text-2xl font-mono font-semibold text-primary">{bookingSuccess}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button className="w-full" onClick={() => router.push(`/dashboard/tracking?awb=${bookingSuccess}`)}>
                            Track Shipment
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
                            New Booking
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <WizardHeader session={session} />
            <WizardStepper currentStep={currentStep} steps={STEPS} />

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8">
                    <Card className="flex flex-col min-h-[500px]">
                        <CardHeader className="border-b px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 text-primary rounded-md">
                                    {(() => {
                                        const Icon = STEPS[currentStep - 1].icon;
                                        return <Icon className="h-5 w-5" />
                                    })()}
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Step {currentStep} of {STEPS.length}</p>
                                    <h2 className="text-lg font-semibold">{STEPS[currentStep - 1].label}</h2>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 flex-1">
                            {validationError && (
                                <Alert variant="destructive" className="mb-6">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{validationError}</AlertDescription>
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

                        <CardFooter className="px-6 py-4 border-t flex items-center justify-between gap-4 bg-muted/20">
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                disabled={currentStep === 1 || isSubmitting}
                            >
                                Back
                            </Button>

                            <div className="flex-1 max-w-[200px]">
                                {currentStep < 4 ? (
                                    <Button
                                        className="w-full"
                                        onClick={handleNextStep}
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button
                                        className="w-full"
                                        onClick={handleSubmit}
                                        disabled={!formData.agreedToTerms || isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processing
                                            </>
                                        ) : (
                                            "Confirm Booking"
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
