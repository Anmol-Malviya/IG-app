"use client";

import React, { useState } from "react";
import { SchedulerSidebar } from "./scheduler-sidebar";
import { SchedulerHeader } from "./scheduler-header";

interface SchedulerShellProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
  children: React.ReactNode;
}

export function SchedulerShell({
  searchQuery,
  onSearchChange,
  user,
  children,
}: SchedulerShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      data-scheduler
      className="hidden lg:flex h-screen bg-[#F7F8FC] text-[#0F172A] font-sans antialiased overflow-hidden"
    >
      {/* Collapsible Left Sidebar */}
      <SchedulerSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        {/* Top App Bar */}
        <SchedulerHeader
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          user={user}
        />

        {/* Dynamic Page Container: full-width with 24px padding */}
        <main className="flex-1 min-h-0 overflow-hidden p-4 xl:p-6 flex flex-col gap-4 xl:gap-5 w-full max-w-none">
          {children}
        </main>
      </div>
    </div>
  );
}
