"use client";

import { useState } from "react";
import {
    Calculator,
    Truck,
    Zap,
    Package,
    Info,
    ArrowRight,
    IndianRupee,
    Box,
    ShieldCheck,
    MapPin,
    Weight,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PRICING_CONFIG, calculateZone, PricingZone } from "./mockRates";

interface QuoteResult {
    standard: {
        rate: number;
        days: number;
        breakdown: {
            freight: number;
            fuel: number;
            docket: number;
            insurance: number;
            gst: number;
        }
    };
    express: {
        rate: number;
        days: number;
        breakdown: {
            freight: number;
            fuel: number;
            docket: number;
            insurance: number;
            gst: number;
        }
    };
    chargeableWeight: number;
    zone: string;
}

export default function QuoteCalculator() {
    const [formData, setFormData] = useState({
        origin: "",
        destination: "",
        weight: "",
        length: "",
        width: "",
        height: "",
        value: "",
        type: "parcel",
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<QuoteResult | null>(null);

    const calculateServiceCost = (
        zone: PricingZone,
        chargeableWeight: number,
        declaredValue: number,
        isExpress: boolean
    ) => {
        // Calculation Logic (Same as before)
        let freight = zone.baseRate;
        const remainingWeight = Math.max(0, chargeableWeight - 0.5);
        if (remainingWeight > 0) {
            const additionalSlots = Math.ceil(remainingWeight / 0.5);
            freight += additionalSlots * zone.additionalRate;
        }

        if (isExpress) {
            freight *= 1.8;
        }

        const fuel = freight * PRICING_CONFIG.fuelSurchargePercent;
        const docket = PRICING_CONFIG.docketCharge;
        const insuranceCalc = declaredValue * PRICING_CONFIG.insurancePercent;
        const insurance = Math.max(insuranceCalc, PRICING_CONFIG.minInsurance);
        const subtotal = freight + fuel + docket + insurance;
        const gst = subtotal * PRICING_CONFIG.gstPercent;
        const total = Math.round(subtotal + gst);

        return {
            rate: total,
            breakdown: {
                freight: Math.round(freight),
                fuel: Math.round(fuel),
                docket: Math.round(docket),
                insurance: Math.round(insurance),
                gst: Math.round(gst),
            }
        };
    };

    const calculateQuote = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        setTimeout(() => {
            const weightVal = parseFloat(formData.weight) || 0.5;
            const l = parseFloat(formData.length) || 0;
            const w = parseFloat(formData.width) || 0;
            const h = parseFloat(formData.height) || 0;
            const declaredValue = parseFloat(formData.value) || 0;

            const volumetricWeight = (l * w * h) / PRICING_CONFIG.volumetricDivisor;
            const chargeableWeight = Math.max(weightVal, volumetricWeight);
            const zone = calculateZone(formData.origin, formData.destination);

            const standardCost = calculateServiceCost(zone, chargeableWeight, declaredValue, false);
            const expressCost = calculateServiceCost(zone, chargeableWeight, declaredValue, true);

            let standardDays = 5;
            let expressDays = 2;
            if (zone.name === "Intra-City") { standardDays = 1; expressDays = 0; }
            else if (zone.name === "Intra-State") { standardDays = 2; expressDays = 1; }
            else if (zone.name === "Metro-Metro") { standardDays = 3; expressDays = 1; }

            setResult({
                standard: { ...standardCost, days: standardDays },
                express: { ...expressCost, days: expressDays },
                chargeableWeight: parseFloat(chargeableWeight.toFixed(2)),
                zone: zone.name,
            });
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-8 items-start">

                {/* Form Section */}
                <div className="lg:col-span-7">
                    <Card className="border-border/60 shadow-xl rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
                        <CardHeader className="bg-primary/5 pb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                                    <Calculator className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <CardTitle className="text-xl">Shipping Cost Estimator</CardTitle>
                                    <CardDescription>Enter details to get exact rates for your shipment route.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 md:p-8 space-y-8">
                            <form onSubmit={calculateQuote} className="space-y-8">
                                {/* Route Details */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                        <MapPin className="h-4 w-4" /> Route
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="origin">Origin Pincode</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground/50" />
                                                <Input
                                                    id="origin"
                                                    placeholder="e.g. 110001"
                                                    className="pl-10 h-11"
                                                    maxLength={6}
                                                    required
                                                    value={formData.origin}
                                                    onChange={(e) => setFormData({ ...formData, origin: e.target.value.replace(/\D/g, '') })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="destination">Destination Pincode</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground/50" />
                                                <Input
                                                    id="destination"
                                                    placeholder="e.g. 400001"
                                                    className="pl-10 h-11"
                                                    maxLength={6}
                                                    required
                                                    value={formData.destination}
                                                    onChange={(e) => setFormData({ ...formData, destination: e.target.value.replace(/\D/g, '') })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Package Details */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                        <Package className="h-4 w-4" /> Package
                                    </h4>

                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="weight">Weight (kg)</Label>
                                            <div className="relative">
                                                <Weight className="absolute left-3 top-3 h-5 w-5 text-muted-foreground/50" />
                                                <Input
                                                    id="weight"
                                                    type="number"
                                                    step="0.1"
                                                    min="0.1"
                                                    placeholder="0.5"
                                                    className="pl-10 h-11"
                                                    required
                                                    value={formData.weight}
                                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="value">Declared Value (₹)</Label>
                                            <div className="relative">
                                                <IndianRupee className="absolute left-3 top-3 h-5 w-5 text-muted-foreground/50" />
                                                <Input
                                                    id="value"
                                                    type="number"
                                                    min="0"
                                                    placeholder="1000"
                                                    className="pl-10 h-11"
                                                    required
                                                    value={formData.value}
                                                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <Label className="text-sm">Dimensions (L x W x H) cm</Label>
                                        <div className="grid grid-cols-3 gap-3">
                                            <Input
                                                placeholder="L"
                                                type="number"
                                                className="h-11 text-center"
                                                value={formData.length}
                                                onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                                            />
                                            <Input
                                                placeholder="W"
                                                type="number"
                                                className="h-11 text-center"
                                                value={formData.width}
                                                onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                                            />
                                            <Input
                                                placeholder="H"
                                                type="number"
                                                className="h-11 text-center"
                                                value={formData.height}
                                                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>Calculating... <Loader2 className="ml-2 h-4 w-4 animate-spin" /></>
                                    ) : (
                                        <>Calculate Rates <ArrowRight className="ml-2 h-4 w-4" /></>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-5 space-y-6">
                    {!result && !loading && (
                        <Card className="border-dashed border-2 h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-muted/20">
                            <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                                <Info className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-lg font-semibold text-muted-foreground">Estimate Summary</h3>
                            <p className="text-sm text-muted-foreground/70 max-w-xs mt-2">
                                Fill in the details to see a breakdown of costs for Standard and Express services.
                            </p>
                        </Card>
                    )}

                    {loading && (
                        <Card className="border-dashed border-2 h-full min-h-[400px] flex flex-col items-center justify-center p-8 animate-pulse">
                            <div className="h-12 w-12 bg-primary/10 rounded-full mb-4"></div>
                            <div className="h-4 w-2/3 bg-muted rounded mb-3"></div>
                            <div className="h-4 w-1/2 bg-muted rounded"></div>
                        </Card>
                    )}

                    {result && (
                        <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 space-y-4">

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="bg-muted/30 border-none shadow-none">
                                    <CardContent className="p-4">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Chargeable Wt.</p>
                                        <p className="text-lg font-bold">{result.chargeableWeight} kg</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-muted/30 border-none shadow-none">
                                    <CardContent className="p-4">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Zone</p>
                                        <p className="text-lg font-bold text-primary truncate">{result.zone}</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Express Card - Highlighted */}
                            <div className="relative group perspective-1000">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <Card className="relative border-primary/50 overflow-hidden shadow-xl bg-gradient-to-br from-background to-primary/5">
                                    <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-primary/20">
                                        RECOMMENDED
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                                                    <Zap className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg leading-tight">Express Air</h3>
                                                    <p className="text-sm text-muted-foreground mt-0.5">
                                                        {result.express.days === 0 ? "Same Day" : `${result.express.days} Day(s) Delivery`}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant="outline" className="mb-1 border-primary/30 text-primary">Fastest</Badge>
                                            </div>
                                        </div>

                                        <div className="space-y-3 p-4 bg-background/50 rounded-xl border border-border/50 mb-6 backdrop-blur-[2px]">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">Base Freight</span>
                                                <span className="font-medium">₹{result.express.breakdown.freight}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">Fuel & Docket</span>
                                                <span className="font-medium">₹{result.express.breakdown.fuel + result.express.breakdown.docket}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">Risk Surcharge</span>
                                                <span className="font-medium">₹{result.express.breakdown.insurance}</span>
                                            </div>
                                            <Separator className="bg-border/60" />
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-foreground">Total (Inc. GST)</span>
                                                <span className="font-bold text-xl text-primary flex items-center">
                                                    <IndianRupee className="h-4 w-4" /> {result.express.rate}
                                                </span>
                                            </div>
                                        </div>

                                        <Button className="w-full font-bold shadow-md shadow-primary/20 bg-gradient-to-r from-primary to-blue-600 border-0">
                                            Ship Express <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Standard Card */}
                            <Card className="hover:border-primary/50 transition-colors shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                                                <Truck className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-base">Standard Surface</h3>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {result.standard.days} Days Delivery
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold flex items-center justify-end">
                                                <IndianRupee className="h-4 w-4 text-muted-foreground" /> {result.standard.rate}
                                            </p>
                                        </div>
                                    </div>

                                    <Button variant="outline" className="w-full text-sm h-10">
                                        Select Standard
                                    </Button>
                                </CardContent>
                            </Card>

                            <p className="text-center text-xs text-muted-foreground/60 pt-2">
                                * Prices are estimates. Final weight check at hub may vary costs.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
