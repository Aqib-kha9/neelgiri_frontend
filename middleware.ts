import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = ["/", "/login"];

// Protected routes that require authentication
const protectedRoutes = ["/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session")?.value;

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname === route || pathname.startsWith(route + "/")
  );

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Parse session cookie if it exists
  let hasValidSession = false;
  if (sessionCookie) {
    try {
      console.log("Middleware: Found session cookie, length:", sessionCookie.length);
      const decoded = decodeURIComponent(sessionCookie);
      const session = JSON.parse(decoded);

      // Check if session is not expired
      if (session?.expiresAt) {
        const expiryTime = new Date(session.expiresAt).getTime();
        const now = Date.now();
        console.log(`Middleware: Expiry Check - Now: ${now}, Expiry: ${expiryTime}, Valid: ${now < expiryTime}`);
        hasValidSession = now < expiryTime;
      } else if (session?.user) {
        // If session has user data, consider it valid (for mock)
        console.log("Middleware: No expiry but has user, allowing.");
        hasValidSession = true;
      } else {
        console.log("Middleware: Cookie exists but structure invalid");
        hasValidSession = !!session;
      }
    } catch (e) {
      console.error("Middleware: Cookie parse error:", e);
      hasValidSession = false;
    }
  } else {
    console.log("Middleware: No session cookie found for path:", pathname);
  }

  // Redirect to login if accessing protected route without valid session
  if (isProtectedRoute && !hasValidSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing login with valid session
  if (pathname === "/login" && hasValidSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // --- GRANULAR RBAC PROTECTION ---
  // Parse role from session (if available in cookie)
  let userRole = '';
  if (sessionCookie) {
    try {
      const decoded = decodeURIComponent(sessionCookie);
      const session = JSON.parse(decoded);
      userRole = session?.user?.role || '';
    } catch (e) { }
  }

  // Define restricted System Admin paths
  // These paths are normally only for Super Admin.
  // We want to exempt "User Management" (/dashboard/roll-permission/users) for Sub-Admins.

  const isSystemAdminPath = pathname.startsWith('/dashboard/roll-permission') ||
    pathname.startsWith('/dashboard/admin');

  if (isSystemAdminPath && hasValidSession) {
    // Allow Super Admin everywhere
    if (userRole === 'super_admin') {
      return NextResponse.next();
    }

    // Sub-Admins (Partner, Branch, Dispatcher)
    if (['partner_admin', 'partner', 'branch_admin', 'branch', 'dispatcher'].includes(userRole)) {
      // ALLOW ONLY: /dashboard/roll-permission/users (and sub-paths)
      // BLOCK: everything else in System Admin
      if (pathname.startsWith('/dashboard/roll-permission/users')) {
        return NextResponse.next();
      }
      // Redirect unauthorized System Admin access to main dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // All other roles (Rider, Customer) -> Block System Admin entirely
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  // -------------------------------

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

