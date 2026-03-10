"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Shield, X } from "lucide-react";
import { mockApi } from "@/mock-api/api";

export function ImpersonationBanner() {
  const { session, refreshSession } = useAuth();
  const router = useRouter();

  if (!session?.isImpersonating) {
    return null;
  }

  const handleStopImpersonation = async () => {
    if (session.impersonatedBy) {
      try {
        await mockApi.stopImpersonation(session.impersonatedBy);
        await refreshSession();
        router.refresh();
      } catch (error) {
        console.error("Failed to stop impersonation:", error);
      }
    }
  };

  return (
    <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
      <Shield className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-yellow-800 dark:text-yellow-200">
          You are impersonating <strong>{session.user.name}</strong>. All actions
          will be logged.
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleStopImpersonation}
          className="ml-4 border-yellow-600 text-yellow-800 hover:bg-yellow-100"
        >
          <X className="mr-2 h-4 w-4" />
          Stop Impersonating
        </Button>
      </AlertDescription>
    </Alert>
  );
}

