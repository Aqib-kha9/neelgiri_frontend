// Core Types for Logistics & Delivery Management System

export type UserRole = string; // Allow dynamic roles

export type Resource = string;
export type Action = string;

export interface Permission {
  resource: Resource;
  action: Action;
}

export interface User {
  id: string;
  _id?: string; // MongoDB ID
  email: string;
  name: string;
  role: UserRole; // Now distinct from the object ID variant on backend, this is the display name
  roleDisplayName?: string; // Human readable role name
  permissions: Permission[]; // Added permissions
  tenantId?: string;
  branchId?: string; // Added branchId
  assignedBranchIds?: string[];
  isActive?: boolean;
  createdAt?: string;
  phone?: string;
  avatar?: string;
  partnerName?: string;
  branchName?: string;
  branchAdminName?: string;
  creatorName?: string;
  city?: string;
  pincode?: string;
  mobileNo?: string;
  customerType?: 'CUSTOMER' | 'AGENT' | 'VENDOR';
  childrenBranches?: {
    id: string;
    name: string;
    code: string;
    admin: {
      name: string;
      email: string;
    } | null;
  }[];
  address?: string;
  customerId?: string;
  receivers?: any[];
  pickupLocations?: any[];
  volumetricWeightDivisor?: number;
  allowedServices?: string[];
  billingType?: string;
}

export interface Tenant {
  id: string;
  name: string;
  type: "super_admin" | "partner";
  city: string;
  isActive: boolean;
  createdAt: string;
}

export interface Branch {
  id: string;
  name: string;
  tenantId: string;
  city: string;
  address: string;
  pincode: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

export interface RolePermission {
  role: UserRole;
  resources: Record<Resource, Action[]>;
}

export interface Session {
  user: User;
  tenant?: Tenant; // Made optional
  branches?: Branch[]; // Made optional
  token?: string; // Made optional
  expiresAt: string;
  impersonatedBy?: string;
  isImpersonating?: boolean; // Made optional
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, unknown>;
  timestamp: string;
  ipAddress?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  branchId: string;
  status: "pending" | "assigned" | "in_transit" | "delivered" | "cancelled";
  pickupAddress: string;
  deliveryAddress: string;
  createdAt: string;
  assignedRiderId?: string;
}

export interface PermissionCheck {
  can: boolean;
  reason?: string;
}

export interface CustomRole {
  id: string;
  name: string;
  description?: string;
  permissions: Record<Resource, Action[]>;
  isSystem: boolean;
  createdAt: string;
  createdBy: string;
}

export interface NavigationItem {
  title: string;
  href?: string;
  icon?: string;
  badge?: string;
  children?: NavigationItem[];
  permission?: {
    resource: Resource;
    action: Action;
  };
}

