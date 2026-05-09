"use client";

import { Truck, Zap, CheckCircle2, ShieldCheck, CreditCard, Banknote, IndianRupee } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface Step4ServiceProps {
    formData: any;
    handleInputChange: (field: string, value: any) => void;
    session: any;
}

export function Step4Service({ formData, handleInputChange, session }: Step4ServiceProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground border-b pb-2">Service Selection</h3>
                    <div className="grid gap-3">
                        {(!session?.user?.allowedServices || session.user.allowedServices.length === 0 || session.user.allowedServices.includes('SURFACE')) && (
                            <Card
                                className={`p-4 cursor-pointer transition-all border flex items-center gap-4 ${
                                    formData.mode === 'SURFACE' 
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                                    : 'hover:border-primary/40 bg-background'
                                }`}
                                onClick={() => handleInputChange("mode", "SURFACE")}
                            >
                                <div className={`h-10 w-10 rounded-md flex items-center justify-center ${formData.mode === 'SURFACE' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                    <Truck className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm text-foreground">Surface Standard</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">3-7 Transit Days • Economy</p>
                                </div>
                                {formData.mode === 'SURFACE' && <CheckCircle2 className="h-5 w-5 text-primary" />}
                            </Card>
                        )}

                        {(!session?.user?.allowedServices || session.user.allowedServices.length === 0 || session.user.allowedServices.includes('AIR')) && (
                            <Card
                                className={`p-4 cursor-pointer transition-all border flex items-center gap-4 ${
                                    formData.mode === 'AIR' 
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                                    : 'hover:border-primary/40 bg-background'
                                }`}
                                onClick={() => handleInputChange("mode", "AIR")}
                            >
                                <div className={`h-10 w-10 rounded-md flex items-center justify-center ${formData.mode === 'AIR' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                    <Zap className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm text-foreground">Premium Air Express</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">1-3 Transit Days • Priority</p>
                                </div>
                                {formData.mode === 'AIR' && <CheckCircle2 className="h-5 w-5 text-primary" />}
                            </Card>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground border-b pb-2">Payment & Confirmation</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <Card
                                className={`p-4 cursor-pointer transition-all border flex flex-col items-center justify-center gap-2 text-center ${
                                    formData.paymentMode === 'prepaid' 
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                                    : 'hover:border-primary/40 bg-background'
                                }`}
                                onClick={() => handleInputChange("paymentMode", "prepaid")}
                            >
                                <CreditCard className={`h-5 w-5 ${formData.paymentMode === 'prepaid' ? 'text-primary' : 'text-muted-foreground'}`} />
                                <span className={`text-xs font-medium ${formData.paymentMode === 'prepaid' ? 'text-primary' : 'text-muted-foreground'}`}>Prepaid</span>
                            </Card>
                            
                            <Card
                                className={`p-4 cursor-pointer transition-all border flex flex-col items-center justify-center gap-2 text-center ${
                                    formData.paymentMode === 'topay' 
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                                    : 'hover:border-primary/40 bg-background'
                                }`}
                                onClick={() => handleInputChange("paymentMode", "topay")}
                            >
                                <Banknote className={`h-5 w-5 ${formData.paymentMode === 'topay' ? 'text-primary' : 'text-muted-foreground'}`} />
                                <span className={`text-xs font-medium ${formData.paymentMode === 'topay' ? 'text-primary' : 'text-muted-foreground'}`}>To Pay</span>
                            </Card>
                        </div>



                        <Card className={`p-4 flex flex-col gap-4 ${formData.agreedToTerms ? 'bg-primary/5 border-primary/20' : ''}`}>
                            <div className="flex items-start gap-4">
                                <div className={`h-10 w-10 rounded-md flex items-center justify-center shrink-0 ${formData.agreedToTerms ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">Terms & Conditions</p>
                                    <p className="text-xs text-muted-foreground mt-1">I acknowledge the Insurance Policy and Cargo Liability terms for this shipment.</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t">
                                <span className="text-sm font-medium">{formData.agreedToTerms ? 'Accepted' : 'Required'}</span>
                                <Switch
                                    checked={formData.agreedToTerms}
                                    onCheckedChange={(checked) => handleInputChange("agreedToTerms", checked)}
                                />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
