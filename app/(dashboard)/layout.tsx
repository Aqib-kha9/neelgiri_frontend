// layout.tsx - Updated to fix independent scrolling and add main content padding
"use client";

import { Suspense, useState } from "react";
import { AuthenticatedHeader } from "@/components/layout/AuthenticatedHeader";

import { Sidebar } from "@/components/layout/Sidebar";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { ImpersonationBanner } from "@/components/admin/ImpersonationBanner";
import { ErrorBoundary } from "@/components/error-boundary";
import { PageLoader } from "@/components/loading/PageLoader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <ErrorBoundary>
      <RouteGuard>
        <div className="flex h-screen overflow-hidden flex-col">
          <ImpersonationBanner />
          <div className="flex flex-1 overflow-hidden relative">
            {/* Sidebar - Fixed from top to bottom, allowing internal scroll. */}
            <div
              className={`
              fixed inset-y-0 left-0 z-50 transform bg-card/95 backdrop-blur-xl transition-all duration-300 ease-in-out
              lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:z-0 lg:overflow-visible border-r border-border/60
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
              ${isCollapsed ? "lg:w-[80px]" : "lg:w-64"}
              w-64
            `}
            >
              <Sidebar
                onClose={() => setSidebarOpen(false)}
                isCollapsed={isCollapsed}
                toggleCollapse={() => setIsCollapsed(!isCollapsed)}
              />
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Main Content Area */}
            {/* h-full and flex-col ensures header/footer/main divide the vertical space */}
            <div className="flex-1 flex flex-col min-w-0 lg:ml-0 h-full relative transition-all duration-300">
              <AuthenticatedHeader
                onMenuClick={() => setSidebarOpen(!sidebarOpen)}
              />

              {/* main content scrolls independently and takes up space between header and footer */}
              {/* main content scrolls independently and takes up space between header and footer */}
              <main className="flex-1 overflow-y-auto pb-[20px] scrollbar-custom">
                <div className="p-1 sm:p-2">
                  <Suspense fallback={<PageLoader />}>{children}</Suspense>
                </div>
              </main>


            </div>
          </div>
        </div>
      </RouteGuard>
    </ErrorBoundary>
  );
}
