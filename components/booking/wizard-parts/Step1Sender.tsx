"use client";

import { User, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface Step1SenderProps {
    formData: any;
    handleInputChange: (field: string, value: any) => void;
    session: any;
    setFormData: any;
    selectSavedPickup: (pickupId: string) => void;
}

export function Step1Sender({ formData, handleInputChange, session, selectSavedPickup }: Step1SenderProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Quick Select Pickup Section */}
            {session?.user?.pickupLocations?.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <MapPin className="h-3 w-3" /> Frequent Pickup Points
                        </Label>
                        <span className="text-[9px] font-bold text-muted-foreground italic">Select to auto-fill</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {session.user.pickupLocations.slice(0, 3).map((p: any) => {
                            const isSelected = formData.senderPincode === p.pincode && formData.senderAddressLine1 === p.address;
                            return (
                                <Card 
                                    key={p._id || p.id}
                                    onClick={() => selectSavedPickup(p._id || p.id)}
                                    className={`p-3 cursor-pointer transition-all border-2 flex items-center gap-3 relative overflow-hidden group ${
                                        isSelected 
                                        ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm" 
                                        : "border-border/60 bg-background hover:border-primary/40 hover:bg-muted/30"
                                    }`}
                                >
                                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"}`}>
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-black truncate uppercase tracking-tight text-foreground">{p.name || 'Branch Point'}</p>
                                        <p className="text-[9px] text-muted-foreground truncate font-bold">{p.city}, {p.pincode}</p>
                                    </div>
                                    {isSelected && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                {/* Sender Identity Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 border-l-4 border-primary pl-3">
                        <h3 className="text-sm font-black uppercase tracking-wider text-foreground">Sender Information</h3>
                    </div>
                    <div className="space-y-4 p-6 rounded-3xl border border-border/70 bg-muted/20">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Full Name or Entity *</Label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 transition-colors group-focus-within:text-primary" />
                                <Input
                                    placeholder="Deepanshu Logistics..."
                                    className="h-11 pl-10 rounded-xl border-border/80 bg-background focus:ring-primary/20 font-bold"
                                    value={formData.senderName}
                                    onChange={(e) => handleInputChange("senderName", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Contact Number *</Label>
                            <div className="relative group">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 transition-colors group-focus-within:text-primary" />
                                <Input
                                    placeholder="10 digit mobile number"
                                    className="h-11 pl-10 rounded-xl border-border/80 bg-background focus:ring-primary/20 font-bold"
                                    type="tel"
                                    maxLength={10}
                                    value={formData.senderPhone}
                                    onChange={(e) => handleInputChange("senderPhone", e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pickup Address Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 border-l-4 border-success pl-3">
                        <h3 className="text-sm font-black uppercase tracking-wider text-foreground">Pickup Location</h3>
                    </div>
                    <div className="space-y-4 p-6 rounded-3xl border border-border/70 bg-muted/20">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Zip/Pincode *</Label>
                                <Input
                                    placeholder="6 digit code"
                                    className="h-11 rounded-xl border-border/80 bg-background focus:ring-primary/20 font-bold tracking-[0.2em]"
                                    maxLength={6}
                                    value={formData.senderPincode}
                                    onChange={(e) => handleInputChange("senderPincode", e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-success/70 ml-1">Validated Hub</Label>
                                <div className="h-11 flex items-center px-4 rounded-xl border border-border/80 bg-background/50 font-black text-[10px] text-success truncate">
                                    {formData.senderCity || (formData.senderPincode.length === 6 ? 'VAL_SEQ_01...' : 'AWAIT_LOC')}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Detailed Address *</Label>
                            <Input
                                placeholder="Floor, Building, Area"
                                className="h-11 rounded-xl border-border/80 bg-background focus:ring-primary/20 font-bold"
                                value={formData.senderAddressLine1}
                                onChange={(e) => handleInputChange("senderAddressLine1", e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
