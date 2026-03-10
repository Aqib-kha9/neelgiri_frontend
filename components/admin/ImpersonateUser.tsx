"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";
import { mockApi } from "@/mock-api/api";
import type { User } from "@/types";

export function ImpersonateUser() {
  const { session, refreshSession } = useAuth();
  const { can } = usePermissions();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && can("impersonate", "user")) {
      loadUsers();
    }
  }, [open, can]);

  const loadUsers = async () => {
    try {
      const data = await mockApi.getUsers();
      setUsers(data.filter((u) => u.id !== session?.user.id));
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const handleImpersonate = async (userId?: string) => {
    if (!session) return;

    setError("");
    setLoading(true);

    try {
      const targetUserId = userId || users.find((u) => u.email === email)?.id;
      if (!targetUserId) {
        setError("User not found");
        setLoading(false);
        return;
      }

      await mockApi.impersonateUser(targetUserId, session.user.id);
      await refreshSession();
      setOpen(false);
      setEmail("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to impersonate");
    } finally {
      setLoading(false);
    }
  };

  if (!can("impersonate", "user")) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Shield className="mr-2 h-4 w-4" />
          Impersonate User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Impersonate User</DialogTitle>
          <DialogDescription>
            Enter the email of the user you want to impersonate. All actions
            will be logged.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Search by Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Or select a user:</Label>
              <div className="max-h-60 space-y-2 overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleImpersonate(user.id)}
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email} • {user.role.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button
              onClick={() => handleImpersonate()}
              disabled={loading || !email}
              className="w-full"
            >
              {loading ? "Impersonating..." : "Impersonate by Email"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

