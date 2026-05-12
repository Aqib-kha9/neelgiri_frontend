"use client";
import { useRef } from "react";
import { Weight, Scale, ShieldCheck, X, Image as ImageIcon, Camera } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Step3ParcelProps {
    formData: any;
    handleInputChange: (field: string, value: any) => void;
    pricing: any;
    session: any;
    uploadFiles: (files: File[]) => Promise<any[]>;
}

export function Step3Parcel({ formData, handleInputChange, pricing, session, uploadFiles }: Step3ParcelProps) {
    const parcelRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const uploadedFiles = await uploadFiles(files);
        
        const newAttachments = uploadedFiles.map((file, index) => ({
            id: Math.random().toString(36).substr(2, 9),
            url: file.url,
            name: file.originalname,
            type: 'parcel_photo',
            preview: file.url // Use server URL for preview
        }));
        
        handleInputChange("attachments", [...(formData.attachments || []), ...newAttachments]);
    };

    const removeFile = (id: string) => {
        const updated = formData.attachments.filter((a: any) => a.id !== id);
        handleInputChange("attachments", updated);
    };

    const parcelPhotos = (formData.attachments || []).filter((a: any) => a.type === 'parcel_photo');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground border-b pb-2">Load Configuration</h3>
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm">Actual Weight (KG) *</Label>
                                <div className="relative group">
                                    <Weight className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="0.00"
                                        type="number"
                                        className="pl-9"
                                        value={formData.weight}
                                        onChange={(e) => handleInputChange("weight", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">Parcel Type</Label>
                                <Select value={formData.packageType} onValueChange={(v) => handleInputChange("packageType", v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BOX">Box / Carton</SelectItem>
                                        <SelectItem value="DOCUMENT">Document</SelectItem>
                                        <SelectItem value="PALLET">Pallet</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm">Dimensions (CM)</Label>
                            <div className="grid grid-cols-3 gap-3">
                                {['length', 'breadth', 'height'].map((dim) => (
                                    <div key={dim} className="space-y-1">
                                        <Input
                                            placeholder={dim.charAt(0).toUpperCase() + dim.slice(1)}
                                            type="number"
                                            className="text-center"
                                            value={(formData as any)[dim]}
                                            onChange={(e) => handleInputChange(dim, e.target.value)}
                                        />
                                        <p className="text-xs text-center text-muted-foreground capitalize">{dim}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm">Declared Value (₹) *</Label>
                                <Input
                                    placeholder="Invoice value"
                                    type="number"
                                    value={formData.declaredValue}
                                    onChange={(e) => handleInputChange("declaredValue", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">Contents <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                                <Input
                                    placeholder="e.g. Electronics, Clothes"
                                    value={formData.contents}
                                    onChange={(e) => handleInputChange("contents", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground border-b pb-2">Pricing Analysis</h3>
                    <div className="space-y-4">
                        <Card className="p-6 bg-muted/30 border-none relative overflow-hidden">
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">Chargeable Weight Basis</span>
                                    <Badge variant="secondary">
                                        {pricing.chargeableWeight > parseFloat(formData.weight || '0') ? 'VOLUMETRIC' : 'WEIGHT'}
                                    </Badge>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-semibold tabular-nums text-foreground">{pricing.chargeableWeight.toFixed(1)}</span>
                                    <span className="text-sm text-muted-foreground">KG Load</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Vol. Weight</p>
                                        <p className="text-sm font-medium">{pricing.volumetricWeight.toFixed(1)} KG</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground mb-1">Divisor</p>
                                        <p className="text-sm font-medium">÷{session?.user?.volumetricWeightDivisor || 5000}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-background border">
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-md flex items-center justify-center ${formData.isInsured ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">Transit Insurance</p>
                                    <p className="text-xs text-muted-foreground">Risk Protection</p>
                                </div>
                            </div>
                            <Badge variant="outline">Automatic</Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Section - ADDED AS PER REQUIREMENT */}
            <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold text-foreground mb-4">Shipment Photos & Attachments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                        className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-6 flex flex-col items-center justify-center hover:border-primary/50 transition-all cursor-pointer bg-muted/5 group h-full min-h-[160px]"
                        onClick={() => parcelRef.current?.click()}
                    >
                        <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                            <Camera className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-sm font-semibold">Upload Parcel Photos</span>
                        <p className="text-xs text-muted-foreground mt-1 text-center">Capture or upload up to 5 photos</p>
                        <input 
                            type="file" 
                            ref={parcelRef}
                            multiple 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleFileChange}
                        />
                    </div>
                    
                    <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 flex flex-col gap-3 min-h-[160px]">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary/70 flex items-center gap-2">
                            <ImageIcon className="h-3 w-3" /> Selected Photos ({parcelPhotos.length})
                        </h4>
                        
                        {parcelPhotos.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2">
                                {parcelPhotos.map((photo: any) => (
                                    <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden border bg-background">
                                        <img src={photo.preview} alt="preview" className="w-full h-full object-cover" />
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); removeFile(photo.id); }}
                                            className="absolute top-1 right-1 h-5 w-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                                <p className="text-[10px] text-muted-foreground leading-relaxed">
                                    No photos selected. Uploading parcel photos helps in faster claims and verification.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
