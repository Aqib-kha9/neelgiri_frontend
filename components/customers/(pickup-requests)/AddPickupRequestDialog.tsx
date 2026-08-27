"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AvailablePickupShipment, pincodeApi, pickupApi } from "@/lib/api-services";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CustomerOption {
    _id: string;
    userId?: string;
    name: string;
    mobileNo?: string;
    portalEmail?: string;
}

interface AddPickupRequestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated?: () => void;
}

export const AddPickupRequestDialog = ({ open, onOpenChange, onCreated }: AddPickupRequestDialogProps) => {
    const { session } = useAuth();
    const role = session?.user?.role || "";
    const isCustomer = role === "customer";
    const [customers, setCustomers] = useState<CustomerOption[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState("");
    const [formData, setFormData] = useState({
        customerName: "",
        customerPhone: "",
        pickupLine1: "",
        pickupCity: "",
        pickupState: "",
        pickupPincode: "",
        pickupDate: "",
        pickupTime: "",
        packageType: "",
        specialInstructions: "",
        priority: "normal",
    });
    const [submitting, setSubmitting] = useState(false);
    const [availableShipments, setAvailableShipments] = useState<AvailablePickupShipment[]>([]);
    const [selectedShipmentIds, setSelectedShipmentIds] = useState<string[]>([]);
    const [loadingShipments, setLoadingShipments] = useState(false);
    const autoFilledForOpen = useRef(false);

    const selectedShipments = availableShipments.filter((shipment) =>
        selectedShipmentIds.includes(shipment._id)
    );
    const selectedWeight = selectedShipments.reduce(
        (total, shipment) => total + (Number(shipment.weight) || 0),
        0
    );
    const selectedOriginPincodes = Array.from(new Set(
        selectedShipments
            .map((shipment) => String(shipment.sender?.pincode || '').trim())
            .filter(Boolean)
    ));

    const loadAvailableShipments = async (customerId?: string) => {
        if (!isCustomer && !customerId) {
            setAvailableShipments([]);
            setSelectedShipmentIds([]);
            return;
        }
        setLoadingShipments(true);
        try {
            const shipments = await pickupApi.availableShipments(customerId);
            setAvailableShipments(shipments);
            setSelectedShipmentIds([]);
            if (shipments.length === 0) {
                toast.info('No booked shipments are currently available for pickup');
            }
        } catch (error: any) {
            setAvailableShipments([]);
            setSelectedShipmentIds([]);
            toast.error(error?.message || 'Failed to load booked shipments');
        } finally {
            setLoadingShipments(false);
        }
    };

    useEffect(() => {
        if (!open || isCustomer) return;
        apiClient.get<CustomerOption[]>('/customers')
            .then(setCustomers)
            .catch(() => toast.error('Failed to load customers'));
    }, [open, isCustomer]);

    useEffect(() => {
        if (!open) {
            autoFilledForOpen.current = false;
            return;
        }
        if (!isCustomer || !session?.user || autoFilledForOpen.current) return;

        autoFilledForOpen.current = true;
        setFormData((current) => ({
            ...current,
            customerName: session.user.name,
            customerPhone: session.user.phone || session.user.mobileNo || '',
        }));
    }, [open, isCustomer, session?.user]);

    useEffect(() => {
        if (!open) return;
        if (isCustomer) {
            void loadAvailableShipments();
        } else if (selectedCustomerId) {
            void loadAvailableShipments(selectedCustomerId);
        }
    }, [open, isCustomer, selectedCustomerId]);

    useEffect(() => {
        if (selectedOriginPincodes.length === 1) {
            setFormData((current) => ({
                ...current,
                pickupPincode: selectedOriginPincodes[0],
            }));
        }
    }, [selectedOriginPincodes.join('|')]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const selectedCustomer = customers.find((customer) => customer._id === selectedCustomerId);
            const trimmedPincode = formData.pickupPincode.trim();
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const pickupDate = formData.pickupDate
                ? new Date(`${formData.pickupDate}T00:00:00`)
                : null;

            if (!isCustomer && (!selectedCustomerId || !selectedCustomer?.userId)) {
                toast.error('Select a customer with portal access');
                return;
            }
            if (!formData.customerName.trim() || !formData.customerPhone.trim()) {
                toast.error('Enter a pickup contact name and phone number');
                return;
            }
            if (!formData.pickupLine1.trim() || !formData.pickupCity.trim() || !formData.pickupState.trim()) {
                toast.error('Complete the pickup address');
                return;
            }
            if (!/^\d{6}$/.test(trimmedPincode)) {
                toast.error('Enter a valid 6-digit pincode');
                return;
            }
            try {
                await pincodeApi.check(trimmedPincode);
            } catch (error: any) {
                toast.error(error?.message || 'Pickup service is not available for this pincode');
                return;
            }
            if (!pickupDate || Number.isNaN(pickupDate.getTime()) || pickupDate < today) {
                toast.error('Select today or a future pickup date');
                return;
            }
            if (!['09-12', '12-15', '15-18', '18-21', 'ANY'].includes(formData.pickupTime)) {
                toast.error('Select a pickup time slot');
                return;
            }
            if (!['normal', 'high', 'urgent'].includes(formData.priority)) {
                toast.error('Select a valid priority');
                return;
            }
            if (!formData.packageType) {
                toast.error('Select a package type');
                return;
            }
            if (selectedShipments.length === 0) {
                toast.error('Select at least one booked shipment');
                return;
            }
            if (selectedOriginPincodes.length !== 1) {
                toast.error('Selected shipments must have the same origin pincode');
                return;
            }
            if (trimmedPincode !== selectedOriginPincodes[0]) {
                toast.error('Pickup pincode must match the selected shipment origin pincode');
                return;
            }

            await pickupApi.create({
                ...(isCustomer
                    ? { customer: session?.user.id }
                    : { customer: selectedCustomer?.userId, customerId: selectedCustomer?._id }),
                pickupAddress: {
                    name: formData.customerName,
                    phone: formData.customerPhone,
                    addressLine1: formData.pickupLine1,
                    city: formData.pickupCity,
                    state: formData.pickupState,
                    pincode: trimmedPincode,
                },
                preferredDate: formData.pickupDate,
                preferredTimeSlot: formData.pickupTime as "09-12" | "12-15" | "15-18" | "18-21" | "ANY",
                shipments: selectedShipments.map((shipment) => ({
                    awb: shipment.awb,
                    weight: shipment.weight,
                    description: shipment.contents || '',
                })),
                priority: formData.priority as "normal" | "high" | "urgent",
                packageType: formData.packageType,
                notes: formData.specialInstructions || undefined,
            });
            toast.success("Pickup request created successfully");
            onOpenChange(false);
            onCreated?.();
            setFormData({
                customerName: isCustomer ? session?.user.name || "" : "",
                customerPhone: isCustomer ? session?.user.phone || session?.user.mobileNo || "" : "",
                pickupLine1: "",
                pickupCity: "",
                pickupState: "",
                pickupPincode: "",
                pickupDate: "",
                pickupTime: "",
                packageType: "",
                specialInstructions: "",
                priority: "normal",
            });
            setSelectedCustomerId("");
            setAvailableShipments([]);
            setSelectedShipmentIds([]);
        } catch (error: any) {
            toast.error(error.message || "Failed to create pickup request");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Pickup Request</DialogTitle>
                    <DialogDescription>
                        Schedule a new pickup. Provide pickup location and package details.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {!isCustomer && (
                            <div className="space-y-2">
                                <Label htmlFor="customer">Customer *</Label>
                                <Select value={selectedCustomerId} onValueChange={(value) => {
                                    const customer = customers.find((item) => item._id === value);
                                    setSelectedCustomerId(value);
                                    setFormData((current) => ({
                                        ...current,
                                        customerName: customer?.name || "",
                                        customerPhone: customer?.mobileNo || "",
                                    }));
                                }}>
                                    <SelectTrigger id="customer"><SelectValue placeholder="Select customer" /></SelectTrigger>
                                    <SelectContent>
                                        {customers.filter((customer) => customer.userId).map((customer) => (
                                            <SelectItem key={customer._id} value={customer._id}>{customer.name}{customer.mobileNo ? ` - ${customer.mobileNo}` : ""}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="customerName">Pickup Contact Name *</Label>
                                <Input
                                    id="customerName"
                                    placeholder="Enter customer name"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="customerPhone">Phone Number *</Label>
                                <Input
                                    id="customerPhone"
                                    type="tel"
                                    placeholder="+91 XXXXX XXXXX"
                                    value={formData.customerPhone}
                                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <Label>Booked Shipments *</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Select one or more booked parcels for this pickup.
                                    </p>
                                </div>
                                <div className="text-right text-xs text-muted-foreground">
                                    <div>{selectedShipments.length} parcel{selectedShipments.length === 1 ? "" : "s"} selected</div>
                                    <div>{selectedWeight.toFixed(2)} kg total</div>
                                </div>
                            </div>
                            <div className="rounded-md border bg-muted/20 p-2">
                                {loadingShipments ? (
                                    <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Loading booked shipments...
                                    </div>
                                ) : availableShipments.length === 0 ? (
                                    <p className="py-6 text-center text-sm text-muted-foreground">
                                        No eligible booked shipments are available for pickup.
                                    </p>
                                ) : (
                                    <div className="max-h-56 space-y-2 overflow-y-auto">
                                        {availableShipments.map((shipment) => {
                                            const shipmentOrigin = String(shipment.sender?.pincode || "").trim();
                                            const selectedOrigin = selectedOriginPincodes[0];
                                            const incompatible = Boolean(
                                                selectedOrigin && shipmentOrigin && shipmentOrigin !== selectedOrigin
                                            );
                                            const checked = selectedShipmentIds.includes(shipment._id);

                                            return (
                                                <label
                                                    key={shipment._id}
                                                    className={`flex cursor-pointer gap-3 rounded-md border p-3 transition-colors ${checked ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                                                        } ${incompatible ? "cursor-not-allowed opacity-50" : ""}`}
                                                >
                                                    <Checkbox
                                                        checked={checked}
                                                        disabled={incompatible}
                                                        onCheckedChange={(value) => {
                                                            if (value) {
                                                                setSelectedShipmentIds((current) => [...current, shipment._id]);
                                                            } else {
                                                                setSelectedShipmentIds((current) => current.filter((id) => id !== shipment._id));
                                                            }
                                                        }}
                                                        aria-label={`Select shipment ${shipment.awb}`}
                                                    />
                                                    <span className="min-w-0 flex-1">
                                                        <span className="flex flex-wrap items-center justify-between gap-2 text-sm font-medium">
                                                            <span className="font-mono">{shipment.awb}</span>
                                                            <span>{Number(shipment.weight || 0).toFixed(2)} kg</span>
                                                        </span>
                                                        <span className="mt-1 block truncate text-xs text-muted-foreground">
                                                            To: {shipment.receiver?.name || "Receiver"}
                                                            {shipment.receiver?.city ? `, ${shipment.receiver.city}` : ""}
                                                            {shipment.receiver?.pincode ? ` - ${shipment.receiver.pincode}` : ""}
                                                        </span>
                                                        <span className="mt-1 block text-xs text-muted-foreground">
                                                            Origin: {shipmentOrigin || "Not specified"}
                                                            {shipment.contents ? ` | ${shipment.contents}` : ""}
                                                        </span>
                                                        {incompatible && (
                                                            <span className="mt-1 block text-xs text-destructive">
                                                                Different origin pincode; select shipments from {selectedOrigin}.
                                                            </span>
                                                        )}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pickupLine1">Pickup Address Line 1 *</Label>
                            <Textarea
                                id="pickupLine1"
                                placeholder="Enter complete pickup address"
                                value={formData.pickupLine1}
                                onChange={(e) => setFormData({ ...formData, pickupLine1: e.target.value })}
                                rows={2}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pickupCity">City *</Label>
                                <Input
                                    id="pickupCity"
                                    placeholder="City"
                                    value={formData.pickupCity}
                                    onChange={(e) => setFormData({ ...formData, pickupCity: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pickupState">State *</Label>
                                <Input
                                    id="pickupState"
                                    placeholder="State"
                                    value={formData.pickupState}
                                    onChange={(e) => setFormData({ ...formData, pickupState: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pickupPincode">Pincode *</Label>
                                <Input
                                    id="pickupPincode"
                                    placeholder="6-digit pincode"
                                    value={formData.pickupPincode}
                                    onChange={(e) => setFormData({ ...formData, pickupPincode: e.target.value })}
                                    maxLength={6}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pickupDate">Pickup Date *</Label>
                                <Input
                                    id="pickupDate"
                                    type="date"
                                    value={formData.pickupDate}
                                    onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pickupTime">Preferred Time Slot *</Label>
                                <Select value={formData.pickupTime} onValueChange={(value) => setFormData({ ...formData, pickupTime: value })}>
                                    <SelectTrigger id="pickupTime">
                                        <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="09-12">9 AM - 12 PM</SelectItem>
                                        <SelectItem value="12-15">12 PM - 3 PM</SelectItem>
                                        <SelectItem value="15-18">3 PM - 6 PM</SelectItem>
                                        <SelectItem value="18-21">6 PM - 9 PM</SelectItem>
                                        <SelectItem value="ANY">Any time</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority *</Label>
                                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                                    <SelectTrigger id="priority">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="normal">Normal</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="urgent">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="packageType">Package Type *</Label>
                                <Select value={formData.packageType} onValueChange={(value) => setFormData({ ...formData, packageType: value })}>
                                    <SelectTrigger id="packageType">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Document">Document</SelectItem>
                                        <SelectItem value="Parcel">Parcel</SelectItem>
                                        <SelectItem value="Fragile">Fragile</SelectItem>
                                        <SelectItem value="Perishable">Perishable</SelectItem>
                                        <SelectItem value="Electronics">Electronics</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="specialInstructions">Special Instructions</Label>
                            <Textarea
                                id="specialInstructions"
                                placeholder="Any special handling requirements..."
                                value={formData.specialInstructions}
                                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                                rows={2}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Create Request
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
