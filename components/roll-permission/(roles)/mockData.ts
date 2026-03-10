import { Role, Permission } from "./types";

export const permissions: Permission[] = [
  // User Management
  {
    id: "user.create",
    name: "Create Users",
    category: "User Management",
    description: "Create new user accounts",
  },
  {
    id: "user.read",
    name: "View Users",
    category: "User Management",
    description: "View user accounts and details",
  },
  {
    id: "user.update",
    name: "Edit Users",
    category: "User Management",
    description: "Modify user information",
  },
  {
    id: "user.delete",
    name: "Delete Users",
    category: "User Management",
    description: "Remove user accounts",
  },

  // Branch Management
  {
    id: "branch.create",
    name: "Create Branches",
    category: "Branch Management",
    description: "Create new branches",
  },
  {
    id: "branch.read",
    name: "View Branches",
    category: "Branch Management",
    description: "View branch information",
  },
  {
    id: "branch.update",
    name: "Edit Branches",
    category: "Branch Management",
    description: "Modify branch details",
  },
  {
    id: "branch.delete",
    name: "Delete Branches",
    category: "Branch Management",
    description: "Remove branches",
  },

  // Delivery Management
  {
    id: "delivery.create",
    name: "Create Deliveries",
    category: "Delivery Management",
    description: "Create new delivery orders",
  },
  {
    id: "delivery.read",
    name: "View Deliveries",
    category: "Delivery Management",
    description: "View delivery orders and status",
  },
  {
    id: "delivery.update",
    name: "Update Deliveries",
    category: "Delivery Management",
    description: "Modify delivery information",
  },
  {
    id: "delivery.delete",
    name: "Delete Deliveries",
    category: "Delivery Management",
    description: "Remove delivery orders",
  },

  // Financial
  {
    id: "finance.read",
    name: "View Financial Data",
    category: "Financial",
    description: "Access financial reports and data",
  },
  {
    id: "finance.update",
    name: "Manage Payments",
    category: "Financial",
    description: "Process and manage payments",
  },

  // Analytics
  {
    id: "analytics.read",
    name: "View Analytics",
    category: "Analytics",
    description: "Access analytics and reports",
  },
  {
    id: "analytics.export",
    name: "Export Data",
    category: "Analytics",
    description: "Export reports and data",
  },

  // System
  {
    id: "system.config",
    name: "System Configuration",
    category: "System",
    description: "Modify system settings",
  },
  {
    id: "system.backup",
    name: "Backup Management",
    category: "System",
    description: "Manage system backups",
  },
];

export const roles: Role[] = [
  {
    id: "role-superadmin",
    name: "Super Admin",
    displayName: "Super Admin",
    description: "Full system access with all permissions",
    permissions: permissions.map((p) => p.id),
    userCount: 1,
    createdAt: "2024-01-01",
    isSystem: true,
  },
  {
    id: "role-partner",
    name: "Partner",
    displayName: "Partner",
    description: "Partner organization access with business insights",
    permissions: [
      "delivery.read",
      "finance.read",
      "analytics.read",
      "analytics.export",
    ],
    userCount: 3,
    createdAt: "2024-01-15",
    isSystem: false,
  },
  {
    id: "role-branch",
    name: "Branch Manager",
    displayName: "Branch Manager",
    description: "Branch operations management and staff coordination",
    permissions: [
      "user.create",
      "user.read",
      "user.update",
      "delivery.create",
      "delivery.read",
      "delivery.update",
      "finance.read",
    ],
    userCount: 12,
    createdAt: "2024-01-20",
    isSystem: false,
  },
  {
    id: "role-dispatcher",
    name: "Dispatcher",
    displayName: "Dispatcher",
    description: "Delivery coordination and rider management",
    permissions: [
      "delivery.create",
      "delivery.read",
      "delivery.update",
      "user.read",
    ],
    userCount: 25,
    createdAt: "2024-02-01",
    isSystem: false,
  },
  {
    id: "role-rider",
    name: "Rider",
    displayName: "Rider",
    description: "Package delivery and customer interaction",
    permissions: ["delivery.read", "delivery.update"],
    userCount: 150,
    createdAt: "2024-02-15",
    isSystem: false,
  },
  {
    id: "role-customer",
    name: "Customer",
    displayName: "Customer",
    description: "Customer access for tracking and basic operations",
    permissions: ["delivery.read"],
    userCount: 5000,
    createdAt: "2024-03-01",
    isSystem: true,
  },
];
