"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { useSchedules } from "@/hooks/use-schedules";
import { useSchedulerView, ViewMode } from "@/hooks/use-scheduler-view";
import {
  Schedule,
  EventCategory,
  CATEGORY_CONFIG,
  QuickAddValues,
} from "@/types/schedule";
import {
  getWeekDays,
  formatTime,
  formatDuration,
  combineDateAndTime,
  isSameDay,
  isToday,
  parseISO,
  format,
} from "@/lib/date-utils";
import { mergeWithRecurringOccurrences } from "@/lib/recurrence";
import { toast, Toaster } from "sonner";

// ─── SVG Vector Icons Set (UI/UX Pro Max) ──────────────────────────────────
const Icons = {
  Calendar: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  ),
  Book: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/></svg>
  ),
  GraduationCap: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
  ),
  Clock: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  ClipboardList: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
  ),
  Flask: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31L4.62 19.1A2 2 0 0 0 6.37 22h11.26a2 2 0 0 0 1.75-2.9L14 9.31V2"/><line x1="8.5" x2="15.5" y1="2" y2="2"/><path d="M14 9.3 8.5 19"/></svg>
  ),
  Users: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Dumbbell: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>
  ),
  Sparkles: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>
  ),
  Target: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  ),
  Search: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  ),
  Bell: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
  ),
  Home: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
  ),
  User: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Menu: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
  ),
  Check: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
};

// ─── Theme Colors matching design mockup ──────────────────────────────────
interface EventStyle {
  bg: string;
  border: string;
  text: string;
  badgeBg: string;
  badgeText: string;
  iconNode: React.ReactNode;
}

function getEventStyle(title: string, category: EventCategory): EventStyle {
  const t = title.toLowerCase();
  if (t.includes("data structures")) {
    return {
      bg: "#f5f3ff",
      border: "#818cf8",
      text: "#312e81",
      badgeBg: "#e0e7ff",
      badgeText: "#4338ca",
      iconNode: <Icons.GraduationCap className="w-4 h-4 text-[#4338ca]" />,
    };
  }
  if (t.includes("cyber security") || t.includes("security") || category === "lab") {
    return {
      bg: "#f0f9ff",
      border: "#38bdf8",
      text: "#0c4a6e",
      badgeBg: "#e0f2fe",
      badgeText: "#0284c7",
      iconNode: <Icons.Flask className="w-4 h-4 text-[#0284c7]" />,
    };
  }
  if (t.includes("study") || t.includes("revision")) {
    return {
      bg: "#f0fdf4",
      border: "#4ade80",
      text: "#14532d",
      badgeBg: "#dcfce7",
      badgeText: "#16a34a",
      iconNode: <Icons.Book className="w-4 h-4 text-[#16a34a]" />,
    };
  }
  if (t.includes("assignment")) {
    return {
      bg: "#fff7ed",
      border: "#fb923c",
      text: "#7c2d12",
      badgeBg: "#ffedd5",
      badgeText: "#ea580c",
      iconNode: <Icons.ClipboardList className="w-4 h-4 text-[#ea580c]" />,
    };
  }
  if (t.includes("exam") || category === "exam") {
    return {
      bg: "#fef2f2",
      border: "#f87171",
      text: "#7f1d1d",
      badgeBg: "#fee2e2",
      badgeText: "#dc2626",
      iconNode: <Icons.GraduationCap className="w-4 h-4 text-[#dc2626]" />,
    };
  }
  if (t.includes("project")) {
    return {
      bg: "#f0fdf4",
      border: "#22c55e",
      text: "#14532d",
      badgeBg: "#dcfce7",
      badgeText: "#15803d",
      iconNode: <Icons.Users className="w-4 h-4 text-[#15803d]" />,
    };
  }
  // Personal / Gym / Other
  return {
    bg: "#faf5ff",
    border: "#c084fc",
    text: "#581c87",
    badgeBg: "#f3e8ff",
    badgeText: "#7e22ce",
    iconNode: t.includes("gym") ? (
      <Icons.Dumbbell className="w-4 h-4 text-[#7e22ce]" />
    ) : (
      <Icons.Sparkles className="w-4 h-4 text-[#7e22ce]" />
    ),
  };
}

