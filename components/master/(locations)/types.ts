export type LocationType =
  | "hub"
  | "branch"
  | "warehouse"
  | "transit_hub"
  | "cross_dock"
  | "delivery_center"
  | "pickup_point";

export type LocationStatus = "active" | "inactive" | "maintenance";
export type FacilityCapability =
  | "Cold Storage"
  | "CCTV"
  | "Fire Safety"
  | "Loading Dock"
  | "Weighbridge"
  | "Backup Power"
  | "Security Staff"
  | "24x7 Operations";

export interface LocationCapacity {
  shipments: number;
  storage: number;
  maxWeightKg: number;
  vehicleBays: number;
}

export interface Location {
  id: string;
  code: string;
  name: string;
  type: LocationType;
  category: "PRIMARY" | "SECONDARY" | "TERTIARY";
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactPerson: string;
  phone: string;
  email: string;
  capacity: LocationCapacity;
  facilities: FacilityCapability[];
  operatingHours: {
    open: string;
    close: string;
    workingDays: string[];
  };
  services: string[];
  status: LocationStatus;
  manager: string;
  coordinates: {
    lat: number | null;
    lng: number | null;
  };
  isOperational: boolean;
  lastAudit: string;
  nextAudit: string;
  securityLevel: "high" | "medium" | "low";
  createdAt: string;
  updatedAt: string;
  parentHubId?: string;
  parentHubName?: string;
  serviceability?: {
    autoMapAddressPincode: boolean;
    defaultTransitDays: number;
  };
  ownershipType?: "COCO" | "FOFO" | "PARTNER";
  gstin?: string;
}

export interface LocationFormData {
  name: string;
  code: string;
  type: LocationType;
  category: "PRIMARY" | "SECONDARY" | "TERTIARY";
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactPerson: string;
  phone: string;
  email: string;
  capacity: LocationCapacity;
  facilities: FacilityCapability[];
  operatingHours: {
    open: string;
    close: string;
    workingDays: string[];
  };
  services: string[];
  status: LocationStatus;
  manager: string;
  coordinates: {
    lat: number | null;
    lng: number | null;
  };
  securityLevel: "high" | "medium" | "low";
  lastAudit: string;
  nextAudit: string;
  parentHubId?: string;
  serviceability: {
    autoMapAddressPincode: boolean;
    defaultTransitDays: number;
  };
  ownershipType?: "COCO" | "FOFO" | "PARTNER";
  gstin?: string;
}

const TYPE_MAP: Record<string, LocationType> = {
  HUB: "hub",
  BRANCH: "branch",
  WAREHOUSE: "warehouse",
  TRANSIT_HUB: "transit_hub",
  CROSS_DOCK: "cross_dock",
  DELIVERY_CENTER: "delivery_center",
  PICKUP_POINT: "pickup_point",
};

const TYPE_REVERSE: Record<LocationType, string> = {
  hub: "HUB",
  branch: "BRANCH",
  warehouse: "WAREHOUSE",
  transit_hub: "TRANSIT_HUB",
  cross_dock: "CROSS_DOCK",
  delivery_center: "DELIVERY_CENTER",
  pickup_point: "PICKUP_POINT",
};

const STATUS_MAP: Record<string, LocationStatus> = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  UNDER_MAINTENANCE: "maintenance",
};

const STATUS_REVERSE: Record<LocationStatus, string> = {
  active: "ACTIVE",
  inactive: "INACTIVE",
  maintenance: "UNDER_MAINTENANCE",
};

const DAY_MAP: Record<string, string> = {
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
  SUN: "Sunday",
};

const DAY_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(DAY_MAP).map(([shortDay, longDay]) => [longDay, shortDay])
);

const toDateInput = (value?: string) => (value ? value.slice(0, 10) : "");

