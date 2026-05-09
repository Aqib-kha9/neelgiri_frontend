"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, MapPin, User, Phone, Mail, Building2, Trash2, Edit2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { GooglePlacesAutocomplete } from "@/components/booking/wizard-parts/GooglePlacesAutocomplete";

export default function AddressBookPage() {
    const { session, refreshSession } = useAuth();
    const [activeTab, setActiveTab] = useState("senders");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        contactPerson: "",
        mobileNo: "",
        email: "",
        pincode: "",
        city: "",
        state: "",
        address: "",
        address2: "",
        landmark: ""
    });

    // Pincode lookup for city/state
    useEffect(() => {
        if (formData.pincode.length === 6) {
            const fetchPincodeDetails = async () => {
                try {
                    const response = await fetch(`/api/pincodes/check/${formData.pincode}`);
                    if (response.ok) {
                        const data = await response.json();
                        setFormData(prev => ({
                            ...prev,
                            city: data.district || data.city || prev.city,
                            state: data.state || prev.state
                        }));
                    }
                } catch (err) {
                    console.error("Pincode lookup failed:", err);
                }
            };
            fetchPincodeDetails();
        }
    }, [formData.pincode]);

    const handleOpenDialog = (item?: any) => {
        if (item) {
            setEditingId(item._id || item.id);
            setFormData({
                name: item.name || "",
                contactPerson: item.contactPerson || "",
                mobileNo: item.mobileNo || item.phone || "",
                email: item.email || "",
                pincode: item.pincode || "",
                city: item.city || "",
                state: item.state || "",
                address: item.address || "",
                address2: item.address2 || "",
                landmark: item.landmark || ""
            });
        } else {
            setEditingId(null);
            setFormData({
                name: "", contactPerson: "", mobileNo: "", email: "",
                pincode: "", city: "", state: "", address: "", address2: "", landmark: ""
            });
        }
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!session?.user?.customerId) {
            console.error("Missing customerId in session:", session?.user);
            alert("Error: Your account is not properly linked to a Customer Profile (Missing Customer ID). Please login with a valid Customer account.");
            return;
        }
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const isSender = activeTab === "senders";
            const arrayName = isSender ? "pickupLocations" : "receivers";

            let currentArray = session.user[arrayName] || [];

            if (editingId) {
                currentArray = currentArray.map((item: any) =>
                    (item._id === editingId || item.id === editingId) ? { ...item, ...formData } : item
                );
            } else {
                currentArray = [...currentArray, { ...formData, id: `ADDR${Date.now()}` }];
            }

            const response = await fetch(`/api/customers/${session.user.customerId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    [arrayName]: currentArray
                })
            });

            if (response.ok) {
                await refreshSession();
                setIsDialogOpen(false);
            } else {
                alert("Failed to save address");
            }
        } catch (error) {
            console.error("Error saving address:", error);
            alert("Error saving address");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, isSender: boolean) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        if (!session?.user?.customerId) {
            alert("Error: Your account is not properly linked to a Customer Profile (Missing Customer ID).");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const arrayName = isSender ? "pickupLocations" : "receivers";
            const currentArray = session.user[arrayName] || [];
            const newArray = currentArray.filter((item: any) => item._id !== id && item.id !== id);

            const response = await fetch(`/api/customers/${session.user.customerId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    [arrayName]: newArray
                })
            });

            if (response.ok) {
                await refreshSession();
            }
        } catch (error) {
            console.error("Error deleting address:", error);
        }
    };

    const AddressCard = ({ data, isSender }: { data: any, isSender: boolean }) => (
        <Card className="hover:border-primary/40 transition-colors">
            <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            {isSender ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{data.name}</h3>
                            {data.contactPerson && <p className="text-sm text-muted-foreground">{data.contactPerson}</p>}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(data)} className="h-8 w-8">
                            <Edit2 className="h-4 w-4 text-muted-foreground hover:text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(data._id || data.id, isSender)} className="h-8 w-8 hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                    </div>
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>{data.mobileNo || data.phone || "N/A"}</span>
                    </div>

                    <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                        <div>
                            <p>{data.address}</p>
                            {data.address2 && <p>{data.address2}</p>}
                            {data.landmark && <p>Near: {data.landmark}</p>}
                            <p className="mt-1 font-medium">{data.city}{data.state ? `, ${data.state}` : ""} - {data.pincode}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Address Book</h1>
                    <p className="text-muted-foreground">Manage your frequent senders and receivers.</p>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" /> Add New {activeTab === "senders" ? "Sender" : "Receiver"}
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="senders">Senders (Pickup)</TabsTrigger>
                    <TabsTrigger value="receivers">Receivers (Drop)</TabsTrigger>
                </TabsList>

                <TabsContent value="senders" className="mt-6">
                    {(!session?.user?.pickupLocations || session.user.pickupLocations.length === 0) ? (
                        <div className="text-center py-12 border rounded-lg bg-muted/10">
                            <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-medium text-foreground">No Senders Found</h3>
                            <p className="text-sm text-muted-foreground mt-1 mb-4">Add your frequent pickup locations to save time during booking.</p>
                            <Button variant="outline" onClick={() => handleOpenDialog()}>Add Sender</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {session.user.pickupLocations.map((loc: any) => (
                                <AddressCard key={loc._id || loc.id} data={loc} isSender={true} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="receivers" className="mt-6">
                    {(!session?.user?.receivers || session.user.receivers.length === 0) ? (
                        <div className="text-center py-12 border rounded-lg bg-muted/10">
                            <User className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-medium text-foreground">No Receivers Found</h3>
                            <p className="text-sm text-muted-foreground mt-1 mb-4">Add your frequent destinations to speed up your booking process.</p>
                            <Button variant="outline" onClick={() => handleOpenDialog()}>Add Receiver</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {session.user.receivers.map((rec: any) => (
                                <AddressCard key={rec._id || rec.id} data={rec} isSender={false} />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit" : "Add New"} {activeTab === "senders" ? "Sender" : "Receiver"}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="mb-4">
                            <GooglePlacesAutocomplete
                                onSelect={(details) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        name: details.name || prev.name,
                                        mobileNo: details.phone || prev.mobileNo,
                                        pincode: details.pincode || prev.pincode,
                                        city: details.city || prev.city,
                                        state: details.state || prev.state,
                                        address: details.address || prev.address
                                    }));
                                }}
                                label="Auto-fill details from Google Maps"
                                placeholder="Search business name or location..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Full Name / Company Name *</Label>
                                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            {activeTab === "senders" && (
                                <div className="space-y-2">
                                    <Label>Contact Person</Label>
                                    <Input value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} />
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label>Mobile Number *</Label>
                                <Input value={formData.mobileNo} maxLength={10} onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value.replace(/\D/g, '') })} />
                            </div>

                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="space-y-2">
                                <Label>Pincode *</Label>
                                <Input value={formData.pincode} maxLength={6} onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })} />
                            </div>
                            <div className="space-y-2">
                                <Label>City</Label>
                                <Input value={formData.city} readOnly className="bg-muted" />
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <Label>Address Line 1 *</Label>
                            <Input value={formData.address} placeholder="Flat, Building, Street" onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Address Line 2 (Optional)</Label>
                                <Input value={formData.address2} placeholder="Area, Sector" onChange={(e) => setFormData({ ...formData, address2: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Landmark (Optional)</Label>
                                <Input value={formData.landmark} placeholder="Near..." onChange={(e) => setFormData({ ...formData, landmark: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isLoading || !formData.name || !formData.mobileNo || !formData.pincode || !formData.address}>
                            {isLoading ? "Saving..." : "Save Address"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
