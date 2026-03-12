"use client";

import { Weight, Scale, ShieldCheck } from "lucide-react";
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
}

export function Step3Parcel({ formData, handleInputChange, pricing, session }: Step3ParcelProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Physical Load Metrics */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 border-l-4 border-primary pl-3">
                        <h3 className="text-sm font-black uppercase tracking-wider text-foreground">Load Configuration</h3>
                    </div>
                    <div className="space-y-6 p-6 rounded-3xl border border-border/70 bg-muted/20">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Actual Weight (KG) *</Label>
                                <div className="relative group">
                                    <Weight className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 transition-colors group-focus-within:text-primary" />
                                    <Input
                                        placeholder="0.00"
                                        type="number"
                                        className="h-11 pl-10 rounded-xl border-border/80 bg-background focus:ring-primary/20 font-bold"
                                        value={formData.weight}
                                        onChange={(e) => handleInputChange("weight", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Parcel Type</Label>
                                <Select value={formData.packageType} onValueChange={(v) => handleInputChange("packageType", v)}>
                                    <SelectTrigger className="h-11 rounded-xl border-border/80 bg-background font-bold text-sm">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-border bg-card">
                                        <SelectItem value="BOX" className="font-bold">Box / Carton</SelectItem>
                                        <SelectItem value="DOCUMENT" className="font-bold">Document</SelectItem>
                                        <SelectItem value="PALLET" className="font-bold">Pallet</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Dimensions (CM)</Label>
                            <div className="grid grid-cols-3 gap-3">
                                {['length', 'breadth', 'height'].map((dim) => (
                                    <div key={dim} className="space-y-1">
                                        <div className="relative group">
                                            <Input
                                                placeholder={dim.charAt(0).toUpperCase()}
                                                type="number"
                                                className="h-10 rounded-xl border-border/80 bg-background focus:ring-primary/20 text-center font-bold text-sm"
                                                value={(formData as any)[dim]}
                                                onChange={(e) => handleInputChange(dim, e.target.value)}
                                            />
                                        </div>
                                        <p className="text-[8px] text-center font-black uppercase tracking-widest opacity-40">{dim}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Volumetric HUD & Protection */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 border-l-4 border-success pl-3">
                        <h3 className="text-sm font-black uppercase tracking-wider text-foreground">Pricing Analysis</h3>
                    </div>
                    <div className="space-y-4">
                        <Card className="p-6 rounded-3xl border-2 border-success/30 bg-success/5 shadow-inner relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all">
                                <Scale className="h-12 w-12" />
                            </div>
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-success/70">Chargeable Weight Basis</span>
                                    <Badge className="bg-success text-white border-none rounded-full px-3 py-0.5 text-[8px] font-black tracking-widest">
                                        {pricing.chargeableWeight > parseFloat(formData.weight || '0') ? 'VOLUMETRIC' : 'WEIGHT'}
                                    </Badge>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black tracking-tighter tabular-nums text-foreground">{pricing.chargeableWeight.toFixed(1)}</span>
                                    <span className="text-sm font-black text-muted-foreground/50 uppercase">KG Load</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-success/10">
                                    <div>
                                        <p className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-widest mb-1">Vol. Weight</p>
                                        <p className="text-sm font-black tabular-nums">{pricing.volumetricWeight.toFixed(1)} KG</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-widest mb-1">Divisor</p>
                                        <p className="text-sm font-black tabular-nums">÷{session?.user?.volumetricWeightDivisor || 5000}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/80 group">
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${formData.isInsured ? 'bg-success text-white shadow-brand' : 'bg-muted text-muted-foreground'}`}>
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wider text-foreground">Transit Insurance</p>
                                    <p className="text-[9px] font-medium text-muted-foreground uppercase">Risk Protection Protocol</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="border-border text-[8px] font-black uppercase tracking-[0.1em]">Automatic</Badge>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
