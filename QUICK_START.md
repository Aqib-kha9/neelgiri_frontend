# Quick Start Guide

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Testing the Application

### 1. Landing Page
- Visit the root URL `/` to see the SEO-optimized landing page
- Notice the public header and footer

### 2. Login
- Navigate to `/login`
- Use any of these demo accounts (password: `password123`):
  - `superadmin@logistics.com` - Full system access
  - `partner@delivery.com` - Partner admin
  - `branch@delivery.com` - Branch admin
  - `dispatcher@delivery.com` - Dispatcher
  - `rider@delivery.com` - Rider
  - `customer@example.com` - Customer

### 3. Dashboard
- After login, you'll be redirected to `/dashboard`
- Notice the authenticated header and footer (different from landing page)
- Dashboard shows role-specific metrics and quick actions

### 4. Role-Based Pages
- **Orders** (`/dashboard/orders`): View and manage orders (permission-based)
- **Branches** (`/dashboard/branches`): Manage branches
- **Users** (`/dashboard/users`): User management with impersonation
- **Reports** (`/dashboard/reports`): Analytics and exports
- **Tracking** (`/dashboard/tracking`): Order tracking interface

### 5. Impersonation (Super Admin only)
- Login as `superadmin@logistics.com`
- Go to Users page
- Click "Impersonate User" button
- Select a user to impersonate
- Notice the yellow banner indicating impersonation mode
- All actions are logged in audit trail

### 6. Permission Testing
- Try logging in with different roles
- Notice how UI elements appear/disappear based on permissions
- Some buttons/links are hidden if you don't have permission
- Protected routes redirect if unauthorized

## Key Features Demonstrated

✅ **Public Landing Page** - SEO optimized with different header/footer  
✅ **Authentication Flow** - Login with session management  
✅ **Role-Based Access Control** - 7 different roles with granular permissions  
✅ **Protected Routes** - Automatic redirect for unauthorized access  
✅ **Permission-Based UI** - Components render based on permissions  
✅ **Multi-Tenant Architecture** - Tenant and branch scoping  
✅ **Impersonation System** - Admin can impersonate users with audit logging  
✅ **Mock API Layer** - Complete mock data for testing  
✅ **Responsive Design** - Works on all device sizes  

## Project Structure

```
app/
  (dashboard)/          # Protected routes group
    dashboard/          # Dashboard pages
  login/                # Login page
  page.tsx              # Landing page (public)

components/
  admin/                # Admin components (impersonation)
  auth/                 # Auth components (ProtectedRoute, PermissionGate)
  layout/               # Headers and footers
  ui/                   # shadcn/ui components

contexts/
  AuthContext.tsx       # Authentication context provider

hooks/
  usePermissions.ts     # Permission checking hook

mock-api/
  api.ts                # Mock API functions
  data/                 # JSON mock data

types/
  index.ts              # TypeScript type definitions
```

## Next Steps

1. **Backend Integration**: Replace `mock-api/api.ts` with real API calls
2. **Add More Pages**: Create additional role-specific pages
3. **Enhance UI**: Add more shadcn/ui components
4. **Add Tests**: Write unit tests for permission logic
5. **Deploy**: Deploy to Vercel, Netlify, or your preferred platform

## Troubleshooting

- **Build errors**: Run `npm run build` to check for TypeScript errors
- **Session issues**: Clear browser localStorage if session gets stuck
- **Permission issues**: Check `mock-api/data/permissions.json` for role permissions

Happy coding! 🚀

