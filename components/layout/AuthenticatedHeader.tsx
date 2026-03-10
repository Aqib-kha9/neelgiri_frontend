"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  LayoutGrid,
  Menu,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  UserCircle2,
  LogOut,
  Shield,
  Truck,
  User,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionGate } from "@/components/auth/PermissionGate";

interface AuthenticatedHeaderProps {
  onMenuClick?: () => void;
}

export function AuthenticatedHeader({ onMenuClick }: AuthenticatedHeaderProps) {
  const { session, logout } = useAuth();
  const { can, role } = usePermissions();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const userInitials =
    session?.user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const getNavItems = () => {
    const items: Array<{
      href: string;
      label: string;
      icon: React.ReactNode;
      permission?: { action: string; resource: string };
    }> = [];

    if (role === "super_admin") {
      if (can("view", "order"))
        items.push({
          href: "/dashboard/orders",
          label: "Orders",
          icon: <Truck className="h-4 w-4" />,
        });
      if (can("view", "report"))
        items.push({
          href: "/dashboard/reports",
          label: "Reports",
          icon: <Settings className="h-4 w-4" />,
        });
    }
    return items;
  };

  const breadcrumbs = useMemo(() => {
    const pathParts = pathname.split("/").filter(Boolean);
    // Skip "dashboard" if it's the first part, or map it.
    return pathParts.map((part, index) => {
      const href = "/" + pathParts.slice(0, index + 1).join("/");
      const label = part.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
      const isLast = index === pathParts.length - 1;
      return { href, label, isLast };
    });
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm font-medium text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground transition-colors hidden sm:block">Dashboard</Link>
            {breadcrumbs.length > 0 && breadcrumbs[0].label !== "Dashboard" && (
              <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/50 hidden sm:block" />
            )}

            {breadcrumbs.map((crumb, idx) => {
              if (crumb.label === "Dashboard") return null;
              return (
                <div key={crumb.href} className="flex items-center">
                  {idx > 0 && <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/50" />}
                  {crumb.isLast ? (
                    <span className="font-semibold text-foreground px-1 py-0.5 rounded-md bg-muted/50">
                      {crumb.label}
                    </span>
                  ) : (
                    <>
                      <Link href={crumb.href} className="hover:text-foreground transition-colors hidden sm:block">
                        {crumb.label}
                      </Link>
                      {/* On mobile, we usually only show the active page, or back button. 
                                    For now keeping it simple: Show active on mobile, full trail on Desktop */}
                      <span className="sm:hidden font-semibold text-foreground">
                        {crumb.label}
                      </span>
                    </>
                  )}
                </div>
              )
            })}
          </nav>
        </div>

        <div className="ml-auto flex flex-1 items-center justify-end gap-2 lg:flex-none lg:justify-between">
          <div className="relative hidden lg:flex items-center mr-4 w-64 xl:w-80 group">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search..."
              className="h-10 rounded-full border-border/50 bg-muted/50 pl-10 pr-12 text-sm shadow-none focus-visible:ring-1 focus-visible:bg-background transition-all"
            />
            <div className="pointer-events-none absolute right-3 flex items-center gap-1 text-[10px] font-medium text-muted-foreground border border-border/50 rounded px-1.5 py-0.5 bg-background/50">
              <span className="text-xs">⌘</span>K
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-muted"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
            </Button>


            <div className="hidden items-center gap-2 xl:flex">
              <Button
                variant="default"
                size="sm"
                className="rounded-full bg-primary px-4 h-9 text-sm font-medium shadow-lg shadow-primary/20 hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </div>

            <div className="h-6 w-px bg-border/50 mx-1 hidden sm:block" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="flex items-center gap-2 rounded-full pl-1.5 pr-3 py-1 text-left hover:bg-muted/50 h-auto"
                  variant="ghost"
                >
                  <Avatar className="h-8 w-8 border border-border/50">
                    <AvatarImage
                      src="https://i.pravatar.cc/100?img=12"
                      alt={session?.user.name || "User"}
                    />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col gap-0.5">
                    <p className="text-xs font-semibold text-foreground leading-none">
                      {session?.user.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground capitalize leading-none">
                      {session?.user.role?.replace(/_/g, " ")}
                    </p>
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground hidden md:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
                <DropdownMenuItem className="flex items-center gap-2">
                  <UserCircle2 className="h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Admin Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {session?.isImpersonating && (
                  <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                    <Shield className="h-4 w-4" />
                    Impersonating Mode
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/profile"
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <User className="h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <PermissionGate action="view" resource="system_settings">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/settings"
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" /> Settings
                    </Link>
                  </DropdownMenuItem>
                </PermissionGate>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer flex items-center gap-2 text-destructive"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