export const mapBackendLocation = (l: any): Location => {
  const facilities: FacilityCapability[] = [];
  if (l.facilities?.hasColdStorage) facilities.push("Cold Storage");
  if (l.facilities?.hasCCTV) facilities.push("CCTV");
  if (l.facilities?.hasFireSafety) facilities.push("Fire Safety");
  if (l.facilities?.hasLoadingDock) facilities.push("Loading Dock");
  if (l.facilities?.hasWeighbridge) facilities.push("Weighbridge");
  if (l.facilities?.hasBackupPower) facilities.push("Backup Power");
  if (l.facilities?.hasSecurityStaff) facilities.push("Security Staff");
  if (l.facilities?.is24x7) facilities.push("24x7 Operations");

  const parent = l.parentLocation;
  const parentHubId = typeof parent === "object" ? parent?._id || parent?.id : parent;

  return {
    id: l._id || l.id || "",
    code: l.code || "",
    name: l.name || "",
    type: TYPE_MAP[l.type] || "hub",
    category: l.category || "PRIMARY",
    address: [l.address?.line1, l.address?.line2].filter(Boolean).join(", "),
    city: l.address?.city || "",
    state: l.address?.state || "",
    pincode: l.address?.pincode || "",
    contactPerson: l.contact?.personName || "",
    phone: l.contact?.phone || "",
    email: l.contact?.email || "",
    capacity: {
      shipments: l.capacity?.maxShipments || 0,
      storage: l.capacity?.storageAreaSqFt || 0,
      maxWeightKg: l.capacity?.maxWeightKg || 0,
      vehicleBays: l.capacity?.vehicleBays || 0,
    },
    facilities,
    operatingHours: {
      open: l.operatingHours?.openTime || "09:00",
      close: l.operatingHours?.closeTime || "18:00",
      workingDays: (l.operatingHours?.workingDays || []).map(
        (day: string) => DAY_MAP[day] || day
      ),
    },
    services: Array.isArray(l.services) ? l.services : [],
    status: STATUS_MAP[l.status] || "active",
    manager: l.manager || l.contact?.personName || "",
    coordinates: {
      lat: Number.isFinite(l.coordinates?.latitude) ? l.coordinates.latitude : null,
      lng: Number.isFinite(l.coordinates?.longitude) ? l.coordinates.longitude : null,
    },
    isOperational: l.status === "ACTIVE",
    lastAudit: toDateInput(l.audit?.lastAuditDate),
    nextAudit: toDateInput(l.audit?.nextAuditDate),
    securityLevel: (l.securityLevel || "MEDIUM").toLowerCase(),
    createdAt: l.createdAt || "",
    updatedAt: l.updatedAt || "",
    parentHubId: parentHubId?.toString() || undefined,
    parentHubName: typeof parent === "object" ? parent?.name : undefined,
    serviceability: {
      autoMapAddressPincode: l.serviceability?.autoMapAddressPincode ?? false,
      defaultTransitDays: l.serviceability?.defaultTransitDays || 3,
    },
    ownershipType: l.ownershipType || "COCO",
    gstin: l.gstin || "",
  };
};

export const mapLocationToBackend = (data: LocationFormData) => {
  const selected = new Set(data.facilities || []);
  const hasLatitude = data.coordinates.lat !== null;
  const hasLongitude = data.coordinates.lng !== null;

  return {
    name: data.name.trim(),
    code: data.code.trim().toUpperCase(),
    type: TYPE_REVERSE[data.type],
    category: data.category,
    ownershipType: data.ownershipType || "COCO",
    gstin: data.gstin?.trim().toUpperCase() || undefined,
    manager: data.manager.trim(),
    address: {
      line1: data.address.trim(),
      city: data.city.trim(),
      state: data.state.trim(),
      pincode: data.pincode.trim(),
      country: "India",
    },
    coordinates:
      hasLatitude && hasLongitude
        ? { latitude: data.coordinates.lat, longitude: data.coordinates.lng }
        : undefined,
    contact: {
      personName: data.contactPerson.trim(),
      phone: data.phone.trim(),
      email: data.email.trim().toLowerCase(),
    },
    capacity: {
      maxShipments: Math.max(0, data.capacity.shipments || 0),
      storageAreaSqFt: Math.max(0, data.capacity.storage || 0),
      maxWeightKg: Math.max(0, data.capacity.maxWeightKg || 0),
      vehicleBays: Math.max(0, data.capacity.vehicleBays || 0),
    },
    facilities: {
      hasColdStorage: selected.has("Cold Storage"),
      hasCCTV: selected.has("CCTV"),
      hasFireSafety: selected.has("Fire Safety"),
      hasLoadingDock: selected.has("Loading Dock"),
      hasWeighbridge: selected.has("Weighbridge"),
      hasBackupPower: selected.has("Backup Power"),
      hasSecurityStaff: selected.has("Security Staff"),
      is24x7: selected.has("24x7 Operations"),
    },
    services: data.services.map((service) => service.trim()).filter(Boolean),
    securityLevel: data.securityLevel.toUpperCase(),
    audit: {
      lastAuditDate: data.lastAudit || undefined,
      nextAuditDate: data.nextAudit || undefined,
    },
    operatingHours: {
      openTime: data.operatingHours.open || "09:00",
      closeTime: data.operatingHours.close || "18:00",
      workingDays: data.operatingHours.workingDays.map(
        (day) => DAY_REVERSE[day] || day
      ),
    },
    status: STATUS_REVERSE[data.status],
    parentLocation: data.parentHubId || null,
    serviceability: {
      autoMapAddressPincode: data.serviceability.autoMapAddressPincode,
      defaultTransitDays: Math.min(30, Math.max(1, data.serviceability.defaultTransitDays || 3)),
    },
  };
};
