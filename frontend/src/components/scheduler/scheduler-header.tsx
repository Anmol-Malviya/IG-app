"use client";

import React, { useRef, useEffect } from "react";
import { Search, Bell, X } from "lucide-react";



interface SchedulerHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
}

export function SchedulerHeader({
  searchQuery,
  onSearchChange,
  user,
}: SchedulerHeaderProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K or Cmd+K to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const initials = user?.firstName
    ? `${user.firstName.charAt(0)}${user.lastName ? user.lastName.charAt(0) : ""}`
    : "A";

  return (
    <header className="h-15 px-6 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-30">
      {/* Search Bar */}
      <div className="relative w-80 max-w-sm">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search className="w-4 h-4" />
        </span>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search schedules, faculty, rooms..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-14 py-2 rounded-[10px] border border-slate-200 text-[13px] bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded border border-slate-200">
            Ctrl K
          </span>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="w-9 h-9 rounded-[10px] border border-slate-200/80 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-[12px] font-bold shadow-xs">
            {initials}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[13px] font-bold text-slate-900 leading-tight">
              {user?.firstName || "Student"} {user?.lastName || ""}
            </span>
            <span className="text-[11px] font-medium text-slate-400 leading-tight">
              {user?.email || "student@uni.edu"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
