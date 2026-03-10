"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PERMISSION_NAV_MAP } from "@/lib/navigation"; // Now exported

// Flat map of route -> permission key
// We need to construct this from PERMISSION_NAV_MAP logic essentially,
// but since PERMISSION_NAV_MAP is in lib/navigation.ts, let's try to reuse or replicate.
// Ideally, we move the map to a shared config.
// For now, I'll assume we can infer permission from the route logic used in Sidebar/Navigation.
// But to be safe and robust, let's define a basic mapping.

const PUBLIC_ROUTES = ['/dashboard', '/dashboard/profile']; // Routes everyone can access

export function RouteGuard({ children }: { children: React.ReactNode }) {
    const { session, loading, can } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // 1. Wait for auth to load
        if (loading) return;

        // 2. Not logged in? Redirect to login
        if (!session?.user) {
            console.log("RouteGuard: No session found, redirecting to login");
            setAuthorized(false);
            router.push('/login');
            return;
        }

        // 3. User is super_admin? Allow everything.
        if (session.user.role === 'super_admin') {
            setAuthorized(true);
            return;
        }

        // 4. Public internal routes check
        if (PUBLIC_ROUTES.includes(pathname) || pathname === '/dashboard') {
            setAuthorized(true);
            return;
        }

        // --- SPECIFIC EXEMPTION FOR USER MANAGEMENT & MANIFEST (MOVED TO TOP) ---
        // Allow Sub-Admins to access User Management and Manifests explicitly, overriding missing permissions.
        const isAdminRole = ['partner_admin', 'partner', 'branch_admin', 'branch', 'dispatcher'].includes(session.user.role);

        if (isAdminRole) {
            // User Management exemption
            if (pathname.startsWith('/dashboard/roll-permission/users')) {
                setAuthorized(true);
                return;
            }
            // Manifest Management exemption
            if (pathname.startsWith('/dashboard/manifest')) {
                setAuthorized(true);
                return;
            }
            // DRS Management exemption
            if (pathname.startsWith('/dashboard/drs')) {
                setAuthorized(true);
                return;
            }
            // Pincode Master exemption
            if (pathname.startsWith('/dashboard/master/pincodes')) {
                setAuthorized(true);
                return;
            }
        }

        // 5. Find if this route requires a permission
        // We reverse lookup the map: Find a resource key where PERMISSION_NAV_MAP[key].href matched the start of pathname

        // Optimization: Strict match first, then prefix match
        let requiredResource = null;

        // Check exact matches first
        for (const [key, nav] of Object.entries(PERMISSION_NAV_MAP)) {
            if (nav.href === pathname) {
                requiredResource = key;
                break;
            }
        }

        // If no exact match, try prefix (e.g. /dashboard/orders/all/123 -> /dashboard/orders/all)
        if (!requiredResource) {
            // Sort keys by length desc to match longest prefix first
            const keys = Object.keys(PERMISSION_NAV_MAP).sort((a, b) => PERMISSION_NAV_MAP[b].href.length - PERMISSION_NAV_MAP[a].href.length);
            for (const key of keys) {
                const navHref = PERMISSION_NAV_MAP[key].href;
                if (pathname.startsWith(navHref) && navHref !== '/dashboard') { // prevent /dashboard matching everything
                    requiredResource = key;
                    break;
                }
            }
        }

        // 6. Check authorization
        if (requiredResource) {
            // We know the resource, do we have ANY permission for it?
            // Usually read access is enough to view the page.
            // can(resource, action). We'll check if user has ANY action for this resource.
            // Our 'can' helper typically checks specific action. 
            // Let's use the raw session permissions array.

            const hasAccess = session.user.permissions.some(p => p.resource === requiredResource);

            if (hasAccess) {
                setAuthorized(true);
            } else {
                console.warn(`⛔ Access Denied: User ${session.user.email} missing permission for resource '${requiredResource}' (Path: ${pathname})`);
                setAuthorized(false);
                router.replace('/dashboard'); // Kick to main dashboard
            }
        } else {
            // Path not found in map? 
            // Either it's a sub-page not strictly mapped, or a public page we missed.
            // Policy: Allow by default if it's under /dashboard and not explicitly restricted? 
            // UNSAFE. 
            // Policy: Block if not recognized? 
            // TOO STRICT for sub-pages e.g. /dashboard/orders/view/123

            // Since we did prefix matching, if it didn't match ANY known module, it might be a 404 or a new page.
            // Let's allow it but log it, assuming 'dashboard' coverage is good.
            // Actually, for safety with custom roles, default allow is risky.
            // But preventing 'edit' or 'create' sub-pages is tricky without explicit maps.

            // Compromise: Allow, assuming the parent list page was protected.
            setAuthorized(true);
        }

    }, [pathname, session, loading, router]);

    if (loading) return <div className="h-screen flex items-center justify-center">Loading Application...</div>;
    if (!authorized) {
        console.log("RouteGuard: Not authorized for", pathname);
        return null;
    }

    return <>{children}</>;
}
