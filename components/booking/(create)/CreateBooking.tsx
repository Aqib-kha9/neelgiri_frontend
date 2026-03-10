// @/components/booking/create/CreateBooking.tsx
"use client";

import { useState, useEffect } from "react";
import { Printer, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DocumentSearch from "./DocumentSearch";
import PrintView from "./PrintView";
import { BookingFormData, Customer, Receiver, PickupLocation } from "./types";
import { mockCustomers } from "./mockData";

// Rate Master Configuration
const RATE_MASTER = {
  SURFACE: {
    "NON DOX": { perKg: 25, minCharge: 50 },
    DOX: { perKg: 15, minCharge: 30 },
    EXPRESS: { perKg: 40, minCharge: 80 },
    FRAGILE: { perKg: 35, minCharge: 70 },
  },
  AIR: {
    "NON DOX": { perKg: 50, minCharge: 100 },
    DOX: { perKg: 25, minCharge: 50 },
    EXPRESS: { perKg: 80, minCharge: 150 },
    FRAGILE: { perKg: 70, minCharge: 140 },
  },
};

// Fuel surcharge percentage based on distance
const FUEL_SURCHARGE = {
  LOCAL: 2, // Within city
  ZONE_A: 5, // Same zone
  ZONE_B: 8, // Neighbouring zone
  ZONE_C: 12, // Far zone
};

const CreateBooking = () => {
  const [showPrint, setShowPrint] = useState(false);
  const [bookingNumber, setBookingNumber] = useState("");

  const [manualSender, setManualSender] = useState({
    name: "",
    contactPerson: "",
    address: "",
    city: "",
    pincode: "",
    mobileNo: "",
    gstin: "",
  });

  const [manualReceiver, setManualReceiver] = useState<Receiver>({
    id: "manual-receiver",
    name: "",
    address: "",
    city: "",
    pincode: "",
    mobileNo: "",
    email: "",
  });

  const [newPickupLocation, setNewPickupLocation] = useState({
    name: "",
    address: "",
    city: "",
    pincode: "",
    contactPerson: "",
    mobileNo: "",
  });

  const [newReceiver, setNewReceiver] = useState({
    name: "",
    address: "",
    city: "",
    pincode: "",
    mobileNo: "",
    email: "",
  });

  const [showAddPickupLocation, setShowAddPickupLocation] = useState(false);
  const [showAddReceiver, setShowAddReceiver] = useState(false);

  const [formData, setFormData] = useState<BookingFormData>({
    documentNo: "",
    sender: null,
    receiver: null,
    pickupLocation: null,
    // Shipment Details
    contents: "NON DOX",
    mode: "SURFACE",
    paymentMode: "",
    forwardTo: "",
    thru: "",
    // Weight & Dimensions
    weight: "",
    length: "",
    breadth: "",
    height: "",
    volumetricWeight: "",
    chargeableWeight: "",
    // Charges
    invoiceValue: "",
    fovAmt: "",
    baseFreight: "",
    rate: "",
    charges: "",
    otherAddLess: "",
    netCharges: "",
    disc: "",
    fuelPercent: "",
    taxPercent: "",
    taxAmount: "",
    tax: "",
    netAmount: "",
    // Compliance
    ewayBillNo: "",
    ewayValidityStart: "",
    ewayValidityEnd: "",
    // Misc
    remark: "",
    bookingSource: "BRANCH",
    status: "BOOKED",
    // New fields for rate calculation
    distanceZone: "ZONE_A",
    serviceType: "STANDARD",
    packagingType: "REGULAR",
    insuranceRequired: false,
    declaredValue: "",
    codAmount: "",
  });

  // Calculate freight based on rate master
  const calculateFreight = () => {
    const chargeableWeight = parseFloat(formData.chargeableWeight) || 0;
    const mode = formData.mode as keyof typeof RATE_MASTER;
    const contents = formData.contents as keyof typeof RATE_MASTER.SURFACE;

    if (chargeableWeight > 0 && mode && contents) {
      const rateConfig = RATE_MASTER[mode]?.[contents];
      if (rateConfig) {
        const freight = Math.max(
          rateConfig.minCharge,
          chargeableWeight * rateConfig.perKg
        );
        return freight;
      }
    }
    return 0;
  };

  // Calculate fuel surcharge
  const calculateFuelSurcharge = () => {
    const baseFreight = parseFloat(formData.baseFreight) || 0;
    const zone = formData.distanceZone as keyof typeof FUEL_SURCHARGE;
    const fuelPercent = FUEL_SURCHARGE[zone] || 0;

    return (baseFreight * fuelPercent) / 100;
  };

  // Auto-calculate volumetric weight
  useEffect(() => {
    const length = parseFloat(formData.length) || 0;
    const breadth = parseFloat(formData.breadth) || 0;
    const height = parseFloat(formData.height) || 0;

    if (length > 0 && breadth > 0 && height > 0) {
      const volumetric = (length * breadth * height) / 5000;
      setFormData((prev) => ({
        ...prev,
        volumetricWeight: volumetric.toFixed(3),
      }));
    }
  }, [formData.length, formData.breadth, formData.height]);

  // Auto-calculate chargeable weight
  useEffect(() => {
    const actualWeight = parseFloat(formData.weight) || 0;
    const volumetricWeight = parseFloat(formData.volumetricWeight) || 0;

    const chargeable = Math.max(actualWeight, volumetricWeight);
    setFormData((prev) => ({
      ...prev,
      chargeableWeight: chargeable.toFixed(3),
    }));
  }, [formData.weight, formData.volumetricWeight]);

  // Auto-calculate base freight when chargeable weight or mode/contents changes
  useEffect(() => {
    const freight = calculateFreight();
    if (freight > 0) {
      setFormData((prev) => ({
        ...prev,
        baseFreight: freight.toFixed(2),
      }));
    }
  }, [formData.chargeableWeight, formData.mode, formData.contents]);

  // Auto-calculate all charges
  useEffect(() => {
    const baseFreight = parseFloat(formData.baseFreight) || 0;
    const otherAddLess = parseFloat(formData.otherAddLess) || 0;
    const fovAmt = parseFloat(formData.fovAmt) || 0;
    const fuelSurcharge = calculateFuelSurcharge();
    const taxPercent = parseFloat(formData.taxPercent) || 18;

    const beforeTax = baseFreight + otherAddLess + fuelSurcharge + fovAmt;
    const taxAmount = beforeTax * (taxPercent / 100);
    const netAmount = beforeTax + taxAmount;

    setFormData((prev) => ({
      ...prev,
      fuelPercent: (
        FUEL_SURCHARGE[prev.distanceZone as keyof typeof FUEL_SURCHARGE] || 0
      ).toString(),
      taxAmount: taxAmount.toFixed(2),
      netAmount: netAmount.toFixed(2),
    }));
  }, [
    formData.baseFreight,
    formData.otherAddLess,
    formData.fovAmt,
    formData.distanceZone,
    formData.taxPercent,
  ]);

  const handleDocumentSelect = (customer: Customer) => {
    setFormData((prev) => ({
      ...prev,
      documentNo: customer.documentNo,
      sender: customer,
      receiver:
        customer.hasReceiver && customer.receivers.length > 0
          ? customer.receivers[0]
          : null,
      pickupLocation:
        customer.usePickupLocation && customer.pickupLocations.length > 0
          ? customer.pickupLocations[0]
          : null,
    }));

    setManualSender({
      name: "",
      contactPerson: "",
      address: "",
      city: "",
      pincode: "",
      mobileNo: "",
      gstin: "",
    });
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleManualSenderChange = (field: string, value: string) => {
    setManualSender((prev) => ({ ...prev, [field]: value }));

    const tempSender: Customer = {
      id: "manual-sender",
      code: "MANUAL",
      documentNo: formData.documentNo || "MANUAL",
      name: field === "name" ? value : manualSender.name,
      contactPerson:
        field === "contactPerson" ? value : manualSender.contactPerson,
      address1: field === "address" ? value : manualSender.address,
      address2: "",
      city: field === "city" ? value : manualSender.city,
      station: "",
      pincode: field === "pincode" ? value : manualSender.pincode,
      mobileNo: field === "mobileNo" ? value : manualSender.mobileNo,
      phoneO: "",
      phoneR: "",
      email: "",
      hasReceiver: false,
      receivers: [],
      usePickupLocation: false,
      pickupLocations: [],
      status: "active",
      gstin: field === "gstin" ? value : manualSender.gstin,
      // New fields from CustomerForm
      fuelCharges: 0,
      fovCharges: 0,
      quotationType: "Standard",
      awt: 0,
      category: "CUSTOMER",
      paymentMode: "Cash",
      accountGroup: "General",
      isInterStateDealer: false,
      bookedBy: "ADMIN",
      bookedDate: new Date().toLocaleString("en-IN"),
      remark: "",
      billingType: "PREPAID",
      creditLimit: 0,
      creditDays: 0,
      defaultPaymentMode: "CASH",
      kycStatus: "NOT_VERIFIED",
      kycDocumentType: "",
      kycDocumentNumber: "",
    };

    setFormData((prev) => ({ ...prev, sender: tempSender }));
  };

  const handleManualReceiverChange = (field: keyof Receiver, value: string) => {
    setManualReceiver((prev) => ({ ...prev, [field]: value }));
    const updatedReceiver = { ...manualReceiver, [field]: value };
    setFormData((prev) => ({ ...prev, receiver: updatedReceiver }));
  };

  const handlePickupLocationChange = (
    pickupLocation: PickupLocation | null
  ) => {
    setFormData((prev) => ({ ...prev, pickupLocation }));
  };

  const handleReceiverChange = (receiver: Receiver | null) => {
    setFormData((prev) => ({ ...prev, receiver }));
  };

  const handleAddPickupLocation = () => {
    if (!formData.sender) return;

    const newLocation: PickupLocation = {
      id: `pickup-${Date.now()}`,
      name:
        newPickupLocation.name ||
        `Location ${formData.sender.pickupLocations.length + 1}`,
      address: newPickupLocation.address,
      city: newPickupLocation.city,
      pincode: newPickupLocation.pincode,
      contactPerson: newPickupLocation.contactPerson,
      mobileNo: newPickupLocation.mobileNo,
    };

    // Update sender with new pickup location
    const updatedSender = {
      ...formData.sender,
      pickupLocations: [
        ...(formData.sender.pickupLocations || []),
        newLocation,
      ],
      usePickupLocation: true,
    };

    setFormData((prev) => ({
      ...prev,
      sender: updatedSender,
      pickupLocation: newLocation,
    }));

    // Reset form and hide
    setNewPickupLocation({
      name: "",
      address: "",
      city: "",
      pincode: "",
      contactPerson: "",
      mobileNo: "",
    });
    setShowAddPickupLocation(false);
  };

  const handleAddReceiver = () => {
    if (!formData.sender) return;

    const newReceiverObj: Receiver = {
      id: `rec-${Date.now()}`,
      name: newReceiver.name,
      address: newReceiver.address,
      city: newReceiver.city,
      pincode: newReceiver.pincode,
      mobileNo: newReceiver.mobileNo,
      email: newReceiver.email || "",
    };

    // Update sender with new receiver
    const updatedSender = {
      ...formData.sender,
      receivers: [...(formData.sender.receivers || []), newReceiverObj],
      hasReceiver: true,
    };

    setFormData((prev) => ({
      ...prev,
      sender: updatedSender,
      receiver: newReceiverObj,
    }));

    // Reset form and hide
    setNewReceiver({
      name: "",
      address: "",
      city: "",
      pincode: "",
      mobileNo: "",
      email: "",
    });
    setShowAddReceiver(false);
  };

  const generateBookingNumber = () => {
    const prefix = "BK";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${prefix}${timestamp}${random}`;
  };

  const handleCreateBooking = () => {
    const bookingNo = generateBookingNumber();
    setBookingNumber(bookingNo);
    setShowPrint(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewBooking = () => {
    setShowPrint(false);
    setManualSender({
      name: "",
      contactPerson: "",
      address: "",
      city: "",
      pincode: "",
      mobileNo: "",
      gstin: "",
    });
    setManualReceiver({
      id: "manual-receiver",
      name: "",
      address: "",
      city: "",
      pincode: "",
      mobileNo: "",
      email: "",
    });
    setNewPickupLocation({
      name: "",
      address: "",
      city: "",
      pincode: "",
      contactPerson: "",
      mobileNo: "",
    });
    setNewReceiver({
      name: "",
      address: "",
      city: "",
      pincode: "",
      mobileNo: "",
      email: "",
    });
    setFormData({
      documentNo: "",
      sender: null,
      receiver: null,
      pickupLocation: null,
      contents: "NON DOX",
      mode: "SURFACE",
      paymentMode: "",
      forwardTo: "",
      thru: "",
      weight: "",
      length: "",
      breadth: "",
      height: "",
      volumetricWeight: "",
      chargeableWeight: "",
      invoiceValue: "",
      fovAmt: "",
      baseFreight: "",
      rate: "",
      charges: "",
      otherAddLess: "",
      netCharges: "",
      disc: "",
      fuelPercent: "",
      taxPercent: "",
      taxAmount: "",
      tax: "",
      netAmount: "",
      ewayBillNo: "",
      ewayValidityStart: "",
      ewayValidityEnd: "",
      remark: "",
      bookingSource: "BRANCH",
      status: "BOOKED",
      distanceZone: "ZONE_A",
      serviceType: "STANDARD",
      packagingType: "REGULAR",
      insuranceRequired: false,
      declaredValue: "",
      codAmount: "",
    });
  };

  const handleClearSender = () => {
    setFormData((prev) => ({ ...prev, sender: null }));
  };

  // Custom input handler for numbers to allow manual typing
  const handleNumberInput = (field: string, value: string) => {
    // Allow empty string or numbers with decimal
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      handleFormChange(field, value);
    }
  };

  if (showPrint) {
    return (
      <div className="p-6 space-y-6 print:p-0 print:space-y-0">
        <div className="flex justify-between items-center print:hidden">
          <h1 className="text-2xl font-bold">Booking Print Preview</h1>
          <div className="flex gap-3">
            <Button
              onClick={handlePrint}
              className="gap-2 rounded-xl bg-primary text-primary-foreground"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button
              onClick={handleNewBooking}
              className="gap-2 rounded-xl bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
              New Booking
            </Button>
          </div>
        </div>
        <PrintView formData={formData} bookingNumber={bookingNumber} />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-2">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Create Booking
              </h1>
              <p className="text-muted-foreground">
                Create new shipment bookings quickly
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={handleCreateBooking}
          disabled={!formData.sender || !formData.receiver}
          className="gap-2 rounded-xl bg-primary text-primary-foreground"
        >
          <Printer className="h-4 w-4" />
          Create & Print Booking
        </Button>
      </div>

      {/* Document Search - Full Width */}
      <Card className="rounded-2xl border-border/70">
        <CardContent className="p-6">
          <DocumentSearch
            onDocumentSelect={handleDocumentSelect}
            customers={mockCustomers}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Side - Sender Card */}
        <Card className="rounded-2xl border-border/70">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Sender Details</h2>
              {formData.sender && (
                <Button
                  onClick={handleClearSender}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Clear & Enter Manually
                </Button>
              )}
            </div>

            {/* Sender Information */}
            <div className="space-y-4 mb-6">
              {formData.sender && formData.sender.id !== "manual-sender" ? (
                <div className="space-y-3">
                  {/* Pickup Location Dropdown with Add Button */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">
                        Pickup Location
                      </label>
                      <Button
                        type="button"
                        onClick={() => setShowAddPickupLocation(true)}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Location
                      </Button>
                    </div>

                    {showAddPickupLocation ? (
                      <div className="p-3 border rounded-lg bg-blue-50 space-y-3">
                        <h4 className="font-medium text-sm text-blue-800">
                          Add New Pickup Location
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={newPickupLocation.name}
                            onChange={(e) =>
                              setNewPickupLocation((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="p-2 border rounded text-sm"
                            placeholder="Location Name"
                          />
                          <input
                            value={newPickupLocation.contactPerson}
                            onChange={(e) =>
                              setNewPickupLocation((prev) => ({
                                ...prev,
                                contactPerson: e.target.value,
                              }))
                            }
                            className="p-2 border rounded text-sm"
                            placeholder="Contact Person"
                          />
                        </div>
                        <input
                          value={newPickupLocation.address}
                          onChange={(e) =>
                            setNewPickupLocation((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                          className="w-full p-2 border rounded text-sm"
                          placeholder="Address"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            value={newPickupLocation.city}
                            onChange={(e) =>
                              setNewPickupLocation((prev) => ({
                                ...prev,
                                city: e.target.value,
                              }))
                            }
                            className="p-2 border rounded text-sm"
                            placeholder="City"
                          />
                          <input
                            value={newPickupLocation.pincode}
                            onChange={(e) =>
                              setNewPickupLocation((prev) => ({
                                ...prev,
                                pincode: e.target.value,
                              }))
                            }
                            className="p-2 border rounded text-sm"
                            placeholder="Pincode"
                          />
                          <input
                            value={newPickupLocation.mobileNo}
                            onChange={(e) =>
                              setNewPickupLocation((prev) => ({
                                ...prev,
                                mobileNo: e.target.value,
                              }))
                            }
                            className="p-2 border rounded text-sm"
                            placeholder="Mobile No"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleAddPickupLocation}
                            size="sm"
                            className="text-xs h-7"
                          >
                            Save Location
                          </Button>
                          <Button
                            onClick={() => setShowAddPickupLocation(false)}
                            variant="outline"
                            size="sm"
                            className="text-xs h-7"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <select
                        value={formData.pickupLocation?.id || ""}
                        onChange={(e) => {
                          const selectedLocation =
                            formData.sender?.pickupLocations.find(
                              (loc) => loc.id === e.target.value
                            ) || null;
                          handlePickupLocationChange(selectedLocation);
                        }}
                        className="w-full p-2 border rounded-lg bg-white"
                      >
                        <option value="">Select Pickup Location</option>
                        {formData.sender?.pickupLocations?.map((location) => (
                          <option key={location.id} value={location.id}>
                            {location.name} - {location.address}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <input
                        value={formData.sender.name}
                        readOnly
                        className="w-full p-2 border rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Contact Person
                      </label>
                      <input
                        value={formData.sender.contactPerson}
                        readOnly
                        className="w-full p-2 border rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Address</label>
                    <input
                      value={formData.sender.address1}
                      readOnly
                      className="w-full p-2 border rounded-lg bg-gray-50"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-medium">City</label>
                      <input
                        value={formData.sender.city}
                        readOnly
                        className="w-full p-2 border rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Pincode</label>
                      <input
                        value={formData.sender.pincode}
                        readOnly
                        className="w-full p-2 border rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Mobile No</label>
                      <input
                        value={formData.sender.mobileNo}
                        readOnly
                        className="w-full p-2 border rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>
                  {formData.sender.gstin && (
                    <div>
                      <label className="text-sm font-medium">GSTIN</label>
                      <input
                        value={formData.sender.gstin}
                        readOnly
                        className="w-full p-2 border rounded-lg bg-gray-50"
                      />
                    </div>
                  )}
                </div>
              ) : (
                // Manual sender input
                <div className="space-y-3 p-3 border rounded-lg bg-blue-50">
                  <h4 className="font-medium text-sm text-blue-800">
                    Enter Sender Details Manually
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Name *</label>
                      <input
                        value={manualSender.name}
                        onChange={(e) =>
                          handleManualSenderChange("name", e.target.value)
                        }
                        className="w-full p-2 border rounded-lg bg-white"
                        placeholder="Enter sender name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Contact Person *
                      </label>
                      <input
                        value={manualSender.contactPerson}
                        onChange={(e) =>
                          handleManualSenderChange(
                            "contactPerson",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border rounded-lg bg-white"
                        placeholder="Enter contact person"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Address *</label>
                    <input
                      value={manualSender.address}
                      onChange={(e) =>
                        handleManualSenderChange("address", e.target.value)
                      }
                      className="w-full p-2 border rounded-lg bg-white"
                      placeholder="Enter complete address"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-medium">City *</label>
                      <input
                        value={manualSender.city}
                        onChange={(e) =>
                          handleManualSenderChange("city", e.target.value)
                        }
                        className="w-full p-2 border rounded-lg bg-white"
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Pincode *</label>
                      <input
                        value={manualSender.pincode}
                        onChange={(e) =>
                          handleManualSenderChange("pincode", e.target.value)
                        }
                        className="w-full p-2 border rounded-lg bg-white"
                        placeholder="Enter pincode"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Mobile No *</label>
                      <input
                        value={manualSender.mobileNo}
                        onChange={(e) =>
                          handleManualSenderChange("mobileNo", e.target.value)
                        }
                        className="w-full p-2 border rounded-lg bg-white"
                        placeholder="Enter mobile number"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">GSTIN</label>
                    <input
                      value={manualSender.gstin}
                      onChange={(e) =>
                        handleManualSenderChange("gstin", e.target.value)
                      }
                      className="w-full p-2 border rounded-lg bg-white"
                      placeholder="Enter GSTIN (optional)"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Shipment Details */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Shipment Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contents</label>
                  <select
                    value={formData.contents}
                    onChange={(e) =>
                      handleFormChange("contents", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="NON DOX">NON DOX (Parcel)</option>
                    <option value="DOX">DOX (Documents)</option>
                    <option value="EXPRESS">Express</option>
                    <option value="FRAGILE">Fragile</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mode</label>
                  <select
                    value={formData.mode}
                    onChange={(e) => handleFormChange("mode", e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="SURFACE">Surface</option>
                    <option value="AIR">Air</option>
                    <option value="EXPRESS">Express</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Distance Zone</label>
                  <select
                    value={formData.distanceZone}
                    onChange={(e) =>
                      handleFormChange("distanceZone", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="LOCAL">Local (Within City)</option>
                    <option value="ZONE_A">Zone A (0-300 km)</option>
                    <option value="ZONE_B">Zone B (300-800 km)</option>
                    <option value="ZONE_C">Zone C (800+ km)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Mode</label>
                  <select
                    value={formData.paymentMode}
                    onChange={(e) =>
                      handleFormChange("paymentMode", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="">Select</option>
                    <option value="CASH">Cash</option>
                    <option value="CREDIT">Credit</option>
                    <option value="COD">COD</option>
                    <option value="PREPAID">Prepaid</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Forward To</label>
                  <input
                    value={formData.forwardTo}
                    onChange={(e) =>
                      handleFormChange("forwardTo", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                    placeholder="Destination Branch"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Service Type</label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) =>
                      handleFormChange("serviceType", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="STANDARD">Standard</option>
                    <option value="PRIORITY">Priority</option>
                    <option value="SAME_DAY">Same Day</option>
                    <option value="NEXT_DAY">Next Day</option>
                  </select>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">
                    Co-loading Vendor
                  </label>
                  <input
                    value={formData.thru}
                    onChange={(e) => handleFormChange("thru", e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white"
                    placeholder="Vendor Name (if any)"
                  />
                </div>
              </div>

              {/* Weight & Dimensions */}
              <h4 className="text-md font-medium mt-4 mb-3">
                Weight & Dimensions
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Actual Weight (kg)
                  </label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) =>
                      handleNumberInput("weight", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                    placeholder="1.970"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Chargeable Weight
                  </label>
                  <input
                    value={formData.chargeableWeight}
                    readOnly
                    className="w-full p-2 border rounded-lg bg-gray-50 font-bold"
                    placeholder="Auto-calculated"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Length (cm)</label>
                  <input
                    type="text"
                    value={formData.length}
                    onChange={(e) =>
                      handleNumberInput("length", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                    placeholder="Length"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Breadth (cm)</label>
                  <input
                    type="text"
                    value={formData.breadth}
                    onChange={(e) =>
                      handleNumberInput("breadth", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                    placeholder="Breadth"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Height (cm)</label>
                  <input
                    type="text"
                    value={formData.height}
                    onChange={(e) =>
                      handleNumberInput("height", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                    placeholder="Height"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Volumetric Weight
                  </label>
                  <input
                    value={formData.volumetricWeight}
                    readOnly
                    className="w-full p-2 border rounded-lg bg-gray-50"
                    placeholder="Auto-calculated"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Receiver Card */}
        <Card className="rounded-2xl border-border/70">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Receiver Details</h2>

            {/* Receiver Information */}
            <div className="space-y-4 mb-6">
              {formData.sender &&
                formData.sender.hasReceiver &&
                formData.sender.receivers.length > 0 &&
                formData.sender.id !== "manual-sender" ? (
                <div className="space-y-3">
                  {/* Receiver Selection Dropdown with Add Button */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">
                        Select Receiver
                      </label>
                      <Button
                        type="button"
                        onClick={() => setShowAddReceiver(true)}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Receiver
                      </Button>
                    </div>

                    {showAddReceiver ? (
                      <div className="p-3 border rounded-lg bg-blue-50 space-y-3">
                        <h4 className="font-medium text-sm text-blue-800">
                          Add New Receiver
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={newReceiver.name}
                            onChange={(e) =>
                              setNewReceiver((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="p-2 border rounded text-sm"
                            placeholder="Receiver Name"
                          />
                          <input
                            value={newReceiver.mobileNo}
                            onChange={(e) =>
                              setNewReceiver((prev) => ({
                                ...prev,
                                mobileNo: e.target.value,
                              }))
                            }
                            className="p-2 border rounded text-sm"
                            placeholder="Mobile No"
                          />
                        </div>
                        <input
                          value={newReceiver.address}
                          onChange={(e) =>
                            setNewReceiver((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                          className="w-full p-2 border rounded text-sm"
                          placeholder="Address"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            value={newReceiver.city}
                            onChange={(e) =>
                              setNewReceiver((prev) => ({
                                ...prev,
                                city: e.target.value,
                              }))
                            }
                            className="p-2 border rounded text-sm"
                            placeholder="City"
                          />
                          <input
                            value={newReceiver.pincode}
                            onChange={(e) =>
                              setNewReceiver((prev) => ({
                                ...prev,
                                pincode: e.target.value,
                              }))
                            }
                            className="p-2 border rounded text-sm"
                            placeholder="Pincode"
                          />
                          <input
                            value={newReceiver.email}
                            onChange={(e) =>
                              setNewReceiver((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            className="p-2 border rounded text-sm"
                            placeholder="Email"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleAddReceiver}
                            size="sm"
                            className="text-xs h-7"
                          >
                            Save Receiver
                          </Button>
                          <Button
                            onClick={() => setShowAddReceiver(false)}
                            variant="outline"
                            size="sm"
                            className="text-xs h-7"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <select
                        value={formData.receiver?.id || ""}
                        onChange={(e) => {
                          const selectedReceiver =
                            formData.sender?.receivers.find(
                              (rec) => rec.id === e.target.value
                            ) || null;
                          handleReceiverChange(selectedReceiver);
                        }}
                        className="w-full p-2 border rounded-lg bg-white"
                      >
                        <option value="">Select Receiver</option>
                        {formData.sender.receivers.map((receiver) => (
                          <option key={receiver.id} value={receiver.id}>
                            {receiver.name} - {receiver.city}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {formData.receiver && (
                    <div className="space-y-3 p-3 border rounded-lg bg-green-50">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium">Name</label>
                          <input
                            value={formData.receiver.name}
                            readOnly
                            className="w-full p-2 border rounded-lg bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Mobile No
                          </label>
                          <input
                            value={formData.receiver.mobileNo}
                            readOnly
                            className="w-full p-2 border rounded-lg bg-gray-50"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Address</label>
                        <input
                          value={formData.receiver.address}
                          readOnly
                          className="w-full p-2 border rounded-lg bg-gray-50"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium">City</label>
                          <input
                            value={formData.receiver.city}
                            readOnly
                            className="w-full p-2 border rounded-lg bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Pincode</label>
                          <input
                            value={formData.receiver.pincode}
                            readOnly
                            className="w-full p-2 border rounded-lg bg-gray-50"
                          />
                        </div>
                      </div>
                      {formData.receiver.email && (
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <input
                            value={formData.receiver.email}
                            readOnly
                            className="w-full p-2 border rounded-lg bg-gray-50"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                // Manual receiver input (always available)
                <div className="space-y-3 p-3 border rounded-lg bg-blue-50">
                  <h4 className="font-medium text-sm text-blue-800">
                    Enter Receiver Details Manually
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Name *</label>
                      <input
                        value={manualReceiver.name}
                        onChange={(e) =>
                          handleManualReceiverChange("name", e.target.value)
                        }
                        className="w-full p-2 border rounded-lg bg-white"
                        placeholder="Enter receiver name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Mobile No *</label>
                      <input
                        value={manualReceiver.mobileNo}
                        onChange={(e) =>
                          handleManualReceiverChange("mobileNo", e.target.value)
                        }
                        className="w-full p-2 border rounded-lg bg-white"
                        placeholder="Enter mobile number"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Address *</label>
                    <input
                      value={manualReceiver.address}
                      onChange={(e) =>
                        handleManualReceiverChange("address", e.target.value)
                      }
                      className="w-full p-2 border rounded-lg bg-white"
                      placeholder="Enter complete address"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">City *</label>
                      <input
                        value={manualReceiver.city}
                        onChange={(e) =>
                          handleManualReceiverChange("city", e.target.value)
                        }
                        className="w-full p-2 border rounded-lg bg-white"
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Pincode *</label>
                      <input
                        value={manualReceiver.pincode}
                        onChange={(e) =>
                          handleManualReceiverChange("pincode", e.target.value)
                        }
                        className="w-full p-2 border rounded-lg bg-white"
                        placeholder="Enter pincode"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={manualReceiver.email || ""}
                      onChange={(e) =>
                        handleManualReceiverChange("email", e.target.value)
                      }
                      className="w-full p-2 border rounded-lg bg-white"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Charges & Compliance */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">
                Charges & Compliance
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Invoice Value (₹)
                  </label>
                  <input
                    type="text"
                    value={formData.invoiceValue}
                    onChange={(e) =>
                      handleNumberInput("invoiceValue", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                    placeholder="Value of goods"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">FOV Amount (₹)</label>
                  <input
                    type="text"
                    value={formData.fovAmt}
                    onChange={(e) =>
                      handleNumberInput("fovAmt", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                    placeholder="Insurance amount"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Base Freight (₹)
                  </label>
                  <input
                    type="text"
                    value={formData.baseFreight}
                    onChange={(e) =>
                      handleNumberInput("baseFreight", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                    placeholder="Auto-calculated"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Other Add/Less (₹)
                  </label>
                  <input
                    type="text"
                    value={formData.otherAddLess}
                    onChange={(e) =>
                      handleNumberInput("otherAddLess", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                    placeholder="Additional charges/discount"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fuel %</label>
                  <input
                    type="text"
                    value={formData.fuelPercent}
                    readOnly
                    className="w-full p-2 border rounded-lg bg-gray-50"
                    placeholder="Auto-calculated"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tax %</label>
                  <input
                    type="text"
                    value={formData.taxPercent}
                    onChange={(e) =>
                      handleNumberInput("taxPercent", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                    placeholder="18.00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tax Amount (₹)</label>
                  <input
                    value={formData.taxAmount}
                    readOnly
                    className="w-full p-2 border rounded-lg bg-gray-50"
                    placeholder="Auto-calculated"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Net Amount (₹)</label>
                  <input
                    value={formData.netAmount}
                    readOnly
                    className="w-full p-2 border rounded-lg bg-gray-50 font-bold"
                    placeholder="Auto-calculated"
                  />
                </div>

                {/* Additional Fields */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">COD Amount (₹)</label>
                  <input
                    type="text"
                    value={formData.codAmount}
                    onChange={(e) =>
                      handleNumberInput("codAmount", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                    placeholder="If COD"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Packaging Type</label>
                  <select
                    value={formData.packagingType}
                    onChange={(e) =>
                      handleFormChange("packagingType", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="REGULAR">Regular</option>
                    <option value="WOODEN">Wooden Box</option>
                    <option value="BUBBLE">Bubble Wrap</option>
                    <option value="CARTON">Carton Box</option>
                  </select>
                </div>

                {/* E-Way Bill Section */}
                <div className="space-y-2 col-span-2 pt-3 border-t">
                  <label className="text-sm font-medium">
                    E-Way Bill Number
                  </label>
                  <input
                    value={formData.ewayBillNo}
                    onChange={(e) =>
                      handleFormChange("ewayBillNo", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Valid From</label>
                  <input
                    type="date"
                    value={formData.ewayValidityStart}
                    onChange={(e) =>
                      handleFormChange("ewayValidityStart", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Valid To</label>
                  <input
                    type="date"
                    value={formData.ewayValidityEnd}
                    onChange={(e) =>
                      handleFormChange("ewayValidityEnd", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  />
                </div>

                {/* Remarks */}
                <div className="space-y-2 col-span-2 pt-3 border-t">
                  <label className="text-sm font-medium">Remark</label>
                  <textarea
                    value={formData.remark}
                    onChange={(e) => handleFormChange("remark", e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white"
                    placeholder="Additional remarks..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateBooking;
