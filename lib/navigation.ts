import type { NavigationItem, Resource, Action, UserRole, Permission } from "@/types";
import { PERMISSION_MODULES } from "@/lib/permission-structure";
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  Building2,
  Warehouse,
  Truck,
  MapPin,
  ClipboardList,
  BarChart3,
  Settings,
  CreditCard,
  FileCheck,
  QrCode,
  ListChecks,
  UserCheck,
  AlertCircle,
  Database,
  Shield,
  ShoppingCart,
  Search,
  Camera,
  Receipt,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
} from "lucide-react";

// Map permission keys to navigation properties
export const PERMISSION_NAV_MAP: Record<string, { href: string; icon?: string }> = {
  // Dashboards
  'dashboard_main': { href: '/dashboard' },
  'dashboard_ops': { href: '/dashboard/operations' },
  'dashboard_partner': { href: '/dashboard/partner-performance' },
  'dashboard_finance': { href: '/dashboard/financial' },
  'dashboard_gst': { href: '/dashboard/gst-compliance' },

  // Booking & Orders
  'order_create': { href: '/dashboard/booking/create' },
  'order_all': { href: '/dashboard/orders/all' },
  'order_pending': { href: '/dashboard/orders/pending-pickups' },
  'order_transit': { href: '/dashboard/orders/in-transit' },
  'order_ofd': { href: '/dashboard/orders/out-for-delivery' },
  'order_delivered': { href: '/dashboard/orders/delivered' },
  'order_exception': { href: '/dashboard/orders/exceptions' },
  'order_quick': { href: '/dashboard/orders/quick' },

  // AWB
  'awb_series': { href: '/dashboard/awb/series' },
  'awb_allocation': { href: '/dashboard/awb/allocation' },
  'awb_usage': { href: '/dashboard/awb/usage' },

  // Tracking & POD
  'tracking_live': { href: '/dashboard/tracking/live' },
  'pod_capture': { href: '/dashboard/pod/capture' },
  'pod_verify': { href: '/dashboard/pod/verification' },
  'pod_missing': { href: '/dashboard/pod/missing' },
  'pod_digital': { href: '/dashboard/pod/signatures' },

  // DRS
  'drs_create': { href: '/dashboard/drs/create' },
  'drs_active': { href: '/dashboard/drs/active' },
  'drs_history': { href: '/dashboard/drs/history' },
  'drs_cust_portal': { href: '/dashboard/tracking/portal' },

  // Manifest - Counter
  'manifest_inward': { href: '/dashboard/manifest/counter/inward' },
  'manifest_counter': { href: '/dashboard/manifest/counter' },
  // Manifest - Forwarding
  'manifest_create': { href: '/dashboard/manifest/forwarding/create' },
  'manifest_bag': { href: '/dashboard/manifest/forwarding/bag' },
  'manifest_dispatch': { href: '/dashboard/manifest/forwarding/dispatch' },
  'manifest_history': { href: '/dashboard/manifest/forwarding/history' },

  // Branch Management
  'branch_all': { href: '/dashboard/branches' },
  'branch_add': { href: '/dashboard/branches/add' },
  'branch_perf': { href: '/dashboard/branches/performance' },
  'branch_service': { href: '/dashboard/branches/service-areas' },

  // Warehouse Operations
  'wh_inventory': { href: '/dashboard/warehouse/inventory' },
  'wh_stock': { href: '/dashboard/warehouse/reconciliation' },
  'wh_assets': { href: '/dashboard/warehouse/assets' },

  // Partner Management
  'partner_all': { href: '/dashboard/partners' },
  'partner_onboard': { href: '/dashboard/partners/onboarding' },
  'partner_score': { href: '/dashboard/partners/scorecards' },
  'partner_settle': { href: '/dashboard/partners/settlement' },

  // Vendor Management
  'vendor_coload': { href: '/dashboard/vendors/co-loading' },
  'vendor_service': { href: '/dashboard/vendors/service' },
  'vendor_metrics': { href: '/dashboard/vendors/metrics' },

  // Customer Management
  'cust_directory': { href: '/dashboard/customers' },
  'cust_onboard': { href: '/dashboard/customers/onboarding' },
  'cust_agreement': { href: '/dashboard/customers/agreements' },
  'cust_ticket': { href: '/dashboard/customers/tickets' },
  'cust_pickup': { href: '/dashboard/customers/pickup-requests' },

  // Financial & GST
  'fin_invoice_gen': { href: '/dashboard/invoice/generate' },
  'fin_invoice_hist': { href: '/dashboard/invoice/history' },
  'fin_notes': { href: '/dashboard/invoice/notes' },
  'fin_gst_report': { href: '/dashboard/gst/reports' },
  'fin_eway': { href: '/dashboard/gst/eway-bills' },
  'fin_tax': { href: '/dashboard/gst/calculations' },
  'fin_pay_coll': { href: '/dashboard/payments/collection' },
  'fin_cod': { href: '/dashboard/payments/cod' },
  'fin_settle': { href: '/dashboard/payments/settlement' },
  'fin_tally': { href: '/dashboard/payments/tally' },

  // Operations
  'op_rider_alloc': { href: '/dashboard/riders/allocation' },
  'op_rider_perf': { href: '/dashboard/riders/performance' },
  'op_rider_shift': { href: '/dashboard/riders/attendance' },
  'op_ex_pending': { href: '/dashboard/exceptions/pending' },
  'op_ex_flow': { href: '/dashboard/exceptions/workflow' },
  'op_ex_rca': { href: '/dashboard/exceptions/analysis' },
  'op_ex_qc': { href: '/dashboard/exceptions/quality' },

  // Reports
  'rep_del_perf': { href: '/dashboard/reports/delivery' },
  'rep_part_perf': { href: '/dashboard/reports/partner' },
  'rep_branch_perf': { href: '/dashboard/reports/branch' },
  'rep_rider_perf': { href: '/dashboard/reports/rider' },
  'rep_rev': { href: '/dashboard/reports/revenue' },
  'rep_gst': { href: '/dashboard/reports/gst' },
  'rep_settle': { href: '/dashboard/reports/settlement' },
  'rep_bi': { href: '/dashboard/reports/bi' },

  // Master Data
  'master_cust': { href: '/dashboard/master/customers' },
  'master_loc': { href: '/dashboard/master/locations' },
  'master_veh': { href: '/dashboard/master/vehicles' },
  'master_driver': { href: '/dashboard/master/drivers' },
  'master_route': { href: '/dashboard/master/routes' },
  'master_pin': { href: '/dashboard/master/pincodes' },
  'master_rate': { href: '/dashboard/master/rates' },
  'master_prod': { href: '/dashboard/master/products' },
  'master_config': { href: '/dashboard/master/config' },

  // System Admin
  'sys_users': { href: '/dashboard/roll-permission/users' },
  'sys_roles': { href: '/dashboard/roll-permission/roles' },
  'sys_perms': { href: '/dashboard/admin/permissions' },
  'sys_audit': { href: '/dashboard/admin/audit-logs' },
  'sys_settings': { href: '/dashboard/admin/settings' },
  'sys_int': { href: '/dashboard/admin/integrations' },
};

