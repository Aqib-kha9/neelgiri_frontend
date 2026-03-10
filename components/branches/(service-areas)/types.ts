export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  status: "active" | "inactive";
}

export interface Pincode {
  pincode: string;
  city: string;
  state: string;
  district: string;
}

export interface ServiceArea {
  branchId: string;
  pincodes: string[];
  assignedAt: string;
  assignedBy: string;
}
