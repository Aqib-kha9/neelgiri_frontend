"use client";

import { useAuth } from "@/contexts/AuthContext";
import { mockApi } from "@/mock-api/api";
import type { Action, Resource } from "@/types";

export function usePermissions() {
  const { session } = useAuth();

  const can = (action: Action, resource: Resource): boolean => {
    if (!session?.user) return false;
    return mockApi.can(session.user.role, action, resource);
  };

  const allowedActions = (resource: Resource): Action[] => {
    if (!session?.user) return [];
    return mockApi.allowedActions(session.user.role, resource);
  };

  const hasAnyPermission = (resource: Resource): boolean => {
    if (!session?.user) return false;
    const actions = mockApi.allowedActions(session.user.role, resource);
    return actions.length > 0;
  };

  return {
    can,
    allowedActions,
    hasAnyPermission,
    role: session?.user?.role,
  };
}

