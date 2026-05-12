"use client";

import { useState } from "react";
import { User, Phone, MapPin, CheckCircle2, Mail, Shield, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GooglePlacesAutocomplete } from "./GooglePlacesAutocomplete";

interface Step1SenderProps {
    formData: any;
    handleInputChange: (field: string, value: any) => void;
    session: any;
    setFormData: any;
    selectSavedPickup: (pickupId: string) => void;
}

export function Step1Sender({ formData, handleInputChange, session, selectSavedPickup }: Step1SenderProps) {
    const [isFetching, setIsFetching] = useState(false);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Quick Select Pickup Section */}
            {session?.user?.pickupLocations?.length > 0 && (
                <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <Label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-primary" /> Saved Senders (Address Book)
                    </Label>
                    <Select onValueChange={(val) => selectSavedPickup(val)}>
                        <SelectTrigger className="bg-background h-auto py-2">
                            <SelectValue placeholder="Select a sender to auto-fill details..." />
                        </SelectTrigger>
                        <SelectContent>
                            {session.user.pickupLocations.map((p: any) => (
                                <SelectItem key={p._id || p.id} value={p._id || p.id} className="py-2">
                                    <div className="flex flex-col text-left items-start">
                                        <span className="font-medium">{p.name} {p.contactPerson ? `(${p.contactPerson})` : ''}</span>
                                        <span className="text-xs text-muted-foreground mt-0.5">{p.city}, {p.pincode} - {p.address}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground border-b pb-2">Sender Information</h3>
                    
                    <div className="space-y-2 p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                        <Label className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                            <Shield className="h-4 w-4" /> Smart Fetch via GSTIN
                        </Label>
                        <div className="flex gap-2">
                            <Input 
                                placeholder="Enter 15-digit GSTIN"
                                value={formData.senderGstin || ""}
                                onChange={(e) => handleInputChange("senderGstin", e.target.value.toUpperCase())}
                                className="border-blue-200 bg-white focus:border-blue-400 font-mono"
                                maxLength={15}
                            />
                            <Button 
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={isFetching}
                                className="border-blue-300 text-blue-700 bg-white hover:bg-blue-50 shrink-0 min-w-[70px]"
                                onClick={async () => {
                                    if (formData.senderGstin?.length !== 15) {
                                        alert("Please enter a valid 15-digit GSTIN");
                                        return;
                                    }
                                    setIsFetching(true);
                                    try {
                                        const token = localStorage.getItem("token");
                                        const res = await fetch(`/api/shipments/compliance/gstin/${formData.senderGstin}`, {
                                            headers: { Authorization: `Bearer ${token}` }
                                        });
                                        const data = await res.json();
                                        
                                        // CORRECT MAPPING: Sandbox returns { data: { data: { ... } } }
                                        const biz = data.data?.data || data.data; 

                                        if (res.ok && biz) {
                                            handleInputChange("senderName", (biz.lgnm || biz.trade_name || biz.tradeNam || "").toString());
                                            
                                            // Construct address from pradr (Primary Address)
                                            const addr = biz.pradr?.addr || {};
                                            const formattedAddr = `${addr.bnm || ''} ${addr.bno || ''} ${addr.flno || ''} ${addr.loc || ''} ${addr.locality || ''} ${addr.st || ''}`.replace(/\s+/g, ' ').trim();
                                            
                                            handleInputChange("senderAddressLine1", formattedAddr || "");
                                            handleInputChange("senderPincode", (addr.pncd || "").toString());
                                            handleInputChange("senderCity", (addr.dst || "").toString());
                                            handleInputChange("senderState", (addr.stcd || "").toString());
                                            
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
                                if (details.name) handleInputChange("senderName", details.name);
                                if (details.phone) handleInputChange("senderPhone", details.phone);
                                if (details.pincode) handleInputChange("senderPincode", details.pincode);
                                if (details.city) handleInputChange("senderCity", details.city);
                                if (details.state) handleInputChange("senderState", details.state);
                                if (details.address) handleInputChange("senderAddressLine1", details.address);
                            }} 
                            skipName={true}
                            label="Google Places Search" 
                            placeholder="Type business name..."
                        />
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-sm">Full Name or Entity *</Label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="e.g. Deepanshu Logistics"
                                    className="pl-9"
                                    value={formData.senderName}
                                    onChange={(e) => handleInputChange("senderName", e.target.value)}
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
                                        value={formData.senderPhone}
                                        onChange={(e) => handleInputChange("senderPhone", e.target.value.replace(/\D/g, ''))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground border-b pb-2">Pickup Location</h3>
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm">Zip/Pincode *</Label>
                                <Input
                                    placeholder="6 digit code"
                                    maxLength={6}
                                    value={formData.senderPincode}
                                    onChange={(e) => handleInputChange("senderPincode", e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">Validated Hub</Label>
                                <div className="h-10 flex items-center px-3 rounded-md border bg-muted/50 text-sm text-muted-foreground truncate">
                                {formData.senderCity ? `${formData.senderCity}${formData.senderState ? ', ' + formData.senderState : ''}` : (formData.senderPincode?.length === 6 ? 'Locating...' : 'Awaiting code')}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Address Line 1 *</Label>
                            <Input
                                placeholder="Flat, Floor, Building Name"
                                value={formData.senderAddressLine1}
                                onChange={(e) => handleInputChange("senderAddressLine1", e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm">Address Line 2 <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                                <Input
                                    placeholder="Street, Area"
                                    value={formData.senderAddressLine2}
                                    onChange={(e) => handleInputChange("senderAddressLine2", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">Landmark <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                                <Input
                                    placeholder="Near by..."
                                    value={formData.senderLandmark}
                                    onChange={(e) => handleInputChange("senderLandmark", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
