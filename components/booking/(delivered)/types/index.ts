import { LucideIcon } from "lucide-react";

export interface Sender {
  name: string;
  phone: string;
  city: string;
  pincode: string;
  gstin: string;
}

export interface Receiver {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  landmark: string;
}

export interface Package {
  type: string;
  weight: string;
  description: string;
  declaredValue: string;
  codAmount: string;
}

export interface Service {
  type: string;
  payment: string;
  charges: string;
}

export interface DeliveredBy {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
}

export interface Proof {
  signature: boolean;
  photo: boolean;
  idProof: boolean;
  notes: string;
}

export interface PODImage {
  type: string;
  url: string;
  timestamp: string;
}

export interface Location {
  latitude: string;
  longitude: string;
  address: string;
}

export interface DeliveryInfo {
  deliveredAt: string;
  deliveredBy: DeliveredBy;
  receivedBy: string;
  relation: string;
  proof: Proof;
  podImages: readonly PODImage[]; // Change to readonly
  location: Location;
  customerRating: number;
  feedback: string;
}

export interface Financials {
  codCollected: string;
  deliveryCharges: string;
  totalAmount: string;
  paymentStatus: "collected" | "paid" | "billed" | "pending";
  invoiceGenerated: boolean;
  invoiceNumber: string;
}

export interface TimelineEvent {
  event: string;
  timestamp: string;
  status: string;
}

export interface PODVerification {
  verified: boolean;
  verifiedBy: string;
  verifiedAt: string;
  status: "verified" | "pending" | "rejected";
  notes: string;
}

export interface Delivery {
  id: string;
  awbNumber: string;
  sender: Sender;
  receiver: Receiver;
  package: Package;
  service: Service;
  deliveryInfo: DeliveryInfo;
  financials: Financials;
  timeline: readonly TimelineEvent[]; // Change to readonly
  podVerification: PODVerification;
}

export interface VerificationConfig {
  label: string;
  color: string;
  icon: LucideIcon;
}

export interface PaymentConfig {
  label: string;
  color: string;
}
