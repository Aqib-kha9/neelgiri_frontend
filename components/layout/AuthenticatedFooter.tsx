// AuthenticatedFooter.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export function AuthenticatedFooter() {
  const { session } = useAuth();

  return (
    <footer className="fixed bottom-0 z-30 w-full border-t bg-muted">
      <div className="w-full py-3 px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} LogiFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap justify-center">
            <span>
              Tenant: <strong>{session?.tenant?.name}</strong>
            </span>
            {session?.branches?.length ? (
              <span>
                Branches: <strong>{session.branches.length}</strong>
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
