"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Building2,
    User,
    Mail,
    Phone,
    FileText,
    Package,
    CheckCircle2,
    ArrowRight,
    Loader2,
    Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function BusinessRegistrationPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        gstin: "",
        volume: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <div className="flex flex-col min-h-screen">
                <PublicHeader />
                <main className="flex-1 bg-muted/30 flex items-center justify-center p-4 md:p-8">
                    <Card className="max-w-xl w-full border-primary/20 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600" />

                        <CardHeader className="text-center pb-2 pt-12">
                            <div className="mx-auto h-24 w-24 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <CheckCircle2 className="h-12 w-12 text-green-600" />
                            </div>
                            <CardTitle className="text-3xl font-bold text-foreground">Request Received!</CardTitle>
                            <CardDescription className="text-lg mt-2">
                                Welcome to <span className="text-primary font-semibold">Neel Giri</span> Business
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="text-center space-y-8 pt-6 px-8 md:px-12">
                            <p className="text-muted-foreground leading-relaxed">
                                Thank you for choosing us as your logistics partner. Our Business Relations team is reviewing your profile.
                            </p>

                            <div className="bg-muted/50 p-6 rounded-xl border border-border/50 space-y-3 text-left">
                                <div className="flex justify-between items-center border-b border-border/10 pb-2">
                                    <span className="text-sm text-muted-foreground">Reference ID</span>
                                    <span className="font-mono font-semibold text-primary">REQ-{Math.floor(Math.random() * 10000)}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-border/10 pb-2">
                                    <span className="text-sm text-muted-foreground">Registered Email</span>
                                    <span className="font-medium text-foreground">{formData.email}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Est. Response Time</span>
                                    <span className="font-medium text-foreground">Within 24 Hours</span>
                                </div>
                            </div>

                            <div className="text-sm text-muted-foreground bg-blue-50/50 p-4 rounded-lg text-blue-700 dark:text-blue-300 dark:bg-blue-900/20">
                                <p><strong>Next Step:</strong> You will receive an activation link on your email once verified.</p>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-center pb-10">
                            <Link href="/">
                                <Button className="w-full min-w-[240px] h-12 text-base font-semibold shadow-xl shadow-primary/20">
                                    Return to Home <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </main>
                <PublicFooter />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <PublicHeader />
            <main className="flex-1 bg-muted/30 py-12 px-4 md:px-8">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left Side: Value Prop */}
                    <div className="space-y-8 lg:pr-12 animate-in fade-in slide-in-from-left-8 duration-700">
                        <div>
                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 mb-4">
                                For Businesses & High-Volume Senders
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight lg:text-6xl mb-4">
                                Ship Smarter, <br /> <span className="text-primary">Grow Faster.</span>
                            </h1>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Join over 500+ businesses who trust Neel Giri for their logistics.
                                Get access to exclusive corporate rates, priority support, and a dedicated account manager.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Preferred Rates</h3>
                                    <p className="text-muted-foreground">Unlock volume-based discounts and fixed pricing slabs tailored to your business needs.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Dedicated Support</h3>
                                    <p className="text-muted-foreground">Skip the queue. Get direct access to a dedicated relationship manager for all your queries.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">GST Compliant Billing</h3>
                                    <p className="text-muted-foreground">Automated monthly invoices with full GST input tax credit benefits for your business.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">All-in-One Dashboard</h3>
                                    <p className="text-muted-foreground">Get a powerful login portal to create bookings, track shipments, and manage your entire logistics operations.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Registration Form */}
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        <Card className="border-border/60 shadow-2xl bg-card/80 backdrop-blur-sm">
                            <CardHeader className="space-y-1 pb-6 bg-primary/5 border-b border-border/50">
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <Briefcase className="h-6 w-6 text-primary" />
                                    Open Business Account
                                </CardTitle>
                                <CardDescription>
                                    Create your corporate profile to unlock the full management portal.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="company">Company / Business Name <span className="text-red-500">*</span></Label>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-3 h-5 w-5 text-muted-foreground/50" />
                                                <Input
                                                    id="company"
                                                    placeholder="e.g. Acme Logistics Pvt Ltd"
                                                    className="pl-10 h-11"
                                                    required
                                                    value={formData.companyName}
                                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="contact">Contact Person <span className="text-red-500">*</span></Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground/50" />
                                                <Input
                                                    id="contact"
                                                    placeholder="Full Name"
                                                    className="pl-10 h-11"
                                                    required
                                                    value={formData.contactPerson}
                                                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="email">Work Email <span className="text-red-500">*</span></Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground/50" />
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        placeholder="name@company.com"
                                                        className="pl-10 h-11"
                                                        required
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground/50" />
                                                    <Input
                                                        id="phone"
                                                        type="tel"
                                                        placeholder="+91 98765 43210"
                                                        className="pl-10 h-11"
                                                        required
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="gstin">GSTIN (Optional)</Label>
                                            <Input
                                                id="gstin"
                                                placeholder="22AAAAA0000A1Z5"
                                                className="h-11 uppercase"
                                                maxLength={15}
                                                value={formData.gstin}
                                                onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="volume">Expected Monthly Volume</Label>
                                            <Select onValueChange={(val) => setFormData({ ...formData, volume: val })}>
                                                <SelectTrigger className="h-11 pl-10 relative">
                                                    <Package className="absolute left-3 top-3 h-5 w-5 text-muted-foreground/50" />
                                                    <SelectValue placeholder="Select shipmnets per month" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="starter">Less than 50 shipments</SelectItem>
                                                    <SelectItem value="growth">50 - 500 shipments</SelectItem>
                                                    <SelectItem value="enterprise">500+ shipments</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <Separator />

                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>Submitting Request <Loader2 className="ml-2 h-4 w-4 animate-spin" /></>
                                        ) : (
                                            <>Submit Application <ArrowRight className="ml-2 h-4 w-4" /></>
                                        )}
                                    </Button>
                                    <p className="text-xs text-center text-muted-foreground">
                                        By clicking submit, you agree to our Terms of Service and Privacy Policy.
                                    </p>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <PublicFooter />
        </div>
    );
}
