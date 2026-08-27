export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  status: "active" | "inactive";
}

export interface Pincode {
  id?: string;
  pincode: string;
  city: string;
  state: string;
  district: string;
  branchId?: string | null;
  isServiceable?: boolean;
  isActiveForBranch?: boolean;
}

export interface ServiceArea {
  branchId: string;
  pincodes: string[];
  assignedAt: string;
  assignedBy: string;
}

export const mapBackendBranch = (b: any): Branch => ({
  id: b._id || b.id || "",
  name: b.name || "Unnamed Branch",
  code: b.code || "N/A",
  city: b.address?.city || b.city || "",
  state: b.address?.state || b.state || "",
  status: b.isActive === false ? "inactive" : "active",
});

export const mapBackendPincode = (p: any): Pincode => ({
  id: p._id || p.id || "",
  pincode: p.pincode || "",
  city: p.officeName || p.district || p.city || "",
  state: p.state || "",
  district: p.district || "",
  branchId: p.branchId?._id || p.branchId || null,
  isServiceable: p.isServiceable ?? false,
  isActiveForBranch: p.isActiveForBranch ?? true,
});