// Module icons
const MODULE_ICONS: Record<string, string> = {
  'dashboards': 'LayoutDashboard',
  'booking_orders': 'Package',
  'awb': 'FileText',
  'tracking_pod': 'Search',
  'drs': 'ClipboardList',
  'manifest': 'FileCheck',
  'branch_mgmt': 'Building2',
  'warehouse': 'Warehouse',
  'partner_mgmt': 'Users',
  'vendor_mgmt': 'Truck',
  'customer_mgmt': 'ShoppingCart',
  'finance_gst': 'CreditCard',
  'operations_mgmt': 'Settings',
  'reports': 'BarChart3',
  'master_data': 'Database',
  'system_admin': 'Shield',
};

export function getNavigationForRole(
  role: UserRole,
  userPermissions: Permission[] = []
): NavigationItem[] {
  // Always return specialized nav for Rider role
  if (role === 'rider') {
    return getRiderNavigation();
  }

  // If user has specific permissions (custom role), build nav dynamically
  if (userPermissions && userPermissions.length > 0) {
    const nav = buildCustomNavigation(userPermissions);

    // FORCE FIX: Ensure Partner, Branch Admin, and Dispatcher ALWAYS have essential modules access
    // This overrides potential missing permissions from backend for a better UX
    if (['partner_admin', 'partner', 'branch_admin', 'branch', 'dispatcher'].includes(role)) {
      // 1. User Management
      const sysAdminExists = nav.find(item => item.title === 'System Admin');
      if (!sysAdminExists) {
        nav.push({
          title: "System Admin",
          icon: "Shield",
          children: [{ title: "User Management", href: "/dashboard/roll-permission/users" }],
        });
      } else if (sysAdminExists.children) {
        if (!sysAdminExists.children.find(c => c.title === 'User Management')) {
          sysAdminExists.children.push({ title: "User Management", href: "/dashboard/roll-permission/users" });
        }
      }

      // 2. DRS Management (Always show for Partner/Branch Admin)
      const drsExists = nav.find(item => item.title === 'DRS Management' || item.title === 'Delivery Run Sheet');
      if (!drsExists) {
        nav.push({
          title: "DRS Management",
          icon: "ClipboardList",
          children: [
            { title: "Create DRS", href: "/dashboard/drs/create" },
            { title: "Active DRS", href: "/dashboard/drs/active" },
            { title: "DRS History", href: "/dashboard/drs/history" },
          ],
        });
      }

      // 3. Manifest Management (Always show for Partner/Branch Admin)
      const manifestExists = nav.find(item => item.title === 'Manifest Management');
      if (!manifestExists) {
        nav.push({
          title: "Manifest Management",
          icon: "FileCheck",
          children: [
            {
              title: "Forwarding",
              children: [
                { title: "Create Manifest", href: "/dashboard/manifest/forwarding/create" },
                { title: "Bag Tag Management", href: "/dashboard/manifest/forwarding/bag" },
                { title: "Dispatch Console", href: "/dashboard/manifest/forwarding/dispatch" },
                { title: "Manifest History", href: "/dashboard/manifest/forwarding/history" },
              ],
            },
          ],
        });
      }

      // 4. Master Data -> Pincode Master (Always show for Partner/Branch Admin)
      const masterExists = nav.find(item => item.title === 'Master Data');
      if (!masterExists) {
        nav.push({
          title: "Master Data",
          icon: "Database",
          children: [{ title: "Pincode Master", href: "/dashboard/master/pincodes" }],
        });
      } else if (masterExists.children) {
        if (!masterExists.children.find(c => c.title === 'Pincode Master')) {
          masterExists.children.push({ title: "Pincode Master", href: "/dashboard/master/pincodes" });
        }
      }
    }
    return nav;
  }

  // Fallback for hardcoded system roles if they somehow don't have permissions array
  // OR if we want to enforce legacy structure for them
  switch (role) {
    case "super_admin":
      return getSuperAdminNavigation();
    case "partner_admin":
    case "partner":
      return getPartnerAdminNavigation();
    case "branch":
    case "branch_admin":
      return getBranchAdminNavigation();
    case "warehouse_admin":
      return getWarehouseAdminNavigation();
    case "dispatcher":
      return getDispatcherNavigation();
    case "rider":
      return getRiderNavigation();
    case "customer":
      return getCustomerNavigation();
    default:
      return [];
  }
}

