"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, X, ChevronDown, Command } from "lucide-react";



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
    <header className="z-30 flex h-[72px] shrink-0 items-center justify-between gap-5 border-b border-slate-200/80 bg-white px-5 xl:px-7 2xl:px-8">
      {/* Search Bar */}
      <div className="relative w-full max-w-[460px]">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search classes, rooms or faculty"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-16 text-[13px] font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
            aria-label="Clear schedule search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[10px] font-semibold text-slate-400 shadow-sm">
            <Command className="h-2.5 w-2.5" /> K
          </span>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        <Link
          href="/services/reminders"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
          title="Notifications"
          aria-label="Open reminders"
        >
          <Bell className="h-[17px] w-[17px]" />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-indigo-500 ring-2 ring-white" />
        </Link>

        <button type="button" className="flex min-h-11 items-center gap-2.5 rounded-xl px-1.5 py-1 text-left transition-colors hover:bg-slate-50" aria-label="Open profile menu">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-[12px] font-bold text-white shadow-sm ring-2 ring-indigo-50">
            {initials}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[12.5px] font-bold leading-tight text-slate-900">
              {user?.firstName || "Student"} {user?.lastName || ""}
            </span>
            <span className="mt-0.5 text-[10.5px] font-medium leading-tight text-slate-400">
              Student workspace
            </span>
          </div>
          <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 xl:block" />
        </button>
      </div>
    </header>
  );
}
