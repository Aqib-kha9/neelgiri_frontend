# Project Structure - Logistics & Delivery Management System

## Overview
This is a comprehensive Next.js 15 frontend application for an enterprise Logistics & Delivery Management System with role-based access control, multi-tenant architecture, and dynamic permissions management.

## Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Icons**: Lucide React

## Project Structure

```
delivery_f/
├── app/                          # Next.js App Router
│   ├── (dashboard)/              # Protected dashboard routes
│   │   └── dashboard/
│   │       ├── page.tsx          # Role-aware main dashboard
│   │       ├── admin/            # System admin pages
│   │       │   ├── roles/        # Role management
│   │       │   └── permissions/  # Permissions matrix
│   │       ├── booking/          # Booking management
│   │       │   └── create/       # Create booking
│   │       ├── orders/           # Order management
│   │       ├── branches/         # Branch management
│   │       ├── users/            # User management
│   │       ├── reports/          # Reports & analytics
│   │       ├── tracking/         # Order tracking
│   │       ├── rider/             # Rider-specific pages
│   │       │   └── tasks/        # Rider tasks
│   │       ├── customer/         # Customer portal
│   │       │   ├── booking/      # Customer booking
│   │       │   └── orders/       # Customer orders
│   │       ├── drs/              # Delivery Run Sheet
│   │       ├── manifest/         # Manifest management
│   │       ├── pod/               # Proof of Delivery
│   │       ├── warehouse/        # Warehouse operations
│   │       ├── partners/          # Partner management
│   │       ├── gst/               # GST compliance
│   │       └── ...                # Other feature pages
│   ├── login/                     # Login page
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Public landing page
│
├── components/
│   ├── admin/                     # Admin components
│   │   ├── ImpersonationBanner.tsx
│   │   └── ImpersonateUser.tsx
│   ├── auth/                      # Authentication components
│   │   ├── ProtectedRoute.tsx
│   │   └── PermissionGate.tsx
│   ├── layout/                     # Layout components
│   │   ├── PublicHeader.tsx
│   │   ├── PublicFooter.tsx
│   │   ├── AuthenticatedHeader.tsx
│   │   ├── AuthenticatedFooter.tsx
│   │   └── Sidebar.tsx            # Role-based sidebar
│   └── ui/                         # shadcn/ui components
│
├── contexts/
│   └── AuthContext.tsx            # Authentication context
│
├── hooks/
│   └── usePermissions.ts          # Permissions hook
│
├── lib/
│   ├── utils.ts                   # Utility functions
│   └── navigation.ts              # Navigation configuration
│
├── mock-api/
│   ├── api.ts                      # Mock API functions
│   └── data/                       # Mock JSON data
│       ├── users.json
│       ├── tenants.json
│       ├── branches.json
│       └── permissions.json
│
├── types/
│   └── index.ts                    # TypeScript type definitions
│
└── public/                         # Static assets
```

## Role-Based Navigation

Each role has a customized sidebar navigation:

### Super Admin
- Dashboards (Main, Operations, Partner Performance, Financial, GST)
- Booking & Orders (Full access)
- AWB Management
- Tracking & POD
- Delivery Run Sheet
- Manifest Management (Counter & Forwarding)
- Branch Management
- Warehouse Operations
- Partner Management
- Vendor Management
- Customer Management
- Financial & GST
- Operations (Rider Management, Exception Handling)
- Reports & Analytics
- Master Data
- System Admin

### Partner Admin
- Main Dashboard
- Booking & Orders
- Tracking & POD
- Branch Management
- Financial & GST
- Reports

### Branch Admin
- Main Dashboard
- Booking & Orders
- Delivery Run Sheet
- Tracking & POD
- Rider Management
- Reports

### Warehouse Admin
- Main Dashboard
- Manifest Management
- Warehouse Operations

### Dispatcher
- Main Dashboard
- Order Management
- Delivery Run Sheet
- Rider Management
- Tracking

### Rider
- My Tasks
- Create DRS
- POD Capture
- My Performance

### Customer
- Dashboard
- Create Order
- My Orders
- Track Order
- Pickup Requests
- Invoices

## Permission System

### Resources
- branch, warehouse, order, invoice, partner, user, shipment, manifest, pod, customer, report, gst, booking, awb, drs, tracking, rider, vendor, pickup, exception, master_data, system_settings

### Actions
- view, manage, create, update, delete, assign, impersonate, approve, assign_staff, stock_update, update_status, assign_rider, cancel, generate, bulk_operations, onboard, assign_roles, export, analytics, filing, compliance, reports, verify, capture, allocate, reconcile, track, scan, bulk_update, configure

### Dynamic Permissions
- Admins can create custom roles
- Permissions can be assigned per resource
- System roles are protected
- Custom roles can be edited/deleted

## Key Features

### 1. Authentication & Authorization
- Email/password login
- Session management
- Role-based access control
- Permission-based UI rendering
- Protected routes

### 2. Multi-Tenant Architecture
- Super Admin tenant
- Partner tenants
- Branch assignment
- Tenant-scoped data

### 3. Impersonation
- Admin can impersonate users
- Visual indicators
- Audit logging

### 4. Role-Specific Dashboards
- Each role sees relevant metrics
- Quick actions based on permissions
- Role-appropriate navigation

### 5. Customer Portal
- Public landing page
- Customer booking
- Order tracking
- Invoice download

## API Integration Points

All API calls are currently mocked in `mock-api/api.ts`. Replace with real API endpoints:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`
- `GET /api/users`
- `POST /api/users/:id/impersonate`
- `GET /api/orders`
- `POST /api/booking/create`
- `GET /api/branches`
- `GET /api/partners`
- `GET /api/permissions/:role`
- `POST /api/roles/create`
- `PUT /api/roles/:id`
- `DELETE /api/roles/:id`

## Development

1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`
3. Build: `npm run build`

## Demo Accounts

All use password: `password123`
- `superadmin@logistics.com` - Super Admin
- `partner@delivery.com` - Partner Admin
- `branch@delivery.com` - Branch Admin
- `warehouse@delivery.com` - Warehouse Admin
- `dispatcher@delivery.com` - Dispatcher
- `rider@delivery.com` - Rider
- `customer@example.com` - Customer

## Next Steps

1. Replace mock API with real backend integration
2. Add more feature pages (AWB, DRS, Manifest, etc.)
3. Implement permission matrix UI for role creation
4. Add real-time updates
5. Implement file uploads
6. Add pagination and search
7. Enhance mobile responsiveness
8. Add unit tests

