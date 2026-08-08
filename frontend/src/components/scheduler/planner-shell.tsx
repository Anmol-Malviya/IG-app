"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  CalendarRange,
  Plus,
  Search,
  X,
} from "lucide-react";

interface PlannerShellProps {
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddEvent: () => void;
  children: React.ReactNode;
}

export function PlannerShell({
  user,
  searchQuery,
  onSearchChange,
  onAddEvent,
  children,
}: PlannerShellProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const initials = `${user?.firstName?.[0] ?? "S"}${user?.lastName?.[0] ?? ""}`;

  return (
    <div
      data-scheduler
      className="min-h-dvh bg-[#f6f7f9] text-slate-950 antialiased"
    >
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1760px] items-center gap-3 px-3 sm:px-5 lg:px-6">
          <Link
            href="/dashboard"
            aria-label="Back to dashboard"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/15"
          >
            <ArrowLeft className="h-[18px] w-[18px]" />
          </Link>

          <div className="flex min-w-0 items-center gap-2.5">
            <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm sm:inline-flex">
              <CalendarRange className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold tracking-[-0.02em] text-slate-950 sm:text-[15px]">
                Weekly planner
              </h1>
              <p className="hidden text-[11px] font-medium text-slate-500 sm:block">
                Your classes, study and deadlines
              </p>
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-[520px] md:block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              ref={searchRef}
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search schedules"
              aria-label="Search schedules"
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-16 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 shadow-sm">
                Ctrl K
              </kbd>
            )}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link
              href="/services/reminders"
              aria-label="Open reminders"
              className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/15 sm:inline-flex"
            >
              <Bell className="h-[18px] w-[18px]" />
            </Link>

            <div
              className="hidden h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold uppercase text-white sm:flex"
              title={user?.email ?? "Student account"}
              aria-label={`${user?.firstName ?? "Student"} account`}
            >
              {initials}
            </div>

            <button
              type="button"
              onClick={onAddEvent}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 text-[13px] font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 active:translate-y-px sm:px-4"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add schedule</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1760px] flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-5 sm:py-5 lg:px-6">
        {children}
      </main>
    </div>
  );
}
