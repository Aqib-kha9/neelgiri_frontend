import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Driver, DriverFormData } from "./types";
import { User, FileText, CreditCard, HeartPulse, UserCircle2 } from "lucide-react";

interface DriverFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: DriverFormData) => void;
    initialData?: Driver | null;
}

const DriverForm = ({ open, onOpenChange, onSubmit, initialData }: DriverFormProps) => {
    const [activeTab, setActiveTab] = useState("profile");
    const [formData, setFormData] = useState<DriverFormData>({
        name: "",
        phone: "",
        email: "",
        licenseNo: "",
        licenseExpiry: "",
        aadharNo: "",
        status: "ACTIVE",
        verificationStatus: "PENDING",
        hubId: "",
        rating: 5,
        dateOfJoining: "",
        fatherName: "",
        address: "",
        bloodGroup: "",
        panCard: "",
        emergencyContact: {
            name: "",
            phone: "",
            relation: "",
        },
        bankDetails: {
            accountNo: "",
            ifscCode: "",
            bankName: "",
        },
    });

    useEffect(() => {
        if (initialData) {
            // Create a clean object without the id and code
            const { id, code, ...rest } = initialData;
            setFormData(rest);
        } else {
            // Reset form
            setFormData({
                name: "",
                phone: "",
                email: "",
                licenseNo: "",
                licenseExpiry: "",
                aadharNo: "",
                status: "ACTIVE",
                verificationStatus: "PENDING",
                hubId: "",
                rating: 5,
                dateOfJoining: "",
                fatherName: "",
                address: "",
                bloodGroup: "",
                panCard: "",
                emergencyContact: {
                    name: "",
                    phone: "",
                    relation: "",
                },
                bankDetails: {
                    accountNo: "",
                    ifscCode: "",
                    bankName: "",
                },
            });
        }
    }, [initialData, open]);

    const handleChange = (field: keyof DriverFormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleNestedChange = (parent: "emergencyContact" | "bankDetails", field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [parent]: {
                ...prev[parent]!,
                [field]: value
            }
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[500px] sm:w-[500px] sm:max-w-[500px] flex flex-col h-full">
                <SheetHeader className="flex-none">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <UserCircle2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <SheetTitle>{initialData ? "Edit Driver Profile" : "Onboard New Driver"}</SheetTitle>
                            <SheetDescription>
                                {initialData ? `Update details for ${initialData.name}` : "Register a new driver partner."}
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-6 pr-2">
                    <form id="driver-form" onSubmit={handleSubmit} className="space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="profile">Profile & Personal</TabsTrigger>
                                <TabsTrigger value="compliance">Documents & Legal</TabsTrigger>
                                <TabsTrigger value="financial">Financial & Emergency</TabsTrigger>
                            </TabsList>

                            <TabsContent value="profile" className="space-y-4 mt-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            placeholder="As per Aadhar"
                                            value={formData.name}
                                            onChange={(e) => handleChange("name", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fatherName">Father's Name</Label>
                                        <Input
                                            id="fatherName"
                                            placeholder="Father's Name"
                                            value={formData.fatherName || ""}
                                            onChange={(e) => handleChange("fatherName", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            placeholder="10-digit mobile number"
                                            value={formData.phone}
                                            onChange={(e) => handleChange("phone", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="driver@example.com"
                                            value={formData.email || ""}
                                            onChange={(e) => handleChange("email", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="bloodGroup">Blood Group</Label>
                                        <Select
                                            value={formData.bloodGroup}
                                            onValueChange={(val: any) => handleChange("bloodGroup", val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Group" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="A+">A+</SelectItem>
                                                <SelectItem value="A-">A-</SelectItem>
                                                <SelectItem value="B+">B+</SelectItem>
                                                <SelectItem value="B-">B-</SelectItem>
                                                <SelectItem value="O+">O+</SelectItem>
                                                <SelectItem value="O-">O-</SelectItem>
                                                <SelectItem value="AB+">AB+</SelectItem>
                                                <SelectItem value="AB-">AB-</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="doj">Date of Joining</Label>
                                        <Input
                                            id="doj"
                                            type="date"
                                            value={formData.dateOfJoining}
                                            onChange={(e) => handleChange("dateOfJoining", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Current Address</Label>
                                    <Input
                                        id="address"
                                        placeholder="Full residential address"
                                        value={formData.address || ""}
                                        onChange={(e) => handleChange("address", e.target.value)}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="compliance" className="space-y-5 mt-6">
                                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Identity Documents</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="licenseNo">Driving License No *</Label>
                                            <Input
                                                id="licenseNo"
                                                placeholder="DL Number"
                                                value={formData.licenseNo}
                                                onChange={(e) => handleChange("licenseNo", e.target.value.toUpperCase())}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="licenseExp">License Expiry *</Label>
                                            <Input
                                                id="licenseExp"
                                                type="date"
                                                value={formData.licenseExpiry}
                                                onChange={(e) => handleChange("licenseExpiry", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Separator className="my-4 bg-border/60" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="aadhar">Aadhar Number</Label>
                                            <Input
                                                id="aadhar"
                                                placeholder="12-digit UID"
                                                value={formData.aadharNo}
                                                onChange={(e) => handleChange("aadharNo", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pan">PAN Card</Label>
                                            <Input
                                                id="pan"
                                                placeholder="PAN Number"
                                                value={formData.panCard || ""}
                                                onChange={(e) => handleChange("panCard", e.target.value.toUpperCase())}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Employment Status</Label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(val: any) => handleChange("status", val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ACTIVE">Active</SelectItem>
                                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                                                <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                                                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="verStatus">Verification Status</Label>
                                        <Select
                                            value={formData.verificationStatus}
                                            onValueChange={(val: any) => handleChange("verificationStatus", val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Verification" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PENDING">Pending</SelectItem>
                                                <SelectItem value="VERIFIED">Verified</SelectItem>
                                                <SelectItem value="REJECTED">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="financial" className="space-y-4 mt-6">
                                <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-200/50">
                                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-emerald-700"><CreditCard className="h-4 w-4" /> Bank Details</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="bankName">Bank Name</Label>
                                            <Input
                                                id="bankName"
                                                value={formData.bankDetails?.bankName || ""}
                                                onChange={(e) => handleNestedChange("bankDetails", "bankName", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="accountNo">Account Number</Label>
                                            <Input
                                                id="accountNo"
                                                value={formData.bankDetails?.accountNo || ""}
                                                onChange={(e) => handleNestedChange("bankDetails", "accountNo", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ifsc">IFSC Code</Label>
                                            <Input
                                                id="ifsc"
                                                value={formData.bankDetails?.ifscCode || ""}
                                                onChange={(e) => handleNestedChange("bankDetails", "ifscCode", e.target.value.toUpperCase())}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg bg-rose-500/5 border border-rose-200/50">
                                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-rose-700"><HeartPulse className="h-4 w-4" /> Emergency Contact</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="emName">Contact Name</Label>
                                            <Input
                                                id="emName"
                                                value={formData.emergencyContact?.name || ""}
                                                onChange={(e) => handleNestedChange("emergencyContact", "name", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="emRelation">Relation</Label>
                                            <Input
                                                id="emRelation"
                                                value={formData.emergencyContact?.relation || ""}
                                                onChange={(e) => handleNestedChange("emergencyContact", "relation", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="emPhone">Phone Number</Label>
                                            <Input
                                                id="emPhone"
                                                value={formData.emergencyContact?.phone || ""}
                                                onChange={(e) => handleNestedChange("emergencyContact", "phone", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </form>
                </div>

                <SheetFooter className="flex-none border-t border-border/50 p-6 bg-background">
                    <div className="flex gap-2 w-full justify-end">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" form="driver-form">
                            {initialData ? "Update Profile" : "Onboard Driver"}
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default DriverForm;
