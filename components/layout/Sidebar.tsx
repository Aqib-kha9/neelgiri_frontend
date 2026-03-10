"use client";

import { useState, useMemo, memo, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { getNavigationForRole } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, LogOut, Sparkles, X, ChevronLeft, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  Building2,
  Warehouse,
  Truck,
  MapPin,
  ClipboardList,
  BarChart3,
  Settings,
  CreditCard,
  FileCheck,
  QrCode,
  ListChecks,
  UserCheck,
  AlertCircle,
  Database,
  Shield,
  ShoppingCart,
  Search,
  Camera,
  Receipt,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  Building2,
  Warehouse,
  Truck,
  MapPin,
  ClipboardList,
  BarChart3,
  Settings,
  CreditCard,
  FileCheck,
  QrCode,
  ListChecks,
  UserCheck,
  AlertCircle,
  Database,
  Shield,
  ShoppingCart,
  Search,
  Camera,
  Receipt,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
};

interface NavItemProps {
  item: any;
  pathname: string;
  level?: number;
  onNavigate?: () => void;
  isCollapsed?: boolean;
}

const NavItem = memo(function NavItem({
  item,
  pathname,
  level = 0,
  onNavigate,
  isCollapsed,
}: NavItemProps) {
  const { can } = usePermissions();
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = useMemo(
    () => item.children && item.children.length > 0,
    [item.children]
  );

  // Auto-expand if child is active
  useEffect(() => {
    if (hasChildren && item.children.some((child: any) => child.href === pathname)) {
      setIsOpen(true);
    }
  }, [pathname, hasChildren, item.children]);

  const isActive = useMemo(() => item.href === pathname, [item.href, pathname]);

  const Icon = useMemo(
    () => (item.icon ? iconMap[item.icon] : null),
    [item.icon]
  );

  const hasPermission = useMemo(() => {
    if (!item.permission) return true;
    return can(item.permission.action, item.permission.resource);
  }, [item.permission, can]);

  if (!hasPermission) return null;

  // Render Logic for Collapsed State
  if (isCollapsed && level === 0) {
    if (hasChildren) {
      return (
        <div className="flex justify-center py-1">
          <DropdownMenu>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 outline-none",
                        isActive || item.children.some((child: any) => child.href === pathname)
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-muted-foreground hover:bg-primary/10 hover:text-primary z-[101]"
                      )}
                    >
                      {Icon ? <Icon className="h-5 w-5" /> : <div className="h-2 w-2 rounded-full bg-current" />}
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenuContent side="right" align="start" className="w-56 ml-2">
              <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {item.children.map((child: any, idx: number) => (
                <DropdownMenuItem key={idx} asChild>
                  <Link
                    href={child.href}
                    className={cn("flex items-center justify-between cursor-pointer w-full", child.href === pathname && "bg-muted font-medium")}
                    onClick={onNavigate}
                  >
                    {child.title}
                    {child.href === pathname && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }

    // Single Item
    return (
      <div className="flex justify-center py-1">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={item.href || "#"}
                onClick={onNavigate}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                {Icon ? <Icon className="h-5 w-5" /> : <div className="h-2 w-2 rounded-full bg-current" />}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              {item.title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    )
  }

  // Expanded State (Original Logic with Enhancements)
  if (hasChildren) {
    return (
      <div className="mb-1">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "group/item flex w-full items-center justify-between gap-3 rounded-r-xl rounded-l-none px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out border-l-2",
            // Premium Active/Open State
            isOpen
              ? "border-primary bg-gradient-to-r from-primary/15 to-transparent text-primary"
              : "border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground hover:pl-4",
            // Highlight parent if child is active
            item.children?.some((child: any) => child.href === pathname) && "border-primary font-semibold text-primary",
            level > 0 && "pl-5 border-l-0 rounded-l-xl ml-2" // Nested items style
          )}
        >
          <span className="flex items-center gap-2">
            {Icon && <Icon className={cn("h-4 w-4 transition-colors", isOpen ? "text-primary" : "text-muted-foreground group-hover/item:text-primary")} />}
            <span className="truncate">{item.title}</span>
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen ? "rotate-180 text-primary" : "text-muted-foreground/50"
            )}
          />
        </button>
        <div
          className={cn(
            "grid transition-all duration-200 ease-in-out",
            isOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="border-l-2 border-primary/10 ml-5 pl-2 space-y-1">
              {item.children.map((child: any, idx: number) => (
                <NavItem
                  key={idx}
                  item={child}
                  pathname={pathname}
                  level={level + 1}
                  onNavigate={onNavigate}
                  isCollapsed={isCollapsed} // Pass specific false or logic if needed, but keeping it ensures purity
                />
              ))}
            </div>
          </div>
        </div>
      </div >
    );
  }

  if (!item.href) return null;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group/item flex items-center justify-between gap-3 rounded-r-xl rounded-l-none px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out border-l-2 mb-0.5",
        level > 0 && "pl-5 border-l-0 rounded-l-xl ml-2", // Nested items style
        isActive
          ? "border-primary bg-gradient-to-r from-primary/15 to-transparent text-primary font-semibold"
          : "border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground hover:pl-4"
      )}
    >
      <span className="flex items-center gap-2">
        {
          Icon ? (
            <Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover/item:text-primary")} />
          ) : level > 0 ? (
            <div className={cn("h-1 w-1 rounded-full transition-colors", isActive ? "bg-primary-foreground" : "bg-muted-foreground group-hover/item:bg-primary")} />
          ) : null
        }
        <span className="truncate">{item.title}</span>
      </span>
      {item.badge && <Badge variant="secondary" className="px-1.5 py-0 h-5 text-[10px]">{item.badge}</Badge>}
    </Link>
  );
});

