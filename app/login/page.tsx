"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageLoader } from "@/components/loading/PageLoader";
import { Truck } from "lucide-react";
import Link from "next/link";
import { getFirstAccessibleRoute } from "@/lib/navigation";
import { toast } from "sonner";


// Simple Profile Selection Modal
function ProfileSelectionModal({
  profiles,
  onSelect,
  open
}: {
  profiles: any[],
  onSelect: (index: number) => void,
  open: boolean
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
      <Card className="w-full max-w-md shadow-2xl relative">
        <CardHeader>
          <CardTitle>Select Profile</CardTitle>
          <CardDescription>
            Your email is associated with multiple accounts. Please select which one you want to access.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 max-h-[60vh] overflow-y-auto">
          {profiles.map((profile) => (
            <button
              key={profile.index}
              onClick={() => onSelect(profile.index)}
              className="flex flex-col items-start gap-1 rounded-xl border p-4 text-left hover:bg-muted/50 transition-colors focus:ring-2 focus:ring-primary outline-none"
            >
              <div className="flex items-center justify-start gap-2 w-full">
                <span className="font-semibold text-lg">{profile.partnerName}</span>
                {profile.isInactive ? (
                  <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Inactive</span>
                ) : (
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Active</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">Branch ID: {profile.branchId || 'N/A'}</span>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Multi-profile state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [availableProfiles, setAvailableProfiles] = useState<any[]>([]);

  const { login, isAuthenticated, session } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for specialized errors (Account Paused)
  useEffect(() => {
    const errType = searchParams.get("error");
    if (errType === "account_paused") {
      const msg = "Your account has been paused by administrator. Access restricted.";
      setError(msg);
      toast.error("Access Restricted", {
        description: msg,
        duration: 5000,
      });
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && session) {
      const timer = setTimeout(() => {
        router.replace("/dashboard");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, session, router]);

  const performLogin = async (profileIdx?: number) => {
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password, profileIdx);

      // Handle Explicit Errors from AuthContext
      if (result && result.error) {
        const msg = result.error;
        setError(msg);
        toast.error("Login Failed", {
          description: msg === "Invalid email or password"
            ? "The email or password you entered is incorrect. Please try again."
            : msg,
          duration: 4000,
        });
        setLoading(false);
        return;
      }

      // Handle Multi-Profile Case
      if (result && result.requiresProfileSelection) {
        setAvailableProfiles(result.profiles);
        setShowProfileModal(true);
        setLoading(false);
        return; // Stop here, wait for user selection
      }

      // Standard Login Success
      toast.success("Login Successful!", {
        description: (
          <span>
            Welcome back, <b className="font-bold text-foreground">{(result as any).user?.name || "User"}</b>! Redirecting to your dashboard...
          </span>
        ),
        duration: 4000,
      });

      await new Promise((resolve) => setTimeout(resolve, 1200)); // Increased delay for readability

      // ALWAYS REDIRECT TO DASHBOARD as requested by owner
      const redirect = "/dashboard";

      window.location.href = redirect;
    } catch (err) {
      console.error("Unexpected login error:", err);
      const msg = "An unexpected error occurred. Please try again.";
      setError(msg);
      toast.error("System Error", {
        description: msg,
        duration: 4000,
      });
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performLogin(); // Initial attempt without profile index
  };

  const handleProfileSelect = (index: number) => {
    setShowProfileModal(false);
    performLogin(index); // Retry login with selected index
  };

  return (
    <div className="flex min-h-screen flex-col">
      <ProfileSelectionModal
        open={showProfileModal}
        profiles={availableProfiles}
        onSelect={handleProfileSelect}
      />

      <header className="border-b">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Truck className="h-6 w-6" />
            <span className="text-xl font-bold">LogiFlow</span>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center bg-muted/50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert Hidden - Using Toasts now */}
              {error && error.includes("administrator") && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive animate-in fade-in slide-in-from-top-1">
                  <AlertDescription className="font-medium text-xs">{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Demo: Use any email from mock data with password "password123"
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p className="font-semibold">Demo Accounts:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>superadmin@logistics.com</li>
                <li>partner@delivery.com</li>
                <li>branch@delivery.com</li>
                <li>dispatcher@delivery.com</li>
                <li>rider@delivery.com</li>
                <li>customer@example.com</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <Suspense fallback={<PageLoader message="Loading login..." />}>
        <LoginForm />
      </Suspense>
    </AuthProvider>
  );
}

