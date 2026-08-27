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
import { apiClient } from "@/lib/api-client";
import { shipmentApi } from "@/lib/api-services";

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
    const bookingIdempotencyKey = useRef<string>("");
    const quoteRequestSequence = useRef(0);
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
        saveRecipientToMaster: false,
        senderInvoiceNo: "",
        additionalDocNos: "",
        eWayBill: "",
        senderGstin: "",
        receiverGstin: "",
        fovPercentage: "", // Manual FOV override
        attachments: [] as any[]
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
        volumetricWeight: 0,
        codCharge: 0
    });

    // No auto pre-fill — form starts blank, user fills manually or picks from Address Book

    if (!bookingIdempotencyKey.current) {
        bookingIdempotencyKey.current = typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `booking-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    // Update pricing when dimensions, service, payment, or insurance inputs change.
    useEffect(() => {
        const requestSequence = ++quoteRequestSequence.current;
        let active = true;

        const fetchPricing = async () => {
            if (!/^\d{6}$/.test(formData.receiverPincode) || !/^\d{6}$/.test(formData.senderPincode)) {
                return;
            }

            const length = parseFloat(formData.length) || 0;
            const breadth = parseFloat(formData.breadth) || 0;
            const height = parseFloat(formData.height) || 0;
            const weight = parseFloat(formData.weight) || 0;
            if (weight <= 0) return;

            const divisor = session?.user?.volumetricWeightDivisor || 5000;
            const volWeight = (length * breadth * height) / divisor;
            const chargeable = Math.max(weight, volWeight);

            setPricing(p => ({ ...p, volumetricWeight: volWeight, chargeableWeight: chargeable }));
            setIsPricingLoading(true);

            try {
                const data = await apiClient.post<any>("/rates/calculate", {
                    weight,
                    length,
                    breadth,
                    height,
                    serviceType: formData.mode,
                    destPincode: formData.receiverPincode,
                    sourcePincode: formData.senderPincode,
                    declaredValue: parseFloat(formData.declaredValue) || 0,
                    paymentMode: formData.paymentMode,
                    codAmount: formData.paymentMode === "cod"
                        ? parseFloat(formData.codAmount) || 0
                        : 0,
                    insuranceRequested: formData.insuranceRequired === true,
                    fovPercentage: formData.insuranceRequired
                        ? parseFloat(formData.fovPercentage) || null
                        : null
                });

                if (!active || requestSequence !== quoteRequestSequence.current) return;

                setPricing({
                    baseFreight: data.baseFreight,
                    taxAmount: data.gstAmount,
                    netAmount: data.totalAmount,
                    chargeableWeight: data.chargeableWeight,
                    fuelSurcharge: data.fuelSurcharge || 0,
                    odaSurcharge: data.odaSurcharge || 0,
                    insuranceAmount: data.fovCharge || 0,
                    gstRate: data.gstRate || 18,
                    volumetricWeight: volWeight,
                    codCharge: data.codCharge || 0
                });
            } catch (err) {
                if (active && requestSequence === quoteRequestSequence.current) {
                    setValidationError(err instanceof Error ? err.message : "Unable to calculate a quote for this route.");
                }
            } finally {
                if (active && requestSequence === quoteRequestSequence.current) {
                    setIsPricingLoading(false);
                }
            }
        };

        const timer = setTimeout(() => void fetchPricing(), 800);

        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [formData.weight, formData.length, formData.breadth, formData.height, formData.mode, formData.declaredValue, formData.fovPercentage, formData.receiverPincode, formData.senderPincode, formData.insuranceRequired, formData.paymentMode, formData.codAmount, session]);

    // Pincode lookup for Sender City/State
    useEffect(() => {
        if (formData.senderPincode?.length === 6) {
            const fetchPincodeDetails = async () => {
                try {
                    const data = await apiClient.get<any>(
                        `/pincodes/check/${formData.senderPincode}`,
                        { requireAuth: false }
                    );
                    setFormData(prev => ({
                        ...prev,
                        senderCity: data.district || data.city || "",
                        senderState: data.state || ""
                    }));
                } catch (err) {
                    console.error("Sender Pincode lookup failed:", err);
                }
            };
            fetchPincodeDetails();
        }
    }, [formData.senderPincode]);

    // Pincode lookup for Receiver City/State
    useEffect(() => {
        if (formData.receiverPincode?.length === 6) {
            const fetchPincodeDetails = async () => {
                try {
                    const data = await apiClient.get<any>(
                        `/pincodes/check/${formData.receiverPincode}`,
                        { requireAuth: false }
                    );
                    setFormData(prev => ({
                        ...prev,
                        receiverCity: data.district || data.city || "",
                        receiverState: data.state || ""
                    }));
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

    const uploadFiles = async (files: File[]) => {
        const uploadData = new FormData();
        files.forEach(file => uploadData.append('files', file));

        try {
            const data = await apiClient.post<{ files: any[] }>("/shipments/upload", uploadData);
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            return data.files.map((f: any) => ({
                ...f,
                url: f.url.startsWith('http') ? f.url : `${baseUrl}${f.url}`
            })); // Array of {url, originalname, mimetype}
        } catch (error) {
            console.error('Upload Error:', error);
            return [];
        }
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

    const validateParty = (prefix: "sender" | "receiver") => {
        const label = prefix === "sender" ? "Sender" : "Receiver";
        const name = formData[`${prefix}Name`];
        const phone = formData[`${prefix}Phone`];
        const pincode = formData[`${prefix}Pincode`];
        const address = formData[`${prefix}AddressLine1`];
        const email = formData[`${prefix}Email`];
        const gstin = formData[prefix === "sender" ? "senderGstin" : "receiverGstin"];

        if (!name.trim() || address.trim().length < 10) return `${label} name and a complete address are required.`;
        if (!/^[6-9]\d{9}$/.test(phone.trim())) return `Enter a valid 10-digit Indian ${label.toLowerCase()} phone number.`;
        if (!/^\d{6}$/.test(pincode.trim())) return `Enter a valid 6-digit ${label.toLowerCase()} pincode.`;
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return `Enter a valid ${label.toLowerCase()} email address.`;
        if (gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/i.test(gstin.trim())) return `Enter a valid ${label.toLowerCase()} GSTIN.`;
        return null;
    };

    const validateParcel = () => {
        const weight = Number(formData.weight);
        const dimensions = [formData.length, formData.breadth, formData.height];
        const suppliedDimensions = dimensions.filter((value) => String(value).trim() !== "");
        const declaredValue = Number(formData.declaredValue || 0);

        if (!Number.isFinite(weight) || weight <= 0 || weight > 10000) return "Weight must be greater than 0 and no more than 10,000 kg.";
        if (!formData.contents.trim()) return "Parcel contents are required.";
        if (suppliedDimensions.length > 0 && (suppliedDimensions.length !== 3 || dimensions.some((value) => Number(value) <= 0))) return "Enter all three dimensions as positive values, or leave all dimensions blank.";
        if (!Number.isFinite(declaredValue) || declaredValue < 0) return "Declared value cannot be negative.";
        if (formData.insuranceRequired && declaredValue <= 0) return "Declared value must be greater than zero when insurance is selected.";
        if (formData.insuranceRequired && formData.fovPercentage && (Number(formData.fovPercentage) <= 0 || Number(formData.fovPercentage) > 100)) return "FOV percentage must be greater than 0 and no more than 100.";
        return null;
    };

    const validateService = () => {
        if (formData.paymentMode === "cod" && (!Number.isFinite(Number(formData.codAmount)) || Number(formData.codAmount) <= 0)) return "Enter a valid COD collection amount.";
        if (formData.eWayBill && !/^\d{12}$/.test(formData.eWayBill.trim())) return "E-Way Bill number must contain exactly 12 digits.";
        if ((formData.attachments || []).length > 10) return "A maximum of 10 attachments is allowed.";
        if (!formData.agreedToTerms) return "Please accept the terms and conditions before booking.";
        return null;
    };

    const handleNextStep = () => {
        const error = currentStep === 1
            ? validateParty("sender")
            : currentStep === 2
                ? validateParty("receiver")
                : currentStep === 3
                    ? validateParcel()
                    : null;

        if (error) {
            setValidationError(error);
            return;
        }

        setValidationError(null);
        setCurrentStep(prev => Math.min(prev + 1, 4));
    };

    const handleBack = () => {
        setValidationError(null);
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        const error = validateParty("sender") || validateParty("receiver") || validateParcel() || validateService();
        if (error) {
            setValidationError(error);
            return;
        }

        setIsSubmitting(true);
        setValidationError(null);

        try {
            const data = await shipmentApi.book({
                sender: {
                    name: formData.senderName,
                    phone: formData.senderPhone,
                    address: `${formData.senderAddressLine1}${formData.senderAddressLine2 ? ', ' + formData.senderAddressLine2 : ''}${formData.senderLandmark ? ' (Landmark: ' + formData.senderLandmark + ')' : ''}`,
                    pincode: formData.senderPincode,
                    city: formData.senderCity,
                    state: formData.senderState,
                    email: formData.senderEmail,
                    gstin: formData.senderGstin
                },
                receiver: {
                    name: formData.receiverName,
                    phone: formData.receiverPhone,
                    address: `${formData.receiverAddressLine1}${formData.receiverAddressLine2 ? ', ' + formData.receiverAddressLine2 : ''}${formData.receiverLandmark ? ' (Landmark: ' + formData.receiverLandmark + ')' : ''}`,
                    pincode: formData.receiverPincode,
                    city: formData.receiverCity,
                    state: formData.receiverState,
                    email: formData.receiverEmail,
                    gstin: formData.receiverGstin
                },
                weight: parseFloat(formData.weight),
                dimensions: {
                    length: parseFloat(formData.length) || 0,
                    width: parseFloat(formData.breadth) || 0,
                    height: parseFloat(formData.height) || 0
                },
                contents: formData.contents.trim(),
                packageType: formData.packageType as "BOX" | "DOCUMENT" | "PALLET",
                category: formData.category.trim() || "General",
                isFragile: formData.isFragile === true,
                insuranceRequired: formData.insuranceRequired === true,
                fovPercentage: formData.insuranceRequired
                    ? parseFloat(formData.fovPercentage) || null
                    : null,
                paymentMode: formData.paymentMode as "prepaid" | "cod" | "topay" | "credit",
                codAmount: formData.paymentMode === 'cod'
                    ? parseFloat(formData.codAmount) || 0
                    : 0,
                declaredValue: parseFloat(formData.declaredValue) || 0,
                mode: formData.mode as "SURFACE" | "AIR",
                senderInvoiceNo: formData.senderInvoiceNo.trim() || undefined,
                eWayBill: formData.eWayBill.trim() || undefined,
                additionalDocNos: formData.additionalDocNos
                    ? formData.additionalDocNos.split(',').map(s => s.trim()).filter(Boolean)
                    : [],
                attachments: formData.attachments.map((attachment: any) => ({
                    url: attachment.url,
                    type: attachment.type,
                    originalname: attachment.originalname || attachment.name,
                    mimetype: attachment.mimetype,
                    size: Number(attachment.size)
                })),
                termsAccepted: formData.agreedToTerms === true,
                termsVersion: "2026-08-21",
                idempotencyKey: bookingIdempotencyKey.current
            });

            setBookingSuccess(data.awb);
            if (data.pricing) {
                setPricing((current) => ({
                    ...current,
                    ...data.pricing,
                    volumetricWeight: current.volumetricWeight,
                }));
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

                    await apiClient.put(`/customers/${session.user.customerId}`, {
                        receivers: [...(session.user.receivers || []), newReceiver]
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
            <div className="mx-auto max-w-lg py-6 sm:py-10 animate-in fade-in duration-500">
                <Card className="overflow-hidden rounded-2xl border-border/70 text-center shadow-sm">
                    <div className="border-b bg-emerald-500/[0.06] px-5 py-8 sm:px-8">
                        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-600">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
                            Shipment created
                        </p>
                        <h1 className="text-2xl font-semibold tracking-tight">Booking confirmed</h1>
                        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                            Your shipment is registered. Keep the AWB number below for tracking and support.
                        </p>
                    </div>

                    <div className="space-y-5 p-5 sm:p-8">
                        <div className="rounded-xl border bg-muted/30 p-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                AWB number
                            </p>
                            <p className="mt-2 break-all font-mono text-2xl font-semibold tracking-tight text-primary">
                                {bookingSuccess}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button className="w-full gap-2" onClick={() => router.push(`/dashboard/tracking?awb=${bookingSuccess}`)}>
                                <ChevronRight className="h-4 w-4" />
                                Track shipment
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
                                Create another
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl space-y-4 pb-8 sm:space-y-5">
            <WizardHeader session={session} />
            <WizardStepper currentStep={currentStep} steps={STEPS} />

            <div className="grid items-start gap-4 lg:grid-cols-12 lg:gap-6">
                <div className="lg:col-span-8">
                    <Card className="flex min-h-[500px] flex-col overflow-hidden rounded-2xl border-border/70 shadow-sm">
                        <CardHeader className="border-b bg-card px-4 py-4 sm:px-6">
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

                        <CardContent className="flex-1 p-4 sm:p-6">
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
                                    uploadFiles={uploadFiles}
                                />
                            )}

                            {currentStep === 4 && (
                                <Step4Service
                                    formData={formData}
                                    handleInputChange={handleInputChange}
                                    session={session}
                                    uploadFiles={uploadFiles}
                                />
                            )}
                        </CardContent>

                        <CardFooter className="sticky bottom-0 z-10 flex items-center justify-between gap-3 border-t bg-background/95 px-4 py-3 shadow-[0_-4px_12px_-8px_rgba(0,0,0,0.25)] backdrop-blur sm:px-6 sm:py-4">
                            <Button
                                variant="outline"
                                className="gap-2"
                                onClick={handleBack}
                                disabled={currentStep === 1 || isSubmitting}
                            >
                                Back
                            </Button>

                            <div className="flex flex-1 justify-end">
                                {currentStep < 4 ? (
                                    <Button
                                        className="w-full gap-2 sm:w-auto sm:min-w-[150px]"
                                        onClick={handleNextStep}
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button
                                        className="w-full gap-2 sm:w-auto sm:min-w-[180px]"
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
                <div className="lg:sticky lg:top-4 lg:col-span-4">
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
