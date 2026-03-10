// components/master/locations/types.ts
export interface Location {
  id: string;
  code: string;
  name: string;
  type: "hub" | "warehouse" | "counter" | "office" | "processing_center";
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactPerson: string;
  phone: string;
  email: string;
  capacity: {
    shipments: number;
    storage: number;
    vehicles: number;
  };
  facilities: string[];
  operatingHours: {
    open: string;
    close: string;
    workingDays: string[];
  };
  services: string[];
  status: "active" | "inactive" | "maintenance";
  manager: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  isOperational: boolean;
  lastAudit: string;
  nextAudit: string;
  securityLevel: "high" | "medium" | "low";
  createdAt: string;
  updatedAt: string;
  parentHubId?: string; // For hierarchy (Hub -> Branch)
  ownershipType?: "COCO" | "FOFO"; // Company Owned or Franchise Owned
  gstin?: string;
}

export interface LocationFormData {
  name: string;
  code: string;
  type: "hub" | "warehouse" | "counter" | "office" | "processing_center";
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactPerson: string;
  phone: string;
  email: string;
  capacity: {
    shipments: number;
    storage: number;
    vehicles: number;
  };
  facilities: string[];
  operatingHours: {
    open: string;
    close: string;
    workingDays: string[];
  };
  services: string[];
  status: "active" | "inactive" | "maintenance";
  manager: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  isOperational: boolean;
  securityLevel: "high" | "medium" | "low";
  lastAudit: string;
  nextAudit: string;
  parentHubId?: string;
  ownershipType?: "COCO" | "FOFO";
  gstin?: string;
}
