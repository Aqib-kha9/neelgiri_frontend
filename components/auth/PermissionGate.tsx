"use client";

import { usePermissions } from "@/hooks/usePermissions";
import type { Action, Resource } from "@/types";

interface PermissionGateProps {
  action: Action;
  resource: Resource;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGate({
  action,
  resource,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { can } = usePermissions();

  if (!can(action, resource)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

