export interface Person {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

export interface Package {
  type: string;
  weight: string;
  description: string;
  codAmount: string;
}

export interface Service {
  type: string;
  payment: string;
}

export interface Shipment {
  id: string;
  awbNumber: string;
  status: string;
  sender: Person;
  receiver: Person;
  package: Package;
  service: Service;
}

export interface BulkShipment {
  id: string;
  name: string;
  status: "draft" | "processing" | "completed" | "failed" | "paused";
  totalShipments: number;
  processed: number;
  failed: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  template: string;
  serviceType: string;
  paymentType: string;
  awbPrefix: string;
  progress: number;
  shipments: Shipment[];
}

export interface BookingTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  fields: string[];
  defaultService: string;
  defaultPayment: string;
}

export type StatusType =
  | "draft"
  | "processing"
  | "completed"
  | "failed"
  | "paused";
export type ServiceType = "Surface" | "Air" | "Express" | "International";
export type PaymentType = "Prepaid" | "COD" | "Credit" | "Mixed";
