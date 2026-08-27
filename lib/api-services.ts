/**
 * api-services.ts
 *
 * Centralized API service methods for Phase 5 frontend wiring.
 * Covers: Pickups, Trips, RTO, Hub Operations, SLA Monitoring.
 *
 * Uses the shared apiClient which handles auth tokens via localStorage session.
 */

import { apiClient } from "./api-client";

// ─── Type Definitions ───────────────────────────────────────────────

export interface ShipmentParty {
  name: string;
  phone: string;
  address: string;
  pincode: string;
  city?: string;
  state?: string;
  email?: string;
  gstin?: string;
}

export type BookingPaymentMode = "prepaid" | "cod" | "topay" | "credit";
export type BookingAttachmentType = "parcel_photo" | "document_scan" | "invoice_scan";

export interface ShipmentAttachment {
  url: string;
  type: BookingAttachmentType;
  originalname?: string;
  mimetype?: string;
  size?: number;
}

export interface ShipmentBookingPayload {
  sender: ShipmentParty;
  receiver: ShipmentParty;
  weight: number;
  dimensions?: { length?: number; width?: number; height?: number };
  contents: string;
  packageType?: "BOX" | "DOCUMENT" | "PALLET";
  category?: string;
  isFragile?: boolean;
  insuranceRequired?: boolean;
  fovPercentage?: number | null;
  paymentMode: BookingPaymentMode;
  codAmount?: number;
  declaredValue: number;
  mode?: "SURFACE" | "AIR";
  customerId?: string;
  senderInvoiceNo?: string;
  eWayBill?: string;
  additionalDocNos?: string[];
  attachments?: ShipmentAttachment[];
  termsAccepted: boolean;
  termsVersion?: string;
  idempotencyKey?: string;
}

export interface ShipmentBookingResponse {
  message: string;
  awb: string;
  shipment: Record<string, unknown>;
  autoRouted: boolean;
  routingInfo?: Record<string, unknown>;
  serviceability?: {
    serviceable: boolean;
    errors: string[];
    warnings: string[];
  };
  pricing?: {
    baseFreight: number;
    fuelSurcharge: number;
    odaSurcharge: number;
    insuranceAmount: number;
    codCharge: number;
    taxAmount: number;
    netAmount: number;
    chargeableWeight: number;
  };
}

export const shipmentApi = {
  book: (data: ShipmentBookingPayload) =>
    apiClient.post<ShipmentBookingResponse>("/shipments/book", data),
};

export type PickupPriority = "normal" | "high" | "urgent";
export type PickupStatus = "requested" | "assigned" | "pickup_started" | "picked_up" | "completed" | "cancelled";

export interface PickupShipment {
  awb: string | null;
  shipmentId?: string;
  weight: number;
  description?: string;
  scannedAt?: string;
  scanStatus: "pending" | "scanned" | "missed" | "rejected";
}

