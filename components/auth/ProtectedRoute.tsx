"use client";

import { useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import type { UserRole } from "@/types";
import { PageLoader } from "@/components/loading/PageLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: {
    action: string;
    resource: string;
  };
}

export function ProtectedRoute({
  children,
  allowedRoles,
  requiredPermission,
}: ProtectedRouteProps) {
  const { session, loading } = useAuth();
  const { can } = usePermissions();
  const router = useRouter();
  const pathname = usePathname();

  const hasAccess = useMemo(() => {
    if (!session) return false;

    console.log("ProtectedRoute: Checking access", {
      role: session?.user.role,
      allowedRoles,
      requiredPermission
    });

    // Check role-based access
    if (allowedRoles && !allowedRoles.includes(session.user.role)) {
      console.warn("ProtectedRoute: Role mismatch");
      return false;
    }

    // Check permission-based access
    if (
      requiredPermission &&
      !can(requiredPermission.action as any, requiredPermission.resource as any)
    ) {
      console.warn("ProtectedRoute: Permission denied");
      return false;
    }

    return true;
  }, [session, allowedRoles, requiredPermission, can]);

  useEffect(() => {
    console.log("ProtectedRoute: Effect triggered", { loading, session: !!session, hasAccess });
    if (!loading) {
      if (!session) {
        console.log("ProtectedRoute: No session, redirecting to login");
        const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
        router.replace(loginUrl);
        return;
      }

      if (!hasAccess) {
        console.log("ProtectedRoute: No access, redirecting to dashboard");
        router.replace("/dashboard");
        return;
      }
    }
  }, [session, loading, hasAccess, router, pathname]);

  if (loading) {
    return <PageLoader message="Checking authentication..." />;
  }

  if (!session) {
    return null;
  }

  if (!hasAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="mt-2 text-muted-foreground">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

