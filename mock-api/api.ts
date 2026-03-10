import { delay } from "@/lib/utils";
import type {
  User,
  Tenant,
  Branch,
  Session,
  UserRole,
  Resource,
  Action,
  Order,
  AuditLog,
} from "@/types";
import usersData from "./data/users.json";
import tenantsData from "./data/tenants.json";
import branchesData from "./data/branches.json";
import permissionsData from "./data/permissions.json";

// Simulate API latency
const API_DELAY = 500;

// In-memory session storage (replace with actual backend)
let currentSession: Session | null = null;
let auditLogs: AuditLog[] = [];

export const mockApi = {
  // Authentication
  async login(email: string, password: string): Promise<Session> {
    await delay(API_DELAY);

    const user = (usersData as User[]).find((u) => u.email === email);
    if (!user || password !== "password123") {
      throw new Error("Invalid credentials");
    }

    const tenant = (tenantsData as Tenant[]).find((t) => t.id === user.tenantId);
    if (!tenant) {
      throw new Error("Tenant not found");
    }

    const branches = (branchesData as Branch[]).filter((b) =>
      user.assignedBranchIds?.includes(b.id)
    );

    const session: Session = {
      user,
      tenant,
      branches,
      token: `mock-token-${user.id}-${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      isImpersonating: false,
    };

    currentSession = session;
    if (typeof window !== "undefined") {
      const sessionString = JSON.stringify(session);
      localStorage.setItem("session", sessionString);
      // Set cookie for middleware to read (synchronous)
      const cookieValue = encodeURIComponent(sessionString);
      const maxAge = 24 * 60 * 60; // 24 hours
      document.cookie = `session=${cookieValue}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }

    // Audit log
    auditLogs.push({
      id: `audit-${Date.now()}`,
      userId: user.id,
      action: "login",
      resource: "auth",
      details: { email },
      timestamp: new Date().toISOString(),
    });

    return session;
  },

  async logout(): Promise<void> {
    await delay(API_DELAY);
    if (currentSession) {
      auditLogs.push({
        id: `audit-${Date.now()}`,
        userId: currentSession.user.id,
        action: "logout",
        resource: "auth",
        details: {},
        timestamp: new Date().toISOString(),
      });
    }
    currentSession = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("session");
      // Clear cookie
      document.cookie = "session=; path=/; max-age=0; SameSite=Lax";
    }
  },

  async getSession(): Promise<Session | null> {
    await delay(API_DELAY / 2);
    if (currentSession) {
      return currentSession;
    }
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("session");
      if (stored) {
        try {
          currentSession = JSON.parse(stored);
          return currentSession;
        } catch (e) {
          localStorage.removeItem("session");
        }
      }
    }
    return null;
  },

  // Permissions
  getPermissions(role: UserRole): Record<Resource, Action[]> {
    return ((permissionsData as any)[role] as Record<Resource, Action[]>) || {};
  },

  can(role: UserRole, action: Action, resource: Resource): boolean {
    const permissions = (permissionsData as any)[role] as Record<Resource, Action[]> | undefined;
    if (!permissions || !permissions[resource]) {
      return false;
    }
    return permissions[resource].includes(action);
  },

  allowedActions(role: UserRole, resource: Resource): Action[] {
    const permissions = (permissionsData as any)[role] as Record<Resource, Action[]> | undefined;
    return permissions?.[resource] || [];
  },

  // Users
  async getUsers(): Promise<User[]> {
    await delay(API_DELAY);
    return usersData as User[];
  },

  async getUserById(id: string): Promise<User | null> {
    await delay(API_DELAY);
    return (usersData as User[]).find((u) => u.id === id) || null;
  },

  // Tenants
  async getTenants(): Promise<Tenant[]> {
    await delay(API_DELAY);
    return tenantsData as Tenant[];
  },

  async getTenantById(id: string): Promise<Tenant | null> {
    await delay(API_DELAY);
    return (tenantsData as Tenant[]).find((t) => t.id === id) || null;
  },

  // Branches
  async getBranches(): Promise<Branch[]> {
    await delay(API_DELAY);
    return branchesData as Branch[];
  },

  async getBranchesByTenant(tenantId: string): Promise<Branch[]> {
    await delay(API_DELAY);
    return (branchesData as Branch[]).filter((b) => b.tenantId === tenantId);
  },

  async getBranchById(id: string): Promise<Branch | null> {
    await delay(API_DELAY);
    return (branchesData as Branch[]).find((b) => b.id === id) || null;
  },

  // Impersonation
  async impersonateUser(userId: string, impersonatorId: string): Promise<Session> {
    await delay(API_DELAY);
    const user = (usersData as User[]).find((u) => u.id === userId);
    if (!user) {
      throw new Error("User not found");
    }

    const tenant = (tenantsData as Tenant[]).find((t) => t.id === user.tenantId);
    if (!tenant) {
      throw new Error("Tenant not found");
    }

    const branches = (branchesData as Branch[]).filter((b) =>
      user.assignedBranchIds?.includes(b.id)
    );

    const session: Session = {
      user,
      tenant,
      branches,
      token: `mock-token-${user.id}-${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      impersonatedBy: impersonatorId,
      isImpersonating: true,
    };

    currentSession = session;
    if (typeof window !== "undefined") {
      const sessionString = JSON.stringify(session);
      localStorage.setItem("session", sessionString);
      // Set cookie for middleware to read (synchronous)
      const cookieValue = encodeURIComponent(sessionString);
      const maxAge = 24 * 60 * 60; // 24 hours
      document.cookie = `session=${cookieValue}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }

    auditLogs.push({
      id: `audit-${Date.now()}`,
      userId: impersonatorId,
      action: "impersonate",
      resource: "user",
      resourceId: userId,
      details: { impersonatedUser: user.email },
      timestamp: new Date().toISOString(),
    });

    return session;
  },

  async stopImpersonation(originalUserId: string): Promise<Session> {
    await delay(API_DELAY);
    const user = (usersData as User[]).find((u) => u.id === originalUserId);
    if (!user) {
      throw new Error("User not found");
    }

    const tenant = (tenantsData as Tenant[]).find((t) => t.id === user.tenantId);
    if (!tenant) {
      throw new Error("Tenant not found");
    }

    const branches = (branchesData as Branch[]).filter((b) =>
      user.assignedBranchIds?.includes(b.id)
    );

    const session: Session = {
      user,
      tenant,
      branches,
      token: `mock-token-${user.id}-${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      isImpersonating: false,
    };

    currentSession = session;
    if (typeof window !== "undefined") {
      const sessionString = JSON.stringify(session);
      localStorage.setItem("session", sessionString);
      // Set cookie for middleware to read (synchronous)
      const cookieValue = encodeURIComponent(sessionString);
      const maxAge = 24 * 60 * 60; // 24 hours
      document.cookie = `session=${cookieValue}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }

    return session;
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    await delay(API_DELAY);
    // Mock orders data
    return [
      {
        id: "order-1",
        orderNumber: "ORD-2024-001",
        customerId: "user-7",
        branchId: "branch-1",
        status: "in_transit",
        pickupAddress: "123 Pickup St",
        deliveryAddress: "456 Delivery Ave",
        createdAt: new Date().toISOString(),
        assignedRiderId: "user-6",
      },
    ] as Order[];
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    await delay(API_DELAY);
    return auditLogs;
  },
};