export interface AvailablePickupShipment {
  _id: string;
  awb: string;
  sender: {
    name?: string;
    pincode?: string;
  };
  receiver: {
    name?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  weight: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  contents?: string;
  status: "not_scheduled";
  createdAt: string;
}

export interface PickupRider {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  branchId?: string;
}

export interface PickupRequest {
  _id: string;
  pickupRequestId: string;
  customer?: { _id: string; name: string; email?: string; phone?: string };
  customerId?: {
    _id: string;
    code?: string;
    name?: string;
    contactPerson?: string;
    email?: string;
    mobileNo?: string;
    phoneO?: string;
    phoneR?: string;
  } | string;
  pickupAddress: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  preferredDate: string;
  preferredTimeSlot: "09-12" | "12-15" | "15-18" | "18-21" | "ANY";
  actualPickupTime?: string | null;
  assignedRider?: PickupRider | string | null;
  assignedBranch?: { _id: string; name: string; code?: string } | string | null;
  shipments: PickupShipment[];
  estimatedPackageCount: number;
  estimatedWeight: number;
  totalShipments: number;
  totalWeight: number;
  priority: PickupPriority;
  packageType?: string;
  status: PickupStatus;
  cancellationReason?: string;
  completedAt?: string | null;
  serviceType: "SURFACE" | "AIR" | "EXPRESS" | "ALL";
  paymentMode: "PREPAID" | "COD" | "CREDIT" | "ALL";
  notes?: string;
  history?: Array<{ status: string; timestamp?: string; remark?: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface PickupListResponse {
  pickups: PickupRequest[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export interface PickupStats {
  total: number;
  requested: number;
  assigned: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  scheduledToday?: number;
}

export interface Trip {
  _id: string;
  tripId: string;
  tripCode?: string;
  originBranch: { _id: string; name: string; code?: string };
  destinationBranch: { _id: string; name: string; code?: string };
  vehicle: { _id: string; vehicleNumber: string; vehicleType?: string };
  vehicleNumber?: string;
  driver?: { _id: string; name: string; phone?: string };
  driverName?: string;
  manifests: Array<{ _id: string; manifestId: string; status: string }>;
  status: string;
  totalShipments: number;
  totalWeight: number;
  departureTime?: string;
  arrivalTime?: string;
  breakdownReason?: string;
  breakdownAt?: string;
  reassignedToTrip?: string;
  route?: { _id: string; routeCode: string; routeName: string };
  remarks?: string;
  history?: Array<{ status: string; timestamp: string; remark?: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface RTOShipment {
  _id: string;
  awb: string;
  shipment?: {
    sender?: { name: string; phone?: string };
    receiver?: { name: string; phone?: string };
    originBranch?: { name: string };
    destinationBranch?: { name: string };
  };
  rtoStatus: string;
  rtoReason?: string;
  rtoInitiatedAt?: string;
  rtoManifestId?: string;
  rtoReceivedAt?: string;
  rtoCompletedAt?: string;
  rtoHistory?: Array<{ status: string; timestamp: string; remark?: string }>;
  createdAt: string;
}

export interface HubDashboard {
  hub: { _id: string; name: string; code?: string; type?: string };
  isDedicatedHub: boolean;
  stats: {
    inboundPending: number;
    inboundArrived: number;
    outboundOpen: number;
    outboundInTransit: number;
    bagsAtHub: number;
    parcelsAtHub: number;
    parcelsAwaitingSort: number;
    parcelsReadyForDRS: number;
  };
  inboundManifests: any[];
  outboundManifests: any[];
  bagsAtHub: any[];
  shipmentsAtHub: number;
}

export interface PendingSortResponse {
  hub: string;
  pendingCount: number;
  page: number;
  totalPages: number;
  shipments: any[];
}

export interface SortHistoryResponse {
  hub: string;
  totalSorts: number;
  page: number;
  totalPages: number;
  sortEvents: any[];
}

export interface SLADashboard {
  total: number;
  onTrack: number;
  approaching: number;
  breached: number;
  breachedPercentage: number;
  byService?: Record<string, { total: number; breached: number }>;
}

export interface PincodeServiceability {
  serviceable: boolean;
  message?: string;
  branchId?: {
    _id: string;
    name: string;
    code?: string;
    isActive?: boolean;
  };
}

export const pincodeApi = {
  check: (pincode: string) =>
    apiClient.get<PincodeServiceability>(
      `/pincodes/check/${encodeURIComponent(pincode)}`
    ),
};

// ─── Pickup API Services ───────────────────────────────────────────

export const pickupApi = {
  list: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient.get<PickupListResponse>(`/pickups${buildQuery(params)}`),

  stats: () => apiClient.get<PickupStats>("/pickups/stats"),

  getById: (id: string) => apiClient.get<PickupRequest>(`/pickups/${id}`),

  riders: () => apiClient.get<PickupRider[]>("/pickups/riders"),

  availableShipments: (customerId?: string) =>
    apiClient.get<AvailablePickupShipment[]>(
      `/pickups/available-shipments${buildQuery({ customerId })}`
    ),

  create: (data: {
    customer?: string;
    customerId?: string;
    pickupAddress: PickupRequest["pickupAddress"];
    preferredDate: string;
    preferredTimeSlot?: PickupRequest["preferredTimeSlot"];
    shipments: Array<{ awb: string; description?: string; weight?: number }>;
    serviceType?: PickupRequest["serviceType"];
    paymentMode?: PickupRequest["paymentMode"];
    priority?: PickupPriority;
    packageType?: string;
    notes?: string;
  }) => apiClient.post<PickupRequest>("/pickups", data),

  assignRider: (id: string, riderId: string) =>
    apiClient.put<PickupRequest>(`/pickups/${id}/assign`, { riderId }),

  startPickup: (id: string) => apiClient.put<PickupRequest>(`/pickups/${id}/start`),

  scanParcel: (id: string, awb: string) =>
    apiClient.post<{ message: string; pickup: PickupRequest }>(`/pickups/${id}/scan`, { awb }),

  markMissed: (id: string, awb: string, reason?: string) =>
    apiClient.post<{ message: string; pickup: PickupRequest }>(`/pickups/${id}/miss`, { awb, reason }),

  complete: (id: string) =>
    apiClient.put<{
      message: string;
      pickup: PickupRequest;
      summary: {
        scanned: number;
        missed: number;
        total: number;
      };
    }>(`/pickups/${id}/complete`),

  cancel: (id: string, reason?: string) =>
    apiClient.put<PickupRequest>(`/pickups/${id}/cancel`, { reason }),
};

// ─── Trip API Services ────────────────────────────────────────────

export const tripApi = {
  list: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient.get<{ data: Trip[]; total?: number; page?: number; pages?: number }>(
      `/trips${buildQuery(params)}`
    ),

  stats: () =>
    apiClient.get<{ total: number; active: number; completed: number; breakdown: number }>(
      "/trips/stats"
    ),

  getById: (id: string) =>
    apiClient.get<{ data: Trip }>(`/trips/${id}`),

  create: (data: {
    originBranchId: string;
    destinationBranchId: string;
    vehicleId: string;
    driverId?: string;
    routeId?: string;
    manifestIds?: string[];
    remarks?: string;
  }) => apiClient.post<{ data: Trip; message: string }>("/trips", data),

  addManifests: (id: string, manifestIds: string[]) =>
    apiClient.post<{ data: Trip; message: string }>(`/trips/${id}/manifests`, { manifestIds }),

  startLoading: (id: string) =>
    apiClient.put<{ data: Trip; message: string }>(`/trips/${id}/start-loading`),

  depart: (id: string) =>
    apiClient.put<{ data: Trip; message: string }>(`/trips/${id}/depart`),

  markInTransit: (id: string) =>
    apiClient.put<{ data: Trip; message: string }>(`/trips/${id}/in-transit`),

  arrive: (id: string) =>
    apiClient.put<{ data: Trip; message: string }>(`/trips/${id}/arrive`),

  complete: (id: string) =>
    apiClient.put<{ data: Trip; message: string }>(`/trips/${id}/complete`),

  markBreakdown: (id: string, reason: string) =>
    apiClient.put<{ data: Trip; message: string }>(`/trips/${id}/breakdown`, { breakdownReason: reason }),

  reassignVehicle: (id: string, vehicleId: string, driverId?: string) =>
    apiClient.put<{ data: Trip; message: string }>(`/trips/${id}/reassign`, { vehicleId, driverId }),

  transferManifests: (id: string, destinationTripId: string, manifestIds?: string[]) =>
    apiClient.post<{ data: Trip; message: string }>(`/trips/${id}/transfer-manifests`, {
      destinationTripId,
      manifestIds,
    }),

  cancel: (id: string, reason?: string) =>
    apiClient.put<{ data: Trip; message: string }>(`/trips/${id}/cancel`, { reason }),
};

// ─── RTO API Services ─────────────────────────────────────────────

export const rtoApi = {
  list: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient.get<{ data: RTOShipment[]; total?: number; page?: number; pages?: number }>(
      `/rto${buildQuery(params)}`
    ),

  stats: () =>
    apiClient.get<{
      total: number;
      initiated: number;
      inTransit: number;
      receivedAtOrigin: number;
      completed: number;
      cancelled: number;
    }>("/rto/stats"),

  getDetails: (awb: string) =>
    apiClient.get<{ data: RTOShipment }>(`/rto/${awb}`),

  initiate: (awb: string, reason: string) =>
    apiClient.post<{ data: RTOShipment; message: string }>("/rto/initiate", { awb, reason }),

  createManifest: (data: { awbs: string[]; originBranchId: string; destinationBranchId: string }) =>
    apiClient.post<{ data: any; message: string }>("/rto/manifest", data),

  dispatchManifest: (manifestId: string, tripId?: string) =>
    apiClient.put<{ data: any; message: string }>(`/rto/manifest/${manifestId}/dispatch`, { tripId }),

  receiveManifest: (manifestId: string) =>
    apiClient.put<{ data: any; message: string }>(`/rto/manifest/${manifestId}/receive`),

  complete: (awb: string) =>
    apiClient.put<{ data: RTOShipment; message: string }>(`/rto/complete/${awb}`),

  cancel: (awb: string, reason?: string) =>
    apiClient.put<{ data: RTOShipment; message: string }>(`/rto/cancel/${awb}`, { reason }),
};

// ─── Hub Operations API Services ──────────────────────────────────

export const hubApi = {
  list: () =>
    apiClient.get<{ data: any[] }>("/hubs"),

  dashboard: () =>
    apiClient.get<HubDashboard>("/hubs/dashboard"),

  pendingSort: () =>
    apiClient.get<PendingSortResponse>("/hubs/pending-sort"),

  sortHistory: () =>
    apiClient.get<SortHistoryResponse>("/hubs/sort-history"),

  receiveManifest: (manifestId: string) =>
    apiClient.post<{ data: any; message: string }>(`/hubs/manifests/${manifestId}/receive`),

  openBag: (bagId: string) =>
    apiClient.post<{ data: any; message: string }>(`/hubs/bags/${bagId}/open`),

  sortParcel: (data: { awb: string; destinationBranchId: string; destinationBagId?: string }) =>
    apiClient.post<{ data: any; message: string }>("/hubs/sort", data),

  createOutboundBag: (data: { destinationBranchId: string; awbs: string[]; hubId?: string }) =>
    apiClient.post<{ data: any; message: string }>("/hubs/bags/outbound", data),

  createOutboundManifest: (data: { bagIds: string[]; destinationBranchId: string; originBranchId: string }) =>
    apiClient.post<{ data: any; message: string }>("/hubs/manifests/outbound", data),

  convertToHub: (branchId: string) =>
    apiClient.put<{ data: any; message: string }>(`/hubs/${branchId}/convert`),
};

// ─── SLA Monitoring API Services ─────────────────────────────────

export const slaApi = {
  dashboard: () =>
    apiClient.get<SLADashboard>("/sla/stats"),

  approaching: () =>
    apiClient.get<{ data: any[] }>("/sla/approaching"),

  breached: () =>
    apiClient.get<{ data: any[] }>("/sla/breached"),

  config: () =>
    apiClient.get<{ data: any }>("/sla/config"),

  triggerBreachCheck: () =>
    apiClient.post<{ checked: number; breached: number; message: string }>("/sla/check"),

  updateShipmentSLA: (awb: string, data: { slaHours?: number; slaDeadline?: string }) =>
    apiClient.put<{ data: any; message: string }>(`/sla/${awb}`, data),
};

// ─── Helper ───────────────────────────────────────────────────────

function buildQuery(params?: Record<string, string | number | undefined>): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== "");
  if (entries.length === 0) return "";
  const search = new URLSearchParams();
  entries.forEach(([k, v]) => search.append(k, String(v)));
  return `?${search.toString()}`;
}
