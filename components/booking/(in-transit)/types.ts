export interface SenderReceiver {
  name: string;
  phone: string;
  city: string;
  pincode: string;
}

export interface PackageDetails {
  type: string;
  weight: string;
  description: string;
  declaredValue: string;
}

export interface ServiceDetails {
  type: string;
  payment: string;
  codAmount: string;
  charges: string;
}

export interface TransitRoute {
  location: string;
  timestamp: string;
  status: "departed" | "processed" | "in_transit" | "expected" | "delayed";
}

export interface Shipment {
  id: string;
  awbNumber: string;
  sender: SenderReceiver;
  receiver: SenderReceiver;
  package: PackageDetails;
  service: ServiceDetails;
  currentStatus: "in_transit" | "hub_processing" | "delay" | "out_for_delivery";
  transitRoute: TransitRoute[];
  currentLocation: string;
  nextHub: string;
  estimatedArrival: string;
  delay: number;
  transportMode: "Air" | "Surface" | "Rail";
  vehicleId: string;
  driver: string;
  lastUpdated: string;
  temperature: string;
  specialHandling: string;
  partner: string;
  delayReason?: string;
}

export interface StatusConfig {
  label: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface TransportConfig {
  label: string;
  color: string;
}
