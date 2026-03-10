export interface SenderReceiver {
  name: string;
  phone: string;
  address: string;
  pincode: string;
  gstin: string;
}

export interface PackageDetails {
  weight: string;
  volumetricWeight: string;
  actualWeight: string;
  type: string;
  description: string;
  invoiceValue: string;
  freightValue: string;
}

export interface ServiceDetails {
  type: string;
  mode: string;
  payment: string;
  codAmount: string;
  charges: string;
}

export interface Order {
  id: string;
  awbNumber: string;
  sender: SenderReceiver;
  receiver: SenderReceiver;
  package: PackageDetails;
  service: ServiceDetails;
  status:
    | "booked"
    | "in-transit"
    | "out-for-delivery"
    | "delivered"
    | "exception";
  bookedDate: string;
  lastUpdated: string;
  qrCode: string;
  eWayBill: string;
  partner: string;
  rider: string;
}

export interface StatusConfig {
  label: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}