function buildCustomNavigation(permissions: Permission[]): NavigationItem[] {
  const nav: NavigationItem[] = [];

  // Get list of resource keys the user has ANY permission for
  const allowedResources = new Set(permissions.map(p => p.resource));

  // 1. Explicitly hoist Main Dashboard to top level
  // Always show Dashboard for better UX (access controlled by RouteGuard/Page)
  nav.push({
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard'
  });

  PERMISSION_MODULES.forEach(module => {
    // Check if user has permission for resources in this module
    let moduleResources = module.resources.filter(r => allowedResources.has(r.key));

    // Exclude 'dashboard_main' as it matches 'Dashboards' module but is already added
    moduleResources = moduleResources.filter(r => r.key !== 'dashboard_main');

    if (moduleResources.length > 0) {
      // Build children items
      const children: NavigationItem[] = [];
      const subGroups: Record<string, NavigationItem[]> = {};

      moduleResources.forEach(res => {
        const navProps = PERMISSION_NAV_MAP[res.key];
        if (!navProps) return;

        const navItem: NavigationItem = {
          title: res.label,
          href: navProps.href,
        };

        // Handle nested groups (hacky, based on labels using ":")
        if (res.label.includes(':')) {
          const [group, title] = res.label.split(':').map(s => s.trim());
          if (!subGroups[group]) subGroups[group] = [];

          subGroups[group].push({
            title: title,
            href: navProps.href
          });
        } else {
          children.push(navItem);
        }
      });

      // Add sub-groups to children
      Object.keys(subGroups).forEach(groupName => {
        children.push({
          title: groupName,
          children: subGroups[groupName]
        });
      });

      // Create Parent Item
      nav.push({
        title: module.label,
        icon: MODULE_ICONS[module.key] || 'LayoutDashboard',
        children: children.sort((a, b) => a.title.localeCompare(b.title))
      });
    }
  });

  return nav;
}


