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
      className="hidden h-screen overflow-hidden bg-[#f3f5f9] font-sans text-[#111827] antialiased lg:flex"
    >
      {/* Collapsible Left Sidebar */}
      <SchedulerSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top App Bar */}
        <SchedulerHeader
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          user={user}
        />

        {/* Dynamic Page Container: full-width with 24px padding */}
        <main className="flex min-h-0 w-full max-w-none flex-1 flex-col gap-4 overflow-hidden p-5 xl:gap-5 xl:p-7 2xl:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
