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
                {/* Service Grade Election */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 border-l-4 border-primary pl-3">
                        <h3 className="text-sm font-black uppercase tracking-wider text-foreground">Service Selection</h3>
                    </div>
                    <div className="grid gap-3 p-2">
                        {session?.user?.allowedServices?.includes('SURFACE') && (
                            <Card
                                className={`p-4 cursor-pointer transition-all border-2 flex items-center gap-4 group relative overflow-hidden ${
                                    formData.mode === 'SURFACE' 
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm' 
                                    : 'border-border/60 bg-background hover:border-primary/40 opacity-70 hover:opacity-100'
                                }`}
                                onClick={() => handleInputChange("mode", "SURFACE")}
                            >
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${formData.mode === 'SURFACE' ? 'bg-primary text-white shadow-brand' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                    <Truck className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-black text-sm tracking-tight text-foreground uppercase">Surface Standard</p>
                                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">3-7 Transit Days • Economy</p>
                                </div>
                                {formData.mode === 'SURFACE' && <CheckCircle2 className="h-5 w-5 text-primary" />}
                            </Card>
                        )}

                        {session?.user?.allowedServices?.includes('AIR') && (
                            <Card
                                className={`p-4 cursor-pointer transition-all border-2 flex items-center gap-4 group relative overflow-hidden ${
                                    formData.mode === 'AIR' 
                                    ? 'border-amber-500 bg-amber-500/5 ring-1 ring-amber-500/20 shadow-sm' 
                                    : 'border-border/60 bg-background hover:border-amber-500/40 opacity-70 hover:opacity-100'
                                }`}
                                onClick={() => handleInputChange("mode", "AIR")}
                            >
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${formData.mode === 'AIR' ? 'bg-amber-500 text-white shadow-lg' : 'bg-muted text-muted-foreground group-hover:bg-amber-500/10 group-hover:text-amber-600'}`}>
                                    <Zap className="h-6 w-6 -rotate-12" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-black text-sm tracking-tight text-foreground uppercase">Premium Air Express</p>
                                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">1-3 Transit Days • Priority</p>
                                </div>
                                {formData.mode === 'AIR' && <CheckCircle2 className="h-5 w-5 text-amber-500" />}
                            </Card>
                        )}
                    </div>
                </div>

                {/* Confirmations & Legals */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 border-l-4 border-success pl-3">
                        <h3 className="text-sm font-black uppercase tracking-wider text-foreground">Payment & Confirmation</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <Card
                                className={`p-4 cursor-pointer transition-all border-2 flex flex-col items-center justify-center gap-2 text-center ${
                                    formData.paymentMode === 'prepaid' 
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm' 
                                    : 'border-border/60 bg-background hover:border-primary/40 opacity-70 hover:opacity-100'
                                }`}
                                onClick={() => handleInputChange("paymentMode", "prepaid")}
                            >
                                <CreditCard className={`h-6 w-6 ${formData.paymentMode === 'prepaid' ? 'text-primary' : 'text-muted-foreground'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${formData.paymentMode === 'prepaid' ? 'text-primary' : 'text-muted-foreground'}`}>Prepaid</span>
                            </Card>
                            
                            <Card
                                className={`p-4 cursor-pointer transition-all border-2 flex flex-col items-center justify-center gap-2 text-center ${
                                    formData.paymentMode === 'cod' 
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm' 
                                    : 'border-border/60 bg-background hover:border-primary/40 opacity-70 hover:opacity-100'
                                }`}
                                onClick={() => handleInputChange("paymentMode", "cod")}
                            >
                                <Banknote className={`h-6 w-6 ${formData.paymentMode === 'cod' ? 'text-primary' : 'text-muted-foreground'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${formData.paymentMode === 'cod' ? 'text-primary' : 'text-muted-foreground'}`}>Cash on Delivery</span>
                            </Card>
                        </div>

                        {formData.paymentMode === 'cod' && (
                            <div className="mb-6 space-y-2 animate-in fade-in slide-in-from-top-2">
                                <Label htmlFor="codAmount" className="text-xs font-black uppercase tracking-widest text-foreground">Collect on Delivery (COD) Amount *</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <Input
                                        id="codAmount"
                                        type="number"
                                        placeholder="0.00"
                                        className="pl-9 h-12 bg-background border-border/70 rounded-xl text-lg font-bold"
                                        value={formData.codAmount}
                                        onChange={(e) => handleInputChange("codAmount", e.target.value)}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Amount to be collected from receiver</p>
                            </div>
                        )}

                        <Card className={`p-5 rounded-2xl border-2 transition-all flex flex-col gap-4 group ${formData.agreedToTerms ? 'border-success/30 bg-success/5 shadow-inner' : 'border-border/60 bg-background'}`}>
                            <div className="flex items-start gap-4">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${formData.agreedToTerms ? 'bg-success text-white shadow-brand' : 'bg-muted text-muted-foreground'}`}>
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground leading-tight">I acknowledge the Insurance Policy and Cargo Liability terms for this shipment.</p>
                                    <p className="text-[9px] font-bold text-muted-foreground mt-1 uppercase">Binding legal acknowledgement required to proceed</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-border/40">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${formData.agreedToTerms ? 'text-success' : 'text-muted-foreground'}`}>{formData.agreedToTerms ? 'Terms Accepted' : 'Agreement Required'}</span>
                                <Switch
                                    checked={formData.agreedToTerms}
                                    onCheckedChange={(checked) => handleInputChange("agreedToTerms", checked)}
                                    className="data-[state=checked]:bg-success"
                                />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
