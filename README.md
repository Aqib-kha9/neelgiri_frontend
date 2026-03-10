# LogiFlow - Enterprise Logistics & Delivery Management System

A production-ready Next.js 15 frontend application for enterprise logistics and delivery management with comprehensive role-based access control, multi-tenant architecture, and permission management.

## 🚀 Features

### Core Functionality
- **Multi-Tenant Architecture**: Support for Super Admin and Partner tenants with isolated data
- **Role-Based Access Control**: 7 distinct roles with granular permissions
- **Permission System**: Resource-action based permission checking
- **Authentication**: Complete auth flow with session management
- **Impersonation**: Admin user impersonation with audit logging
- **Protected Routes**: Route-level and component-level access control

### Roles Implemented
1. **Super Admin**: Full system access, partner management, GST compliance
2. **Partner Admin**: Regional partner management, branch oversight
3. **Branch Admin**: Branch operations, rider allocation, DRS management
4. **Warehouse Admin**: Inventory management, stock reconciliation
5. **Dispatcher**: Order assignment, rider coordination
6. **Rider**: Mobile-optimized delivery tasks, POD capture
7. **Customer**: Order creation, tracking portal

### Pages & Features
- **Public Landing Page**: SEO-optimized marketing page
- **Login Page**: Authentication with demo accounts
- **Dashboard**: Role-aware dashboard with metrics
- **Orders Management**: Create, view, update, assign orders
- **Branches Management**: Multi-branch operations
- **Users Management**: User CRUD with role assignment
- **Reports**: Analytics and export functionality

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd delivery_f
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Demo Accounts

Use these credentials to test different roles (password: `password123`):

- **Super Admin**: `superadmin@logistics.com`
- **Partner Admin**: `partner@delivery.com`
- **Branch Admin**: `branch@delivery.com`
- **Warehouse Admin**: `warehouse@delivery.com`
- **Dispatcher**: `dispatcher@delivery.com`
- **Rider**: `rider@delivery.com`
- **Customer**: `customer@example.com`

## 📁 Project Structure

```
delivery_f/
├── app/                      # Next.js App Router
│   ├── (dashboard)/          # Protected dashboard routes
│   │   └── dashboard/        # Dashboard pages
│   ├── login/                # Login page
│   ├── layout.tsx            # Root layout
│   └── page.tsx             # Landing page
├── components/               # React components
│   ├── admin/               # Admin-specific components
│   ├── auth/                # Authentication components
│   ├── layout/               # Layout components
│   └── ui/                   # shadcn/ui components
├── contexts/                 # React contexts
│   └── AuthContext.tsx      # Authentication context
├── hooks/                    # Custom React hooks
│   └── usePermissions.ts    # Permissions hook
├── lib/                      # Utility functions
│   └── utils.ts             # Helper functions
├── mock-api/                 # Mock API layer
│   ├── api.ts               # API functions
│   └── data/                # Mock JSON data
├── types/                    # TypeScript types
│   └── index.ts             # Type definitions
└── public/                   # Static assets
```

## 🔧 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Icons**: Lucide React

## 🎯 Key Concepts

### Authentication Flow
1. User logs in with email/password
2. Session is created and stored (localStorage for mock)
3. Session includes user, tenant, branches, and permissions
4. Protected routes check authentication status
5. Logout clears session

### Permission System
- Permissions are defined in `mock-api/data/permissions.json`
- Each role has access to specific resources with specific actions
- Use `usePermissions()` hook to check permissions
- Use `<PermissionGate>` component for conditional rendering

### Multi-Tenant Architecture
- Super Admin tenant has system-wide access
- Partner tenants have isolated data
- Users are scoped to their tenant
- Branches belong to tenants
- UI filters content by tenant and assigned branches

### Impersonation
- Only users with `impersonate` permission can impersonate
- Impersonation banner shows when active
- All actions are logged in audit trail
- Can stop impersonation to return to original user

## 🔌 Backend Integration

The application uses a mock API layer. To integrate with a real backend:

1. **Update API Endpoints**: Replace `mock-api/api.ts` with actual API calls
2. **Environment Variables**: Configure `NEXT_PUBLIC_API_URL` in `.env.local`
3. **Authentication**: Implement JWT token handling
4. **Session Management**: Replace localStorage with secure session storage
5. **Error Handling**: Add proper error boundaries and retry logic

### API Endpoints Expected

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/session
GET    /api/users
GET    /api/users/:id
GET    /api/tenants
GET    /api/branches
GET    /api/orders
POST   /api/users/:id/impersonate
POST   /api/users/:id/stop-impersonation
GET    /api/permissions/:role
GET    /api/audit-logs
```

## 🧪 Testing

Run the development server and test:
- Login with different roles
- Navigate to different pages
- Check permission-based UI rendering
- Test impersonation flow
- Verify protected routes

## 📝 TODO for Backend Integration

- [ ] Replace mock API with real API calls
- [ ] Implement JWT token refresh
- [ ] Add proper error handling
- [ ] Implement OTP verification
- [ ] Add real-time updates (WebSocket)
- [ ] Implement file uploads
- [ ] Add pagination for lists
- [ ] Implement search and filters
- [ ] Add data export functionality
- [ ] Implement audit log viewing

## 🚀 Deployment

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

For deployment to Vercel, Netlify, or other platforms, follow their respective documentation.

## 📄 License

This project is proprietary software.

## 🤝 Support

For issues and questions, please contact the development team.

---

**Note**: This is a frontend skeleton with mock data. Backend integration is required for production use.
