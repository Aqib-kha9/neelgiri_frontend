"use client";

import { User, Phone, MapPin, CheckCircle2, Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
                    
                    <div className="mb-2">
                        <GooglePlacesAutocomplete 
                            onSelect={(details) => {
                                if (details.name) handleInputChange("senderName", details.name);
                                if (details.phone) handleInputChange("senderPhone", details.phone);
                                if (details.pincode) handleInputChange("senderPincode", details.pincode);
                                if (details.city) handleInputChange("senderCity", details.city);
                                if (details.state) handleInputChange("senderState", details.state);
                                if (details.address) handleInputChange("senderAddressLine1", details.address);
                            }} 
                            label="Auto-fill from Google" 
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
                                    {formData.senderCity ? `${formData.senderCity}${formData.senderState ? ', ' + formData.senderState : ''}` : (formData.senderPincode.length === 6 ? 'Locating...' : 'Awaiting code')}
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
