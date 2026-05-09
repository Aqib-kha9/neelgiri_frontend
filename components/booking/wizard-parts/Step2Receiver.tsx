"use client";

import { User, Phone, MapPin, CheckCircle2, Star, History, Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
                    
                    <div className="mb-2">
                        <GooglePlacesAutocomplete 
                            onSelect={(details) => {
                                if (details.name) handleInputChange("receiverName", details.name);
                                if (details.phone) handleInputChange("receiverPhone", details.phone);
                                if (details.pincode) handleInputChange("receiverPincode", details.pincode);
                                if (details.city) handleInputChange("receiverCity", details.city);
                                if (details.state) handleInputChange("receiverState", details.state);
                                if (details.address) handleInputChange("receiverAddressLine1", details.address);
                            }} 
                            label="Auto-fill destination from Google" 
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
                                    {formData.receiverCity ? `${formData.receiverCity}${formData.receiverState ? ', ' + formData.receiverState : ''}` : (formData.receiverPincode.length === 6 ? 'Locating...' : 'Awaiting code')}
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
