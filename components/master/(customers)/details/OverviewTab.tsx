import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Customer, PickupLocation, Receiver } from "../types";
import {
    CreditCard,
    FileText,
    MapPin,
    Truck,
    IndianRupee,
    Phone,
    Mail,
    User,
    Globe,
    ShieldCheck,
    FileStack,
    StickyNote,
    Users
} from "lucide-react";

interface OverviewTabProps {
    customer: Customer;
}

const OverviewTab = ({ customer }: OverviewTabProps) => {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* 1. Basic & Contact Information */}
            <Card className="rounded-2xl border-border/70 shadow-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="h-5 w-5 text-primary" />
                        Basic & Contact Info
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Contact Person</p>
                            <p className="font-medium">{customer.contactPerson}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Mobile Number</p>
                            <p className="font-medium">{customer.mobileNo}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Office Phone</p>
                            <p className="font-medium">{customer.phoneO || "-"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Residence Phone</p>
                            <p className="font-medium">{customer.phoneR || "-"}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-muted-foreground">Email Address</p>
                            <p className="font-medium">{customer.email}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 2. Billing, Payment & Logistics */}
            <Card className="rounded-2xl border-border/70 shadow-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Billing & Services Config
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Billing Type</p>
                            <Badge variant="outline" className="mt-1">{customer.quotationType || "Standard"}</Badge>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Payment Terms</p>
                            <p className="font-medium">{customer.paymentTerms || "Net 30"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Default Pay Mode</p>
                            <p className="font-medium">{customer.paymentMode}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Portal Access</p>
                            <Badge variant={customer.portalAccess ? "success" : "secondary"} className="mt-1">
                                {customer.portalAccess ? "Enabled" : "Disabled"}
                            </Badge>
                        </div>
                        <div className="col-span-2 space-y-2">
                            <div>
                                <p className="text-muted-foreground mb-1">Allowed Services</p>
                                <div className="flex flex-wrap gap-2">
                                    {customer.allowedServices?.length > 0 ? (
                                        customer.allowedServices.map(s => <Badge key={s} variant="secondary" className="rounded-md">{s}</Badge>)
                                    ) : <span className="text-muted-foreground">-</span>}
                                </div>
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-1">Serviceable Zones</p>
                                <div className="flex flex-wrap gap-2">
                                    {customer.serviceableZones?.length > 0 ? (
                                        customer.serviceableZones.map(z => <Badge key={z} variant="outline" className="rounded-md bg-muted/30">{z}</Badge>)
                                    ) : <span className="text-muted-foreground">-</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>


            {/* 3. Geographic Network (Addresses / Receivers / Pickups) */}
            <Card className="rounded-2xl border-border/70 shadow-card md:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <MapPin className="h-5 w-5 text-primary" />
                        Geographic Network
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-3">
                    {/* Registered Address */}
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            Registered Address
                        </h4>
                        <div className="rounded-xl border border-border/50 bg-muted/20 p-3 text-sm">
                            <p>{customer.address1}</p>
                            {customer.address2 && <p>{customer.address2}</p>}
                            <p>{customer.city}, {customer.station} - {customer.pincode}</p>
                        </div>
                    </div>

                    {/* Pickup Locations */}
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            Pickup Locations ({customer.pickupLocations.length})
                        </h4>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                            {customer.pickupLocations.length > 0 ? customer.pickupLocations.map((loc, idx) => (
                                <div key={idx} className="rounded-xl border border-border/50 p-3 text-sm hover:bg-muted/30">
                                    <p className="font-medium">{loc.name}</p>
                                    <p className="text-xs text-muted-foreground">{loc.address}, {loc.city}</p>
                                    <p className="text-xs text-muted-foreground">POC: {loc.contactPerson} ({loc.mobileNo})</p>
                                </div>
                            )) : <p className="text-sm text-muted-foreground italic">No pickup locations added</p>}
                        </div>
                    </div>

                    {/* Receivers */}
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            Receivers ({customer.receivers.length})
                        </h4>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                            {customer.receivers.length > 0 ? customer.receivers.map((rec, idx) => (
                                <div key={idx} className="rounded-xl border border-border/50 p-3 text-sm hover:bg-muted/30">
                                    <p className="font-medium">{rec.name}</p>
                                    <p className="text-xs text-muted-foreground">{rec.address}, {rec.city}</p>
                                    <p className="text-xs text-muted-foreground">Ph: {rec.mobileNo}</p>
                                </div>
                            )) : <p className="text-sm text-muted-foreground italic">No receivers added</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 4. Compliance & Internal */}
            <Card className="rounded-2xl border-border/70 shadow-card md:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        Compliance & Internal Reference
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-4 text-sm">
                        <div className="space-y-1">
                            <p className="text-muted-foreground">GSTIN</p>
                            <div className="flex items-center gap-1.5">
                                <span className="font-mono bg-muted/50 px-1.5 py-0.5 rounded">{customer.gstin || "N/A"}</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Contract ID</p>
                            <p className="font-medium">{customer.contractId || "-"}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground">KYC Status</p>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">{customer.kycStatus || "Verified"}</Badge>
                                {customer.kycDocumentType && <span className="text-xs text-muted-foreground">({customer.kycDocumentType})</span>}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Registered By</p>
                            <p className="font-medium">{customer.bookedBy}</p>
                            {customer.documentNo && <p className="text-xs text-muted-foreground">Doc: {customer.documentNo}</p>}
                        </div>
                    </div>

                    {customer.remark && (
                        <div className="mt-6 rounded-xl bg-orange-50/50 border border-orange-100 p-4">
                            <p className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                                <StickyNote className="h-3 w-3" /> Remarks
                            </p>
                            <p className="text-sm text-orange-900/80">{customer.remark}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

        </div>
    );
};

export default OverviewTab;
