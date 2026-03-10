"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { Session } from "@/types";
import { SESSION_STORAGE_KEY, SESSION_EXPIRY_BUFFER } from "@/lib/constants";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Helper to set cookie
const setCookie = (name: string, value: string, days: number) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (encodeURIComponent(value || "")) + expires + "; path=/; SameSite=Lax";
};

type Permission = {
  resource: string;
  action: string;
};

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string, profileIndex?: number) => Promise<Session | any | null>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isAuthenticated: boolean;
  can: (resource: string, action: string) => boolean; // New helper
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // CONNECTION TEST: Ping backend on mount to prove connection
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log("🔍 Testing connection to backend...");
        await fetch("/api/auth/test-connection");
      } catch (e) {
        console.error("Connection test failed", e);
      }
    };
    testConnection();
  }, []);

  const loadSession = useCallback(async () => {
    try {
      let token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      // RECOVERY: If token is missing from localStorage but we have a session cookie, try to recover
      if (!token && typeof document !== 'undefined') {
        const cookies = document.cookie.split('; ');
        const sessionCookie = cookies.find(row => row.startsWith('session='));
        if (sessionCookie) {
          try {
            const rawValue = sessionCookie.split('=')[1];
            const decodedValue = decodeURIComponent(rawValue);
            const cookieData = JSON.parse(decodedValue);
            if (cookieData.token) {
              token = cookieData.token as string;
              localStorage.setItem("token", token);
            } else {
              // No token in cookie? Clear it to prevent redirect loops
              document.cookie = "session=; path=/; max-age=0; SameSite=Lax";
              window.location.reload();
              return;
            }
          } catch (e) {
            // Silently fail recovery
          }
        }
      }

      if (!token) {
        setSession(null);
        setLoading(false);
        return;
      }

      // Verify token with backend
      const res = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("AuthContext: fetch /me status:", res.status);

      if (res.ok) {
        const userData = await res.json();
        const currentSession: Session = {
          user: {
            id: userData._id,
            email: userData.email,
            name: userData.name,
            role: userData.role, // Legacy role name
            roleDisplayName: userData.roleDisplayName, // Friendly name
            branchId: userData.branchId,
            permissions: userData.permissions, // New permissions array
            partnerName: userData.partnerName,
            branchName: userData.branchName,
            branchAdminName: userData.branchAdminName,
            creatorName: userData.creatorName,
            city: userData.city,
            pincode: userData.pincode,
            childrenBranches: userData.childrenBranches
          },
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
        setSession(currentSession);
      } else {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 403 && errorData.isPaused) {
          console.warn("User access revoked: Account Paused");
          // Immediately clear and redirect
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem(SESSION_STORAGE_KEY);
            document.cookie = "session=; path=/; max-age=0; SameSite=Lax";
            window.location.href = "/force-logout";
          }
          setSession(null);
          return;
        }

        console.log("AuthContext: Session invalid");
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem(SESSION_STORAGE_KEY);
        }
        setSession(null);
      }
    } catch (error) {
      console.error("Session verification failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();

    const syncInterval = setInterval(() => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token && !loading) {
        loadSession();
      }
    }, 15000);

    return () => clearInterval(syncInterval);
  }, [loadSession, loading]);

  const login = useCallback(async (email: string, password: string, profileIndex?: number) => {
    try {
      console.log(`Attempting login for ${email} to /api/auth/login`);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, profileIndex }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.message || "Login failed", status: res.status };
      }

      // Check for Multi-Profile Handling
      if (data.requiresProfileSelection) {
        // Do NOT set session yet. Return special object to let UI handle selection.
        return {
          requiresProfileSelection: true,
          profiles: data.profiles
        };
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
      }

      // Create session object
      const newSession: Session = {
        user: {
          id: data._id,
          email: data.email,
          name: data.name,
          role: data.role,
          roleDisplayName: data.roleDisplayName,
          branchId: data.branchId, // Context-aware branch ID
          permissions: data.permissions,
          partnerName: data.partnerName,
          branchName: data.branchName,
          branchAdminName: data.branchAdminName,
          creatorName: data.creatorName,
          childrenBranches: data.childrenBranches
        },
        token: data.token, // Store token in session object
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      setSession(newSession);

      // Set session cookie for middleware (exclude permissions to avoid 4KB limit)
      const cookieSession = {
        ...newSession,
        user: {
          ...newSession.user,
          permissions: [], // Exclude permissions
          childrenBranches: [] // Exclude large arrays to prevent 4KB limit
        }
      };
      setCookie("session", JSON.stringify(cookieSession), 30);

      // Redirect will be handled by the login page component
      return newSession;

    } catch (error) {
      console.error("Login error:", error);
      return { error: error instanceof Error ? error.message : "Network error" };
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      // Clear local state
      setSession(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem(SESSION_STORAGE_KEY);
        // Clear cookie
        document.cookie = "session=; path=/; max-age=0; SameSite=Lax";

        toast.success("Successfully Logged Out", {
          description: "See you again soon!",
          duration: 5000,
        });
      }
      setTimeout(() => {
        router.push('/login');
      }, 500);

    } catch (error) {
      console.error("Failed to logout:", error);
    }
  }, [router]);

  const refreshSession = useCallback(async () => {
    await loadSession();
  }, [loadSession]);

  const isAuthenticated = useMemo(() => {
    return !!session;
  }, [session]);

  // New helper for permission checking
  const can = useCallback((resource: string, action: string) => {
    if (!session?.user?.permissions) return false;
    return session.user.permissions.some(p =>
      p.resource === resource && (p.action === action || p.action === '*')
    );
  }, [session]);

  const value = useMemo(
    () => ({
      session,
      loading,
      login,
      logout,
      refreshSession,
      isAuthenticated,
      can,
    }),
    [session, loading, login, logout, refreshSession, isAuthenticated, can]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