export default function WeeklySchedulePage() {
  const { user } = useAuth();
  const {
    currentDate,
    viewMode,
    setViewMode,
    selectedDay,
    setSelectedDay,
    goToToday,
    goNextWeek,
    goPrevWeek,
  } = useSchedulerView();

  const weekBounds = useMemo(() => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - 14);
    const end = new Date(currentDate);
    end.setDate(end.getDate() + 14);
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }, [currentDate]);

  const {
    schedules,
    isLoading,
    createSchedule,
    deleteSchedule,
    duplicateSchedule,
    updateStatus,
    undoDelete,
  } = useSchedules({ startDate: weekBounds.startDate, endDate: weekBounds.endDate });

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);
  const allEvents = useMemo(
    () =>
      mergeWithRecurringOccurrences(
        schedules,
        parseISO(weekBounds.startDate),
        parseISO(weekBounds.endDate)
      ),
    [schedules, weekBounds]
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState<Schedule | null>(null);

  // Group events by day "yyyy-MM-dd"
  const eventsByDay = useMemo(() => {
    const m: Record<string, Schedule[]> = {};
    for (const d of weekDays) {
      const k = format(d, "yyyy-MM-dd");
      m[k] = allEvents
        .filter((e) => isSameDay(parseISO(e.startDateTime), d))
        .sort(
          (a, b) =>
            parseISO(a.startDateTime).getTime() - parseISO(b.startDateTime).getTime()
        );
    }
    return m;
  }, [allEvents, weekDays]);

  const selectedDayKey = format(selectedDay, "yyyy-MM-dd");
  const currentDayEvents = useMemo(() => {
    let list = eventsByDay[selectedDayKey] || [];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location?.toLowerCase().includes(q) ||
          e.faculty?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [eventsByDay, selectedDayKey, searchQuery]);

  const todayEvents = useMemo(() => {
    return allEvents.filter((e) => isSameDay(parseISO(e.startDateTime), new Date()));
  }, [allEvents]);

  const todayClassesCount = todayEvents.filter(
    (e) => e.category === "class" || e.category === "lab"
  ).length;

  const nextUpcomingEvent = useMemo(() => {
    const now = new Date();
    return allEvents
      .filter((e) => parseISO(e.startDateTime) > now && e.status === "scheduled")
      .sort(
        (a, b) =>
          parseISO(a.startDateTime).getTime() - parseISO(b.startDateTime).getTime()
      )[0];
  }, [allEvents]);

  const handleQuickAdd = async (v: QuickAddValues) => {
    try {
      const s = combineDateAndTime(v.startDate, v.startTime);
      const e = combineDateAndTime(v.startDate, v.endTime);
      await createSchedule({
        title: v.title,
        category: v.category,
        startDateTime: s.toISOString(),
        endDateTime: e.toISOString(),
        recurrence: { type: "none" },
        status: "scheduled",
      } as Partial<Schedule>);
      toast.success("Event added to schedule!");
    } catch {
      toast.error("Failed to add event");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSchedule(id);
      toast("Event deleted", {
        action: { label: "Undo", onClick: () => undoDelete() },
      });
      setDetailEvent(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateSchedule(id);
      toast.success("Schedule duplicated!");
      setDetailEvent(null);
    } catch {
      toast.error("Failed to duplicate");
    }
  };

  const handleToggleComplete = async (id: string, status: Schedule["status"]) => {
    try {
      await updateStatus(id, status);
      toast.success(status === "completed" ? "Marked as completed" : "Marked active");
      setDetailEvent(null);
    } catch {
      toast.error("Failed to update status");
    }
  };

  // Time grid slots 8:00 AM to 6:00 PM
  const gridHours = [
    { label: "8:00 AM", hour: 8 },
    { label: "9:00 AM", hour: 9 },
    { label: "10:00 AM", hour: 10 },
    { label: "11:00 AM", hour: 11 },
    { label: "12:00 PM", hour: 12 },
    { label: "1:00 PM", hour: 13 },
    { label: "2:00 PM", hour: 14 },
    { label: "3:00 PM", hour: 15 },
    { label: "4:00 PM", hour: 16 },
    { label: "5:00 PM", hour: 17 },
    { label: "6:00 PM", hour: 18 },
  ];

  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
  const gridStartMinutes = 8 * 60; // 8:00 AM
  const currentTopOffset = ((nowMinutes - gridStartMinutes) / 60) * 64; // 64px per hour

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans flex flex-col antialiased">
      <Toaster position="top-center" richColors />

      {/* ══════════════════════════════════════════════════════════════
          1. LAPTOP / DESKTOP VIEW (Visible on >= 1024px screen)
          ══════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-1 min-h-screen">
        {/* ── Left Navigation Sidebar ── */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-6 flex-shrink-0">
          <div>
            {/* Header / Brand */}
            <div className="flex items-center gap-3 mb-8 px-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#4338ca] text-white flex items-center justify-center shadow-md shadow-indigo-100">
                <Icons.Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-[17px] text-slate-900 tracking-tight">
                Weekly Schedule
              </span>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1.5">
              <Link
                href="/services/weekly-schedule"
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-[#eef2ff] text-[#4338ca] font-extrabold text-[13.5px] transition-all min-h-[44px]"
              >
                <Icons.Calendar className="w-4.5 h-4.5 text-[#4338ca]" />
                <span>Schedule</span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-700 hover:bg-[#f1f5f9] hover:text-slate-900 font-bold text-[13.5px] transition-all min-h-[44px]"
              >
                <Icons.Calendar className="w-4.5 h-4.5 text-slate-600" />
                <span>Calendar</span>
              </Link>
              <Link
                href="/services/assignments"
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-700 hover:bg-[#f1f5f9] hover:text-slate-900 font-bold text-[13.5px] transition-all min-h-[44px]"
              >
                <Icons.ClipboardList className="w-4.5 h-4.5 text-slate-600" />
                <span>Tasks</span>
              </Link>
              <Link
                href="/services/resources"
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-700 hover:bg-[#f1f5f9] hover:text-slate-900 font-bold text-[13.5px] transition-all min-h-[44px]"
              >
                <Icons.Book className="w-4.5 h-4.5 text-slate-600" />
                <span>Courses</span>
              </Link>
              <Link
                href="/services/exam-planner"
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-700 hover:bg-[#f1f5f9] hover:text-slate-900 font-bold text-[13.5px] transition-all min-h-[44px]"
              >
                <Icons.GraduationCap className="w-4.5 h-4.5 text-slate-600" />
                <span>Exams</span>
              </Link>
              <Link
                href="/services/notes"
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-700 hover:bg-[#f1f5f9] hover:text-slate-900 font-bold text-[13.5px] transition-all min-h-[44px]"
              >
                <Icons.ClipboardList className="w-4.5 h-4.5 text-slate-600" />
                <span>Notes</span>
              </Link>
              <Link
                href="/services/study-planner"
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-700 hover:bg-[#f1f5f9] hover:text-slate-900 font-bold text-[13.5px] transition-all min-h-[44px]"
              >
                <Icons.Clock className="w-4.5 h-4.5 text-slate-600" />
                <span>Analytics</span>
              </Link>
              <Link
                href="/services/todo-list"
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-700 hover:bg-[#f1f5f9] hover:text-slate-900 font-bold text-[13.5px] transition-all min-h-[44px]"
              >
                <Icons.Check className="w-4.5 h-4.5 text-slate-600" />
                <span>Habit Tracker</span>
              </Link>
            </nav>
          </div>

          {/* Focus Mode CTA */}
          <Link
            href="/services/study-planner"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-[#eef2ff] text-[#4338ca] hover:bg-[#e0e7ff] transition-all min-h-[44px] cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-2.5 font-bold text-xs">
              <Icons.Target className="w-4 h-4 text-[#4338ca]" />
              <span>Focus Mode</span>
            </div>
            <span className="text-sm font-extrabold">›</span>
          </Link>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#f8fafc]">
          {/* Top Bar with Search & Profile */}
          <div className="h-16 px-8 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-20">
            {/* Search */}
            <div className="relative w-80">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Icons.Search className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Search events, tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
                className="w-full pl-10 pr-16 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                Ctrl K
              </span>
            </div>

            {/* Profile & Notifications */}
            <div className="flex items-center gap-3">
              <button
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Icons.Bell className="w-5 h-5 text-slate-600" />
              </button>
              <div className="flex items-center gap-2.5 cursor-pointer px-2 py-1 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-[#4338ca] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {user?.firstName?.charAt(0) || "A"}
                </div>
                <span className="text-xs text-slate-500 font-bold">▾</span>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-7 max-w-7xl mx-auto w-full">
            {/* Greeting & Date Controls Row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Good morning, {user?.firstName || "Anmol"} 👋
                </h1>
                <p className="text-xs text-slate-500 mt-1 font-semibold">
                  {format(new Date(), "EEEE, d MMMM")}
                </p>
              </div>

              {/* View switchers & Date Picker */}
              <div className="flex items-center gap-4">
                {/* Date range nav */}
                <div className="flex items-center gap-2.5 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
                  <button onClick={goPrevWeek} className="text-slate-600 hover:text-black font-bold text-base px-1">‹</button>
                  <span className="text-xs font-bold text-slate-800 px-1 whitespace-nowrap">
                    {format(weekDays[0], "d MMM")} – {format(weekDays[6], "d MMM, yyyy")}
                  </span>
                  <button onClick={goNextWeek} className="text-slate-600 hover:text-black font-bold text-base px-1">›</button>
                  <button onClick={goToToday} className="text-xs font-bold text-[#4338ca] bg-[#eef2ff] px-3 py-1 rounded-xl ml-2 hover:bg-indigo-100 transition-colors">
                    Today
                  </button>
                </div>

                {/* View switcher */}
                <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm gap-1.5">
                  {(["day", "week", "agenda"] as ViewMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                        viewMode === mode
                          ? "bg-[#4338ca] text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setQuickAddOpen(true)}
                  className="px-5 py-2.5 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-2xl text-xs font-bold shadow-md shadow-indigo-200 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <span className="text-sm font-light">+</span> Add Event
                </button>
              </div>
            </div>

            {/* 4 Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4.5">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start gap-4 hover:border-indigo-200 transition-all">
                <div className="w-11 h-11 rounded-2xl bg-[#eef2ff] text-[#4338ca] flex items-center justify-center flex-shrink-0">
                  <Icons.Book className="w-5 h-5 text-[#4338ca]" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Today&apos;s classes
                  </p>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                    {todayClassesCount}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    {todayClassesCount} scheduled
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start gap-4 hover:border-emerald-200 transition-all">
                <div className="w-11 h-11 rounded-2xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center flex-shrink-0">
                  <Icons.Clock className="w-5 h-5 text-[#059669]" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Study hours
                  </p>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                    3h 45m
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#10b981] w-[75%] rounded-full" />
                    </div>
                    <span className="text-[10.5px] text-slate-500 font-semibold">
                      Daily goal: 4h
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start gap-4 hover:border-purple-200 transition-all">
                <div className="w-11 h-11 rounded-2xl bg-[#f3e8ff] text-[#7e22ce] flex items-center justify-center flex-shrink-0">
                  <Icons.GraduationCap className="w-5 h-5 text-[#7e22ce]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Next class
                  </p>
                  <h3 className="text-base font-extrabold text-slate-900 mt-0.5 truncate">
                    {nextUpcomingEvent ? nextUpcomingEvent.title : "Data Structures"}
                  </h3>
                  <p className="text-xs text-indigo-600 font-bold mt-0.5 truncate">
                    in 1h 15m · 10:30 AM
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start gap-4 hover:border-orange-200 transition-all">
                <div className="w-11 h-11 rounded-2xl bg-[#fff7ed] text-[#ea580c] flex items-center justify-center flex-shrink-0">
                  <Icons.ClipboardList className="w-5 h-5 text-[#ea580c]" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Pending
                  </p>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                    3
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    2 tasks · 1 assignment
                  </p>
                </div>
              </div>
            </div>

            {/* ── Interactive Weekly Schedule Grid ── */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Day Headers Row */}
              <div className="grid grid-cols-8 border-b border-slate-200 bg-white sticky top-0 z-10 text-center">
                <div className="py-4 text-[11px] font-bold text-slate-400 border-r border-slate-100 flex items-center justify-center">
                  Time
                </div>
                {weekDays.map((d) => {
                  const active = isToday(d);
                  return (
                    <div
                      key={d.toISOString()}
                      className={`py-3 px-1 border-r border-slate-100 last:border-r-0 flex flex-col items-center justify-center ${
                        active ? "bg-indigo-50/40" : ""
                      }`}
                    >
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        {format(d, "EEE")}
                      </span>
                      <span
                        className={`text-xs font-extrabold mt-1 inline-block ${
                          active
                            ? "bg-[#4338ca] text-white px-3 py-0.5 rounded-full shadow-sm"
                            : "text-slate-800"
                        }`}
                      >
                        {format(d, "d MMM")}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Grid Body */}
              <div className="relative" style={{ height: `${gridHours.length * 64}px` }}>
                {gridHours.map((slot, i) => (
                  <div
                    key={slot.label}
                    className="grid grid-cols-8 border-b border-slate-100 absolute w-full"
                    style={{ top: `${i * 64}px`, height: "64px" }}
                  >
                    <div className="text-[11px] font-semibold text-slate-400 pr-3 text-right flex items-center justify-end border-r border-slate-100">
                      {slot.label}
                    </div>
                    {Array.from({ length: 7 }).map((_, c) => (
                      <div
                        key={c}
                        onClick={() => {
                          setSelectedDay(weekDays[c]);
                          setQuickAddOpen(true);
                        }}
                        className="border-r border-slate-100 last:border-r-0 hover:bg-indigo-50/20 cursor-pointer transition-colors"
                      />
                    ))}
                  </div>
                ))}

                {/* Red Live-Time Line */}
                {currentTopOffset > 0 && currentTopOffset < gridHours.length * 64 && (
                  <div
                    className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
                    style={{ top: `${currentTopOffset}px` }}
                  >
                    <div className="w-[12.5%] text-right pr-2">
                      <span className="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-sm">
                        {format(new Date(), "h:mm a")}
                      </span>
                    </div>
                    <div className="flex-1 h-[2px] bg-red-500 relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 -mt-[4px] -ml-1 absolute left-0 shadow-sm" />
                    </div>
                  </div>
                )}

                {/* Render Grid Cards */}
                {weekDays.map((d, colIndex) => {
                  const k = format(d, "yyyy-MM-dd");
                  const dayEvts = eventsByDay[k] || [];
                  const leftPercent = 12.5 + colIndex * 12.5;

                  return dayEvts.map((ev) => {
                    const start = parseISO(ev.startDateTime);
                    const end = parseISO(ev.endDateTime);
                    const startMins = start.getHours() * 60 + start.getMinutes();
                    const endMins = end.getHours() * 60 + end.getMinutes();

                    const top = ((startMins - gridStartMinutes) / 60) * 64;
                    const height = Math.max(((endMins - startMins) / 60) * 64, 42);
                    const style = getEventStyle(ev.title, ev.category);

                    if (top < 0 || top > gridHours.length * 64) return null;

                    return (
                      <div
                        key={ev._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailEvent(ev);
                        }}
                        className="absolute rounded-2xl px-3.5 py-2.5 border transition-all cursor-pointer hover:shadow-md hover:scale-[1.01] z-10 overflow-hidden flex flex-col justify-start"
                        style={{
                          left: `calc(${leftPercent}% + 4px)`,
                          width: "calc(12.5% - 8px)",
                          top: `${top + 1}px`,
                          height: `${height - 2}px`,
                          backgroundColor: style.bg,
                          borderColor: style.border,
                          borderLeftWidth: "3.5px",
                        }}
                      >
                        <h4
                          className="font-bold text-[12px] truncate leading-tight tracking-tight"
                          style={{ color: style.text }}
                        >
                          {ev.title}
                        </h4>
                        {height > 44 && (
                          <p className="text-[10px] text-slate-600 font-semibold mt-1 truncate leading-tight">
                            {format(start, "h:mm")} – {format(end, "h:mm a")}
                          </p>
                        )}
                        {height > 58 && ev.location && (
                          <p className="text-[9.5px] text-slate-500 font-medium truncate mt-0.5 leading-tight">
                            {ev.location}
                          </p>
                        )}
                      </div>
                    );
                  });
                })}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. MOBILE / PHONE VIEW (Visible on < 1024px screen)
          ══════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden w-full min-h-screen bg-white flex flex-col">
        {/* ── Top Mobile Bar (☰ + Title + 🔔) ── */}
        <header className="px-5 pt-4 pb-3 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-20">
          <Link
            href="/dashboard"
            className="w-11 h-11 -ml-2 rounded-2xl flex items-center justify-center text-slate-800 hover:bg-slate-100 transition-colors"
            title="Menu / Back"
          >
            <Icons.Menu className="w-5 h-5 text-slate-800" />
          </Link>

          <h1 className="text-[17px] font-extrabold text-slate-900 tracking-tight">
            Weekly Schedule
          </h1>

          <button
            className="w-11 h-11 -mr-2 rounded-2xl flex items-center justify-center text-slate-800 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Icons.Bell className="w-5 h-5 text-slate-800" />
          </button>
        </header>

        {/* ── Horizontal Day Strip (Mon 5, Tue 6, etc.) ── */}
        <div className="px-3 py-2.5 bg-white border-b border-slate-100">
          <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none py-1 px-1">
            {weekDays.map((d) => {
              const active = isSameDay(d, selectedDay);
              const dayName = format(d, "EEE");
              const dayNum = format(d, "d");

              return (
                <button
                  key={d.toISOString()}
                  onClick={() => setSelectedDay(d)}
                  className={`flex flex-col items-center justify-center py-2 px-2.5 rounded-[18px] min-w-[50px] flex-1 transition-all duration-200 cursor-pointer relative min-h-[44px] ${
                    active
                      ? "bg-[#4338ca] text-white shadow-md shadow-indigo-200 scale-105"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className={`text-[12.5px] font-bold leading-none ${active ? "text-white" : "text-slate-800"}`}>
                    {dayName}
                  </span>
                  <span className={`text-[14px] font-extrabold mt-1 leading-none ${active ? "text-white" : "text-slate-900"}`}>
                    {dayNum}
                  </span>
                  {active && (
                    <span className="w-1.5 h-1.5 bg-white rounded-full mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Featured "Next Class" Banner Card ── */}
        <div className="px-4 pt-4">
          <div className="rounded-2xl p-4 bg-white border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#f3e8ff] text-[#7e22ce] flex items-center justify-center">
                  <Icons.GraduationCap className="w-4 h-4 text-[#7e22ce]" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Next class
                </span>
              </div>
              <span className="text-xs font-extrabold text-[#4338ca]">
                in 1h 15m
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Data Structures
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              10:30 AM – 11:30 AM · Room B-201
            </p>
            <div className="w-full h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
              <div className="w-1/3 h-full bg-[#4338ca] rounded-full" />
            </div>
          </div>
        </div>

        {/* ── Day Section Header ── */}
        <div className="px-5 pt-5 pb-1 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#4338ca]">
            {format(selectedDay, "EEEE, d MMMM")}
          </h2>
        </div>

        {/* ── Mobile Timeline Schedule List ── */}
        <div className="flex-1 px-4 py-2 pb-24 overflow-y-auto">
          {currentDayEvents.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Icons.Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800 mt-2">No classes scheduled</h3>
              <p className="text-xs text-slate-500 mt-1">Enjoy your free time!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentDayEvents.map((ev, idx) => {
                const s = parseISO(ev.startDateTime);
                const style = getEventStyle(ev.title, ev.category);
                const isCurrent = idx === 1;

                return (
                  <React.Fragment key={ev._id}>
                    {/* Live red time marker */}
                    {isCurrent && (
                      <div className="flex items-center gap-2 my-1">
                        <span className="text-[10px] font-extrabold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                          {format(new Date(), "h:mm a")}
                        </span>
                        <div className="flex-1 h-[1.5px] bg-red-400" />
                      </div>
                    )}

                    <div
                      onClick={() => setDetailEvent(ev)}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      {/* Left time */}
                      <div className="w-14 text-center flex-shrink-0 leading-none">
                        <div className="text-xs font-extrabold text-slate-900">
                          {format(s, "h:mm")}
                        </div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">
                          {format(s, "a")}
                        </div>
                      </div>

                      {/* Right card */}
                      <div
                        className="flex-1 rounded-2xl p-3.5 border transition-all active:scale-[0.99] flex items-center justify-between min-h-[44px]"
                        style={{
                          backgroundColor: style.bg,
                          borderColor: style.border,
                          borderLeftWidth: "4px",
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="flex-shrink-0">{style.iconNode}</span>
                          <div className="min-w-0">
                            <h4 className="font-bold text-[13.5px] text-slate-900 truncate">
                              {ev.title}
                            </h4>
                            <p className="text-[11px] text-slate-600 font-medium mt-0.5 truncate">
                              {format(s, "h:mm")} – {format(parseISO(ev.endDateTime), "h:mm a")} {ev.location ? `· ${ev.location}` : ""}
                            </p>
                          </div>
                        </div>
                        <span className="text-slate-400 text-xs font-bold">›</span>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Floating Action Button (+) ── */}
        <button
          onClick={() => setQuickAddOpen(true)}
          className="fixed bottom-20 right-5 w-14 h-14 rounded-full bg-[#4338ca] text-white shadow-lg flex items-center justify-center text-2xl font-light active:scale-95 z-30 min-h-[44px] min-w-[44px]"
          title="Add Class"
        >
          +
        </button>

        {/* ── Bottom App Tab Navigation Bar ── */}
        <nav className="h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2 sticky bottom-0 z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center text-slate-600 hover:text-[#4338ca] transition-colors min-h-[48px] min-w-[48px] cursor-pointer"
          >
            <Icons.Home className="w-5 h-5 text-slate-600" />
            <span className="text-[10.5px] font-bold mt-1 text-slate-700">Home</span>
          </Link>
          <Link
            href="/services/weekly-schedule"
            className="flex flex-col items-center justify-center text-[#4338ca] min-h-[48px] min-w-[48px] cursor-pointer"
          >
            <Icons.Calendar className="w-5 h-5 text-[#4338ca]" />
            <span className="text-[10.5px] font-extrabold mt-1 text-[#4338ca]">Schedule</span>
          </Link>
          <Link
            href="/services/assignments"
            className="flex flex-col items-center justify-center text-slate-600 hover:text-[#4338ca] transition-colors min-h-[48px] min-w-[48px] cursor-pointer"
          >
            <Icons.ClipboardList className="w-5 h-5 text-slate-600" />
            <span className="text-[10.5px] font-bold mt-1 text-slate-700">Tasks</span>
          </Link>
          <Link
            href="/services/resources"
            className="flex flex-col items-center justify-center text-slate-600 hover:text-[#4338ca] transition-colors min-h-[48px] min-w-[48px] cursor-pointer"
          >
            <Icons.Book className="w-5 h-5 text-slate-600" />
            <span className="text-[10.5px] font-bold mt-1 text-slate-700">Courses</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center text-slate-600 hover:text-[#4338ca] transition-colors min-h-[48px] min-w-[48px] cursor-pointer"
          >
            <Icons.User className="w-5 h-5 text-slate-600" />
            <span className="text-[10.5px] font-bold mt-1 text-slate-700">Profile</span>
          </Link>
        </nav>
      </div>

      {/* ── MODALS ── */}
      {quickAddOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl animate-slideUp">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Add Class / Event</h3>
              <button
                onClick={() => setQuickAddOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 font-bold"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const title = (form.elements.namedItem("title") as HTMLInputElement).value;
                const startDate = (form.elements.namedItem("startDate") as HTMLInputElement).value;
                const startTime = (form.elements.namedItem("startTime") as HTMLInputElement).value;
                const endTime = (form.elements.namedItem("endTime") as HTMLInputElement).value;
                handleQuickAdd({ title, category: "class", startDate, startTime, endTime });
                setQuickAddOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs font-bold text-slate-500">Title / Subject</label>
                <input name="title" required placeholder="e.g. Data Structures, Security Lab..." className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs mt-1 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Date</label>
                <input name="startDate" type="date" defaultValue={selectedDayKey} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs mt-1 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600" />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-500">Start Time</label>
                  <input name="startTime" type="time" defaultValue="09:00" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs mt-1 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">End Time</label>
                  <input name="endTime" type="time" defaultValue="10:00" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs mt-1 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600" />
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-2xl font-bold text-xs shadow-md mt-2 transition-all">
                Add to Schedule
              </button>
            </form>
          </div>
        </div>
      )}

      {detailEvent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl animate-slideUp">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                  {detailEvent.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">{detailEvent.title}</h3>
              </div>
              <button onClick={() => setDetailEvent(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 font-bold">✕</button>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {formatTime(detailEvent.startDateTime)} – {formatTime(detailEvent.endDateTime)} ({formatDuration(detailEvent.startDateTime, detailEvent.endDateTime)})
            </p>
            {detailEvent.location && (
              <p className="text-xs font-semibold text-slate-700 mt-2">📍 {detailEvent.location}</p>
            )}
            <div className="grid grid-cols-2 gap-2 mt-5">
              <button
                onClick={() => handleToggleComplete(detailEvent._id, detailEvent.status === "completed" ? "scheduled" : "completed")}
                className="py-2.5 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                {detailEvent.status === "completed" ? "Reactivate" : "Mark Done"}
              </button>
              <button
                onClick={() => handleDuplicate(detailEvent._id)}
                className="py-2.5 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Duplicate
              </button>
              <button
                onClick={() => {
                  handleDelete(detailEvent._id);
                }}
                className="col-span-2 py-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.22s cubic-bezier(0.32, 0.72, 0, 1); }
        .animate-fadeIn { animation: fadeIn 0.18s ease-out; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