// ... Keep existing hardcoded functions for fallback reference ...
function getSuperAdminNavigation(): NavigationItem[] {
  return [
    {
      title: "Dashboards",
      icon: "LayoutDashboard",
      children: [
        { title: "Main Dashboard", href: "/dashboard" },
        { title: "Operations Dashboard", href: "/dashboard/operations" },
        { title: "Partner Performance", href: "/dashboard/partner-performance" },
        { title: "Financial Overview", href: "/dashboard/financial" },
        { title: "GST Compliance", href: "/dashboard/gst-compliance" },
      ],
    },
    {
      title: "System Admin",
      icon: "Shield",
      children: [
        { title: "User Management", href: "/dashboard/roll-permission/users" },
        { title: "User Roles", href: "/dashboard/roll-permission/roles" },
        { title: "Permissions", href: "/dashboard/admin/permissions" },
      ],
    },
    // Truncated for brevity, dynamic is preferred
  ];
}


function getPartnerAdminNavigation(): NavigationItem[] {
  return [
    { title: "Main Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    {
      title: "DRS Management",
      icon: "ClipboardList",
      children: [
        { title: "Create DRS", href: "/dashboard/drs/create" },
        { title: "Active DRS", href: "/dashboard/drs/active" },
        { title: "DRS History", href: "/dashboard/drs/history" },
      ],
    },
    {
      title: "Manifest Management",
      icon: "FileCheck",
      children: [
        {
          title: "Counter",
          children: [
            { title: "Counter Manifest", href: "/dashboard/manifest/counter" },
            { title: "Inward Processing", href: "/dashboard/manifest/counter/inward" },
          ],
        },
        {
          title: "Forwarding",
          children: [
            { title: "Create Manifest", href: "/dashboard/manifest/forwarding/create" },
            { title: "Bag Tag Management", href: "/dashboard/manifest/forwarding/bag" },
            { title: "Dispatch Console", href: "/dashboard/manifest/forwarding/dispatch" },
            { title: "Manifest History", href: "/dashboard/manifest/forwarding/history" },
          ],
        },
      ],
    },
    {
      title: "Master Data",
      icon: "Database",
      children: [
        { title: "Pincode Master", href: "/dashboard/master/pincodes" },
      ],
    },
    { title: "Reports", href: "/dashboard/reports/revenue", icon: "BarChart3" },
    {
      title: "System Admin",
      icon: "Shield",
      children: [
        { title: "User Management", href: "/dashboard/roll-permission/users" },
      ],
    },
  ];
}

