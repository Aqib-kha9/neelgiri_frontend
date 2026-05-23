"use client";

import { useState } from "react";
import { User, Phone, MapPin, CheckCircle2, Mail, Shield, Loader2, History, Star } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { GooglePlacesAutocomplete } from "./GooglePlacesAutocomplete";

interface Step2ReceiverProps {
    formData: any;
    handleInputChange: (field: string, value: any) => void;
    session: any;
    selectSavedRecipient: (recipientId: string) => void;
}

export function Step2Receiver({ formData, handleInputChange, session, selectSavedRecipient }: Step2ReceiverProps) {
    const [isFetching, setIsFetching] = useState(false);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {session?.user?.receivers?.length > 0 && (
                <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <Label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                        <History className="h-4 w-4 text-primary" /> Saved Receivers (Address Book)
                    </Label>
                    <Select onValueChange={(val) => selectSavedRecipient(val)}>
                        <SelectTrigger className="bg-background h-auto py-2">
                            <SelectValue placeholder="Select a receiver to auto-fill details..." />
                        </SelectTrigger>
                        <SelectContent>
                            {session.user.receivers.map((rc: any) => (
                                <SelectItem key={rc._id || rc.id} value={rc._id || rc.id} className="py-2">
                                    <div className="flex flex-col text-left items-start">
                                        <span className="font-medium">{rc.name}</span>
                                        <span className="text-xs text-muted-foreground mt-0.5">{rc.city}, {rc.pincode} - {rc.address}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground border-b pb-2">Receiver Information</h3>
                    
                    <div className="space-y-2 p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                        <Label className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                            <Shield className="h-4 w-4" /> Smart Fetch via GSTIN
                        </Label>
                        <div className="flex gap-2">
                            <Input 
                                placeholder="Enter 15-digit GSTIN"
                                value={formData.receiverGstin || ""}
                                onChange={(e) => handleInputChange("receiverGstin", e.target.value)}
                                onBlur={(e) => handleInputChange("receiverGstin", e.target.value.toUpperCase())}
                                className="border-blue-200 bg-white focus:border-blue-400 font-mono uppercase"
                                maxLength={15}
                            />
                            <Button 
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={isFetching}
                                className="border-blue-300 text-blue-700 bg-white hover:bg-blue-50 shrink-0 min-w-[70px]"
                                onClick={async () => {
                                    const gstin = (formData.receiverGstin || "").trim().toUpperCase();
                                    if (gstin.length !== 15) {
                                        alert("Please enter a valid 15-digit GSTIN");
                                        return;
                                    }
                                    setIsFetching(true);
                                    try {
                                        const token = localStorage.getItem("token");
                                        const res = await fetch(`/api/shipments/compliance/gstin/${gstin}`, {
                                            headers: { Authorization: `Bearer ${token}` }
                                        });
                                        const data = await res.json();
                                        
                                        // CORRECT MAPPING: Sandbox returns { data: { data: { ... } } }
                                        const biz = data.data?.data || data.data; 

                                        if (res.ok && biz) {
                                            handleInputChange("receiverName", (biz.lgnm || biz.trade_name || biz.tradeNam || "").toString());
                                            
                                            // Construct address from pradr (Primary Address)
                                            const addr = biz.pradr?.addr || {};
                                            const formattedAddr = `${addr.bnm || ''} ${addr.bno || ''} ${addr.flno || ''} ${addr.loc || ''} ${addr.locality || ''} ${addr.st || ''}`.replace(/\s+/g, ' ').trim();
                                            
                                            handleInputChange("receiverAddressLine1", formattedAddr || "");
                                            handleInputChange("receiverPincode", (addr.pncd || "").toString());
                                            handleInputChange("receiverCity", (addr.dst || "").toString());
                                            handleInputChange("receiverState", (addr.stcd || "").toString());
                                            
                                            alert("Success: Details populated!");
                                        } else {
                                            alert(`Error: ${data.message || "GSTIN details not found"}`);
                                        }
                                    } catch (err) {
                                        console.error("GST Fetch failed", err);
                                        alert("Failed to connect to verification service");
                                    } finally {
                                        setIsFetching(false);
                                    }
                                }}
                            >
                                {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Fetch"}
                            </Button>
                        </div>
                        <p className="text-[10px] text-blue-600">Instantly fetch business name and address from Government database.</p>
                    </div>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-muted-foreground/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or Search via Google</span>
                        </div>
                    </div>
                    
                    <div className="mb-2">
                        <GooglePlacesAutocomplete 
                            onSelect={(details) => {
                                // Don't auto-fill name if it's empty (skipName is true)
                                if (details.name) handleInputChange("receiverName", details.name);
                                if (details.phone) handleInputChange("receiverPhone", details.phone);
                                if (details.pincode) handleInputChange("receiverPincode", details.pincode);
                                if (details.city) handleInputChange("receiverCity", details.city);
                                if (details.state) handleInputChange("receiverState", details.state);
                                if (details.address) handleInputChange("receiverAddressLine1", details.address);
                            }} 
                            skipName={true}
                            label="Google Places Search" 
                            placeholder="Type business name..."
                        />
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-sm">Full Name *</Label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Enter receiver name"
                                    className="pl-9"
                                    value={formData.receiverName}
                                    onChange={(e) => handleInputChange("receiverName", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm">Contact Number *</Label>
                                <div className="relative group">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="10 digit mobile"
                                        className="pl-9"
                                        type="tel"
                                        maxLength={10}
                                        value={formData.receiverPhone}
                                        onChange={(e) => handleInputChange("receiverPhone", e.target.value.replace(/\D/g, ''))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground border-b pb-2">Destination Delivery</h3>
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm">Dest. Pincode *</Label>
                                <Input
                                    placeholder="6 digit code"
                                    maxLength={6}
                                    value={formData.receiverPincode}
                                    onChange={(e) => handleInputChange("receiverPincode", e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">Validated City</Label>
                                <div className="h-10 flex items-center px-3 rounded-md border bg-muted/50 text-sm text-muted-foreground truncate">
                                    {formData.receiverCity ? `${formData.receiverCity}${formData.receiverState ? ', ' + formData.receiverState : ''}` : (formData.receiverPincode?.length === 6 ? 'Locating...' : 'Awaiting code')}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Address Line 1 *</Label>
                            <Input
                                placeholder="Flat, Floor, Building Name"
                                value={formData.receiverAddressLine1}
                                onChange={(e) => handleInputChange("receiverAddressLine1", e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm">Address Line 2 <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                                <Input
                                    placeholder="Street, Area"
                                    value={formData.receiverAddressLine2}
                                    onChange={(e) => handleInputChange("receiverAddressLine2", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">Landmark <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                                <Input
                                    placeholder="Near by..."
                                    value={formData.receiverLandmark}
                                    onChange={(e) => handleInputChange("receiverLandmark", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Card className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-md flex items-center justify-center ${formData.saveRecipientToMaster ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        <Star className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-medium text-sm text-foreground">Save to Address Book</p>
                        <p className="text-xs text-muted-foreground">Save this recipient for future bookings</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Switch
                        checked={formData.saveRecipientToMaster}
                        onCheckedChange={(checked) => handleInputChange("saveRecipientToMaster", checked)}
                    />
                </div>
            </Card>
        </div>
    );
}
