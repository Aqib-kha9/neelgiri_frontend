export interface Branch {
  id: string;
  name: string;
  code: string;
  type: "company" | "partner";
  address: string;
  city: string;
  state: string;
  pincode: string;
  manager: string;
  staffCount: number;
  serviceArea: string;
  status: "active" | "maintenance" | "inactive";
  performance: number;
  revenue: number;
  joined: string;
  lastAudit: string;
}

/**
 * Maps a backend Branch document (returned by GET /api/branches) to the
 * frontend Branch interface used by the branch management UI.
 *
 * Backend shape:
 *   { _id, name, code, partnerId, ownershipType, address{street,city,state,pincode,country},
 *     contact{phone,email}, isActive, createdAt, updatedAt, admin:{name,email}|null }
 */
export const mapBackendBranch = (b: any): Branch => ({
  id: b._id || b.id || "",
  name: b.name || "Unnamed Branch",
  code: b.code || "N/A",
  type: b.ownershipType || (b.partnerId ? "partner" : "company"),
  address: b.address?.street || b.address || "",
  city: b.address?.city || b.city || "",
  state: b.address?.state || b.state || "",
  pincode: b.address?.pincode || b.pincode || "",
  manager: b.admin?.name || b.manager || "Unassigned",
  staffCount: b.staffCount ?? 0,
  serviceArea: b.serviceArea || b.address?.city || b.city || "",
  status: b.isActive === false ? "inactive" : b.status || "active",
  performance: b.performance ?? 0,
  revenue: b.revenue ?? 0,
  joined: b.createdAt || b.joined || new Date().toISOString(),
  lastAudit: b.updatedAt || b.lastAudit || new Date().toISOString(),
});
