export interface User {
  id: string;
  _id?: string;
  email: string;
  name: string;
  role: UserRole;
  roleName?: string;
  branchId?: string;
  branchName?: string;
  status: "active" | "inactive" | "pending" | string;
  createdAt: string;
  lastLogin?: string;
  phone?: string;
  isPaused?: boolean;
  partnerName?: string;
  createdBy?: {
    name: string;
    email: string;
    role: {
      name: string;
      displayName?: string;
    };
  };
}

export type UserRole = string;

export interface CreateUserData {
  email: string;
  name: string;
  role: UserRole;
  branchId?: string;
  password: string;
  phone?: string;
  status?: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
}
