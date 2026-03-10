// components/master/customers/types.ts
export interface Customer {
  id: string;
  code: string;
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
  fuelCharges: number;
  fovCharges: number;
  quotationType: string;
  awt: number;
  category: string;
  paymentMode: string;
  accountGroup: string;
  isInterStateDealer: boolean;
  documentNo: string;
  bookedBy: string;
  bookedDate: string;
  remark: string;
  createdAt: string;
  updatedAt: string;
  billingType?: string;
  creditDays?: number;
  defaultPaymentMode?: string;
  kycStatus?: string;
  kycDocumentType?: string;
  kycDocumentNumber?: string;
  creditLimit?: number;
  paymentTerms?: "Net 15" | "Net 30" | "Net 45" | "Net 60" | "Immediate";
  contractId?: string;
  customerType: "REGULAR" | "GUEST";
  registrationSource: "ADMIN" | "WEBSITE";
  rateCard?: string;
  // Portal & Logistics Configuration
  portalAccess: boolean;
  portalEmail?: string;
  portalPassword?: string; // Optional, only for form state
  allowedServices: string[]; // e.g. ["Air", "Surface"]
  serviceableZones: string[]; // e.g. ["North", "South"]
  apiAccess: boolean; // Hidden for now but field exists
  apiKey?: string;
  webhookUrl?: string;
}

export interface CustomerFormData {
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
  fuelCharges: number;
  fovCharges: number;
  quotationType: string;
  awt: number;
  category: string;
  paymentMode: string;
  accountGroup: string;
  isInterStateDealer: boolean;
  documentNo: string;
  bookedBy: string;
  bookedDate: string;
  remark: string;
  billingType?: string;
  creditDays?: number;
  defaultPaymentMode?: string;
  kycStatus?: string;
  kycDocumentType?: string;
  kycDocumentNumber?: string;
  creditLimit?: number;
  paymentTerms?: "Net 15" | "Net 30" | "Net 45" | "Net 60" | "Immediate";
  contractId?: string;
  customerType: "REGULAR" | "GUEST";
  registrationSource: "ADMIN" | "WEBSITE";
  rateCard?: string;
  // Portal & Logistics Configuration
  portalAccess: boolean;
  portalEmail?: string;
  portalPassword?: string;
  allowedServices: string[];
  serviceableZones: string[];
  apiAccess: boolean;
  apiKey?: string;
  webhookUrl?: string;
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
