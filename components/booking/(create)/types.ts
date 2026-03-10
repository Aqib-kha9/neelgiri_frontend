// @/components/booking/create/types.ts
export interface BookingFormData {
  documentNo: string;
  sender: Customer | null;
  receiver: Receiver | null;
  pickupLocation: PickupLocation | null;

  // Shipment Details
  contents: string;
  mode: string;
  paymentMode: string;
  forwardTo: string;
  thru: string;

  // Weight & Dimensions
  weight: string;
  length: string;
  breadth: string;
  height: string;
  volumetricWeight: string;
  forwardingWeight?: string; // Actual weight used for forwarding vendor
  chargeableWeight: string;

  // Charges
  rate: string;
  fovAmt: string;
  charges: string;
  otherAddLess: string;
  netCharges: string;
  disc: string;
  fuelPercent: string;
  tax: string;
  netAmount: string;
  invoiceValue: string;
  baseFreight: string;
  taxPercent: string;
  taxAmount: string;

  // Compliance
  ewayBillNo: string;
  ewayValidityStart: string;
  ewayValidityEnd: string;

  // Misc
  remark: string;
  bookingSource: string;
  status: string;

  // Rate Calculation
  distanceZone: string;
  serviceType: string;
  packagingType: string;
  insuranceRequired: boolean;
  declaredValue: string;
  codAmount: string;
}

export interface Customer {
  id: string;
  code: string;
  documentNo: string;
  name: string;
  contactPerson: string;
  address1: string;
  address2: string;
  city: string;
  station: string;
  pincode: string;
  gstin?: string;
  mobileNo: string;
  phoneO: string;
  phoneR: string;
  email: string;
  hasReceiver: boolean;
  receivers: Receiver[];
  usePickupLocation: boolean;
  pickupLocations: PickupLocation[];
  status: "active" | "inactive";

  // Additional fields
  fuelCharges?: number;
  fovCharges?: number;
  quotationType?: string;
  awt?: number;
  category?: string;
  paymentMode?: string;
  accountGroup?: string;
  isInterStateDealer?: boolean;
  bookedBy?: string;
  bookedDate?: string;
  remark?: string;
  billingType?: string;
  creditLimit?: number;
  creditDays?: number;
  defaultPaymentMode?: string;
  kycStatus?: string;
  kycDocumentType?: string;
  kycDocumentNumber?: string;

  // Logistics Configuration
  allowedServices?: string[]; // e.g., ["SURFACE", "AIR"]
  serviceableZones?: string[]; // e.g., ["ZONE_A", "ZONE_B"]
  riskStatus?: "LOW" | "MEDIUM" | "HIGH"; // For Credit Checks
}
export interface Receiver {
  id: string;
  name: string;
  address: string;
  city: string;
  pincode: string;
  mobileNo: string;
  email?: string;
}

export interface PickupLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  pincode: string;
  contactPerson: string;
  mobileNo: string;
}
