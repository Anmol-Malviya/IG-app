"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  ClipboardList,
  BookOpen,
  GraduationCap,
  FileText,
  BarChart3,
  CheckSquare,
  Target,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Schedule", href: "/services/weekly-schedule", icon: Calendar },
  { label: "Overview", href: "/dashboard", icon: BarChart3 },
  { label: "Assignments", href: "/services/assignments", icon: ClipboardList },
  { label: "Notes", href: "/services/notes", icon: FileText },
  { label: "Resources", href: "/services/resources", icon: BookOpen },
  { label: "Exams", href: "/services/exam-planner", icon: GraduationCap },
  { label: "Study planner", href: "/services/study-planner", icon: Target },
  { label: "Tasks", href: "/services/todo-list", icon: CheckSquare },
] as const;

interface SchedulerSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function SchedulerSidebar({
  collapsed,
  onToggleCollapse,
}: SchedulerSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`relative flex flex-shrink-0 select-none flex-col justify-between overflow-hidden border-r border-white/5 bg-[#0d1424] p-3 text-white transition-all duration-300 ${
        collapsed ? "w-[76px]" : "w-[76px] xl:w-[248px]"
      }`}
    >
      <div className="pointer-events-none absolute -left-16 top-0 h-52 w-52 rounded-full bg-indigo-500/10 blur-3xl" />
      <div>
        {/* Brand & Collapse Toggle */}
        <div className="relative mb-7 flex h-12 items-center justify-between px-1.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 text-white shadow-[0_8px_24px_rgba(79,70,229,0.35)] ring-1 ring-white/15">
              <Calendar className="h-[19px] w-[19px]" />
            </div>
            {!collapsed && (
              <div className="hidden min-w-0 xl:block">
                <span className="block truncate text-[15px] font-bold tracking-[-0.02em] text-white">
                  IG Workspace
                </span>
                <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Student OS
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/10 hover:text-white xl:flex"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        {!collapsed ? (
          <p className="mb-2 hidden px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600 xl:block">
            Workspace
          </p>
        ) : null}
        <nav className="space-y-1.5" aria-label="Student workspace">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                title={item.label}
                aria-label={item.label}
                className={`group relative flex min-h-11 items-center justify-center gap-3 rounded-xl px-3 text-[13px] font-semibold transition-all ${collapsed ? "" : "xl:justify-start"} ${
                  active
                    ? "bg-indigo-500 text-white shadow-[0_8px_24px_rgba(79,70,229,0.22)]"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <Icon
                  className={`h-[18px] w-[18px] flex-shrink-0 transition-colors ${
                    active ? "text-white" : "text-slate-500 group-hover:text-slate-200"
                  }`}
                />
                {!collapsed && (
                  <span className="hidden xl:block truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Focus Mode Card */}
      {!collapsed ? (
        <Link
          href="/services/study-planner"
          className="group hidden rounded-2xl border border-white/[0.08] bg-white/[0.05] p-3.5 transition-all hover:border-indigo-400/30 hover:bg-white/[0.08] xl:block"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
              <Sparkles className="h-4 w-4" />
            </div>
            <ChevronRight className="h-4 w-4 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-300" />
          </div>
          <p className="text-[12px] font-bold text-white">Start a focus session</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-slate-500">
            Block distractions and study with intent.
          </p>
        </Link>
      ) : null}

      <Link
        href="/services/study-planner"
        title="Focus Mode"
        aria-label="Focus Mode"
        className={`${collapsed ? "flex" : "flex xl:hidden"} mx-auto h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-indigo-300 transition-colors hover:bg-white/10`}
      >
        <Target className="w-4 h-4" />
      </Link>
    </aside>
  );
}
