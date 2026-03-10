"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Download, Upload, RefreshCw, IndianRupee, Percent } from "lucide-react";
import { ImportDialog } from "../../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../../warehouse/(inventory)/ExportDialog";
import { taxCalculatorStats, gstRates, recentCalculations } from "./mockData";

const TaxCalculator = () => {
    const [amount, setAmount] = useState("");
    const [gstRate, setGstRate] = useState("18");
    const [calculationType, setCalculationType] = useState<"inclusive" | "exclusive">("exclusive");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);

    const calculateGST = () => {
        const baseAmount = parseFloat(amount) || 0;
        const rate = parseFloat(gstRate) || 0;

        if (calculationType === "exclusive") {
            // GST is added to base amount
            const gstAmount = (baseAmount * rate) / 100;
            const cgst = gstAmount / 2;
            const sgst = gstAmount / 2;
            const totalAmount = baseAmount + gstAmount;
            return { baseAmount, cgst, sgst, igst: 0, totalGst: gstAmount, totalAmount };
        } else {
            // GST is included in the amount
            const baseAmount = (parseFloat(amount) * 100) / (100 + rate);
            const gstAmount = parseFloat(amount) - baseAmount;
            const cgst = gstAmount / 2;
            const sgst = gstAmount / 2;
            return { baseAmount, cgst, sgst, igst: 0, totalGst: gstAmount, totalAmount: parseFloat(amount) };
        }
    };

    const result = amount ? calculateGST() : null;

    const handleReset = () => {
        setAmount("");
        setGstRate("18");
        setCalculationType("exclusive");
    };

    return (
        <div className="space-y-7">
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">GST Compliance</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">Tax Calculator</h1>
                            <p className="max-w-2xl text-body">Calculate GST amounts for invoices and transactions. Support for both inclusive and exclusive tax calculations.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                                <Calculator className="h-3.5 w-3.5 text-primary" />48 calculations today
                            </span>
                            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                                <Percent className="h-3.5 w-3.5 text-success" />18% avg rate
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <Button variant="outline" className="gap-2 rounded-lg border-border/70" onClick={() => setIsExportOpen(true)}>
                                <Download className="h-4 w-4" />Export
                            </Button>
                            <Button variant="outline" className="gap-2 rounded-lg border-border/70" onClick={() => setIsImportOpen(true)}>
                                <Upload className="h-4 w-4" />Import
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {taxCalculatorStats.map((stat, index) => (
                    <Card key={index} className="relative overflow-hidden rounded-2xl border-border/70 bg-card/95 shadow-card">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                    <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">{stat.value}</div>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <stat.icon className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${stat.trend === "up" ? "bg-success/15 text-success" : "bg-error/15 text-error"}`}>
                                    {stat.change}
                                </span>
                                <span className="text-xs text-muted-foreground">{stat.description}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Calculator Card */}
                <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base font-semibold">
                            <Calculator className="h-5 w-5 text-primary" />
                            GST Calculator
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">Calculate tax amounts for your transactions</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="calculation-type">Calculation Type</Label>
                                <Select value={calculationType} onValueChange={(value: "inclusive" | "exclusive") => setCalculationType(value)}>
                                    <SelectTrigger id="calculation-type" className="h-11 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="exclusive">GST Exclusive (Add GST)</SelectItem>
                                        <SelectItem value="inclusive">GST Inclusive (Extract GST)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    {calculationType === "exclusive"
                                        ? "GST will be added to the base amount"
                                        : "GST will be extracted from the total amount"}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount">
                                    {calculationType === "exclusive" ? "Base Amount" : "Total Amount (incl. GST)"}
                                </Label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="Enter amount"
                                        className="h-11 rounded-xl pl-10"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gst-rate">GST Rate (%)</Label>
                                <Select value={gstRate} onValueChange={setGstRate}>
                                    <SelectTrigger id="gst-rate" className="h-11 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {gstRates.map((rate) => (
                                            <SelectItem key={rate.rate} value={rate.rate.toString()}>
                                                {rate.label} - {rate.description}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button className="flex-1 gap-2 rounded-xl" disabled={!amount}>
                                    <Calculator className="h-4 w-4" />
                                    Calculate
                                </Button>
                                <Button variant="outline" className="gap-2 rounded-xl" onClick={handleReset}>
                                    <RefreshCw className="h-4 w-4" />
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Card */}
                <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Calculation Results</CardTitle>
                        <p className="text-xs text-muted-foreground">Detailed GST breakdown</p>
                    </CardHeader>
                    <CardContent>
                        {result ? (
                            <div className="space-y-4">
                                <div className="rounded-2xl bg-muted/30 p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Base Amount</span>
                                        <span className="text-lg font-semibold">₹{result.baseAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="h-px bg-border" />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">CGST ({parseFloat(gstRate) / 2}%)</span>
                                        <span className="font-medium">₹{result.cgst.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">SGST ({parseFloat(gstRate) / 2}%)</span>
                                        <span className="font-medium">₹{result.sgst.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">IGST (0%)</span>
                                        <span className="font-medium">₹{result.igst.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="h-px bg-border" />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Total GST ({gstRate}%)</span>
                                        <span className="text-lg font-semibold text-primary">₹{result.totalGst.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-primary/10 p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-primary">Total Amount</span>
                                        <span className="text-2xl font-bold text-primary">₹{result.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-muted/20 p-3 text-xs text-muted-foreground">
                                    <p className="font-medium mb-1">Note:</p>
                                    <p>This calculation is for {calculationType === "exclusive" ? "GST exclusive" : "GST inclusive"} amount.
                                        CGST and SGST apply for intra-state transactions. For inter-state, IGST would be {gstRate}%.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="rounded-full bg-muted/30 p-4 mb-4">
                                    <Calculator className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-medium text-muted-foreground">Enter amount to calculate GST</p>
                                <p className="text-xs text-muted-foreground mt-1">Results will appear here</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Calculations */}
            <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Recent Calculations</CardTitle>
                    <p className="text-xs text-muted-foreground">Your calculation history</p>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Base Amount</TableHead>
                                    <TableHead>GST Rate</TableHead>
                                    <TableHead>CGST</TableHead>
                                    <TableHead>SGST</TableHead>
                                    <TableHead>Total Amount</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentCalculations.map((calc) => (
                                    <TableRow key={calc.id} className="group hover:bg-muted/20">
                                        <TableCell>
                                            <Badge variant={calc.calculationType === "exclusive" ? "default" : "secondary"} className="rounded-full">
                                                {calc.calculationType === "exclusive" ? "Exclusive" : "Inclusive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium text-foreground max-w-[200px] truncate">{calc.description || "-"}</p>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium">₹{calc.baseAmount.toLocaleString("en-IN")}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="rounded-full">{calc.gstRate}%</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">₹{calc.cgst.toLocaleString("en-IN")}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">₹{calc.sgst.toLocaleString("en-IN")}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-foreground">₹{calc.totalAmount.toLocaleString("en-IN")}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(calc.calculatedDate).toLocaleString("en-IN")}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
            <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />
        </div>
    );
};

export default TaxCalculator;
