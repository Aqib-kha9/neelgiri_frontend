"use client";

import { User, Phone, MapPin, CheckCircle2, Star, History } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface Step2ReceiverProps {
    formData: any;
    handleInputChange: (field: string, value: any) => void;
    session: any;
    selectSavedRecipient: (recipientId: string) => void;
}

export function Step2Receiver({ formData, handleInputChange, session, selectSavedRecipient }: Step2ReceiverProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Quick Access Badges for Saved Recipients */}
            {session?.user?.receivers?.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <History className="h-3 w-3" /> Recent Recipients
                        </Label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {session.user.receivers.slice(0, 5).map((rc: any) => {
                            const isSelected = formData.receiverPincode === rc.pincode && formData.receiverName === rc.name;
                            return (
                                <div 
                                    key={rc._id || rc.id}
                                    onClick={() => selectSavedRecipient(rc._id || rc.id)}
                                    className={`px-4 py-2 rounded-full border-2 cursor-pointer transition-all flex items-center gap-2 ${
                                        isSelected 
                                        ? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary/20" 
                                        : "border-border/60 bg-background hover:border-primary/40 text-muted-foreground"
                                    }`}
                                >
                                    <div className={`h-2 w-2 rounded-full ${isSelected ? "bg-primary animate-pulse" : "bg-muted-foreground/30"}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{rc.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                {/* Receiver Identity Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 border-l-4 border-primary pl-3">
                        <h3 className="text-sm font-black uppercase tracking-wider text-foreground">Receiver Information</h3>
                    </div>
                    <div className="space-y-4 p-6 rounded-3xl border border-border/70 bg-muted/20">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Full Name *</Label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 transition-colors group-focus-within:text-primary" />
                                <Input
                                    placeholder="Enter receiver name"
                                    className="h-11 pl-10 rounded-xl border-border/80 bg-background focus:ring-primary/20 font-bold"
                                    value={formData.receiverName}
                                    onChange={(e) => handleInputChange("receiverName", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Contact Number *</Label>
                            <div className="relative group">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 transition-colors group-focus-within:text-primary" />
                                <Input
                                    placeholder="10 digit mobile"
                                    className="h-11 pl-10 rounded-xl border-border/80 bg-background focus:ring-primary/20 font-bold"
                                    type="tel"
                                    maxLength={10}
                                    value={formData.receiverPhone}
                                    onChange={(e) => handleInputChange("receiverPhone", e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shipping Address Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 border-l-4 border-amber-500 pl-3">
                        <h3 className="text-sm font-black uppercase tracking-wider text-foreground">Destination Delivery</h3>
                    </div>
                    <div className="space-y-4 p-6 rounded-3xl border border-border/70 bg-muted/20">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Dest. Pincode *</Label>
                                <Input
                                    placeholder="6 digit code"
                                    className="h-11 rounded-xl border-border/80 bg-background focus:ring-primary/20 font-bold tracking-[0.2em]"
                                    maxLength={6}
                                    value={formData.receiverPincode}
                                    onChange={(e) => handleInputChange("receiverPincode", e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-amber-500 ml-1">Validated City</Label>
                                <div className="h-11 flex items-center px-4 rounded-xl border border-border/80 bg-background/50 font-black text-[10px] text-amber-600 truncate">
                                    {formData.receiverCity || (formData.receiverPincode.length === 6 ? 'VAL_SEQ_02...' : 'AWAIT_LOC')}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Full Shipping Address *</Label>
                            <Input
                                placeholder="Wing, Flat, Building, Street"
                                className="h-11 rounded-xl border-border/80 bg-background focus:ring-primary/20 font-bold"
                                value={formData.receiverAddressLine1}
                                onChange={(e) => handleInputChange("receiverAddressLine1", e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Save to Master Toggle - Professional Style */}
            <Card className="p-4 rounded-2xl border border-border/80 bg-background flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm group hover:border-primary/40 transition-all">
                <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${formData.saveRecipientToMaster ? "bg-primary text-white shadow-brand" : "bg-muted text-muted-foreground"}`}>
                        <Star className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-black text-[11px] uppercase tracking-wider text-foreground">Synchronize with Master Data</p>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">Save this recipient for future high-speed booking recall</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${formData.saveRecipientToMaster ? "text-primary" : "text-muted-foreground"}`}>{formData.saveRecipientToMaster ? 'Active' : 'Disabled'}</span>
                    <Switch
                        checked={formData.saveRecipientToMaster}
                        onCheckedChange={(checked) => handleInputChange("saveRecipientToMaster", checked)}
                    />
                </div>
            </Card>
        </div>
    );
}
