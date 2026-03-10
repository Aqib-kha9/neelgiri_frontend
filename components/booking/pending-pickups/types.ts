export interface SenderReceiver {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  gstin: string;
}

export interface PackageDetails {
  type: string;
  weight: string;
  dimensions: string;
  description: string;
  declaredValue: string;
  actualWeight: string;
}

export interface ServiceDetails {
  type: string;
  payment: string;
  codAmount: string;
  charges: string;
}

export interface Pickup {
  id: string;
  awbNumber: string;
  sender: SenderReceiver;
  receiver: SenderReceiver;
  package: PackageDetails;
  service: ServiceDetails;
  status: "pending" | "assigned" | "scheduled" | "failed" | "completed";
  priority: "high" | "medium" | "low";
  bookingDate: string;
  preferredPickup: string;
  timeInState: string;
  assignedRider: string;
  pickupAttempts: number;
  specialInstructions: string;
  documents: string[];
  qrCode: string;
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  status: "available" | "on_duty" | "on_break";
  currentLoad: number;
  maxLoad: number;
}

export interface StatusConfig {
  label: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface PriorityConfig {
  label: string;
  color: string;
}
