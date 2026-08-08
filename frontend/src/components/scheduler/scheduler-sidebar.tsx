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
} from "lucide-react";

interface SchedulerSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function SchedulerSidebar({
  collapsed,
  onToggleCollapse,
}: SchedulerSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Schedule",
      href: "/services/weekly-schedule",
      icon: Calendar,
      active: pathname.startsWith("/services/weekly-schedule"),
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
      active: pathname === "/dashboard",
    },
    {
      label: "Assignments",
      href: "/services/assignments",
      icon: ClipboardList,
      active: pathname.startsWith("/services/assignments"),
    },
    {
      label: "Notes",
      href: "/services/notes",
      icon: FileText,
      active: pathname.startsWith("/services/notes"),
    },
    {
      label: "Courses",
      href: "/services/resources",
      icon: BookOpen,
      active: pathname.startsWith("/services/resources"),
    },
    {
      label: "Exams",
      href: "/services/exam-planner",
      icon: GraduationCap,
      active: pathname.startsWith("/services/exam-planner"),
    },
    {
      label: "Study Planner",
      href: "/services/study-planner",
      icon: Target,
      active: pathname.startsWith("/services/study-planner"),
    },
    {
      label: "Tasks",
      href: "/services/todo-list",
      icon: CheckSquare,
      active: pathname.startsWith("/services/todo-list"),
    },
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200 flex flex-col justify-between p-4 flex-shrink-0 transition-all duration-200 select-none ${
        collapsed ? "w-[68px]" : "w-[68px] xl:w-[236px]"
      }`}
    >
      <div>
        {/* Brand & Collapse Toggle */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-[10px] bg-[#4F46E5] text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <span className="hidden xl:block font-extrabold text-[15px] text-slate-900 tracking-tight truncate">
                IG Scheduler
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden xl:flex w-7 h-7 rounded-[8px] items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
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
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                title={item.label}
                aria-label={item.label}
                className={`flex items-center justify-center ${collapsed ? "" : "xl:justify-start"} gap-3 px-3 py-2.5 rounded-[10px] text-[13px] font-semibold transition-all ${
                  item.active
                    ? "bg-[#EEF2FF] text-[#4F46E5]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    item.active ? "text-[#4F46E5]" : "text-slate-400"
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
          className="hidden xl:flex items-center justify-between p-3 rounded-[10px] bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 text-slate-800 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <Target className="w-4 h-4 text-[#4F46E5]" />
            <span className="text-[12px] font-bold text-slate-800 group-hover:text-[#4F46E5]">
              Focus Mode
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#4F46E5]" />
        </Link>
      ) : null}

      <Link
        href="/services/study-planner"
        title="Focus Mode"
        aria-label="Focus Mode"
        className={`${collapsed ? "flex" : "flex xl:hidden"} w-10 h-10 mx-auto rounded-[10px] bg-slate-50 hover:bg-indigo-50 border border-slate-200 items-center justify-center text-[#4F46E5] transition-colors`}
      >
        <Target className="w-4 h-4" />
      </Link>
    </aside>
  );
}
