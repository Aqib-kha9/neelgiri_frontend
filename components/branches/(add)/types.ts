export interface BranchFormData {
  // Basic Information
  name: string;
  code: string;
  type: "company" | "partner";
  status: "active" | "inactive" | "maintenance";
  logo?: string;

  // Location Details
  address: string;
  city: string;
  state: string;
  pincode: string;
  serviceArea: string;
  latitude: string;
  longitude: string;

  // Contact Details
  phone: string;
  email: string;
  emergencyContact: string;
  supportEmail: string;

  // Staff & Operations
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  staffCount: string;
  operatingHours: {
    open: string;
    close: string;
  };
  workingDays: string[];
  maxDailyCapacity: string;
  serviceRadius: string;
  hasWarehouse: boolean;
  hasPickupCounter: boolean;
}

export interface BulkUploadData {
  file: File | null;
  mapping: Record<string, string>;
  preview: any[];
}
