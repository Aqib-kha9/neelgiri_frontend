import { LucideIcon } from "lucide-react";

export interface Sender {
  name: string;
  phone: string;
  city: string;
  pincode: string;
}

export interface Receiver {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  landmark: string;
  instructions: string;
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

export interface Rider {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  status: "active" | "available" | "on_break" | "offline"; // Ye sahi hai?
  rating: number;
  deliveriesToday: number;
}

export interface DeliveryInfo {
  assignedTime: string;
  estimatedDelivery: string;
  currentLocation: string;
  distanceToDestination: string;
  timeToDestination: string;
  deliveryAttempt: number;
  lastUpdated: string;
  attemptNotes?: string;
  deliveredAt?: string;
  proof?: {
    signature: boolean;
    photo: boolean;
    notes: string;
  };
}

// types/index.ts mei Delivery interface update karo
export interface Delivery {
  id: string;
  awbNumber: string;
  sender: Sender;
  receiver: Receiver;
  package: Package;
  service: Service;
  currentStatus:
    | "out_for_delivery"
    | "delivery_attempted"
    | "delivered"
    | "failed";
  rider: Rider;
  deliveryInfo: DeliveryInfo;
  priority: "high" | "medium" | "low";
  specialInstructions: string;
  proofRequired: readonly string[]; // Yahan change karo
  qrCode: string;
  temperature: "Normal" | "Controlled";
}

export interface StatusConfig {
  label: string;
  color: string;
  icon: LucideIcon;
}

export interface PriorityConfig {
  label: string;
  color: string;
}

export interface RiderStatusConfig {
  label: string;
  color: string;
}