NavItem.displayName = "NavItem";

const QUICK_ACTIONS_KEY = "quickActionsHidden";

interface SidebarProps {
  onClose?: () => void;
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
}

export const Sidebar = memo(function Sidebar({ onClose, isCollapsed = false, toggleCollapse }: SidebarProps) {
  const { session, logout } = useAuth();
  const pathname = usePathname();
  // State to manage visibility of the Quick Actions card
  const [isQuickActionsHidden, setIsQuickActionsHidden] = useState(false);

  const navigation = useMemo(
    () => (session?.user ? getNavigationForRole(session.user.role, session.user.permissions) : []),
    [session?.user?.role, session?.user?.permissions]
  );

  // Load hidden state from sessionStorage - fixed with proper dependencies
  useEffect(() => {
    if (session?.user?.id && typeof window !== "undefined") {
      // Use sessionStorage instead of localStorage
      const isHidden =
        sessionStorage.getItem(`${QUICK_ACTIONS_KEY}_${session.user.id}`) ===
        "true";
      setIsQuickActionsHidden(isHidden);
    } else {
      // If no session, default to showing the card
      setIsQuickActionsHidden(false);
    }
  }, [session?.user?.id]); // Added proper dependency

  const handleHideQuickActions = useCallback(() => {
    setIsQuickActionsHidden(true);
    // Persist the choice in sessionStorage (cleared when browser closes)
    if (session?.user?.id && typeof window !== "undefined") {
      sessionStorage.setItem(`${QUICK_ACTIONS_KEY}_${session.user.id}`, "true");
    }
  }, [session?.user?.id]);

  const roleTitle = useMemo(() => {
    if (!session?.user) return "";

    // Prefer the friendly display name from backend if available
    if (session.user.roleDisplayName) return session.user.roleDisplayName;

    const roleMap: Record<string, string> = {
      super_admin: "Logistics Admin",
      partner_admin: "Partner Admin",
      branch_admin: "Branch Admin",
      warehouse_admin: "Warehouse Admin",
      dispatcher: "Dispatcher",
      rider: "Rider",
      customer: "Customer Portal",
    };
    return roleMap[session.user.role] || "Portal";
  }, [session?.user?.role, session?.user?.roleDisplayName]);

  if (!session) return null;

  return (
    <aside className="flex h-full flex-col bg-card/50 backdrop-blur-xl relative group/sidebar">
      {/* Mobile Close Button */}
      <div className="flex items-center justify-between px-5 py-5 lg:hidden flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20">
            <span className="text-lg font-bold">BG</span>
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">BlackGrapes</p>
            <p className="text-xs text-muted-foreground">{roleTitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className={cn(
        "hidden lg:flex items-center flex-shrink-0 transition-all duration-300",
        isCollapsed ? "justify-center px-2 py-6" : "justify-between px-5 py-6"
      )}>
        {isCollapsed ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20">
            <span className="text-lg font-bold">BG</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20">
              <span className="text-lg font-bold">BG</span>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-bold text-foreground tracking-tight">BlackGrapes</p>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{roleTitle}</p>
            </div>
          </div>
        )}

        {!isCollapsed && <ThemeSwitcher />}
      </div>

      {/* Toggle Sidebar Button (Desktop Only) */}
      <div className="hidden lg:flex justify-end pr-3 pb-2 z-10 absolute right-0 top-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className={cn(
            "h-6 w-6 rounded-full bg-card border border-border shadow-sm text-muted-foreground hover:text-foreground opacity-0 group-hover/sidebar:opacity-100 transition-opacity absolute -right-3 top-1 z-[110]", // Added z-[110]
            isCollapsed && "rotate-180 -right-4 bg-background z-[110] opacity-100 shadow-md"
          )}
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>
      </div>

      {/* Scrollable Navigation Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <ScrollArea className="flex-1">
          <nav className={cn(
            "space-y-0.5 py-2 transition-all duration-300",
            isCollapsed ? "px-1" : "px-2"
          )}>
            {navigation.map((item: any, idx: number) => (
              <NavItem
                key={idx}
                item={item}
                pathname={pathname}
                onNavigate={onClose}
                isCollapsed={isCollapsed}
              />
            ))}

            {/* Show Theme Switcher at bottom of nav when collapsed since header one is hidden */}
            {isCollapsed && (
              <div className="flex justify-center pt-4 border-t border-border/40 mt-4">
                <ThemeSwitcher />
              </div>
            )}
          </nav>
        </ScrollArea>
      </div>

      {/* Fixed Bottom Section */}
      <div className={cn(
        "flex-shrink-0 transition-all duration-300 border-t border-border/40",
        isCollapsed ? "p-2 items-center flex flex-col gap-2" : "px-4 py-5"
      )}>
        {!isCollapsed && !isQuickActionsHidden && (
          <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 border border-primary/10 mb-4 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Quick Actions
                </p>
                <p className="text-[0.7rem] text-muted-foreground leading-snug mt-0.5">
                  Accelerate your workflow.
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <button
                  className="rounded-full p-1 text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors"
                  onClick={handleHideQuickActions}
                  aria-label="Hide quick actions"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <Button
                size="sm"
                className="h-8 w-full text-xs justify-center bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
              >
                Schedule Pickup
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-full text-xs justify-center bg-background/50 hover:bg-background"
              >
                Generate Report
              </Button>
            </div>
          </div>
        )}

        {/* Logout Button */}
        {isCollapsed ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-destructive hover:bg-destructive/10 rounded-xl"
                  onClick={() => logout()}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Log Out</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 h-10 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors group/logout"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4" />
            <span className="font-medium">Log out</span>
          </Button>
        )}

      </div>
    </aside>
  );
});