function getBranchAdminNavigation(): NavigationItem[] {
  return [
    { title: "Main Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    {
      title: "DRS Management",
      icon: "ClipboardList",
      children: [
        { title: "Create DRS", href: "/dashboard/drs/create" },
        { title: "Active DRS", href: "/dashboard/drs/active" },
        { title: "DRS History", href: "/dashboard/drs/history" },
      ],
    },
    {
      title: "Manifest Management",
      icon: "FileCheck",
      children: [
        {
          title: "Counter",
          children: [
            { title: "Counter Manifest", href: "/dashboard/manifest/counter" },
            { title: "Inward Processing", href: "/dashboard/manifest/counter/inward" },
          ],
        },
        {
          title: "Forwarding",
          children: [
            { title: "Create Manifest", href: "/dashboard/manifest/forwarding/create" },
            { title: "Bag Tag Management", href: "/dashboard/manifest/forwarding/bag" },
            { title: "Dispatch Console", href: "/dashboard/manifest/forwarding/dispatch" },
            { title: "Manifest History", href: "/dashboard/manifest/forwarding/history" },
          ],
        },
      ],
    },
    {
      title: "Master Data",
      icon: "Database",
      children: [
        { title: "Pincode Master", href: "/dashboard/master/pincodes" },
      ],
    },
    {
      title: "System Admin",
      icon: "Shield",
      children: [
        { title: "User Management", href: "/dashboard/roll-permission/users" },
      ],
    },
  ];
}

function getWarehouseAdminNavigation(): NavigationItem[] { return []; }

function getDispatcherNavigation(): NavigationItem[] {
  return [
    { title: "Main Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    {
      title: "Manifest Management",
      icon: "FileCheck",
      children: [
        {
          title: "Counter",
          children: [
            { title: "Counter Manifest", href: "/dashboard/manifest/counter" },
            { title: "Inward Processing", href: "/dashboard/manifest/counter/inward" },
          ],
        },
        {
          title: "Forwarding",
          children: [
            { title: "Create Manifest", href: "/dashboard/manifest/forwarding/create" },
            { title: "Bag Tag Management", href: "/dashboard/manifest/forwarding/bag" },
            { title: "Dispatch Console", href: "/dashboard/manifest/forwarding/dispatch" },
            { title: "Manifest History", href: "/dashboard/manifest/forwarding/history" },
          ],
        },
      ],
    },
    {
      title: "System Admin",
      icon: "Shield",
      children: [
        { title: "User Management", href: "/dashboard/roll-permission/users" },
      ],
    },
  ];
}

function getRiderNavigation(): NavigationItem[] {
  return [
    { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { title: "See Task", href: "/dashboard/rider/tasks", icon: "ClipboardList" },
    { title: "POD Capture", href: "/dashboard/rider/pod", icon: "Camera" },
  ];
}
function getCustomerNavigation(): NavigationItem[] {
  return [
    { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { title: "Create Order", href: "/dashboard/customer/booking", icon: "Package" },
  ];
}

// ... (existing code)

export function getFirstAccessibleRoute(user: { role: string; permissions: Permission[] }): string {
  // 1. If super_admin, go to dashboard
  if (user.role === 'super_admin' || user.role === 'admin') return '/dashboard';

  // 2. Iterate through modules in order to find the first accessible resource
  for (const module of PERMISSION_MODULES) {
    for (const resource of module.resources) {
      if (!PERMISSION_NAV_MAP[resource.key]) continue;

      const hasRead = user.permissions.some(
        p => p.resource === resource.key && (p.action === 'read' || p.action === '*')
      );

      if (hasRead) {
        return PERMISSION_NAV_MAP[resource.key].href;
      }
    }
  }

  // 3. Fallback
  return '/dashboard'; // Or a 403 page if stricter
}
